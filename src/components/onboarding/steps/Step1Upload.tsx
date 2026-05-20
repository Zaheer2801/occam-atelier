import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface Props {
  onComplete: (profileJson: Record<string, unknown>) => void;
}

export const Step1Upload = ({ onComplete }: Props) => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const parseFile = useCallback(async (f: File) => {
    setFile(f);
    setError("");
    setParsing(true);
    try {
      const form = new FormData();
      form.append("file", f);
      const res = await fetch(`${API}/api/parse/resume`, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setParsed(data.profile_json || data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Parse failed. Try a different file.");
    } finally {
      setParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) parseFile(f);
    },
    [parseFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) parseFile(f);
  };

  const s = { color: "var(--aa-text-primary)" };

  return (
    <div>
      <h1
        className="text-2xl md:text-3xl mb-2"
        style={{ fontFamily: "DM Serif Display, Georgia, serif", color: "var(--aa-text-primary)" }}
      >
        Upload your resume
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--aa-text-secondary)" }}>
        PDF or DOCX · max 10MB · parsed securely, never shared without your approval
      </p>

      {!parsed ? (
        <>
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center gap-3 rounded-xl p-10 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragOver ? "var(--aa-brand)" : "var(--aa-border-default)"}`,
              background: dragOver ? "var(--aa-brand-subtle)" : "var(--aa-bg-surface)",
            }}
          >
            <Upload className="h-8 w-8" style={{ color: dragOver ? "var(--aa-brand)" : "var(--aa-text-tertiary)" }} />
            <span className="text-sm" style={{ color: "var(--aa-text-secondary)" }}>
              {parsing ? "Parsing…" : file ? file.name : "Drag & drop or click to upload"}
            </span>
            <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileInput} />
          </label>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: "var(--aa-danger)" }}>
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Success state */}
          <div
            className="flex items-center gap-3 rounded-xl p-4 mb-6"
            style={{ background: "var(--aa-success-subtle)", border: "1px solid var(--aa-success-border)" }}
          >
            <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: "var(--aa-success)" }} />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--aa-success)" }}>
                Parsed securely
              </p>
              <p className="text-xs" style={{ color: "var(--aa-text-secondary)" }}>
                {file?.name}
              </p>
            </div>
          </div>

          {/* Preview extracted data */}
          <div className="space-y-4 mb-6">
            {(parsed as { full_name?: string }).full_name && (
              <Field label="Name" value={(parsed as { full_name: string }).full_name} />
            )}
            {(parsed as { email?: string }).email && (
              <Field label="Email" value={(parsed as { email: string }).email} />
            )}
            {(parsed as { skills?: string[] }).skills?.length ? (
              <div>
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
                  Skills detected
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {((parsed as { skills: string[] }).skills).slice(0, 12).map((sk: string) => (
                    <span
                      key={sk}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-subtle)", color: "var(--aa-text-secondary)" }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {(parsed as { experience?: unknown[] }).experience?.length ? (
              <Field
                label="Experience entries"
                value={`${(parsed as { experience: unknown[] }).experience.length} roles detected`}
              />
            ) : null}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setParsed(null); setFile(null); }}
              className="text-sm px-4 py-2 rounded-lg"
              style={{ background: "var(--aa-bg-surface)", border: "1px solid var(--aa-border-default)", color: "var(--aa-text-secondary)" }}
            >
              Re-upload
            </button>
            <button
              onClick={() => onComplete(parsed)}
              className="flex-1 text-sm font-medium px-4 py-2 rounded-lg"
              style={{ background: "var(--aa-brand)", color: "var(--aa-text-inverse)" }}
            >
              Looks good — continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--aa-text-tertiary)", fontFamily: "monospace" }}>
      {label}
    </p>
    <p className="text-sm" style={{ color: "var(--aa-text-primary)" }}>{value}</p>
  </div>
);
