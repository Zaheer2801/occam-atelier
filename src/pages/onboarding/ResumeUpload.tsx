import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];

const ResumeUpload = () => {
  const { user } = useAuth();
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [phase, setPhase] = useState<"idle" | "uploading" | "parsing">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File) => {
    if (!ALLOWED.includes(f.type) && !/\.(pdf|docx?)$/i.test(f.name)) {
      toast.error("Only PDF or DOCX files are accepted"); return;
    }
    if (f.size > MAX_BYTES) { toast.error("File must be under 10MB"); return; }
    setFile(f);
  };

  const onUpload = async () => {
    if (!user || !file) return;
    setPhase("uploading");
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const path = `${user.id}/resume-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (upErr) { setPhase("idle"); toast.error(upErr.message); return; }

    await supabase.from("profiles").update({ resume_url: path, updated_at: new Date().toISOString() }).eq("id", user.id);

    setPhase("parsing");
    const { data, error } = await supabase.functions.invoke("parse-resume", { body: { resumePath: path } });
    if (error || (data as { error?: string })?.error) {
      setPhase("idle");
      toast.error((data as { error?: string })?.error || error?.message || "Parse failed");
      return;
    }
    toast.success("Resume parsed!");
    nav("/onboarding/resume-review");
  };

  return (
    <OnboardingShell step={2} title="Upload your resume" subtitle="PDF or DOCX, max 10MB. We'll extract your details for review.">
      <div className="space-y-5">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files?.[0]; if (f) pickFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-10 w-10 text-primary" />
              <div className="font-medium">{file.name}</div>
              <div className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · click to replace</div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="font-medium">Drag & drop your resume</div>
              <div className="text-xs text-muted-foreground">or click to browse</div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => nav("/onboarding/personal-info")} disabled={phase !== "idle"}>Back</Button>
          <Button onClick={onUpload} disabled={!file || phase !== "idle"} className="flex-1 gradient-primary text-primary-foreground border-0">
            {phase === "uploading" && <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>}
            {phase === "parsing" && <><Loader2 className="h-4 w-4 animate-spin" /> Parsing with AI…</>}
            {phase === "idle" && "Upload & parse"}
          </Button>
        </div>
        {phase === "parsing" && (
          <p className="text-xs text-center text-muted-foreground">This usually takes 10–20 seconds.</p>
        )}
      </div>
    </OnboardingShell>
  );
};

export default ResumeUpload;
