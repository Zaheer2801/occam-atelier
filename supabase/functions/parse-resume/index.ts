import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a precise resume parser. Extract structured data from the resume content the user supplies. Return ONLY via the provided tool call. Dates must be ISO format (YYYY-MM or YYYY-MM-DD). If a field is missing, return an empty string or empty array — never invent data. Also generate 3-5 suggested target job titles based on the candidate's experience.`;

const TOOL = {
  type: "function",
  function: {
    name: "save_parsed_resume",
    description: "Persist the structured resume data extracted from the document.",
    parameters: {
      type: "object",
      properties: {
        personal: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            summary: { type: "string" },
          },
          required: ["name", "email", "phone", "summary"],
          additionalProperties: false,
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
            additionalProperties: false,
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
            additionalProperties: false,
          },
        },
        suggested_roles: { type: "array", items: { type: "string" } },
      },
      required: ["personal", "skills", "work_experience", "education", "suggested_roles"],
      additionalProperties: false,
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Auth
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const { resumePath } = await req.json();
    if (!resumePath || typeof resumePath !== "string") {
      return new Response(JSON.stringify({ error: "resumePath required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resumePath.startsWith(`${userId}/`)) {
      return new Response(JSON.stringify({ error: "Forbidden path" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Download resume
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: file, error: dlErr } = await admin.storage.from("resumes").download(resumePath);
    if (dlErr || !file) throw new Error(`Download failed: ${dlErr?.message}`);

    const bytes = new Uint8Array(await file.arrayBuffer());
    let b64 = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      b64 += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    b64 = btoa(b64);

    const ext = resumePath.split(".").pop()?.toLowerCase() ?? "";
    const mime = ext === "pdf" ? "application/pdf"
      : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      : ext === "doc" ? "application/msword"
      : "application/octet-stream";

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Parse this resume and call save_parsed_resume with the structured data." },
              { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
            ],
          },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "save_parsed_resume" } },
      }),
    });

    if (!aiRes.ok) {
      const errTxt = await aiRes.text();
      console.error("AI gateway error", aiRes.status, errTxt);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway ${aiRes.status}`);
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("Model did not return tool call");
    const parsed = JSON.parse(toolCall.function.arguments);

    // Persist parsed_resume + suggested_roles to profile
    const { error: updErr } = await admin
      .from("profiles")
      .update({
        parsed_resume: {
          personal: parsed.personal,
          skills: parsed.skills,
          work_experience: parsed.work_experience,
          education: parsed.education,
        },
        suggested_roles: parsed.suggested_roles,
        status: "resume_review",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (updErr) throw new Error(`Profile update failed: ${updErr.message}`);

    return new Response(JSON.stringify({ ok: true, parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("parse-resume error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
