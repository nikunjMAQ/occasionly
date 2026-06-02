-- 1. Enable pg_cron extension if not already enabled
create extension if not exists pg_cron;

-- 2. Clean up any existing schedule for process-reminders safely
do $$
begin
  perform cron.unschedule('process-reminders-every-minute');
exception when others then
  -- Ignore error if job does not exist
end;
$$;

-- 3. Schedule the reminder processing function to execute every minute
-- This queries the events table and dispatches emails / updates next reminder states
select cron.schedule(
  'process-reminders-every-minute',
  '* * * * *',
  $$
  select
    net.http_post(
      url := 'https://yrwohdnaaswngndfjhfq.supabase.co/functions/v1/process-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'
      ),
      body := '{}'::jsonb
    );
  $$
);
