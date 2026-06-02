-- Create reminder deliveries table
create table public.reminder_deliveries (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null,
  user_id uuid not null,
  delivery_type text not null,
  status text not null default 'pending',
  delivered_at timestamptz,
  error_message text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.reminder_deliveries enable row level security;

-- Add RLS policies for owner checks
create policy "Users can perform all operations on their own reminder deliveries"
  on public.reminder_deliveries
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Alter events table to add scheduling and status fields
alter table public.events
  add column last_reminded_at timestamptz,
  add column next_reminder_at timestamptz,
  add column reminder_enabled boolean default true;
