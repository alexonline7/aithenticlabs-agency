ALTER TABLE public.generated_reports
DROP CONSTRAINT IF EXISTS generated_reports_report_type_check;

ALTER TABLE public.generated_reports
ADD CONSTRAINT generated_reports_report_type_check
CHECK (
  report_type = ANY (
    ARRAY[
      'interview'::text,
      'architecture'::text,
      'ux_blueprint'::text,
      'consensus'::text,
      'quantum-blueprint'::text,
      'ai-brief'::text,
      'flash-app'::text
    ]
  )
);