-- Migration: add processing column to events table for concurrency lock
-- Created: 2026-06-03

ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS processing BOOLEAN DEFAULT false;
