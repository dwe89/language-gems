# Windows Troubleshooting Guide for Language Gems

## Issue: Blank Screen on Assignment Games (Windows Only)

If you're experiencing a blank screen when trying to access assignment games on Windows laptops, this guide will help diagnose and fix the issue.

### Quick Diagnostic Test

1. **Visit the Diagnostics Page**
   - Go to: `https://www.languagegems.com/diagnostics`
   - This will run automatic tests and show you what might be wrong
   - Click "Download Report" to save the results

2. **Check Browser Console**
   - Press `F12` on your keyboard
   - Click the "Console" tab
   - Look for any red error messages
   - Take a screenshot if you see errors

### Common Causes & Solutions

#### 1. **Browser Compatibility Issues**

**Symptoms:**
- Blank white screen
- Page loads but nothing appears
- No error messages visible

**Solutions:**
- **Update your browser** to the latest version
  - Chrome: Settings → About Chrome
  - Edge: Settings → About Microsoft Edge
  - Firefox: Menu → Help → About Firefox

- **Try a different browser**
  - Recommended: Google Chrome or Microsoft Edge (latest versions)
  - Avoid Internet Explorer (not supported)

#### 2. **Cookies & Local Storage Disabled**

**Symptoms:**
- Can't stay logged in
- Settings don't save
- Games won't load

**Solutions:**

**For Chrome/Edge:**
1. Click the lock icon in the address bar
2. Click "Site settings"
3. Make sure "Cookies" is set to "Allow"
4. Make sure "JavaScript" is set to "Allow"

**For Firefox:**
1. Click the shield icon in the address bar
2. Turn off "Enhanced Tracking Protection" for this site
3. Refresh the page

#### 3. **School Network Restrictions**

**Symptoms:**
- Works at home but not at school
- Some features load but games don't
- Audio doesn't play

**Solutions:**
- Ask your IT department to whitelist:
  - `languagegems.com`
  - `*.languagegems.com`
  - `supabase.co` (for database access)
  - `*.supabase.co`

- Check if WebGL is blocked:
  - Visit: `https://get.webgl.org/`
  - If you see a spinning cube, WebGL works
  - If not, ask IT to enable WebGL

#### 4. **JavaScript Disabled**

**Symptoms:**
- Page loads but is completely static
- No interactive elements work
- Blank screen

**Solutions:**

**For Chrome/Edge:**
1. Go to Settings
2. Search for "JavaScript"
3. Make sure it's set to "Allowed"

**For Firefox:**
1. Type `about:config` in the address bar
2. Search for `javascript.enabled`
3. Make sure it's set to `true`

#### 5. **Cache/Cookies Issues**

**Symptoms:**
- Old version of site loads
- Features that should work don't
- Intermittent blank screens

**Solutions:**

**Clear Browser Cache:**

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Select "Cookies and other site data"
4. Click "Clear data"

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cookies" and "Cache"
3. Click "Clear Now"

### Advanced Troubleshooting

#### Check Console for Specific Errors

1. Press `F12` to open Developer Tools
2. Click the "Console" tab
3. Look for messages starting with:
   - `❌` (errors)
   - `🎮 [NOUGHTS WRAPPER]` (game loading)
   - `🔍 [NOUGHTS PAGE]` (page initialization)

#### Common Error Messages & Fixes

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "localStorage is not available" | Privacy settings too strict | Enable cookies and site data |
| "Failed to fetch" | Network/firewall blocking | Contact IT to whitelist site |
| "WebGL not supported" | Graphics drivers outdated | Update graphics drivers |
| "Cookies are disabled" | Browser settings | Enable cookies for this site |

### Still Not Working?

If you've tried all the above and still have issues:

1. **Collect Information:**
   - Visit `/diagnostics` and download the report
   - Take screenshots of any error messages
   - Note your browser version and Windows version

2. **Contact Support:**
   - Email the diagnostic report
   - Include screenshots
   - Describe exactly what you see (or don't see)

3. **Temporary Workaround:**
   - Try using a different device (phone, tablet, different computer)
   - Try accessing from home instead of school network
   - Use a different browser

### For Teachers/IT Staff

#### Recommended Browser Settings

- **Minimum Browser Versions:**
  - Chrome 90+
  - Edge 90+
  - Firefox 88+
  - Safari 14+

- **Required Features:**
  - JavaScript enabled
  - Cookies enabled
  - Local Storage enabled
  - WebGL enabled (for some games)
  - Web Audio API enabled

#### Network Requirements

- **Domains to Whitelist:**
  ```
  languagegems.com
  *.languagegems.com
  supabase.co
  *.supabase.co
  ```

- **Ports:**
  - HTTPS (443)
  - WSS (443) for real-time features

#### Group Policy Settings (Windows)

If using Group Policy to manage browsers:

1. **Enable JavaScript**
2. **Allow Cookies** for `*.languagegems.com`
3. **Allow Local Storage**
4. **Don't block WebGL**

### Testing Checklist

Use this checklist to verify everything works:

- [ ] Can access `https://www.languagegems.com`
- [ ] Can log in successfully
- [ ] Can see student dashboard
- [ ] Can click on an assignment
- [ ] Assignment page loads (not blank)
- [ ] Game starts when clicked
- [ ] Can interact with game
- [ ] Progress saves correctly
- [ ] Audio plays (if applicable)

### Diagnostic URLs

- **Main Diagnostics:** `https://www.languagegems.com/diagnostics`
- **Test Assignment:** `https://www.languagegems.com/games/noughts-and-crosses?assignment=4d13f075-6d69-40e7-a8a9-9c653a292f70&mode=assignment`

---

**Last Updated:** October 2025
**Version:** 1.0

