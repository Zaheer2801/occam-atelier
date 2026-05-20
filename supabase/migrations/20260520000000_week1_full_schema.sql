-- ============================================================
-- OCAS Atelier — Week 1 Full Schema
-- Run this in Supabase SQL editor (project: dwkqadmfghszkjloveia)
-- ============================================================

-- Fuzzy matching for company deduplication (must be first)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Candidates ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               VARCHAR UNIQUE NOT NULL,
  created_at          TIMESTAMP DEFAULT NOW(),
  deleted_at          TIMESTAMP,
  profile_json        JSONB,
  consent_given_at    TIMESTAMP,
  consent_ip          VARCHAR,
  consent_user_agent  VARCHAR,
  geo_country         VARCHAR,
  phone_us            VARCHAR,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  onboarding_step     INTEGER DEFAULT 1,
  subscription_tier   VARCHAR DEFAULT 'scout'
);

-- ── Resume variants ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id      UUID REFERENCES candidates(id) ON DELETE CASCADE,
  variant_name      VARCHAR,          -- 'strength', 'transition', 'technical'
  content_json      JSONB,
  pdf_ats_path      VARCHAR,
  pdf_designed_path VARCHAR,
  pdf_modern_path   VARCHAR,
  docx_path         VARCHAR,
  generation_method VARCHAR DEFAULT 'ai',  -- 'ai' | 'manual'
  created_at        TIMESTAMP DEFAULT NOW(),
  is_active         BOOLEAN DEFAULT TRUE
);

-- ── Canonical company entities ───────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name VARCHAR NOT NULL,
  aliases        JSONB DEFAULT '[]',
  domain         VARCHAR,
  clearbit_id    VARCHAR,
  industry       VARCHAR,
  size_range     VARCHAR,
  is_enterprise  BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- ── Discovered jobs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                 UUID REFERENCES companies(id),
  source                     VARCHAR,          -- 'indeed' | 'google_jobs' | 'greenhouse' | 'lever' | 'ashby'
  source_url                 VARCHAR,
  source_company_name        VARCHAR,
  title                      VARCHAR,
  location                   VARCHAR,
  is_remote                  BOOLEAN,
  salary_min                 INTEGER,
  salary_max                 INTEGER,
  salary_currency            VARCHAR DEFAULT 'USD',
  description_text           TEXT,
  ats_type                   VARCHAR,          -- 'greenhouse' | 'lever' | 'ashby' | 'workday' | 'unknown'
  ats_detected_confidence    FLOAT,
  requires_video             BOOLEAN DEFAULT FALSE,
  requires_portfolio         BOOLEAN DEFAULT FALSE,
  requires_work_sample       BOOLEAN DEFAULT FALSE,
  requires_assessment_first  BOOLEAN DEFAULT FALSE,
  form_field_count           INTEGER,
  posted_at                  TIMESTAMP,
  discovered_at              TIMESTAMP DEFAULT NOW(),
  is_active                  BOOLEAN DEFAULT TRUE,
  fit_score                  FLOAT,
  dedup_hash                 VARCHAR UNIQUE
);

-- ── Applications (central fact table) ───────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id         UUID REFERENCES candidates(id),
  job_id               UUID REFERENCES jobs(id),
  resume_id            UUID REFERENCES resumes(id),
  status               VARCHAR,          -- 'auto_applied' | 'pending_review' | 'manual_required' | 'skipped' | 'withdrawn'
  confidence_score     FLOAT,
  confidence_factors   JSONB,
  veto_applied         VARCHAR,
  applied_at           TIMESTAMP,
  applied_by           VARCHAR,          -- 'bot' | 'human' | 'bot_approved_by_human'
  screenshot_url       VARCHAR,
  form_data_submitted  JSONB,
  outcome_status       VARCHAR,
  outcome_at           TIMESTAMP,
  authenticity_score   FLOAT,
  authenticity_flags   JSONB,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);

