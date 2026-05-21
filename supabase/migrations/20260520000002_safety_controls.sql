-- Safety control columns for candidates
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS is_paused              BOOLEAN    DEFAULT FALSE;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS paused_at              TIMESTAMPTZ;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS emergency_stopped_at   TIMESTAMPTZ;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS hired_at               TIMESTAMPTZ;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS hired_company          VARCHAR;

-- reviewer_queue: track when reviewer started working on an item
ALTER TABLE reviewer_queue ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
