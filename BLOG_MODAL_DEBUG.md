# Blog Subscription Modal - Debug Guide

## 🔍 **Investigation Results**

The modal component has been updated to support **BOTH** triggers simultaneously:
- ✅ **Exit-intent**: Triggers when mouse leaves page (moves to top)
- ✅ **Scroll**: Triggers when user scrolls 50% down the page

## 🐛 **Why It's Not Showing**

The modal might not be showing because:

1. **LocalStorage is blocking it** - You previously dismissed it or subscribed
2. **Page hasn't reloaded** - The new code hasn't loaded yet
3. **You're on the wrong page** - Modal only shows on blog post pages

## ✅ **How to Test**

### **Step 1: Clear LocalStorage**

Open your browser console (F12) and run:

```javascript
// Clear the modal flags
localStorage.removeItem('blog_subscribed');
localStorage.removeItem('blog_modal_dismissed');
console.log('✅ Modal flags cleared!');
```

### **Step 2: Reload the Page**

Hard refresh the blog post page:
- **Mac**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### **Step 3: Check Console Logs**

You should see these logs in the console:

```
🎯 [BLOG MODAL] Component mounted, triggers: ['exit-intent', 'scroll']
🎯 [BLOG MODAL] LocalStorage state: { blog_subscribed: null, blog_modal_dismissed: null }
🎯 [BLOG MODAL] Checking conditions: { hasSubscribed: false, hasDismissed: false, hasShown: false, triggers: ['exit-intent', 'scroll'] }
🎯 [BLOG MODAL] Setting up exit-intent trigger
🎯 [BLOG MODAL] Setting up scroll trigger at 50 %
```

### **Step 4: Trigger the Modal**

**Option A - Scroll Trigger:**
1. Scroll down the blog post slowly
2. When you reach 50% of the page, wait 500ms
3. Modal should appear!

**Option B - Exit-Intent Trigger:**
1. Move your mouse to the very top of the browser window
2. Like you're going to close the tab
3. Wait 500ms
4. Modal should appear!

## 🎯 **What Changed**

### **Before:**
- Only supported ONE trigger at a time
- Had to choose: `trigger="exit-intent"` OR `trigger="scroll"`

### **After:**
- Supports MULTIPLE triggers simultaneously
- Default: `triggers={['exit-intent', 'scroll']}`
- Both triggers work at the same time!

## 📝 **Current Configuration**

In `src/app/blog/[slug]/page.tsx`:

```tsx
<BlogSubscriptionModal />
```

This uses the defaults:
- **Triggers**: Both exit-intent AND scroll
- **Scroll Percentage**: 50%
- **Delay**: 500ms

## 🔧 **Custom Configuration**

If you want to customize:

```tsx
{/* Only exit-intent */}
<BlogSubscriptionModal triggers={['exit-intent']} delay={1000} />

{/* Only scroll at 75% */}
<BlogSubscriptionModal triggers={['scroll']} scrollPercentage={75} />

{/* Both with custom settings */}
<BlogSubscriptionModal 
  triggers={['exit-intent', 'scroll']} 
  scrollPercentage={60} 
  delay={300} 
/>
```

## 🚨 **Troubleshooting**

### **Modal Still Not Showing?**

1. **Check you're on a blog post page**
   - URL should be: `/blog/[slug]`
   - Example: `/blog/target-language-prompts-for-gcse-speaking-assessments`

2. **Check console for errors**
   - Open DevTools (F12)
   - Look for red errors
   - Look for the 🎯 [BLOG MODAL] logs

3. **Verify localStorage is clear**
   ```javascript
   console.log({
     subscribed: localStorage.getItem('blog_subscribed'),
     dismissed: localStorage.getItem('blog_modal_dismissed')
   });
   ```

4. **Force show the modal (for testing)**
   ```javascript
   // Run this in console to force show
   localStorage.removeItem('blog_subscribed');
   localStorage.removeItem('blog_modal_dismissed');
   location.reload();
   ```

## ✅ **Expected Behavior**

1. **First Visit**: Modal shows on FIRST trigger (scroll 50% OR exit-intent)
2. **After Dismissing**: Modal won't show again (localStorage flag set)
3. **After Subscribing**: Modal won't show again (localStorage flag set)
4. **New Browser/Incognito**: Modal shows again (fresh localStorage)

## 📊 **Testing Checklist**

- [ ] Clear localStorage
- [ ] Hard refresh page
- [ ] See console logs with 🎯 [BLOG MODAL]
- [ ] Scroll to 50% - modal appears
- [ ] OR move mouse to top - modal appears
- [ ] Submit form - success message
- [ ] Close modal - localStorage flag set
- [ ] Refresh page - modal doesn't show again

---

**Need more help?** Check the console logs and share what you see!

