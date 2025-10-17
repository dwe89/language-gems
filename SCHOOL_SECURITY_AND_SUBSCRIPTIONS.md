# School Management: Security & Subscription Questions Answered

## 🔒 Security: School Code Protection

### Question: "What is stopping a teacher knowing the school code of another school and signing up as a teacher?"

**Current Status**: ⚠️ **NOT PROTECTED** - This is a valid security concern!

Currently, if a teacher knows another school's code, they COULD potentially sign up and join that school. This needs to be fixed.

### Recommended Solutions:

#### Option 1: **Invitation-Only System** (RECOMMENDED)
**How it works**:
- Teachers can ONLY join a school if they have a pending invitation
- School code alone is not enough
- Signup validates that an invitation exists for that email + school code combination

**Implementation**:
```typescript
// During signup, validate invitation exists
const { data: invitation } = await supabase
  .from('pending_teacher_invitations')
  .select('*')
  .eq('teacher_email', email)
  .eq('school_code', schoolCode)
  .eq('status', 'pending')
  .single();

if (!invitation) {
  return { error: 'No invitation found for this email and school' };
}

// After successful signup, mark invitation as accepted
await supabase
  .from('pending_teacher_invitations')
  .update({ status: 'accepted' })
  .eq('id', invitation.id);
```

**Pros**:
- ✅ Most secure
- ✅ School owners have full control
- ✅ Prevents unauthorized access
- ✅ Tracks who invited whom

**Cons**:
- ❌ Teachers must wait for invitation
- ❌ Can't self-register even if they know the code

#### Option 2: **Approval System**
**How it works**:
- Teachers can sign up with school code
- They're added with `status: 'pending_approval'`
- School owner must approve them before they get access

**Pros**:
- ✅ Teachers can self-register
- ✅ Owner still has control
- ✅ Flexible workflow

**Cons**:
- ❌ Requires owner action
- ❌ Delay before teacher can access
- ❌ More complex UI needed

#### Option 3: **School Code + Secret Key**
**How it works**:
- Each school has a public code (e.g., "LGDEMO") AND a secret key
- Teachers need BOTH to join
- Secret key is shared privately by school owner

**Pros**:
- ✅ Simple to implement
- ✅ Teachers can self-register
- ✅ Reasonably secure

**Cons**:
- ❌ Secret key can be shared/leaked
- ❌ Less control for owner
- ❌ Hard to revoke access

### **RECOMMENDED APPROACH**: Option 1 (Invitation-Only)

This is the most secure and gives school owners full control. It's also the industry standard (similar to Slack, Microsoft Teams, etc.).

---

## 💎 Subscription & Premium Access

### Question: "Does it automatically give that teacher pro mode or not?"

**Current Status**: ❌ **NO** - Teachers do NOT automatically get premium access

**How it works now**:
1. Teacher is invited to school
2. Teacher signs up (free account)
3. Teacher joins the school
4. Teacher has `subscription_status: 'free'` or whatever they had before

**What teachers get**:
- ✅ Access to school's classes
- ✅ Access to school's students
- ✅ Can view assignments created by school owner
- ❌ **NO premium features** (unless they pay separately)

### Question: "What if an invited teacher already has an account, will it upgrade them?"

**Current Status**: ❌ **NO** - Existing accounts are NOT upgraded

**What happens**:
1. Teacher already has account (free or premium)
2. School owner invites them
3. Teacher is added to school
4. Teacher's subscription status **STAYS THE SAME**
5. No automatic upgrade

---

## 💡 Recommended Subscription Models

### Model 1: **School-Wide License** (RECOMMENDED for B2B)
**How it works**:
- School owner pays for X teacher seats
- All teachers in school get premium access
- Subscription is tied to the school, not individual teachers

**Pricing Example**:
- £399/year for school owner (1 seat)
- £99/year per additional teacher
- Or: £999/year for unlimited teachers

**Implementation**:
```typescript
// Check if user has premium access
function hasPremiumAccess(user) {
  // Direct subscription
  if (user.subscription_status === 'active') return true;
  
  // School-based access
  if (user.school_code) {
    const school = getSchool(user.school_code);
    if (school.subscription_status === 'active') {
      // Check if school has available seats
      const memberCount = getSchoolMemberCount(school.code);
      return memberCount <= school.licensed_seats;
    }
  }
  
  return false;
}
```

**Pros**:
- ✅ Simple for schools to manage
- ✅ Predictable pricing
- ✅ Encourages team adoption
- ✅ Higher revenue per school

**Cons**:
- ❌ More complex billing
- ❌ Need seat management UI
- ❌ What happens when teacher leaves?

### Model 2: **Individual Subscriptions Only**
**How it works**:
- Each teacher pays for their own premium
- School membership is separate from subscription
- Teachers can be in school but have free accounts

**Pros**:
- ✅ Simple billing
- ✅ No seat management needed
- ✅ Teachers keep access if they leave school

