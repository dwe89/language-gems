-- ============================================================================
-- ADD GRAMMAR GEM TYPE TO ENUM
-- This must be in a separate transaction from using the new enum value
-- ============================================================================

-- Add grammar gem type to existing enum (if not already present)
DO $$ 
BEGIN
    -- Check if 'grammar' value exists in gem_type_enum
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'grammar' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'gem_type_enum')
    ) THEN
        ALTER TYPE gem_type_enum ADD VALUE 'grammar';
    END IF;
END $$;
