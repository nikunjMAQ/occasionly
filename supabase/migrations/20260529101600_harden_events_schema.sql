-- 1. Alter events table to add flat columns matching OccasionEvent
alter table events
add column if not exists person_name text,
add column if not exists occasion_type text,
add column if not exists occasion_date text,
add column if not exists reminder_days_before integer not null default 0,
add column if not exists reminder_time text not null default '09:00',
add column if not exists timezone text not null default 'UTC',
add column if not exists relationship_type text not null default 'other',
add column if not exists nickname text,
add column if not exists interests text[] not null default '{}',
add column if not exists gift_ideas text[] not null default '{}',
add column if not exists notes text,
add column if not exists version integer not null default 1,
add column if not exists is_favorite boolean not null default false,
add column if not exists whatsapp_number text not null default '',
add column if not exists preferred_reminder_channel text not null default 'whatsapp',
add column if not exists tone text not null default 'warm',
add column if not exists starting_year integer;

-- 2. Migrate existing data from 'data' JSONB column if it exists
update events
set
  person_name = coalesce(data->>'personName', ''),
  occasion_type = coalesce(data->>'eventType', ''),
  occasion_date = coalesce(data->>'recurringDate', ''),
  reminder_days_before = coalesce((data->>'reminderOffsetDays')::integer, 0),
  reminder_time = coalesce(data->>'reminderTime', '09:00'),
  timezone = coalesce(data->>'timezone', 'UTC'),
  relationship_type = coalesce(data->>'relationshipType', 'other'),
  nickname = data->>'nickname',
  interests = array(
    select jsonb_array_elements_text(coalesce(data->'interests', '[]'::jsonb))
  ),
  gift_ideas = array(
    select jsonb_array_elements_text(coalesce(data->'giftIdeas', '[]'::jsonb))
  ),
  notes = data->>'notes',
  version = coalesce((data->>'version')::integer, 1),
  is_favorite = coalesce((data->>'isFavorite')::boolean, false),
  whatsapp_number = coalesce(data->>'whatsappNumber', ''),
  preferred_reminder_channel = coalesce(data->>'preferredReminderChannel', 'whatsapp'),
  tone = coalesce(data->>'tone', 'warm'),
  starting_year = (data->>'startingYear')::integer
where data is not null;

-- 3. Drop the old JSONB data column to complete hardening
alter table events drop column if exists data;

-- 4. Audit & verify optimized indexes
drop index if exists idx_events_occasion_date;
create index if not exists idx_events_occasion_date on events(occasion_date);
create index if not exists idx_events_user_id on events(user_id);

-- 5. Revamp RLS Policies into individual actions (SELECT, INSERT, UPDATE, DELETE)
drop policy if exists "Users manage own events" on events;

create policy "Users can view own events"
on events for select
using (auth.uid() = user_id);

create policy "Users can insert own events"
on events for insert
with check (auth.uid() = user_id);

create policy "Users can update own events"
on events for update
using (auth.uid() = user_id);

create policy "Users can delete own events"
on events for delete
using (auth.uid() = user_id);
