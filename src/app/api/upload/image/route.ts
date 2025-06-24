import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('Image upload API called');
    
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (e) {
              console.log('Cookie set error (expected in some contexts):', e);
            }
          },
        },
      }
    );

    console.log('Supabase client created, checking auth...');

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    console.log('Auth check result:', { hasSession: !!session, authError });
    
    if (authError || !session) {
      console.log('Authentication failed:', authError);
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    console.log('User authenticated:', session.user.email);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}_${Math.random().toString(36).substring(2)}.${extension}`;
    console.log('Generated filename:', filename);

    // Convert file to ArrayBuffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    console.log('File converted to buffer, size:', fileBuffer.length);

    // Upload to Supabase storage
    console.log('Starting Supabase upload to blog bucket...');
    const { data, error } = await supabase.storage
      .from('blog')
      .upload(filename, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ 
        error: 'Upload failed', 
        details: error.message,
        code: error.name 
      }, { status: 500 });
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog')
      .getPublicUrl(filename);

    console.log('Public URL generated:', publicUrl);

    return NextResponse.json({ 
      url: publicUrl,
      filename: data.path,
      size: file.size,
      type: file.type 
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}