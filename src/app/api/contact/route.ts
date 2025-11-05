import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required').refine(
    (email) => {
      // Reject emails that are actually URLs
      if (email.startsWith('http://') || email.startsWith('https://')) {
        return false;
      }
      // Ensure email has @ and valid domain structure
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    { message: 'Please provide a valid email address' }
  ),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(2000, 'Message must be less than 2000 characters'),
  contactType: z.string().optional().default('general'),
  phone: z.string().optional(),
  organization: z.string().optional(),
  // Honeypot field - should always be empty
  website: z.string().optional()
});

// Helper function to send notification email via Brevo
async function sendNotificationEmail(submission: any) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  if (!BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured - skipping email notification');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'LanguageGems Contact Form',
          email: 'support@languagegems.com' // Using validated sender from Brevo
        },
        to: [
          {
            email: 'support@languagegems.com',
            name: 'LanguageGems Support'
          }
        ],
        replyTo: {
          email: submission.email,
          name: submission.name
        },
        subject: `New Contact Form Submission: ${submission.subject}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Contact Form Submission</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Contact Details</h3>
              <p><strong>Name:</strong> ${submission.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
              <p><strong>Contact Type:</strong> ${submission.contact_type}</p>
              ${submission.phone ? `<p><strong>Phone:</strong> ${submission.phone}</p>` : ''}
              ${submission.organization ? `<p><strong>Organization:</strong> ${submission.organization}</p>` : ''}
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Subject</h3>
              <p>${submission.subject}</p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">Message</h3>
              <p style="white-space: pre-wrap;">${submission.message}</p>
            </div>

            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Submission Time:</strong> ${new Date(submission.created_at).toLocaleString('en-GB', {
                  timeZone: 'Europe/London',
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
              <p style="margin: 5px 0 0 0; color: #1e40af;">
                <strong>Submission ID:</strong> ${submission.id}
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This email was automatically generated from the LanguageGems contact form.
                Please respond directly to this email to contact the sender.
              </p>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', response.status, errorData);
      return { success: false, error: 'Failed to send notification email' };
    }

    const data = await response.json();
    console.log('Brevo API response:', {
      status: response.status,
      messageId: data.messageId,
      timestamp: new Date().toISOString(),
      recipient: 'support@languagegems.com'
    });
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: 'Email service error' };
  }
}

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ipAddress: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const limit = 5; // Max 5 submissions
  const windowMs = 60 * 60 * 1000; // Per hour

  const record = rateLimitMap.get(ipAddress);

  // Clean up old entries
  if (record && now > record.resetTime) {
    rateLimitMap.delete(ipAddress);
  }

  const currentRecord = rateLimitMap.get(ipAddress);

  if (!currentRecord) {
    // First submission from this IP
    rateLimitMap.set(ipAddress, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (currentRecord.count >= limit) {
    return { 
      allowed: false, 
      message: 'Too many submissions. Please try again later.' 
    };
  }

  // Increment count
  currentRecord.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // HONEYPOT CHECK: If the "website" field is filled, it's a bot
    if (validatedData.website && validatedData.website.trim() !== '') {
      console.warn('Bot detected: honeypot field filled', {
        email: validatedData.email,
        website: validatedData.website
      });
      // Return success to the bot (so they don't know we detected them)
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.'
      });
    }

    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'Unknown';

    // RATE LIMITING: Check if IP has exceeded submission limit
    const rateLimitCheck = checkRateLimit(ipAddress);
    if (!rateLimitCheck.allowed) {
      console.warn('Rate limit exceeded', { ipAddress });
      return NextResponse.json(
        { error: rateLimitCheck.message },
        { status: 429 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Check if user is authenticated (optional)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Prepare submission data
    const submissionData = {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      contact_type: validatedData.contactType,
      phone: validatedData.phone || null,
      organization: validatedData.organization || null,
      user_id: user?.id || null,
      ip_address: ipAddress,
      user_agent: userAgent,
      source: 'contact_form',
      status: 'new',
      priority: 'medium'
    };

    // Insert into database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert(submissionData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          error: 'Failed to save contact submission',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      );
    }

    // Send notification email
    const emailResult = await sendNotificationEmail(submission);
    
    if (!emailResult.success) {
      console.warn('Email notification failed:', emailResult.error);
      // Don't fail the request if email fails, just log it
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      submissionId: submission.id,
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Contact form submission error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid form data',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}