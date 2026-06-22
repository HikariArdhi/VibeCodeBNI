-- Fix RLS policies: Allow anon role to access tables
-- (needed because supabase-js uses anon key, not authenticated)

-- app_users: anon needs SELECT for login
CREATE POLICY "Allow anon read app_users"
  ON app_users FOR SELECT TO anon USING (true);

-- employees: anon needs full CRUD
CREATE POLICY "Allow anon read employees"
  ON employees FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert employees"
  ON employees FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update employees"
  ON employees FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete employees"
  ON employees FOR DELETE TO anon USING (true);

-- leave_requests: anon needs full CRUD
CREATE POLICY "Allow anon read leave_requests"
  ON leave_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon insert leave_requests"
  ON leave_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon update leave_requests"
  ON leave_requests FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete leave_requests"
  ON leave_requests FOR DELETE TO anon USING (true);
