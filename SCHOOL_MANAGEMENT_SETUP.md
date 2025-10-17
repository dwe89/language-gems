# School Management System - Complete Setup Guide

## ✅ Issues Fixed

### 1. **User Setup - danieletienne89@gmail.com**
**Problem**: User showed "No school associated with user"

**Solution**: 
- Created school code `LGDEMO` for "Language Gems Demo School"
- Set user as school owner with `is_school_owner = true`
- Automatically created school membership via database trigger

**Database Changes**:
```sql
-- School created
INSERT INTO school_codes (code, school_name, is_active)
VALUES ('LGDEMO', 'Language Gems Demo School', true);

-- User updated to school owner
UPDATE user_profiles
SET school_code = 'LGDEMO', is_school_owner = true
WHERE email = 'danieletienne89@gmail.com';

-- School membership auto-created by trigger
-- Result: User is now owner of LGDEMO school
```

### 2. **School Management Card on Account Page**
**Problem**: School Management card only showed for school owners, not all premium users

**Solution**: 
- Updated `/account` page to show School Management card for ALL premium teachers
- Card is now visible at `http://localhost:3000/account` for premium users
- Prominent green gradient card with school management features

**Changes Made**:
- Modified condition from `isTeacher && hasSubscription && schoolInfo?.isOwner` to `isTeacher && hasSubscription`
- All premium teachers can now access school management
- Non-owners will be guided to create their school

### 3. **Teacher Invitation System with Brevo Email Integration**
**Problem**: Adding teachers didn't send emails or create accounts

**Solution**: Created complete teacher invitation workflow with Brevo email integration

**New API Endpoint**: `/api/school/invite-teacher`

**Features**:
1. **For Existing Teachers** (already have Language Gems account):
   - Automatically adds them to the school
   - Sends welcome email via Brevo
   - Notifies them they've been added
   - No signup required

