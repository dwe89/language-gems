# 🛡️ Grammar Pages Database Migration - Backup & Restore Instructions

## 📋 What Was Backed Up

**Date**: 2025-10-18
**Total Pages**: 248 grammar pages
- Spanish: 138 pages
- French: 87 pages  
- German: 23 pages

## 🔒 Backup Locations

### 1. Git Commits (Primary Backup)
All changes are committed to git with clear commit messages:
- Commit: `597c69cc` - "Enhanced Spanish grammar pages with comprehensive content + created syntax category"
- Commit: `ac912ba8` - "BACKUP: Created JSON backup of all 248 grammar pages before database migration"

**To view commits:**
```bash
git log --oneline
```

### 2. JSON Backup File (Secondary Backup)
Location: `backups/grammar-content-backup.json`
- Size: 5.95 MB
- Contains: Full source code of all 248 page.tsx files
- Includes: Sections data, metadata, and complete file content

### 3. GitHub Remote (Tertiary Backup)
All commits are pushed to GitHub:
- Repository: `dwe89/language-gems`
- Branch: `main`

---

## 🔄 How to Restore (If Needed)

### Option 1: Git Revert (Recommended - Fastest)

If you want to completely undo the database migration:

```bash
# See recent commits
git log --oneline

# Revert to the backup commit (before migration started)
git reset --hard ac912ba8

# Force push to GitHub (if already deployed)
git push origin main --force

# Redeploy on Vercel
# (Vercel will auto-deploy from the reverted commit)
```

**⚠️ WARNING**: This will delete ALL changes made after commit `ac912ba8`

---

### Option 2: Restore from JSON Backup (Selective)

If you want to restore specific pages or all pages from the JSON backup:

```bash
# Restore all pages from backup
npx tsx scripts/restore-grammar-content.ts
```

This will:
- ✅ Read `backups/grammar-content-backup.json`
- ✅ Recreate all 248 page.tsx files
- ✅ Skip files that already exist (won't overwrite)
- ✅ Show summary of restored/skipped/errors

---

### Option 3: Manual File Restoration

If you need to restore a single page manually:

1. Open `backups/grammar-content-backup.json`
2. Search for the page you need (e.g., "spanish/verbs/present-regular")
3. Copy the `content.rawFile` value
4. Create the file at the original path
5. Paste the content

---

## 🚨 Emergency Rollback Procedure

If the database migration causes issues in production:

### Step 1: Immediate Rollback (5 minutes)
```bash
# Revert to backup commit
git reset --hard ac912ba8

# Push to GitHub
git push origin main --force
```

### Step 2: Verify Vercel Deployment
- Go to Vercel dashboard
- Check that deployment is using commit `ac912ba8`
- If not, manually trigger redeploy from that commit

### Step 3: Verify Site Works
- Visit https://languagegems.com/grammar/spanish/verbs/present-regular
- Confirm pages load correctly
- Check console for errors

---

## 📊 What Changes During Migration

### Before Migration (Current State)
```
src/app/grammar/
├── spanish/
│   ├── verbs/
│   │   ├── present-regular/page.tsx  ← Static file with hardcoded content
│   │   ├── preterite-tense/page.tsx  ← Static file with hardcoded content
│   │   └── ... (136 more files)
├── french/
│   └── ... (87 files)
└── german/
    └── ... (23 files)
```

### After Migration (New State)
```
src/app/grammar/
└── [language]/
    └── [category]/
        └── [topic]/
            └── page.tsx  ← ONE dynamic file fetches from database

Database (Supabase):
└── grammar_pages table
    ├── Row 1: spanish/verbs/present-regular (content as JSONB)
    ├── Row 2: spanish/verbs/preterite-tense (content as JSONB)
    └── ... (248 rows total)
```

---

## ✅ Pre-Migration Checklist

Before proceeding with migration, verify:

- [x] Git commit created: `597c69cc`
- [x] Git commit created: `ac912ba8`
- [x] Commits pushed to GitHub
- [x] JSON backup created: `backups/grammar-content-backup.json` (5.95 MB)
- [x] Restore script created: `scripts/restore-grammar-content.ts`
- [x] This documentation created

---

## 🎯 Migration Phases

### Phase 1: Database Setup (Safe - No Risk)
- Create `grammar_pages` table in Supabase
- No changes to existing files
- **Reversible**: Just drop the table

### Phase 2: Content Migration (Safe - No Risk)
- Insert all 248 pages into database
- Existing files remain unchanged
- **Reversible**: Just delete database rows

### Phase 3: Code Refactoring (POINT OF NO RETURN)
- Replace 248 static files with 1 dynamic route
- Delete old page.tsx files
- **Reversible**: Use git revert or restore script

---

## 📞 Support

If you need help restoring:

1. **Check git log**: `git log --oneline`
2. **Check backup file exists**: `ls -lh backups/grammar-content-backup.json`
3. **Run restore script**: `npx tsx scripts/restore-grammar-content.ts`
4. **Contact**: Check git history for exact state before migration

---

## 🔐 Backup Verification

To verify backups are intact:

```bash
# Check git commits exist
git log --oneline | grep "BACKUP"

# Check JSON backup exists and size
ls -lh backups/grammar-content-backup.json

# Check backup content (first 10 pages)
cat backups/grammar-content-backup.json | jq '.[0:10] | .[].filePath'
```

Expected output:
```
-rw-r--r--  1 user  staff   5.95M  backups/grammar-content-backup.json
```

---

## ✨ Ready to Proceed

All backups are in place. You can now safely proceed with the database migration knowing you can restore everything if needed.

**Current safe state commit**: `ac912ba8`

