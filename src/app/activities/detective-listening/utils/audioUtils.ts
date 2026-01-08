import { createClient } from '@supabase/supabase-js';

// Create Supabase client for audio access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Get the public URL for an audio file from Supabase Storage
 */
export const getAudioUrl = (filename: string): string => {
  const { data } = supabaseClient.storage
    .from('audio')
    .getPublicUrl(`detective-listening/${filename}`);
  
  return data.publicUrl;
};

/**
 * Check if an audio file exists in Supabase Storage
 */
export const checkAudioExists = async (filename: string): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.storage
      .from('audio')
      .download(`detective-listening/${filename}`);
    
    return !error && !!data;
  } catch (error) {
    return false;
  }
};

/**
 * Get all available audio files from Supabase Storage
 */
export const listAudioFiles = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabaseClient.storage
      .from('audio')
      .list('detective-listening');

    if (error) {
      console.error('Error listing audio files:', error);
      return [];
    }

    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('Error listing audio files:', error);
    return [];
  }
};
