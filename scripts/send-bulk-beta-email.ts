import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase credentials missing. Make sure SUPABASE_SERVICE_ROLE_KEY is in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface Profile {
    email: string;
    display_name: string | null;
    role: string;
}

async function fetchTargetUsers() {
    console.log('🔍 Fetching target users (teachers and learners)...');
    const { data, error } = await supabase
        .from('user_profiles')
        .select('email, display_name, role')
        .in('role', ['teacher', 'learner'])
        .not('email', 'eq', 'danieletienne89@gmail.com'); // Exclude admin as they get tests

    if (error) {
        console.error('❌ Error fetching users:', error);
        return [];
    }

    return data as Profile[];
}

async function sendEmail(to: string, name: string) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'danieletienne89@gmail.com';

    // Personalize the greeting
    const greeting = name ? `Hi ${name},` : 'Hi there,';

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <h1 style="color: #2563eb;">LanguageGems is now in Open Beta! 🚀</h1>
        
        <p>${greeting}</p>
        
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

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey!,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: 'Daniel from LanguageGems',
                    email: senderEmail,
                },
                to: [{ email: to, name: name || undefined }],
                subject: "LanguageGems is now in Open Beta! 💎",
                htmlContent: htmlContent,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error(`❌ Failed to send to ${to}:`, error);
        return false;
    }
}

async function askConfirmation(message: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(message, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

async function main() {
    const users = await fetchTargetUsers();

    if (users.length === 0) {
        console.log('✅ No target users found (excluding admin).');
        return;
    }

    console.log(`📋 Found ${users.length} target users.`);
    console.log('Sample users:');
    users.slice(0, 5).forEach(u => console.log(` - ${u.email} (${u.role})`));

    const confirmed = await askConfirmation(`\n🚀 Do you want to send the Open Beta email to all ${users.length} users? (y/n): `);

    if (!confirmed) {
        console.log('❌ Operation cancelled by user.');
        return;
    }

    console.log('🚀 Starting bulk send...');
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
        process.stdout.write(`📧 Sending to ${user.email}... `);
        const success = await sendEmail(user.email, user.display_name || '');
        if (success) {
            console.log('✅');
            successCount++;
        } else {
            console.log('❌');
            failCount++;
        }

        // Rate limiting: sleep for 100ms between emails to be safe
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✨ Bulk send complete!');
    console.log(`✅ Successfully sent: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
}

main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