2. **For New Teachers** (don't have account yet):
   - Sends beautiful invitation email via Brevo
   - Includes signup link with pre-filled school code
   - Provides school code for manual entry
   - Guides them through signup process

**Email Templates**:
- **Invitation Email**: For new teachers with signup link
- **Welcome Email**: For existing teachers added to school
- Both use professional HTML templates with Language Gems branding
- Sent via Brevo API with proper authentication

### 4. **Database Schema Fixes**
**Problem**: Foreign key relationship error in school_memberships query

**Solution**:
- Fixed API to manually join `school_memberships` with `user_profiles`
- Removed broken foreign key reference
- Now properly fetches member details

## 📋 How It Works

### School Owner Workflow

1. **Access School Management**:
   - Go to `/account` page
   - Click green "School Management" card
   - Or navigate directly to `/account/school`

2. **View School Details**:
   - See school code (e.g., `LGDEMO`)
   - View list of all teachers in school
   - See member roles (owner/member)

3. **Add Teachers**:
   - Enter teacher's email address
   - Click "Add Teacher"
   - System automatically:
     - Checks if teacher exists in system
     - Sends appropriate email (invitation or welcome)
     - Adds to school if existing user
     - Creates invitation for new users

4. **Remove Teachers**:
   - Click remove button next to teacher
   - Confirm removal
   - Teacher is unlinked from school

### Teacher Invitation Flow

#### Scenario A: Existing Teacher
```
1. Owner enters: teacher@school.com
2. System finds existing account
3. Adds teacher to school immediately
4. Sends welcome email via Brevo
5. Teacher can access school dashboard
```

#### Scenario B: New Teacher
```
1. Owner enters: newteacher@school.com
2. System doesn't find account
3. Sends invitation email via Brevo with:
   - Personalized greeting
   - School name and code
   - Signup link with pre-filled data
   - Instructions
4. Teacher clicks link → signup page
5. School code pre-filled
6. Teacher completes signup
7. Automatically added to school
```

### Email Integration (Brevo)

**Configuration**:
- API Key: Set in `.env.local` as `BREVO_API_KEY`
- Sender: `noreply@languagegems.com`
- Templates: Professional HTML with Language Gems branding

**Email Features**:
- Responsive HTML design
- Gradient headers with branding
- Clear call-to-action buttons
- School code prominently displayed
- Fallback plain text links
- Tagged for tracking (`teacher-invitation`, `school-management`)

## 🗄️ Database Schema

### Tables

**school_codes**:
- `code`: Unique school identifier (e.g., 'LGDEMO')
- `school_name`: Full school name
- `is_active`: Whether school is active
- `school_initials`: Optional initials

**school_memberships**:
- `school_code`: Reference to school
- `school_name`: Denormalized school name
- `owner_user_id`: User ID of school owner
- `member_user_id`: User ID of member
- `role`: 'owner' or 'member'
- `status`: 'active' or 'inactive'
- `joined_at`: When member joined

**user_profiles**:
- `school_code`: School the user belongs to
- `is_school_owner`: Whether user owns the school
- `school_owner_id`: Reference to school owner

### Database Functions

**add_teacher_to_school(p_school_code, p_teacher_email, p_owner_user_id)**:
- Validates school owner permissions
- Finds teacher by email
- Creates school membership
- Updates teacher's profile
- Returns success/error JSON

**create_school_owner_membership()**:
- Trigger function
- Automatically creates membership when user becomes school owner
- Ensures owner is member of their own school

## 🔧 API Endpoints

### GET `/api/school/members`
**Purpose**: List all members of user's school

**Returns**:
```json
{
  "success": true,
  "school_code": "LGDEMO",
  "members": [
    {
      "id": "uuid",
      "role": "owner",
      "status": "active",
      "joined_at": "2024-10-17T...",
      "member_user_id": "uuid",
      "user_profiles": {
        "email": "user@example.com",
        "display_name": "User Name",
        "subscription_status": "active"
      }
    }
  ]
}
```

### POST `/api/school/invite-teacher`
**Purpose**: Invite or add teacher to school with email notification

**Request**:
```json
{
  "teacher_email": "teacher@school.com",
  "teacher_name": "Teacher Name" // optional
}
```

**Response** (Existing Teacher):
```json
{
  "success": true,
  "message": "Existing teacher added to school and notified",
  "teacher_id": "uuid"
}
```

**Response** (New Teacher):
```json
{
  "success": true,
  "message": "Invitation email sent successfully",
  "invitation_sent": true
}
```

### DELETE `/api/school/members?member_user_id=uuid`
**Purpose**: Remove teacher from school

**Returns**:
```json
{
  "success": true,
  "message": "Teacher removed from school successfully"
}
```

## 🎨 UI Components

### Account Page (`/account`)
- Shows School Management card for all premium teachers
- Green gradient design
- Prominent placement above other account sections
- Links to `/account/school`

### School Management Page (`/account/school`)
- School code display
- Member list with roles
- Add teacher form
- Remove teacher buttons
- Success/error messaging
- Loading states

## 🧪 Testing

### Test the System

1. **View School Management**:
   ```
   Navigate to: http://localhost:3000/account
   Should see: Green "School Management" card
   ```

2. **Access School Page**:
   ```
   Click card or go to: http://localhost:3000/account/school
   Should see: School code "LGDEMO" and member list
   ```

3. **Add Existing Teacher**:
   ```
   Enter email of existing teacher account
   Click "Add Teacher"
   Should: Add immediately + send welcome email
   ```

4. **Invite New Teacher**:
   ```
   Enter email of non-existent account
   Click "Add Teacher"
   Should: Send invitation email with signup link
   ```

5. **Check Emails**:
   - Emails sent via Brevo API
   - Check Brevo dashboard for sent emails
   - Verify email delivery and content

## 📝 Next Steps

### For Production Deployment

1. **Email Template Customization**:
   - Review email HTML templates
   - Adjust branding and colors
   - Test across email clients

2. **School Creation Flow**:
   - Add UI for teachers to create their own schools
   - School code generation and validation
   - School name and details form

3. **Permission Management**:
   - Define what members vs owners can do
   - Add role-based access control
   - Implement permission checks

4. **Billing Integration**:
   - Link school management to subscription
   - Multi-user pricing tiers
   - Usage tracking and limits

5. **Enhanced Features**:
   - Bulk teacher import
   - Teacher role customization
   - School settings and preferences
   - Analytics and reporting

## 🐛 Troubleshooting

### "No school associated with user"
- Check `user_profiles.school_code` is set
- Verify `is_school_owner` is true for owners
- Ensure school exists in `school_codes` table

### Emails not sending
- Verify `BREVO_API_KEY` in `.env.local`
- Check Brevo API key is valid
- Review Brevo dashboard for errors
- Check server logs for API errors

### Teacher not added
- Verify teacher has `role = 'teacher'` in user_profiles
- Check school_code matches
- Review database function logs
- Ensure subscription is active

### Foreign key errors
- Use manual joins instead of foreign key references
- Check table relationships in Supabase
- Verify column names match schema

## ✅ Summary

The school management system is now fully functional with:
- ✅ User setup as school owner (danieletienne89@gmail.com)
- ✅ School Management card visible on account page
- ✅ Teacher invitation system with Brevo email integration
- ✅ Automatic account detection (existing vs new teachers)
- ✅ Professional email templates
- ✅ Database schema and API endpoints
- ✅ Complete workflow from invitation to onboarding

All components are integrated with Supabase for data storage and Brevo for email delivery!

