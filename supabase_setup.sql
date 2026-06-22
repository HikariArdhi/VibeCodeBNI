-- ============================================
-- TugasVibeCodeBNI — Supabase Database Setup
-- Employee Leave Management System
-- ============================================

-- ============================================
-- STEP 1: TABLE app_users
-- ============================================
CREATE TABLE IF NOT EXISTS app_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT NOT NULL UNIQUE CHECK (char_length(username) >= 1),
  password_hash TEXT NOT NULL CHECK (char_length(password_hash) >= 1),
  role          TEXT NOT NULL DEFAULT 'EMPLOYEE'
                CHECK (role IN ('MANAGER', 'SUPERVISOR', 'EMPLOYEE')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_app_users_username
  ON app_users (username);

COMMENT ON TABLE app_users IS 'Tabel user untuk authentication - TugasVibeCodeBNI';

INSERT INTO app_users (username, password_hash, role) VALUES
  ('admin',  'admin123',  'MANAGER'),
  ('hikari', 'hikari123', 'SUPERVISOR'),
  ('haikal', 'haikal123', 'EMPLOYEE')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- STEP 2: TABLE employees
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL CHECK (char_length(name) >= 3),
  department            TEXT NOT NULL CHECK (char_length(department) > 0),
  position              TEXT NOT NULL CHECK (char_length(position) > 0),
  annual_leave_balance  INTEGER NOT NULL DEFAULT 12
                        CHECK (annual_leave_balance >= 0),
  block_leave_taken     BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_name_lower
  ON employees (LOWER(name));

CREATE INDEX IF NOT EXISTS idx_employees_department
  ON employees (department);

COMMENT ON TABLE employees IS 'Tabel data karyawan - TugasVibeCodeBNI';

-- ============================================
-- STEP 3: TABLE leave_requests
-- ============================================
CREATE TABLE IF NOT EXISTS leave_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type          TEXT NOT NULL DEFAULT 'ANNUAL_LEAVE'
                CHECK (type IN ('ANNUAL_LEAVE', 'BLOCK_LEAVE', 'SICK_LEAVE')),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  reason        TEXT NOT NULL CHECK (char_length(reason) > 0),
  status        TEXT NOT NULL DEFAULT 'PENDING'
                CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_date_range CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_status
  ON leave_requests (status);

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id
  ON leave_requests (employee_id);

CREATE INDEX IF NOT EXISTS idx_leave_requests_type
  ON leave_requests (type);

CREATE INDEX IF NOT EXISTS idx_leave_requests_dates
  ON leave_requests (start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_leave_requests_status_created
  ON leave_requests (status, created_at DESC);

COMMENT ON TABLE leave_requests IS 'Tabel pengajuan cuti karyawan - TugasVibeCodeBNI';

-- ============================================
-- STEP 4: TRIGGER auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_employees_updated_at ON employees;
CREATE TRIGGER trg_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER trg_leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 5: VIEWS for Dashboard
-- ============================================
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM employees) AS total_employees,
  (SELECT COUNT(*) FROM leave_requests WHERE status = 'PENDING') AS pending_leaves,
  (SELECT COUNT(*) FROM leave_requests WHERE status = 'APPROVED') AS approved_leaves,
  (SELECT COUNT(*) FROM leave_requests WHERE status = 'REJECTED') AS rejected_leaves,
  (SELECT COUNT(*) FROM employees WHERE block_leave_taken = false) AS non_compliant_block_leave;

CREATE OR REPLACE VIEW department_distribution AS
SELECT
  department,
  COUNT(*) AS employee_count
FROM employees
GROUP BY department
ORDER BY employee_count DESC;

CREATE OR REPLACE VIEW recent_leave_requests AS
SELECT
  lr.id,
  lr.employee_id,
  e.name AS employee_name,
  e.department AS employee_department,
  lr.type,
  lr.start_date,
  lr.end_date,
  (lr.end_date - lr.start_date) AS duration_days,
  lr.reason,
  lr.status,
  lr.created_at
FROM leave_requests lr
JOIN employees e ON e.id = lr.employee_id
ORDER BY lr.created_at DESC
LIMIT 10;

-- ============================================
-- STEP 6: ROW LEVEL SECURITY
-- ============================================
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- app_users policies
CREATE POLICY "Allow authenticated read app_users"
  ON app_users FOR SELECT TO authenticated USING (true);

-- employees policies
CREATE POLICY "Allow authenticated read employees"
  ON employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert employees"
  ON employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update employees"
  ON employees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete employees"
  ON employees FOR DELETE TO authenticated USING (true);

-- leave_requests policies
CREATE POLICY "Allow authenticated read leave_requests"
  ON leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert leave_requests"
  ON leave_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update leave_requests"
  ON leave_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete leave_requests"
  ON leave_requests FOR DELETE TO authenticated USING (true);

-- ============================================
-- STEP 7: SEED DATA
-- ============================================
INSERT INTO employees (name, department, position, annual_leave_balance, block_leave_taken) VALUES
  ('Ahmad Fauzi',     'Engineering',      'Senior Staff', 10, true),
  ('Siti Nurhaliza',  'Human Resources',  'Manager',      12, false),
  ('Budi Santoso',    'Finance',          'Junior Staff', 12, false),
  ('Dewi Lestari',    'Marketing',        'Lead',          8, true),
  ('Eko Prasetyo',    'Operations',       'Manager',      12, false),
  ('Fitri Handayani', 'Sales',            'Senior Staff', 11, false);

INSERT INTO leave_requests (employee_id, type, start_date, end_date, reason, status)
SELECT e.id, 'ANNUAL_LEAVE', '2026-07-01'::DATE, '2026-07-03'::DATE, 'Family vacation', 'PENDING'
FROM employees e WHERE e.name = 'Ahmad Fauzi'
UNION ALL
SELECT e.id, 'SICK_LEAVE', '2026-07-10'::DATE, '2026-07-12'::DATE, 'Medical checkup', 'APPROVED'
FROM employees e WHERE e.name = 'Siti Nurhaliza'
UNION ALL
SELECT e.id, 'ANNUAL_LEAVE', '2026-07-15'::DATE, '2026-07-16'::DATE, 'Personal matters', 'REJECTED'
FROM employees e WHERE e.name = 'Budi Santoso'
UNION ALL
SELECT e.id, 'BLOCK_LEAVE', '2026-07-20'::DATE, '2026-07-25'::DATE, 'Mandatory block leave compliance', 'PENDING'
FROM employees e WHERE e.name = 'Dewi Lestari';

-- ============================================
-- DONE! Verifikasi:
-- SELECT * FROM dashboard_stats;
-- SELECT * FROM department_distribution;
-- SELECT * FROM recent_leave_requests;
-- ============================================