-- ── Emails (thread-aware) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS emails (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id      UUID REFERENCES applications(id),
  thread_id           VARCHAR,
  direction           VARCHAR,          -- 'inbound' | 'outbound'
  classification      VARCHAR,          -- 'INTERVIEW_REQUEST' | 'ASSESSMENT' | 'REJECTION' | 'OFFER' | 'FOLLOW_UP_NEEDED' | 'NOISE'
  raw_content         TEXT,
  processed_content   TEXT,
  sent_at             TIMESTAMP,
  approved_by_user_id UUID,
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ── ML training labels ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS outcomes (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id           UUID REFERENCES applications(id),
  response_received        BOOLEAN,
  response_type            VARCHAR,      -- 'rejection' | 'phone_screen' | 'interview' | 'offer' | 'none'
  days_to_response         INTEGER,
  role_cancelled           BOOLEAN DEFAULT FALSE,
  form_submission_success  BOOLEAN,
  application_quality      BOOLEAN,      -- response within 14 days, exclude role_cancelled
  created_at               TIMESTAMP DEFAULT NOW()
);

-- ── Interview state machine ──────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_pipeline (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id    UUID REFERENCES applications(id),
  state             VARCHAR,            -- REQUESTED | AVAILABILITY_SENT | CONFIRMED | COMPLETED | CANCELLED | GHOSTED | OFFER_EXTENDED | NEGOTIATING | ACCEPTED | DECLINED | WITHDRAWN | REJECTED
  previous_state    VARCHAR,
  interviewer_name  VARCHAR,
  interviewer_email VARCHAR,
  scheduled_at      TIMESTAMP,
  completed_at      TIMESTAMP,
  notes             TEXT,
  cancelled_by      VARCHAR,            -- 'candidate' | 'recruiter'
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ── Do Not Contact list ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS dnc_list (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  company_id   UUID REFERENCES companies(id),
  reason       VARCHAR,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  priority     VARCHAR,    -- 'critical' | 'high' | 'normal' | 'low'
  channel      VARCHAR,    -- 'sms' | 'push' | 'email' | 'in_app'
  title        VARCHAR,
  body         TEXT,
  sent_at      TIMESTAMP,
  read_at      TIMESTAMP,
  batch_id     VARCHAR
);

-- ── Immutable audit log ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID,
  actor_type  VARCHAR,    -- 'candidate' | 'reviewer' | 'system'
  action      VARCHAR,
  entity_type VARCHAR,
  entity_id   UUID,
  metadata    JSONB,
  ip_address  VARCHAR,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── Reviewer queue ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviewer_queue (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id       UUID REFERENCES applications(id),
  queue_type           VARCHAR,    -- 'pending_review' | 'manual_required'
  assigned_to          UUID,
  assigned_at          TIMESTAMP,
  completed_at         TIMESTAMP,
  action_taken         VARCHAR,    -- 'approved' | 'edited_approved' | 'rejected' | 'escalated'
  reviewer_notes       TEXT,
  handle_time_seconds  INTEGER,
  created_at           TIMESTAMP DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS companies_canonical_trgm ON companies USING GIN (canonical_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS jobs_dedup_hash           ON jobs (dedup_hash);
CREATE INDEX IF NOT EXISTS jobs_fit_score            ON jobs (fit_score DESC);
CREATE INDEX IF NOT EXISTS applications_candidate    ON applications (candidate_id);
CREATE INDEX IF NOT EXISTS applications_status       ON applications (status);
CREATE INDEX IF NOT EXISTS notifications_candidate   ON notifications (candidate_id, read_at);
CREATE INDEX IF NOT EXISTS audit_log_entity          ON audit_log (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS resumes_candidate         ON resumes (candidate_id, is_active);

-- ── Row-level security on candidates ────────────────────────
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "candidates_own_row" ON candidates
  FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "service_role_all" ON candidates
  FOR ALL USING (auth.role() = 'service_role');
