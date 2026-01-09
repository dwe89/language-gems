import { createClient } from '../../../../lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function generateScopedUsername(firstName: string, lastName: string, schoolInitials: string, existingUsernames: Set<string>) {
  // Create base username: firstnamel (e.g., johns) - all lowercase
  const baseUsername = `${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`;
  let finalUsername = baseUsername;
  let suffix = 0;

  // Check if username exists and add suffix if needed
  while (existingUsernames.has(finalUsername)) {
    suffix++;
    finalUsername = baseUsername + suffix;
  }

  // Add to existing usernames to prevent duplicates in this batch
  existingUsernames.add(finalUsername);
  return finalUsername;
}

function generatePassword() {
  // Arrays for gem-based password generation
  const adjectives = [
    'Good', 'New', 'Old', 'Pure', 'Dark', 'Cool', 'Full', 'Soft', 'Warm',
    'Cold', 'Hot', 'Long', 'Deep', 'Sweet', 'Dry', 'Wet', 'Fine', 'Grey',
    'True', 'Rich', 'High', 'Low', 'Nice', 'Bold', 'Wise',
    'Flat', 'Dull', 'Open', 'Live', 'Real', 'Last', 'Safe', 'Fresh', 'Hard',
    'Pure', 'Pink', 'Blue', 'Red', 'Gold', 'Silver', 'Red', 'Green', 'Yellow', 'Orange',
    'Purple', 'Indigo', 'Violet', 'Black', 'White', 'Gray', 'Brown', 'Tan', 'Beige',
    'Cyan', 'Magenta', 'Lime', 'Olive', 'Maroon', 'Navy', 'Teal', 'Aqua', 'Fuchsia',
    'Rose', 'Lavender',
  ];

  const gems = [
    'Stone', 'Rock', 'Jewel', 'Sparkle', 'Crystal', 'Bead', 'Charm', 'Glow',
    'Amber', 'Garnet', 'Quartz', 'Onyx', 'Turquoise', 'Amethyst', 'Glass',
    'Coral', 'Pearl', 'Diamond', 'Ruby', 'Topaz', 'Opal', 'Jade', 'Sapphire',
    'Emerald', 'Treasure', 'Fossil', 'Pebble', 'Chip', 'Shard', 'Glitter', 'Glimmer',
    'Gemstone', 'Mineral', 'Ore', 'Vein', 'Nugget', 'Dust', 'Deposit', 'Mine',
    'Cave', 'Fragment', 'Element', 'Piece', 'Bit', 'Speck', 'Spot', 'Mark',
    'Dot', 'Ring', 'Orb', 'Sphere', 'Drop', 'Teardrop', 'Amulet', 'Talisman',
    'Pendant', 'Necklace', 'Bracelet', 'Earring', 'Crown', 'Scepter', 'Coin',
    'Token', 'Medal', 'Award', 'Prize', 'Trophy', 'Ribbon', 'Badge', 'Emblem',
    'Seal', 'Symbol', 'Light', 'Fire', 'Ember', 'Glimmer', 'Flash',
    'Shine', 'Luster', 'Facet', 'Cut', 'Carat', 'Clarity', 'Colour',
    'Platinum', 'Metal', 'Ore', 'Deposit', 'Mine', 'Fragment'
  ];

  // Pick random adjective and gem
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const gem = gems[Math.floor(Math.random() * gems.length)];

  // Generate random number between 10 and 99
  const number = Math.floor(Math.random() * 90) + 10;

  return `${adjective}${gem}${number}`.toLowerCase();
}

// Process students in batches to avoid timeouts
const BATCH_SIZE = 5;

// Configure route settings
export const maxDuration = 60; // 60 seconds timeout for bulk operations

interface StudentResult {
  name: string;
  username: string;
  password: string;
  userId: string;
}

interface StudentError {
  name: string;
  error: string;
}

