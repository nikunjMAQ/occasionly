-- Migration: Add ON DELETE CASCADE foreign key constraint to reminder_deliveries
-- Created: 2026-06-03

-- Alter column type of reminder_id to text to match public.events.id
ALTER TABLE public.reminder_deliveries
ALTER COLUMN reminder_id TYPE text USING reminder_id::text;

-- Clean up any orphaned rows that do not point to a valid event anymore
DELETE FROM public.reminder_deliveries
WHERE reminder_id NOT IN (SELECT id FROM public.events);

-- Add constraint to cascade deletes
ALTER TABLE public.reminder_deliveries
ADD CONSTRAINT fk_reminder_deliveries_reminder_id
FOREIGN KEY (reminder_id)
REFERENCES public.events(id)
ON DELETE CASCADE;
