-- Create functions for generating student credentials

-- Function to generate a scoped student username
CREATE OR REPLACE FUNCTION generate_student_username_scoped(
    p_first_name TEXT,
    p_last_name TEXT,
    p_school_initials TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    username_exists BOOLEAN;
    suffix INTEGER := 0;
BEGIN
    -- Create base username: FirstnameL + school initials (e.g., JohnS_CHS)
    base_username := INITCAP(p_first_name) || UPPER(LEFT(p_last_name, 1)) || '_' || UPPER(p_school_initials);
    final_username := base_username;
    
    -- Check if username exists and add suffix if needed
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM user_profiles 
            WHERE username = final_username
        ) INTO username_exists;
        
        IF NOT username_exists THEN
            EXIT;
        END IF;
        
        suffix := suffix + 1;
        final_username := base_username || suffix;
    END LOOP;
    
    RETURN final_username;
END;
$$;

-- Function to generate a random student password
CREATE OR REPLACE FUNCTION generate_student_password()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    password TEXT;
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    i INTEGER;
BEGIN
    password := '';
    
    -- Generate 8 character password
    FOR i IN 1..8 LOOP
        password := password || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    RETURN password;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION generate_student_username_scoped(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_student_password() TO authenticated; 