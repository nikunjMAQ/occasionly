create table if not exists notifications (
  id text primary key,

  user_id uuid not null,

  data jsonb not null,

  created_at timestamptz
  default now()
);

alter table notifications
enable row level security;

create policy
"Users manage own notifications"

on notifications

for all

using (
  auth.uid() = user_id
)

with check (
  auth.uid() = user_id
);
