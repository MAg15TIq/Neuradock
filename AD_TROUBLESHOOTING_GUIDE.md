# Ad Troubleshooting Guide - NeuraDock

## 🚨 Issue: 6 Ad Slots Not Showing Ads

Your codebase has a comprehensive ad implementation with all 6 Netpub slots configured, but ads are not displaying. This guide provides diagnosis and solutions.

## ✅ What's Working

- **Scripts Loaded**: All Netpub scripts are properly configured in `layout.tsx`
- **Components Created**: Ad banner components are well-implemented
- **Layout Integration**: SidebarLayout properly uses ad components
- **GDPR Compliance**: GDPR script is loaded correctly

## ❌ Potential Issues & Solutions

### 1. **Script Loading Optimization** ✅ FIXED

**Issue**: Multiple duplicate scripts were being loaded for the same Netpub ID.

**Solution**: Consolidated to single script in `src/app/layout.tsx`:
```tsx
{/* Single Netpub script for all slots */}
<ScriptHandler strategy="afterInteractive" id="netpub-ad-script-main">
  {`(function(a) { 
    if (!document.getElementById(a)) { 
      const s = document.createElement("script"); 
      s.id = a; 
      s.async = true; 
      s.src = ["https://fstatic.netpub.media/static/", a, ".min.js?", Date.now()].join(""); 
      s.onload = function() {
        console.log("Netpub script loaded successfully");
        window.netpubLoaded = true;
      };
      document.head.appendChild(s); 
    } 
  })("831b33a650047ee11a992b11fdadd8f3")`}
</ScriptHandler>
```

### 2. **Debug Information Added** ✅ IMPLEMENTED

**Enhancement**: Added debug information to `NetpubBanner` component:
- Script loading status
- Slot configuration details
- Visual indicators in development mode
- Console logging for troubleshooting

### 3. **Testing Pages Created** ✅ IMPLEMENTED

**New Pages**:
- `/ad-debug` - Comprehensive debug dashboard
- `/ad-simple-test` - Simple HTML test page
- Enhanced `/ad-test` - Component testing page

## 🔧 Diagnostic Steps

### Step 1: Check Script Loading
1. Visit `/ad-debug` page
2. Check "Script Loading Status" section
3. Verify "netpub-ad-script-main" shows "Loaded"
4. Look for console message: "Netpub script loaded successfully"

### Step 2: Test Basic HTML Implementation
1. Visit `/ad-simple-test` page
2. Open browser developer tools (F12)
3. Check Console tab for script loading messages
4. Wait 5-10 seconds for ads to load
5. Look for ad content in the containers

### Step 3: Component Testing
1. Visit `/ad-debug` page
2. Scroll to "Test All Ad Slots" section
3. Check if debug information shows for each slot
4. Verify script loading status

## 🚨 Common Issues & Solutions

### Issue: Scripts Not Loading
**Symptoms**: Debug dashboard shows scripts as "Failed"
**Solutions**:
- Check network connectivity to `fstatic.netpub.media`
- Disable ad blockers temporarily
- Check browser console for CORS or network errors
- Verify firewall/proxy settings

### Issue: Scripts Load But No Ads
**Symptoms**: Scripts show "Loaded" but ad containers remain empty
**Solutions**:
- Wait 5-10 seconds (ads can take time to load)
- Check if your Netpub account has active campaigns
- Test from different geographic locations
- Verify publisher ID: `831b33a650047ee11a992b11fdadd8f3`
- Contact Netpub support to verify account status

### Issue: Ad Blockers Interfering
**Symptoms**: Ads work in incognito mode but not regular browsing
**Solutions**:
- Test in incognito/private browsing mode
- Temporarily disable ad blockers
- Add your domain to ad blocker whitelist
- Use the `useAdBanner` hook to detect ad blocking

### Issue: GDPR Compliance Blocking Ads
**Symptoms**: Ads don't show in EU regions
**Solutions**:
- Verify GDPR script is loading: `https://fstatic.netpub.media/extra/cmp/cmp-gdpr.js`
- Check if consent banner appears
- Test from non-EU IP addresses
- Ensure proper consent is given

## 📊 Monitoring & Analytics

### Browser Console Checks
Look for these messages:
- ✅ "Netpub script loaded successfully"
- ✅ "[NetpubBanner Slot X] Script exists: true"
- ❌ Any error messages related to script loading

### Network Tab Checks
Verify these requests succeed:
- `https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js`
- `https://fstatic.netpub.media/extra/cmp/cmp-gdpr.js`

### Element Inspection
Check ad containers have:
- Correct class: `adv-831b33a650047ee11a992b11fdadd8f3`
- Proper data attributes: `data-slot`, `data-sizes-desktop`, `data-sizes-mobile`
- Content injected by Netpub script

## 🎯 Next Steps

### Immediate Actions
1. **Test the debug pages**: Visit `/ad-debug` and `/ad-simple-test`
2. **Check console logs**: Look for script loading messages
3. **Wait for ads**: Allow 5-10 seconds for ad content to load
4. **Test without ad blockers**: Use incognito mode

### If Issues Persist
1. **Contact Netpub Support**: Provide your publisher ID and debug information
2. **Check Account Status**: Verify your Netpub account has active campaigns
3. **Test Geographic Targeting**: Try from different locations/VPNs
4. **Review Campaign Settings**: Ensure campaigns target your domain

### Account Verification
- **Publisher ID**: `831b33a650047ee11a992b11fdadd8f3`
- **Domain**: Verify your domain is approved in Netpub dashboard
- **Campaign Status**: Check if you have active ad campaigns
- **Payment Status**: Ensure account is in good standing

## 📝 Implementation Summary

### Files Modified
- `src/app/layout.tsx` - Optimized script loading
- `src/components/ui/netpub-banner.tsx` - Added debug information
- `src/app/ad-debug/page.tsx` - New debug dashboard
- `src/app/ad-simple-test/page.tsx` - New simple test page

### Key Features Added
- Single script loading (prevents duplicates)
- Debug information in development mode
- Comprehensive testing pages
- Script loading status monitoring
- Ad blocker detection
- Console logging for troubleshooting

## 🔗 Quick Links

- **Debug Dashboard**: `/ad-debug`
- **Simple Test**: `/ad-simple-test`
- **Component Test**: `/ad-test`
- **Netpub Script**: `https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js`
- **GDPR Script**: `https://fstatic.netpub.media/extra/cmp/cmp-gdpr.js`

---

**Note**: Ad networks typically require 24-48 hours to activate new placements. If this is a new setup, allow time for the system to recognize and serve ads to your slots.
