# Resources System - Dynamic Content Management Plan

## 🎯 Current State

### What We Have:
- ✅ `/resources` page with 6 products from database
- ✅ `/product/[slug]` dynamic route for individual products
- ✅ `/admin` page for adding products
- ✅ Products stored in `products` table in Supabase
- ✅ File uploads to Supabase Storage

### What's Placeholder/Hardcoded:
- ❌ "Browse by Curriculum" section (Spanish, French, German cards)
- ❌ "Skills Hub" section
- ❌ `/resources/[language]` routes (e.g., `/resources/spanish`)
- ❌ `/resources/[language]/[keystage]` routes (e.g., `/resources/spanish/ks3`)
- ❌ `/resources/[language]/[keystage]/[topic]` routes (e.g., `/resources/spanish/ks3/identity-personal-life`)

---

## 📋 Your Requirements

### 1. **Admin Editing from Production**
You want to be able to:
- Add products directly from `/resources` page (not just `/admin`)
- Edit product pages from `/product/[slug]` page
- Add pictures, edit descriptions, etc. inline

### 2. **Dynamic Routes**
Make ALL of these editable/manageable:
- `/resources` - Main landing page
- `/resources/spanish`, `/resources/french`, `/resources/german`
- `/resources/spanish/ks3`, `/resources/spanish/ks4`
- `/resources/spanish/ks3/identity-personal-life` (and all other topics)

### 3. **Coming Soon Sections**
- "Browse by Curriculum" → Show "Coming Soon"
- "Skills Hub" → Show "Coming Soon"

---

## 🏗️ Proposed Architecture

### **Option A: Extend Editable Pages System**
Use the same `editable_pages` table we just created for homepage:

```sql
-- Add resources pages
INSERT INTO editable_pages (page_slug, page_title, page_data) VALUES
('resources', 'Resources', '{...}'),
('resources-spanish', 'Spanish Resources', '{...}'),
('resources-spanish-ks3', 'Spanish KS3 Resources', '{...}'),
('resources-spanish-ks3-identity', 'Identity & Personal Life', '{...}');
```

**Pros:**
- Reuses existing system
- Easy admin editing
- Version control built-in

**Cons:**
- Not ideal for hierarchical data
- Lots of separate pages to manage

---

### **Option B: Create Resource Categories Table** (RECOMMENDED)
Create a new table structure specifically for resources:

```sql
CREATE TABLE resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES resource_categories(id),
  language TEXT, -- 'spanish', 'french', 'german'
  key_stage TEXT, -- 'ks3', 'ks4'
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link products to categories
ALTER TABLE products ADD COLUMN category_id UUID REFERENCES resource_categories(id);
```

**Pros:**
- Hierarchical structure (parent/child)
- Easy to query by language/keystage
- Scalable for future expansion
- Can attach products to categories

**Cons:**
- More complex to implement
- Need new admin UI

---

### **Option C: Hybrid Approach** (BEST)
Combine both:
1. Use `editable_pages` for main `/resources` page content
2. Use `resource_categories` table for hierarchical navigation
3. Keep existing `products` table for actual resources

**Benefits:**
- Main page is easily editable (hero, sections, etc.)
- Categories are structured and queryable
- Products remain separate and flexible

---

## 🚀 Implementation Plan

### **Phase 1: Quick Wins (30 mins)**
1. ✅ Add "Coming Soon" badges to Browse by Curriculum and Skills Hub
2. ✅ Hide/disable these sections temporarily
3. ✅ Add admin edit button to `/resources` page
4. ✅ Make main resources page editable via `editable_pages`

### **Phase 2: Product Inline Editing (1 hour)**
1. Add "Edit Product" button to `/product/[slug]` pages (admin only)
2. Create `ProductEditModal` component
3. Allow editing:
   - Name, description
   - Price
   - Tags
   - Thumbnail upload
   - Preview images upload
   - Learning objectives, target audience, etc.

### **Phase 3: Add Product from Resources Page (30 mins)**
1. Add floating "Add Product" button on `/resources` (admin only)
2. Reuse existing product creation modal from `/admin`
3. Refresh page after creation

### **Phase 4: Dynamic Categories (2-3 hours)**
1. Create `resource_categories` table
2. Seed with initial data (Spanish/French/German → KS3/KS4 → Topics)
3. Create admin interface for managing categories
4. Update `/resources/[language]` routes to be dynamic
5. Update `/resources/[language]/[keystage]` routes
6. Update `/resources/[language]/[keystage]/[topic]` routes

---

## 📊 Database Schema

