// Utility functions for generating student credentials

export function generatePassword(): string {
  // Generate a random password (lowercase only)
  const length = 8;
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log(`Generated password: ${password}`);
  return password;
}

export async function generateScopedUsername(
  supabase: any,
  firstName: string,
  lastName: string,
  schoolInitials: string
): Promise<string> {
  try {
    // Create base username: firstname + last initial (e.g., johns, maryt)
    const baseUsername = `${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}`;
    let finalUsername = baseUsername;
    let suffix = 0;
    
    // Check if username exists and add suffix if needed
    while (true) {
      const { data: existingUser, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', finalUsername)
        .single();
      
      if (error || !existingUser) {
        // Username is available (error means no match found)
        break;
      }
      
      // Username exists, try with suffix
      suffix++;
      finalUsername = `${baseUsername}${suffix}`;
    }
    
    console.log(`Generated username for ${firstName} ${lastName}: ${finalUsername}`);
    return finalUsername;
  } catch (error) {
    console.error('Error in generateScopedUsername:', error);
    // Fallback to simple username generation
    return `${firstName.toLowerCase()}${lastName.charAt(0).toLowerCase()}${Date.now()}`;
  }
}

export function generateSchoolInitials(teacherProfile: any): string {
  // Get or generate school initials
  if (teacherProfile.school_initials) {
    return teacherProfile.school_initials;
  }
  
  // Generate school initials from teacher's email domain or set a default
  if (teacherProfile.email && teacherProfile.email.includes('@')) {
    const domain = teacherProfile.email.split('@')[1];
    // Extract first 3 characters of domain name (before any dots)
    const domainName = domain.split('.')[0];
    return domainName.substring(0, 3).toUpperCase();
  } else {
    // Fallback to first 3 letters of display name or default
    const name = teacherProfile.display_name || 'SCHOOL';
    return name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  }
}

export async function ensureTeacherHasSchoolInitials(
  supabase: any,
  teacherId: string,
  teacherProfile: any
): Promise<string> {
  let schoolInitials = teacherProfile.school_initials;
  
  if (!schoolInitials) {
    schoolInitials = generateSchoolInitials(teacherProfile);
    
    // Update teacher's profile with the generated school initials
    await supabase
      .from('user_profiles')
      .update({ school_initials: schoolInitials })
      .eq('user_id', teacherId);
  }
  
  return schoolInitials;
} 