-- 1. Add date_of_birth column to employees
ALTER TABLE employees ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Update existing employees with sample birthdays
UPDATE employees SET date_of_birth = '1995-06-25' WHERE name = 'Haikal Rahman';
UPDATE employees SET date_of_birth = '1992-03-14' WHERE name = 'Hikari Tanaka';
UPDATE employees SET date_of_birth = '1990-12-08' WHERE name = 'Sarah Chen';
UPDATE employees SET date_of_birth = '1988-07-22' WHERE name = 'Ahmad Fauzi';
UPDATE employees SET date_of_birth = '1993-01-30' WHERE name = 'Maya Putri';
UPDATE employees SET date_of_birth = '1991-09-15' WHERE name = 'Riko Saputra';

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'ANNOUNCEMENT' CHECK (type IN ('ANNOUNCEMENT', 'BIRTHDAY', 'SYSTEM')),
  created_by TEXT NOT NULL DEFAULT 'SYSTEM',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Allow anon read notifications" ON notifications FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert notifications" ON notifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update notifications" ON notifications FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete notifications" ON notifications FOR DELETE TO anon USING (true);
CREATE POLICY "Allow authenticated read notifications" ON notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications (is_read);
