import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/aqa-writing/upload-photo
 * Upload a photo to Supabase storage for use in photo-description questions
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `writing-photo-${timestamp}-${randomString}.${fileExtension}`;

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('assessment-images')
      .upload(`aqa-writing/${fileName}`, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', {
        message: error.message,
        fileName: fileName,
        bucket: 'assessment-images',
        fullError: JSON.stringify(error)
      });
      return NextResponse.json(
        { success: false, error: 'Failed to upload photo to storage', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.error('No data returned from upload');
      return NextResponse.json(
        { success: false, error: 'Upload succeeded but no data returned' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('assessment-images')
      .getPublicUrl(`aqa-writing/${fileName}`);

    if (!urlData || !urlData.publicUrl) {
      console.error('Failed to get public URL for uploaded file');
      return NextResponse.json(
        { success: false, error: 'Failed to generate public URL' },
        { status: 500 }
      );
    }

    console.log('Photo uploaded successfully:', {
      fileName,
      path: data.path,
      publicUrl: urlData.publicUrl
    });

    return NextResponse.json({
      success: true,
      photoUrl: urlData.publicUrl,
      fileName: fileName
    });

  } catch (error: any) {
    console.error('Error in POST /api/admin/aqa-writing/upload-photo:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

