create table if not exists reminder_logs (
  id text primary key,

  user_id uuid not null,

  data jsonb not null,

  created_at timestamptz
  default now()
);

alter table reminder_logs
enable row level security;

create policy
"Users manage own reminder logs"

on reminder_logs

for all

using (
  auth.uid() = user_id
)

with check (
  auth.uid() = user_id
);
