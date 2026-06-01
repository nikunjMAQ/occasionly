alter table events
add column if not exists updated_at
timestamptz default now();