interface BatchResult {
  student: {
    name: string;
    firstName: string;
    lastName: string;
    displayName: string;
    username: string;
    password: string;
    email: string;
  };
  authUser?: any;
  error?: string;
  success: boolean;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Create admin client for user creation
    const adminClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { students, classId, schoolCode } = body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: 'Student list is required' }, { status: 400 });
    }

    if (!classId) {
      return NextResponse.json({ error: 'Class ID is required' }, { status: 400 });
    }

    if (!schoolCode) {
      return NextResponse.json({ error: 'School code is required' }, { status: 400 });
    }

    // Verify teacher owns the class
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('name')
      .eq('id', classId)
      .eq('teacher_id', user.id)
      .single();

    if (classError || !classData) {
      return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 403 });
    }

    // Check user profile for subscription type and student limits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_type')
      .eq('user_id', user.id)
      .single();

    if (profile?.subscription_type === 'individual_teacher') {
      const { count } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('teacher_id', user.id);

      const currentCount = count || 0;
      const MAX_STUDENTS = 150;

      if (currentCount + students.length > MAX_STUDENTS) {
        return NextResponse.json({
          error: `Individual Teacher plan is limited to ${MAX_STUDENTS} students. You currently have ${currentCount} students and are trying to add ${students.length} more.`
        }, { status: 403 });
      }
    }

    // Get existing usernames to avoid conflicts
    const { data: existingProfiles, error: profilesError } = await adminClient
      .from('user_profiles')
      .select('username')
      .not('username', 'is', null);

    if (profilesError) {
      return NextResponse.json({ error: 'Failed to check existing usernames' }, { status: 500 });
    }

    const existingUsernames = new Set(existingProfiles?.map(p => p.username) || []);
    const results: StudentResult[] = [];
    const errors: StudentError[] = [];

    // Validate and prepare student data first
    const validStudents = [];
    for (const studentInput of students) {
      try {
        const name = typeof studentInput === 'string' ? studentInput.trim() : studentInput.name?.trim();

        if (!name) {
          errors.push({ name: 'Unknown', error: 'Student name is required' });
          continue;
        }

        // Replace tabs with spaces and normalize whitespace
        const normalizedName = name.replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();

        // Parse first and last name from full name
        const nameParts = normalizedName.split(' ').filter((part: string) => part.length > 0);
        if (nameParts.length < 2) {
          errors.push({ name: normalizedName, error: 'Please use "First Last" format' });
          continue;
        }

        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        const displayName = `${firstName} ${lastName}`;

        // Generate username and password client-side
        const username = generateScopedUsername(firstName, lastName, schoolCode, existingUsernames);
        const password = generatePassword();

        // Create unique email with timestamp to avoid duplicates
        const baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}`;
        const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
        const email = `${baseEmail}.${uniqueId}@student.languagegems.com`;

        validStudents.push({
          name: normalizedName,
          firstName,
          lastName,
          displayName,
          username,
          password,
          email
        });
      } catch (error: any) {
        const originalName = typeof studentInput === 'string' ? studentInput : studentInput.name || 'Unknown';
        const normalizedErrorName = originalName.replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();
        errors.push({
          name: normalizedErrorName,
          error: error.message
        });
      }
    }

    // Process students in batches to avoid timeouts
    for (let i = 0; i < validStudents.length; i += BATCH_SIZE) {
      const batch = validStudents.slice(i, i + BATCH_SIZE);

      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(validStudents.length / BATCH_SIZE)}: ${batch.length} students`);

      // Process batch in parallel where possible
      const batchPromises = batch.map(async (student): Promise<BatchResult> => {
        try {
          // Create auth user
          const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
            email: student.email,
            password: student.password,
            email_confirm: true,
            user_metadata: {
              name: student.displayName,
              role: 'student',
              username: student.username
            }
          });

          if (authError) {
            throw new Error(authError.message);
          }

          return {
            student,
            authUser: authUser.user,
            success: true
          };
        } catch (error: any) {
          return {
            student,
            error: error.message,
            success: false
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Collect successful auth users for batch profile updates
      const successfulUsers = batchResults.filter(result => result.success);
      const failedUsers = batchResults.filter(result => !result.success);

      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} results: ${successfulUsers.length} successful, ${failedUsers.length} failed`);

      // Add failed users to errors
      failedUsers.forEach(result => {
        errors.push({
          name: result.student.name,
          error: result.error || 'Unknown error occurred'
        });
      });

      if (successfulUsers.length > 0) {
        // Update profiles in batch - use update instead of upsert since handle_new_user trigger already created profiles
        const profilePromises = successfulUsers.map(result =>
          adminClient
            .from('user_profiles')
            .update({
              username: result.student.username,
              teacher_id: user.id,
              initial_password: result.student.password,
              school_code: schoolCode
            })
            .eq('user_id', result.authUser!.id)
        );

        const profileResults = await Promise.all(profilePromises);

        // Check if any profile updates failed
        const failedProfileUpdates = profileResults.filter(result => result.error);
        if (failedProfileUpdates.length > 0) {
          console.error('Some profile updates failed:', failedProfileUpdates);
          // Add failed users to errors but continue with enrollments for successful ones
          failedProfileUpdates.forEach((result, index) => {
            const correspondingUser = successfulUsers[profileResults.indexOf(result)];
            if (correspondingUser) {
              errors.push({
                name: correspondingUser.student.name,
                error: `Profile update failed: ${result.error?.message || 'Unknown error'}`
              });
            }
          });
        }

        // Only process enrollments for users whose profiles were successfully updated
        const successfulProfileUsers = successfulUsers.filter((user, index) => {
          const profileResult = profileResults[index];
          return !profileResult.error;
        });

        if (successfulProfileUsers.length > 0) {
          // Batch insert class enrollments
          const enrollments = successfulProfileUsers.map(result => ({
            class_id: classId,
            student_id: result.authUser!.id,
            enrolled_at: new Date().toISOString(),
            status: 'active'
          }));

          const { error: enrollError } = await adminClient
            .from('class_enrollments')
            .insert(enrollments);

          if (enrollError) {
            console.error('Batch enrollment error:', enrollError);
            successfulProfileUsers.forEach(result => {
              errors.push({
                name: result.student.name,
                error: `Enrollment failed: ${enrollError.message}`
              });
            });
          } else {
            // Add successful results only for users who completed the entire process
            successfulProfileUsers.forEach(result => {
              results.push({
                name: result.student.displayName,
                username: result.student.username,
                password: result.student.password,
                userId: result.authUser!.id
              });
            });
          }
        }
      }

      // Add a delay between batches to prevent rate limiting
      if (i + BATCH_SIZE < validStudents.length) {
        console.log('Waiting 500ms before next batch...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return NextResponse.json({
      results,
      errors,
      message: `Successfully created ${results.length} student accounts`,
      total: results.length + errors.length
    });
  } catch (error: any) {
    console.error('Error in bulk student creation:', error);
    return NextResponse.json({
      error: 'Failed to create students',
      details: error.message
    }, { status: 500 });
  }
} 