import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface EmailParams {
    to: string;
    name?: string;
    subject: string;
    htmlContent: string;
}

async function sendEmail({ to, name, subject, htmlContent }: EmailParams) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.error('❌ BREVO_API_KEY is missing from .env.local');
        return { success: false, error: 'Configuration error' };
    }

    console.log(`📧 Preparing to send email to: ${to}`);
    console.log(`🔑 Using API Key: ${apiKey.substring(0, 5)}...`);

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: 'Daniel from LanguageGems',
                    email: process.env.BREVO_SENDER_EMAIL || 'danieletienne89@gmail.com', // Fallback to your admin email if env var not set
                },
                to: [
                    {
                        email: to,
                        name: name,
                    },
                ],
                subject: subject,
                htmlContent: htmlContent,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Brevo API Error:', JSON.stringify(errorData, null, 2));
            return { success: false, error: errorData };
        }

        const data = await response.json();
        console.log('✅ Email sent successfully!');
        console.log('Response:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        return { success: false, error: error };
    }
}

// ---------------------------------------------------------
//  TEST RUN
// ---------------------------------------------------------
(async () => {
    const TEST_EMAIL = 'danieletienne89@gmail.com'; // ONLY SEND TO YOU

    console.log('🚀 Starting Brevo Email Test...');

    // The "Open Beta" Announcement Template
    const subject = "LanguageGems is now in Open Beta! 💎";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h1 style="color: #2563eb;">LanguageGems is now in Open Beta! 🚀</h1>
        
        <p>Hi there,</p>
        
        <p>You signed up for LanguageGems a while ago when we were in early development.</p>
        
        <p>I'm excited to announce: <strong>LanguageGems is now in Open Beta!</strong></p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bae6fd;">
            <h3 style="margin-top: 0; color: #0284c7;">✅ What's New & Unlocked:</h3>
            <ul style="margin-bottom: 0;">
                <li><strong>All features now unlocked</strong> for free during beta</li>
                <li>Full access to all games (Spanish, French, German)</li>
                <li>New AI-generated songs and vocabulary practice</li>
                <li>GCSE-focused content (AQA & Edexcel aligned)</li>
            </ul>
        </div>

        <p>Your account is ready to use right now:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.languagegems.com/auth/login" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Login to LanguageGems</a>
        </div>

        <p>This is completely <strong>free</strong> during our Open Beta phase. We're actively looking for feedback to make LanguageGems even better for teachers and learners like you.</p>

        <p>Try it out and let me know what you think!</p>

        <p style="margin-top: 30px;">
            Best,<br>
            <strong>Daniel</strong><br>
            <span style="color: #666; font-size: 14px;">MFL Teacher & LanguageGems Creator</span>
        </p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #999;">
            You received this email because you signed up for LanguageGems.<br>
            If you'd prefer not to receive updates, you can <a href="{{ unsubscribe }}" style="color: #999; text-decoration: underline;">unsubscribe here</a>.
        </p>
    </div>
    `;

    await sendEmail({
        to: TEST_EMAIL,
        name: 'Daniel (Admin)',
        subject: subject,
        htmlContent: htmlContent
    });
})();
