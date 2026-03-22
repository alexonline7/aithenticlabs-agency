CREATE POLICY "Anyone can submit projects"
ON public.client_submissions
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);