# CSV Encoding Fix Guide

This guide helps you fix encoding issues when uploading CSV files with accented characters from Excel on Mac.

## The Problem

When you export CSV files from Excel on Mac, the file is often saved with Mac Roman or Latin-1 encoding instead of UTF-8. This causes accented characters (á, é, í, ó, ú, ñ, etc.) to appear as question marks or strange symbols when uploaded to your application.

## Quick Fix - Use the Script

### 1. Fix a single CSV file:
```bash
node scripts/fix-csv-encoding.js your-file.csv your-file-fixed.csv
```

### 2. Fix all CSV files in a directory:
```bash
node scripts/fix-csv-encoding.js --batch ./data/vocabulary/
```

### 3. Fix all CSV files in current directory:
```bash
node scripts/fix-csv-encoding.js --batch .
```

## Prevention - Proper Export from Excel on Mac

### Method 1: Export as UTF-8 CSV (Recommended)
1. In Excel, go to **File > Save As**
2. Choose **CSV UTF-8 (Comma delimited) (.csv)** from the format dropdown
3. This ensures proper UTF-8 encoding from the start

### Method 2: Export as Regular CSV then Convert
1. Export as regular CSV from Excel
2. Use our encoding fix script (above)

### Method 3: Use Numbers (Alternative)
1. Open your file in Apple Numbers
2. Export as CSV - Numbers typically handles UTF-8 better than Excel

## Manual Fix (if script doesn't work)

### Using TextEdit:
1. Open the CSV file in TextEdit
2. Go to **Format > Make Plain Text**
3. Save the file
4. When saving, ensure encoding is set to **UTF-8**

### Using VSCode:
1. Open the CSV file in VSCode
2. Look at the bottom right corner for encoding (might show "Mac Roman" or "Latin-1")
3. Click on the encoding
4. Select "Reopen with Encoding"
5. Choose the correct source encoding (usually "Mac Roman" for Excel Mac exports)
6. Once opened correctly, save the file (it will save as UTF-8)

## Testing Your Fixed CSV

Run this command to test if your CSV has proper encoding:
```bash
node scripts/fix-csv-encoding.js your-file.csv --test
```

## Common Encoding Issues and Solutions

| Problem | Appears as | Original | Solution |
|---------|------------|----------|----------|
| Spanish accents | Ã¡, Ã©, Ã­, Ã³, Ãº | á, é, í, ó, ú | Use the encoding script |
| Spanish ñ | Ã± | ñ | Use the encoding script |
| French accents | Ã , Ã¨, Ã® | à, è, î | Use the encoding script |
| German umlauts | Ã¤, Ã¶, Ã¼ | ä, ö, ü | Use the encoding script |
| Question marks | ? | Any accented char | Wrong encoding detected |

## Verifying the Fix

After running the encoding fix script, check:

1. **Accented characters display correctly** - no question marks or strange symbols
2. **CSV structure is preserved** - columns are still properly separated
3. **No data loss** - same number of rows and columns

## Integration with Your Import Scripts

All your existing import scripts already use UTF-8 encoding:
- `scripts/import-gcse-vocabulary.js` - ✅ Uses `utf-8`
- `fix_special_cases.js` - ✅ Handles BOM properly
- `standardize_database.js` - ✅ Uses `csv-parser` with UTF-8

So once your CSV files are properly encoded with our script, they should import correctly.

## Troubleshooting

### Script shows "0 accented characters found"
- Your original file might already be corrupted
- Try opening the original file in different programs to see if accents are visible
- You might need to re-export from your original data source

### Accents still wrong after running script
- The script might have detected the wrong encoding
- Try manually specifying the encoding in the script
- Check if your terminal/console supports UTF-8 display

### File appears empty after conversion
- The original file might be using a very different encoding
- Try opening the original file in a hex editor to see the raw bytes
- Contact support if the issue persists

## Prevention Tips

1. **Always use "CSV UTF-8" format** when exporting from Excel
2. **Test with a small file first** before importing large datasets
3. **Keep a backup** of your original data in Excel format
4. **Verify encoding** before uploading to your application

This should resolve your accent/encoding issues when uploading CSV files from Excel on Mac!
