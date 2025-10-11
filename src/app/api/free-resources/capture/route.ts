import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, resourceId, source } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('Processing free resource request:', { email, firstName, resourceId, source });

    // 1. Save lead to database
    const { data: lead, error: leadError } = await supabase
      .from('free_resource_leads')
      .insert({
        email,
        first_name: firstName || null,
        resource_id: resourceId || null,
        source: source || 'free-resources-landing',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (leadError) {
      // Check if it's a duplicate email
      if (leadError.code === '23505') {
        console.log('Email already exists, proceeding to send resources');
      } else {
        console.error('Error saving lead:', leadError);
        return NextResponse.json(
          { error: 'Failed to save lead information' },
          { status: 500 }
        );
      }
    }

    // 2. Add to Brevo contact list
    try {
      await addToBrevoList(email, firstName);
    } catch (brevoError) {
      console.warn('Brevo contact creation failed (non-critical):', brevoError);
    }

    // 3. Send email with download links
    await sendFreeResourceEmail(email, firstName);

    return NextResponse.json({
      success: true,
      message: 'Resources sent successfully!',
    });

  } catch (error: any) {
    console.error('Error processing free resource request:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

async function addToBrevoList(email: string, firstName?: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_FREE_RESOURCES_LIST_ID = process.env.BREVO_FREE_RESOURCES_LIST_ID || '3'; // Create this list in Brevo

  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured');
    return;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName || '',
        },
        listIds: [Number(BREVO_FREE_RESOURCES_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      console.log('Successfully added contact to Brevo free resources list');
    } else {
      const errorData = await response.json();
      console.warn('Brevo API error (non-critical):', errorData);
    }
  } catch (error) {
    console.warn('Failed to add to Brevo list:', error);
  }
}

async function sendFreeResourceEmail(email: string, firstName?: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.languagegems.com';

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY not configured');
    throw new Error('Email service not configured');
  }

  // Get download URLs from Supabase Storage
  const resources = [
    {
      name: 'Spanish Vocabulary Starter Pack',
      path: 'free-resources/spanish-vocab-starter.pdf'
    },
    {
      name: 'French Grammar Quick Reference',
      path: 'free-resources/french-grammar-guide.pdf'
    },
    {
      name: 'Language Learning Planner',
      path: 'free-resources/language-learning-planner.pdf'
    }
  ];

  // Generate signed URLs for downloads (valid for 7 days)
  const downloadLinks = await Promise.all(
    resources.map(async (resource) => {
      const { data, error } = await supabase.storage
        .from('products') // or create a 'free-resources' bucket
        .createSignedUrl(resource.path, 604800); // 7 days in seconds

      if (error) {
        console.error(`Error creating signed URL for ${resource.name}:`, error);
        // Fallback to public URL if signed URL fails
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(resource.path);
        return {
          name: resource.name,
          url: publicUrlData.publicUrl
        };
      }

      return {
        name: resource.name,
        url: data.signedUrl
      };
    })
  );

  // Send email via Brevo using template
  // You'll need to create this template in Brevo (Template ID: 16)
  const TEMPLATE_ID = 16; // Create this template in Brevo

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        templateId: TEMPLATE_ID,
        to: [{ email, name: firstName || email }],
        params: {
          first_name: firstName || 'there',
          download_link_1: downloadLinks[0]?.url || '',
          download_link_2: downloadLinks[1]?.url || '',
          download_link_3: downloadLinks[2]?.url || '',
          resource_name_1: downloadLinks[0]?.name || '',
          resource_name_2: downloadLinks[1]?.name || '',
          resource_name_3: downloadLinks[2]?.name || '',
          resources_page_url: `${BASE_URL}/resources`,
          unsubscribe_url: `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}`
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo email send error:', errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }

    console.log('Free resource email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending free resource email:', error);
    throw error;
  }
}

