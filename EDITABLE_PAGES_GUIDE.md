# Editable Pages System - Implementation Guide

## ✅ What's Been Completed

### 1. **Database Infrastructure**
- ✅ Created `editable_pages` table for storing page content as JSONB
- ✅ Created `editable_pages_history` table for version control
- ✅ Created `page_sections` table for alternative section-based editing
- ✅ Set up RLS policies for security
- ✅ Added automatic versioning triggers
- ✅ Pre-populated data for: homepage, schools, pricing, about, freebies

### 2. **Service Layer**
- ✅ Created `EditablePagesService` class (`src/services/editablePagesService.ts`)
- ✅ Methods for CRUD operations, version history, publish/unpublish
- ✅ TypeScript interfaces for type safety

### 3. **Admin UI Components**
- ✅ `PageEditorModal` - Full-featured modal for editing page content
- ✅ `PageEditButton` - Floating edit button for admin users
- ✅ `EditablePageWrapper` - Reusable wrapper component for any page
- ✅ `useEditablePage` hook - React hook for fetching page data
- ✅ `isAdmin()` utility - Check if user is admin

### 4. **Converted Pages**
- ✅ **Homepage** (`/`) - Fully dynamic and editable in production

### 5. **Pages with Data Ready (Not Yet Converted)**
- 🟡 Schools page (`/schools`) - Data in database, needs conversion
- 🟡 Pricing page (`/pricing`) - Data in database, needs conversion
- 🟡 About page (`/about`) - Data in database, needs conversion
- 🟡 Freebies page (`/freebies-for-teachers`) - Data in database, needs conversion

---

## 🎯 How to Convert a Page to Editable

### **Option A: Using EditablePageWrapper (Recommended for New Pages)**

```tsx
"use client";

import EditablePageWrapper from '@/components/admin/EditablePageWrapper';
import { iconMap } from '@/lib/iconMap'; // You'll need to create this

export default function MyPage() {
  return (
    <EditablePageWrapper pageSlug="my-page">
      {(pageData, isLoading) => (
        <div>
          <h1>{pageData?.hero?.headline || "Default Headline"}</h1>
          <p>{pageData?.hero?.subheadline || "Default subheadline"}</p>
          
          {/* Features section */}
          {pageData?.features?.map((feature: any, index: number) => {
            const Icon = iconMap[feature.icon];
            return (
              <div key={index}>
                <Icon />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </EditablePageWrapper>
  );
}
```

### **Option B: Manual Integration (For Existing Complex Pages)**

This is what we did for the homepage. Follow these steps:

1. **Add imports:**
```tsx
import { useEditablePage } from '@/hooks/useEditablePage';
import { isAdmin } from '@/lib/adminCheck';
import PageEditButton from '@/components/admin/PageEditButton';
```

2. **Load page data:**
```tsx
const { pageData, isLoading, reload } = useEditablePage('page-slug');
const { user } = useAuth();
const userIsAdmin = isAdmin(user?.email);
```

3. **Use page data with fallbacks:**
```tsx
const headline = pageData?.hero?.headline || "Default Headline";
const features = pageData?.features || defaultFeatures;
```

4. **Add admin edit button:**
```tsx
{userIsAdmin && <PageEditButton pageSlug="page-slug" onSave={reload} />}
```

5. **Handle dynamic icons:**
```tsx
const iconMap: Record<string, any> = {
  Gamepad2, BookOpen, Users, Award, // ... import all icons
};

const Icon = iconMap[feature.icon] || DefaultIcon;
```

---

## 📊 Database Schema

### Page Data Structure Examples

#### **Homepage:**
```json
{
  "hero": {
    "headline": "Master GCSE Languages Through Play",
    "subheadline": "The complete GCSE language learning platform...",
    "cta_primary": { "text": "Try Games Demo", "url": "/games", "icon": "Play" },
    "cta_secondary": { "text": "Get Started Free", "url": "#signup", "icon": "ArrowRight" }
  },
  "features": [
    {
      "title": "Interactive Learning Games",
      "description": "15+ engaging games...",
      "icon": "Gamepad2",
      "color": "from-blue-500 to-indigo-600"
    }
  ],
  "audience_cards": [...],
  "cta_section": {...}
}
```

