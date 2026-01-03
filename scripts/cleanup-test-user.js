const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteUser(email) {
    if (!email) {
        console.error("❌ Please provide an email address");
        process.exit(1);
    }

    console.log(`🔍 Searching for user: ${email}`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        console.log("⚠️ User not found in Auth system.");
        // Try to find in user_profiles to clean up orphaned record
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('user_id')
            .eq('email', email) // Assuming email is in user_profiles? Or likely not.
            .single();

        // If we can't find in auth, we can't easily rely on finding the user_id unless we know it.
        // But usually we just need to delete from auth.admin.
        return;
    }

    const userId = user.id;
    console.log(`✅ Found User ID: ${userId}`);

    // 2. Delete from user_profiles (and other tables via cascade ideally, but let's be safe)
    console.log("🗑️ Deleting from public tables...");

    await supabase.from('user_profiles').delete().eq('user_id', userId);
    await supabase.from('learner_preferences').delete().eq('user_id', userId);
    await supabase.from('learner_progress').delete().eq('user_id', userId);
    await supabase.from('school_codes').delete().eq('code', 'WHIZZ'); // Example cleanup if needed

    // 3. Delete from Auth
    console.log("🗑️ Deleting from Auth system...");
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
        console.error("❌ Error deleting user:", deleteError.message);
    } else {
        console.log("✅ User deleted successfully!");
    }
}

const email = process.argv[2];
deleteUser(email);
