-- Create index for user_id to optimize sync filtering
create index if not exists idx_events_user_id
on events(user_id);

-- Create index for recurringDate stored inside the JSONB data column
create index if not exists idx_events_occasion_date
on events ((data->>'recurringDate'));