#### **Schools Page:**
```json
{
  "hero": {...},
  "features": [...],
  "pricing": {
    "plans": [
      {
        "name": "Free Trial",
        "price": "£0",
        "period": "14 days",
        "features": ["...", "..."],
        "cta_text": "Start Free Trial",
        "highlighted": false
      }
    ]
  },
  "testimonials": [...],
  "faq": [...]
}
```

---

## 🔧 Admin Workflow

### **How to Edit a Page in Production:**

1. **Log in as admin** (danieletienne89@gmail.com)
2. **Navigate to the page** you want to edit
3. **Click the floating purple "Edit Page" button** (bottom-right)
4. **Edit the JSON** in the modal:
   - **Content tab**: Edit `page_data` (hero, features, etc.)
   - **SEO & Meta tab**: Edit meta tags, OG tags, etc.
   - **Version History tab**: View/restore previous versions
5. **Click "Format JSON"** to validate and prettify
6. **Click "Save Changes"**
7. **Page reloads** with updated content

### **Tips for Editing:**
- Use the "Format JSON" button to validate before saving
- Check the Version History tab to restore previous versions
- Test changes on a staging environment first (if available)
- Keep a backup of important content changes

---

## 🚀 Next Steps

### **Immediate (High Priority):**
1. Convert Schools page (`/schools`) - B2B critical
2. Convert Pricing page (`/pricing`) - Pricing changes common
3. Convert About page (`/about`) - Founder story updates

### **Medium Priority:**
4. Convert Freebies page (`/freebies-for-teachers`)
5. Make Grammar Practice/Test pages editable (requires different approach)
6. Make Resources topic pages dynamic

### **Low Priority:**
7. Convert remaining static blog pages to database
8. Add visual WYSIWYG editor (optional enhancement)
9. Add A/B testing capabilities (optional enhancement)

---

## 📝 Notes

- **Icon Mapping**: Create a centralized `iconMap` in `src/lib/iconMap.ts` for reusability
- **Fallback Content**: Always provide fallback content for when database is unavailable
- **Loading States**: Show loading spinners while fetching page data
- **Error Handling**: Handle errors gracefully with user-friendly messages
- **Version Control**: All changes are automatically versioned in `editable_pages_history`
- **Security**: Only admin users (danieletienne89@gmail.com) can see edit buttons
- **Performance**: Consider adding caching for frequently accessed pages

---

## 🎨 Example: Converting Schools Page

See `src/app/page.tsx` for a complete example of how the homepage was converted.

Key changes:
1. Added `useEditablePage('homepage')` hook
2. Replaced hardcoded text with `pageData?.hero?.headline || "fallback"`
3. Mapped over `pageData?.features` instead of hardcoded arrays
4. Added dynamic icon mapping with `iconMap[feature.icon]`
5. Added `<PageEditButton>` at the end for admin users

---

## 🐛 Troubleshooting

**Q: Edit button not showing?**
- Check you're logged in as danieletienne89@gmail.com
- Check `isAdmin()` function is working
- Check browser console for errors

**Q: Page data not loading?**
- Check database connection
- Check page_slug matches exactly
- Check RLS policies allow reading

**Q: JSON validation errors?**
- Use "Format JSON" button to find syntax errors
- Check for missing commas, quotes, brackets
- Use a JSON validator online

**Q: Changes not appearing?**
- Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
- Check browser cache
- Check if `reload()` is called after save

---

## 📚 Related Files

- `supabase/migrations/20250130000000_create_editable_pages.sql` - Database schema
- `src/services/editablePagesService.ts` - Service layer
- `src/hooks/useEditablePage.ts` - React hook
- `src/components/admin/PageEditorModal.tsx` - Edit modal
- `src/components/admin/PageEditButton.tsx` - Edit button
- `src/components/admin/EditablePageWrapper.tsx` - Wrapper component
- `src/lib/adminCheck.ts` - Admin utilities
- `src/app/page.tsx` - Example implementation (homepage)

