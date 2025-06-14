# Netpub Script Verification Guide

## ✅ Quick Verification Steps

### 1. Open Browser Developer Tools
- Press `F12` or right-click → "Inspect"
- Go to the **Console** tab

### 2. Check for Success Messages
Look for these console messages:
```
[NetPub] Attempting to load script from: https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js
[NetPub] Script loaded successfully from: [URL]
[NetPub] Object verified and available
```

### 3. Verify Script Elements
In the **Elements** tab, check for:
- `<script id="gdpr-compliance-script">` - GDPR script
- `<script id="831b33a650047ee11a992b11fdadd8f3">` - Main Netpub script
- `<meta name="netpub_831b33a650047ee11a992b11fdadd8f3">` - Verification meta tag

### 4. Test Ad Containers
Visit: `http://localhost:3001/ad-simple-test`
- Look for ad containers with class `adv-831b33a650047ee11a992b11fdadd8f3`
- Ads should load within 5-10 seconds
- Check for any error messages in console

### 5. Use Diagnostics Dashboard
Visit: `http://localhost:3001/netpub-diagnostics`
- All core status items should show green checkmarks
- No critical errors should be present
- Ad containers should be detected

## 🔧 Troubleshooting

### If Script Doesn't Load:
1. **Check Network**: Ensure internet connection is stable
2. **Disable Ad Blockers**: Temporarily disable browser ad blockers
3. **Clear Cache**: Hard refresh with `Ctrl+F5` or `Cmd+Shift+R`
4. **Check Console**: Look for network errors or blocked requests

### If Ads Don't Show:
1. **Wait**: Ads can take 5-10 seconds to load
2. **Geographic Location**: Some ads are geo-targeted
3. **Account Status**: Verify Netpub account has active campaigns
4. **Ad Inventory**: No ads may be available for your location/time

### Manual Retry:
If script fails, you can manually retry in console:
```javascript
window.retryNetpubLoad();
```

## 📊 Expected Behavior

### ✅ Success Indicators:
- Console shows "Script loaded successfully"
- `window.netpub` object is available
- Ad containers are detected
- GDPR script loads without errors
- No critical errors in diagnostics

### ⚠️ Warning Signs:
- Script loading timeouts
- Multiple retry attempts
- Missing verification meta tag
- Ad containers not found

### ❌ Error Indicators:
- "All script URLs failed" message
- Network connectivity issues
- Missing GDPR compliance script
- Verification meta tag not found

## 🌐 Live Testing URLs

- **Simple Test**: http://localhost:3001/ad-simple-test
- **Diagnostics**: http://localhost:3001/netpub-diagnostics  
- **Debug Dashboard**: http://localhost:3001/ad-debug
- **Home Page**: http://localhost:3001/

## 📝 Configuration Details

- **Publisher ID**: 831b33a650047ee11a992b11fdadd8f3
- **GDPR Script**: https://fstatic.netpub.media/extra/cmp/cmp-gdpr.js
- **Primary Script**: https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js
- **Fallback URLs**: Multiple CDN endpoints configured
- **Retry Logic**: 3 retry cycles with exponential backoff
- **Timeout**: 15 seconds per URL attempt
