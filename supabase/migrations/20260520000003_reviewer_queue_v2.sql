-- Extend reviewer_queue to match the Week 3/4 dead-letter + reviewer API schema

ALTER TABLE reviewer_queue
  ADD COLUMN IF NOT EXISTS candidate_id   UUID,
  ADD COLUMN IF NOT EXISTS job_id         UUID,
  ADD COLUMN IF NOT EXISTS payload        JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resolved_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS started_at     TIMESTAMPTZ;

-- Rename old columns to match API expectations (only if they still exist under old names)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='reviewer_queue' AND column_name='completed_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='reviewer_queue' AND column_name='resolved_at'
  ) THEN
    ALTER TABLE reviewer_queue RENAME COLUMN completed_at TO resolved_at;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS reviewer_queue_type_resolved
  ON reviewer_queue (queue_type, resolved_at)
  WHERE resolved_at IS NULL;
