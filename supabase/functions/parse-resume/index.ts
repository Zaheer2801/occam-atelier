import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { unzipSync } from "https://esm.sh/fflate@0.8.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a precise resume parser. Extract structured data from the resume content. Dates must be ISO format (YYYY-MM or YYYY-MM-DD). If a field is missing, return an empty string or empty array — never invent data. Also generate 3-5 suggested target job titles based on the candidate's experience and skills.`;

const TOOL = {
  name: "save_parsed_resume",
  description: "Persist the structured resume data extracted from the document.",
  input_schema: {
    type: "object",
    properties: {
      personal: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          location: { type: "string" },
          summary: { type: "string" },
        },
        required: ["name", "email", "phone", "location", "summary"],
      },
      skills: { type: "array", items: { type: "string" } },
      work_experience: {
        type: "array",
        items: {
          type: "object",
          properties: {
            company: { type: "string" },
            title: { type: "string" },
            start_date: { type: "string" },
            end_date: { type: "string" },
            description: { type: "string" },
          },
          required: ["company", "title", "start_date", "end_date", "description"],
        },
      },
      education: {
        type: "array",
        items: {
          type: "object",
          properties: {
            institution: { type: "string" },
            degree: { type: "string" },
            start_date: { type: "string" },
            end_date: { type: "string" },
          },
          required: ["institution", "degree", "start_date", "end_date"],
        },
      },
      suggested_roles: { type: "array", items: { type: "string" } },
    },
    required: ["personal", "skills", "work_experience", "education", "suggested_roles"],
  },
};

function extractDocxText(bytes: Uint8Array): string {
  try {
    const unzipped = unzipSync(bytes);
    const docXml = unzipped["word/document.xml"];
    if (!docXml) return "";
    const xml = new TextDecoder().decode(docXml);
    // Strip XML tags and collapse whitespace
    return xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured in edge function secrets");

    // Verify caller
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { resumePath } = await req.json();
    if (!resumePath || typeof resumePath !== "string") {
      return new Response(JSON.stringify({ error: "resumePath required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resumePath.startsWith(`${userId}/`)) {
      return new Response(JSON.stringify({ error: "Forbidden path" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download from storage
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: file, error: dlErr } = await admin.storage.from("resumes").download(resumePath);
    if (dlErr || !file) throw new Error(`Download failed: ${dlErr?.message}`);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const ext = resumePath.split(".").pop()?.toLowerCase() ?? "";
    const isPdf = ext === "pdf";
    const isDocx = ext === "docx" || ext === "doc";

    // Build Claude message content
    type ContentBlock =
      | { type: "text"; text: string }
      | { type: "document"; source: { type: "base64"; media_type: string; data: string } };

    const userContent: ContentBlock[] = [];

    if (isPdf) {
      // Native PDF support in Claude
      let b64 = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        b64 += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      b64 = btoa(b64);

      userContent.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: b64 },
      });
      userContent.push({ type: "text", text: "Parse this resume and call save_parsed_resume with all extracted data." });
    } else if (isDocx) {
      const text = extractDocxText(bytes);
      if (!text) throw new Error("Could not extract text from DOCX. Try uploading as PDF.");
      userContent.push({
        type: "text",
        text: `Parse the following resume text and call save_parsed_resume with all extracted data:\n\n${text.slice(0, 20000)}`,
      });
    } else {
      throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
    }

    // Call Anthropic
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
        tools: [TOOL],
        tool_choice: { type: "tool", name: "save_parsed_resume" },
      }),
    });

    if (!aiRes.ok) {
      const errTxt = await aiRes.text();
      console.error("Anthropic error", aiRes.status, errTxt);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Anthropic API error ${aiRes.status}`);
    }

    const aiJson = await aiRes.json();
    const toolUse = aiJson.content?.find((c: { type: string }) => c.type === "tool_use");
    if (!toolUse) throw new Error("Model did not return structured data");
    const parsed = toolUse.input as {
      personal: { name: string; email: string; phone: string; location: string; summary: string };
      skills: string[];
      work_experience: { company: string; title: string; start_date: string; end_date: string; description: string }[];
      education: { institution: string; degree: string; start_date: string; end_date: string }[];
      suggested_roles: string[];
    };

    // Persist to profile — update name, phone, location from resume if not blank
    const profileUpdate: Record<string, unknown> = {
      resume_url: resumePath,
      parsed_resume: {
        personal: parsed.personal,
        skills: parsed.skills,
        work_experience: parsed.work_experience,
        education: parsed.education,
      },
      suggested_roles: parsed.suggested_roles,
      status: "resume_review",
      updated_at: new Date().toISOString(),
    };
    if (parsed.personal.name) profileUpdate.full_name = parsed.personal.name;
    if (parsed.personal.phone) profileUpdate.phone = parsed.personal.phone;
    if (parsed.personal.location) profileUpdate.location = parsed.personal.location;

    const { error: updErr } = await admin.from("profiles").update(profileUpdate).eq("id", userId);
    if (updErr) throw new Error(`Profile update failed: ${updErr.message}`);

    return new Response(JSON.stringify({ ok: true, parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("parse-resume error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
