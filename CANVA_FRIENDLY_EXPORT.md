# Canva-Friendly PDF Export Feature

## Overview
The Canva-Friendly PDF export feature provides a simplified PDF version of worksheets specifically optimized for importing into Canva. This solves the issue where complex CSS styling (gradients, shadows, decorative elements) gets rasterized into background images, making them non-editable in Canva.

## Problem Solved
When exporting standard PDFs to Canva, the following elements were being flattened into background images:
- Gradient backgrounds
- Box shadows
- Decorative icons
- Complex border styling
- Rounded corners with multiple effects

This made it impossible to edit individual text elements, boxes, and other components in Canva.

## Solution
The Canva-friendly mode generates a simplified PDF with:
- **No gradients** - Uses solid colors only (#000 for text, simple borders)
- **No shadows** - Removes all box-shadow and text-shadow effects
- **Hidden icons** - Decorative icons are hidden (display: none)
- **Simple borders** - 1-2px solid borders instead of complex multi-layer effects
- **Basic layouts** - Clean, editable structure with proper spacing
- **Black & white scheme** - High contrast for easy editing

## How to Use

### For Grammar Exercises
1. Create your grammar worksheet as usual
2. Click "Generate Grammar Exercises"
3. Once generated, you'll see three options:
   - **Preview** - View the worksheet in browser
   - **Download** - Standard PDF with full styling
   - **Download for Canva** - Simplified PDF optimized for Canva import

### API Usage
Add `?canva=true` query parameter to the download URL:

```typescript
// Standard download
GET /api/worksheets/{id}/download

// Canva-friendly download
GET /api/worksheets/{id}/download?canva=true
```

### Programmatic Generation
Pass the `canvaFriendly` option in the HTML generation options:

```typescript
const html = generateGrammarExercisesHTML(worksheet, {
  canvaFriendly: true
});
```

## Technical Implementation

### Files Modified
- `/src/app/api/worksheets/generate-html/shared/types.ts` - Added `canvaFriendly?: boolean` to `HTMLGeneratorOptions`
- `/src/app/api/worksheets/generate-html/shared/canva-styles.ts` - New simplified stylesheet
- `/src/app/api/worksheets/generate-html/generators/grammar-exercises.ts` - Uses canva styles when requested
- `/src/app/api/worksheets/[id]/download/route.ts` - Accepts `?canva=true` parameter
- `/src/app/api/worksheets/generate-html/route.ts` - Passes options through to generators
- `/src/app/worksheets/create/grammar-exercises/page.tsx` - Added "Download for Canva" button

### Style Comparison

**Standard Mode:**
```css
.worksheet-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1E40AF;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

**Canva-Friendly Mode:**
```css
.worksheet-title {
  font-family: 'Arial', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #000;
  border-bottom: 3px solid #000;
  text-align: center;
}
```

## Benefits
1. **Editable Text** - All text remains selectable and editable in Canva
2. **Moveable Elements** - Each box, table, and section can be moved independently
3. **Customizable** - Teachers can easily customize colors, fonts, and layout in Canva
4. **No Image Background** - Entire worksheet is composed of editable elements
5. **Clean Structure** - Simple, professional appearance that's easy to modify

## Future Enhancements
- [ ] Add Canva-friendly option to all worksheet types (Reading Comprehension, Vocabulary Practice, etc.)
- [ ] Create pre-made Canva templates matching the simplified style
- [ ] Add color scheme options (e.g., blue theme, green theme) for Canva mode
- [ ] Generate Canva-optimized SVG exports in addition to PDF
- [ ] Add "Export to Canva" direct integration via Canva's API

## Notes
- The Canva-friendly PDF maintains all content and structure - only styling is simplified
- Student information fields, exercises, and answer keys are all preserved
- Print quality is maintained at the same resolution
- File size is typically smaller due to simpler styling

## Testing
To test the feature:
1. Create a grammar worksheet with multiple exercise types
2. Download both standard and Canva-friendly versions
3. Import both PDFs into Canva
4. Verify that the Canva-friendly version has editable elements instead of background images
