import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function useMigrations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const runMigrations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if the user_progress table exists
        const { error: tableError } = await supabase
          .from('user_progress')
          .select('id')
          .limit(1);

        // If the table doesn't exist, create it
        if (tableError && tableError.message.includes('relation "user_progress" does not exist')) {
          // Read the migration file
          const response = await fetch('/api/migrations/run-latest');
          if (!response.ok) {
            throw new Error('Failed to run migrations');
          }
          
          const result = await response.json();
          console.log('Migration result:', result);
        }

        setIsComplete(true);
      } catch (err: any) {
        console.error('Migration error:', err);
        setError(err.message || 'Failed to run migrations');
      } finally {
        setIsLoading(false);
      }
    };

    runMigrations();
  }, []);

  return { isLoading, error, isComplete };
} 