import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase-server';

// Brevo API integration
async function addToBrevoList(email: string, firstName?: string, lastName?: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not found, skipping Brevo integration');
    return { success: false, error: 'No API key' };
  }

  try {
    // First, create or update the contact
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
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
          SOURCE: 'Coming Soon Modal',
          SIGNUP_DATE: new Date().toISOString(),
        },
        listIds: [8], // Add to list ID 8
        updateEnabled: true, // Update if contact already exists
      }),
    });

    if (contactResponse.ok) {
      console.log('Successfully added contact to Brevo');

      // Send welcome email (optional - you need to create template ID in Brevo first)
      // await sendWelcomeEmail(email, firstName, lastName);

      return { success: true };
    } else {
      const errorData = await contactResponse.json();
      console.warn('Brevo API error (non-critical):', errorData);
      // Don't fail the entire request if Brevo fails
      return { success: false, error: errorData, nonCritical: true };
    }
  } catch (error) {
    console.warn('Error adding contact to Brevo (non-critical):', error);
    return { success: false, error, nonCritical: true };
  }
}

// Optional: Send welcome email via Brevo transactional API
async function sendWelcomeEmail(email: string, firstName?: string, lastName?: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) return { success: false };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        templateId: 1, // Replace with your Brevo template ID
        to: [{ email, name: `${firstName} ${lastName}`.trim() }],
        params: {
          FIRSTNAME: firstName || 'there',
          LASTNAME: lastName || '',
        },
      }),
    });

    if (response.ok) {
      console.log('Welcome email sent successfully');
      return { success: true };
    } else {
      const errorData = await response.json();
      console.warn('Failed to send welcome email:', errorData);
      return { success: false, error: errorData };
    }
  } catch (error) {
    console.warn('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, source = 'coming-soon-modal' } = await request.json();

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

    const supabase = await createClient();

    // Check if email already exists in Supabase
    const { data: existingEmail } = await supabase
      .from('beta_email_signups')
      .select('id, features')
      .eq('email', email)
      .single();

    let supabaseResult;
    
    if (existingEmail) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('beta_email_signups')
        .update({
          updated_at: new Date().toISOString(),
          source: source,
        })
        .eq('id', existingEmail.id);

      if (updateError) {
        console.error('Error updating email signup:', updateError);
        return NextResponse.json(
          { error: 'Failed to update signup' },
          { status: 500 }
        );
      }

      supabaseResult = { isExisting: true };
    } else {
      // Create new email signup record
      const { error: insertError } = await supabase
        .from('beta_email_signups')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          features: ['coming-soon'],
          priority: 'high',
          source,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting email signup:', insertError);
        return NextResponse.json(
          { error: 'Failed to save email signup' },
          { status: 500 }
        );
      }

      supabaseResult = { isExisting: false };
    }

    // Add to Brevo (don't fail the request if this fails)
    const brevoResult = await addToBrevoList(email, firstName, lastName);
    
    return NextResponse.json({
      success: true,
      message: supabaseResult.isExisting 
        ? 'Email updated successfully' 
        : 'Email successfully added to our list',
      isExisting: supabaseResult.isExisting,
      brevoSuccess: brevoResult.success,
    });

  } catch (error) {
    console.error('Coming soon signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
