import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

export const dynamic = 'force-dynamic';

/**
 * Subscribe to blog notifications
 */
export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

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

    const supabase = createServiceRoleClient();

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('blog_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to our blog updates',
          isExisting: true
        });
      } else {
        // Reactivate subscription
        const { error } = await supabase
          .from('blog_subscribers')
          .update({
            is_active: true,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id);

        if (error) {
          console.error('Error reactivating subscription:', error);
          return NextResponse.json(
            { error: 'Failed to reactivate subscription' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your blog subscription has been reactivated',
          isExisting: true
        });
      }
    }

    // Create new subscription
    const { error } = await supabase
      .from('blog_subscribers')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        is_active: true
      });

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    // Add to Brevo list (optional)
    try {
      await addToBrevoList(email, firstName, lastName);
    } catch (brevoError) {
      console.warn('Failed to add to Brevo list:', brevoError);
      // Don't fail the entire request for Brevo errors
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to blog updates!',
      isExisting: false
    });

  } catch (error) {
    console.error('Blog subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Unsubscribe from blog notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Unsubscribe token or email is required' },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    let query = supabase.from('blog_subscribers');
    
    if (token) {
      query = query.eq('unsubscribe_token', token);
    } else {
      query = query.eq('email', email);
    }

    const { error } = await query.update({
      is_active: false,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error unsubscribing:', error);
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from blog updates'
    });

  } catch (error) {
    console.error('Blog unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function addToBrevoList(email: string, firstName?: string, lastName?: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not found, skipping Brevo integration');
    return { success: false, error: 'No API key' };
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
          LASTNAME: lastName || '',
        },
        listIds: [2], // Replace with your blog subscribers list ID
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      console.log('Successfully added contact to Brevo blog list');
      return { success: true };
    } else {
      const errorData = await response.json();
      console.warn('Brevo API error (non-critical):', errorData);
      return { success: false, error: errorData, nonCritical: true };
    }
  } catch (error) {
    console.warn('Error adding contact to Brevo (non-critical):', error);
    return { success: false, error, nonCritical: true };
  }
}