**Cons**:
- ❌ Barrier to adoption
- ❌ Lower revenue per school
- ❌ Inconsistent experience within school

### Model 3: **Hybrid Model** (BEST OF BOTH)
**How it works**:
- School owner can optionally purchase seats for teachers
- Teachers can also purchase individual subscriptions
- Premium access = (individual subscription OR school seat)

**Example**:
```
School Owner: £399/year (includes 1 seat)
Additional Seats: £99/year each
Individual Teacher: £149/year

Teacher A: Covered by school seat → Premium ✅
Teacher B: Has individual subscription → Premium ✅
Teacher C: No subscription, no seat → Free ❌
```

**Pros**:
- ✅ Flexible for different school budgets
- ✅ Teachers can self-upgrade
- ✅ Maximum market coverage
- ✅ Higher overall revenue

**Cons**:
- ❌ Most complex to implement
- ❌ Need clear UI to show access source
- ❌ Potential confusion

---

## 🎯 Recommended Implementation Plan

### Phase 1: Security (IMMEDIATE)
1. ✅ Implement invitation-only system
2. ✅ Validate invitations during signup
3. ✅ Show pending invitations in UI (DONE)
4. ✅ Auto-accept invitations on signup

### Phase 2: Subscription Model (NEXT)
1. Decide on subscription model (recommend Hybrid)
2. Add `licensed_seats` to schools table
3. Implement seat management UI
4. Update premium access checks
5. Add billing for additional seats

### Phase 3: Enhanced Features
1. Invitation expiry and resend
2. Bulk teacher import
3. Role-based permissions
4. Usage analytics per teacher
5. School admin dashboard

---

## 📋 Current Status Summary

| Feature | Status | Notes |
|---------|--------|-------|
| **Pending Invitations UI** | ✅ DONE | Shows invited teachers who haven't signed up |
| **Email Invitations** | ✅ DONE | Sends via Brevo with signup link |
| **School Code Security** | ⚠️ TODO | Need invitation validation on signup |
| **Premium Access for Teachers** | ❌ NO | Teachers don't get auto-upgraded |
| **School-Wide Subscriptions** | ❌ NO | Not implemented yet |
| **Seat Management** | ❌ NO | Not implemented yet |

---

## 🔧 Quick Fixes Needed

### 1. Add Invitation Validation to Signup
**File**: `src/app/signup/page.tsx` or signup API

```typescript
// Before creating account, check for invitation
if (role === 'teacher' && schoolCode) {
  const { data: invitation } = await supabase
    .from('pending_teacher_invitations')
    .select('*')
    .eq('teacher_email', email)
    .eq('school_code', schoolCode)
    .eq('status', 'pending')
    .single();
    
  if (!invitation) {
    throw new Error('You must be invited by your school to join. Please contact your school administrator.');
  }
  
  // After successful signup
  await supabase
    .from('pending_teacher_invitations')
    .update({ status: 'accepted' })
    .eq('id', invitation.id);
}
```

### 2. Add School Subscription Model
**File**: `src/app/api/school/members/route.ts`

```typescript
// When adding teacher, check seat availability
const { data: school } = await supabase
  .from('schools')
  .select('licensed_seats, subscription_status')
  .eq('code', schoolCode)
  .single();

const { count: memberCount } = await supabase
  .from('school_memberships')
  .select('*', { count: 'exact', head: true })
  .eq('school_code', schoolCode)
  .eq('status', 'active');

if (memberCount >= school.licensed_seats) {
  return { error: 'School has reached maximum teacher seats. Please upgrade your plan.' };
}
```

---

## 💬 Answers to Your Questions

### Q: "After I typed in my invite, it sent the email, but we got an error. What should happen when we send an invite?"

**A**: The error was because `user_profiles` was undefined (now fixed). When you send an invite:

1. ✅ Email is sent via Brevo
2. ✅ Pending invitation is created in database
3. ✅ Success message shows
4. ✅ Invitation appears in "Pending Invitations" section (amber/yellow box)
5. ✅ Shows teacher email, name, invite date, and expiry date

### Q: "Should the invite show on the screen? With status, etc?"

**A**: ✅ **YES - NOW IMPLEMENTED!**

The UI now shows:
- **Pending Invitations** section (amber/yellow) above active members
- Shows: Teacher name, email, invite date, expiry date
- Status badge: "Pending"
- Separate from active members

### Q: "What is stopping a teacher knowing the school code of another school and signing up as a teacher?"

**A**: ⚠️ **NOTHING CURRENTLY** - This needs to be fixed!

**Solution**: Implement invitation-only system (see Phase 1 above)

### Q: "Does it automatically give that teacher pro mode or not?"

**A**: ❌ **NO** - Teachers do NOT get automatic premium access

**Solution**: Implement school-wide subscriptions (see Model 3 above)

### Q: "What if an invited teacher already has an account, will it upgrade them?"

**A**: ❌ **NO** - Existing accounts are NOT upgraded

**Solution**: Implement school-based premium access checks

