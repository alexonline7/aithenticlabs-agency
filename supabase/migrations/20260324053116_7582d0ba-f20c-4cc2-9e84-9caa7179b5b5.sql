CREATE POLICY "Anonymous can insert public blueprints"
ON public.generated_reports
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);