### **resource_categories Table**
```sql
CREATE TABLE resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'spanish', 'spanish-ks3', 'spanish-ks3-identity'
  parent_id UUID REFERENCES resource_categories(id),
  
  -- Metadata
  language TEXT CHECK (language IN ('spanish', 'french', 'german')),
  key_stage TEXT CHECK (key_stage IN ('ks3', 'ks4')),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  color TEXT, -- Tailwind color class
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  show_in_nav BOOLEAN DEFAULT true,
  
  -- Rich content
  page_content JSONB DEFAULT '{}', -- Hero, sections, etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_categories_parent ON resource_categories(parent_id);
CREATE INDEX idx_categories_language ON resource_categories(language);
CREATE INDEX idx_categories_keystage ON resource_categories(key_stage);
CREATE INDEX idx_categories_slug ON resource_categories(slug);

-- RLS Policies
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published categories"
  ON resource_categories FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage categories"
  ON resource_categories FOR ALL
  USING (auth.email() = 'danieletienne89@gmail.com');
```

### **Update products table**
```sql
ALTER TABLE products 
  ADD COLUMN category_id UUID REFERENCES resource_categories(id),
  ADD COLUMN display_order INTEGER DEFAULT 0;

CREATE INDEX idx_products_category ON products(category_id);
```

---

## 🎨 UI Components Needed

### 1. **ProductEditButton** (similar to PageEditButton)
```tsx
<ProductEditButton productId={product.id} onSave={reload} />
```

### 2. **ProductEditModal**
- Form for editing all product fields
- Image upload for thumbnail and previews
- Tag management
- Save/Cancel buttons

### 3. **AddProductButton** (on /resources page)
```tsx
{isAdmin && <AddProductButton />}
```

### 4. **CategoryEditButton** (for category pages)
```tsx
<CategoryEditButton categorySlug={slug} onSave={reload} />
```

### 5. **ComingSoonBadge**
```tsx
<ComingSoonBadge />
```

---

## 🔄 Migration Strategy

### Step 1: Seed Categories
```sql
-- Top level: Languages
INSERT INTO resource_categories (slug, title, language, icon, color, display_order) VALUES
('spanish', 'Spanish', 'spanish', 'Globe', 'from-red-500 to-yellow-500', 1),
('french', 'French', 'french', 'Globe', 'from-blue-500 to-indigo-500', 2),
('german', 'German', 'german', 'Globe', 'from-gray-700 to-gray-900', 3);

-- Second level: Key Stages
INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, display_order)
SELECT 
  language || '-ks3',
  'KS3 ' || title,
  language,
  'ks3',
  id,
  1
FROM resource_categories WHERE parent_id IS NULL;

-- Third level: Topics (example for Spanish KS3)
INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, display_order) VALUES
('spanish-ks3-identity', 'Identity & Personal Life', 'spanish', 'ks3', 
  (SELECT id FROM resource_categories WHERE slug = 'spanish-ks3'), 1),
('spanish-ks3-local-area', 'Local Area, Holiday & Travel', 'spanish', 'ks3',
  (SELECT id FROM resource_categories WHERE slug = 'spanish-ks3'), 2);
```

### Step 2: Link Existing Products
```sql
-- Link products to categories based on existing fields
UPDATE products
SET category_id = (
  SELECT id FROM resource_categories 
  WHERE language = products.language 
  AND key_stage = products.key_stage
  LIMIT 1
)
WHERE language IS NOT NULL AND key_stage IS NOT NULL;
```

---

## ✅ Next Steps

**Immediate (Do Now):**
1. Add "Coming Soon" to Browse by Curriculum and Skills Hub
2. Test homepage editing (make sure it works!)
3. Add admin edit button to `/resources` page

**Short Term (This Week):**
4. Implement Product inline editing
5. Add "Add Product" button to `/resources`
6. Create `resource_categories` table
7. Seed initial categories

**Medium Term (Next Week):**
8. Build category admin interface
9. Make all `/resources/*` routes dynamic
10. Add category edit buttons to all category pages

---

## 🐛 Current Issues to Fix

1. **Homepage editing not working** - Need to verify Supabase client auth
2. **Admin email hardcoded** - Should we keep `danieletienne89@gmail.com` hardcoded? (YES)

---

## 💡 Questions for You

1. **Do you want to start with Phase 1 (Coming Soon badges) first?**
2. **Should we implement Option C (Hybrid Approach) for categories?**
3. **Do you want product editing inline or in a separate modal?**
4. **Should categories be editable from the category pages themselves, or only from /admin?**

Let me know and I'll implement whatever you choose! 🚀

