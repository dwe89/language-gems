import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: 'BREVO_API_KEY not configured' }, { status: 500 });
  }

  try {
    const { recipient } = await request.json();
    
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'LanguageGems Test',
          email: 'noreply@languagegems.com'
        },
        to: [
          {
            email: recipient || 'support@languagegems.com',
            name: 'Test Recipient'
          }
        ],
        subject: 'Test Email from LanguageGems Contact System',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #3b82f6;">Email Test Successful! 🎉</h2>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #374151;">Test Details</h3>
              <p><strong>Time:</strong> ${new Date().toLocaleString('en-GB', {
                timeZone: 'Europe/London',
                dateStyle: 'full',
                timeStyle: 'short'
              })}</p>
              <p><strong>Recipient:</strong> ${recipient || 'support@languagegems.com'}</p>
              <p><strong>Purpose:</strong> Testing LanguageGems contact form email delivery</p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">What This Means</h3>
              <p>If you received this email, your Brevo configuration is working correctly!</p>
              <p>Contact form submissions will be delivered to this email address.</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This is a test email from the LanguageGems contact form system.
              </p>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to send test email', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: data.messageId,
      recipient: recipient || 'support@languagegems.com'
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: (error as Error).message },
      { status: 500 }
    );
  }
}