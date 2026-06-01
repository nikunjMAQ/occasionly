create table if not exists events (
  id text primary key,

  user_id uuid not null,

  data jsonb not null,

  created_at timestamptz
  default now()
);

alter table events
enable row level security;

create policy
"Users manage own events"

on events

for all

using (
  auth.uid() = user_id
)

with check (
  auth.uid() = user_id
);
