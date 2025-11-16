-- Migration: Add trial and invoice columns to support 14-day free trial workflow
-- Run this in your Supabase SQL Editor

-- Add trial columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS trial_status VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_school_owner BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS school_code VARCHAR(50) DEFAULT NULL;

-- Create indexes for trial lookups
CREATE INDEX IF NOT EXISTS idx_trial_status ON public.user_profiles(trial_status);
CREATE INDEX IF NOT EXISTS idx_trial_ends_at ON public.user_profiles(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_subscription_status ON public.user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_school_code ON public.user_profiles(school_code);

-- Add trial and invoice columns to school_codes table
ALTER TABLE public.school_codes
ADD COLUMN IF NOT EXISTS trial_status VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_plan VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS estimated_students INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS finance_email VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS additional_notes TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_invoice_id VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invoice_status VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invoice_paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS postcode VARCHAR(20) DEFAULT NULL;

-- Create indexes for school lookups
CREATE INDEX IF NOT EXISTS idx_school_trial_status ON public.school_codes(trial_status);
CREATE INDEX IF NOT EXISTS idx_school_stripe_customer ON public.school_codes(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_school_invoice_status ON public.school_codes(invoice_status);

COMMENT ON COLUMN public.user_profiles.trial_status IS 'Trial status: active, expired, converted, cancelled';
COMMENT ON COLUMN public.user_profiles.trial_starts_at IS 'When the 14-day trial started';
COMMENT ON COLUMN public.user_profiles.trial_ends_at IS 'When the 14-day trial ends';
COMMENT ON COLUMN public.user_profiles.subscription_status IS 'Subscription status: free, trialing, active, cancelled, past_due';
COMMENT ON COLUMN public.user_profiles.subscription_expires_at IS 'When the paid subscription expires';
COMMENT ON COLUMN public.user_profiles.is_school_owner IS 'Whether this user owns/manages a school account';
COMMENT ON COLUMN public.user_profiles.school_code IS 'Associated school code for this user';

COMMENT ON COLUMN public.school_codes.trial_status IS 'School trial status';
COMMENT ON COLUMN public.school_codes.trial_plan IS 'Which plan they trialed: basic, standard, large-school, mat';
COMMENT ON COLUMN public.school_codes.estimated_students IS 'Estimated number of students';
COMMENT ON COLUMN public.school_codes.finance_email IS 'School finance department email for invoicing';
COMMENT ON COLUMN public.school_codes.stripe_customer_id IS 'Stripe customer ID for this school';
COMMENT ON COLUMN public.school_codes.stripe_invoice_id IS 'Latest Stripe invoice ID';
COMMENT ON COLUMN public.school_codes.invoice_status IS 'Invoice status: draft, sent, paid, overdue, cancelled';
COMMENT ON COLUMN public.school_codes.invoice_sent_at IS 'When invoice was sent';
COMMENT ON COLUMN public.school_codes.invoice_paid_at IS 'When invoice was paid';
