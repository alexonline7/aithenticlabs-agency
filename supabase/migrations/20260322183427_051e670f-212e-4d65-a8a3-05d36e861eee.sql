-- Allow public read access to projects that are marked as 'completed' for the portfolio
CREATE POLICY "Public can view completed projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (status = 'completed');

-- Allow authenticated users to read own submissions
CREATE POLICY "Users can read own submissions"
ON public.client_submissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());