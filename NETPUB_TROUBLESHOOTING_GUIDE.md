# NetPub Script Loading Troubleshooting Guide

## 🚨 **Common Issue: "Failed to load Netpub script"**

This error indicates that the NetPub advertising script cannot be loaded from their servers. Here are the most common causes and solutions:

## 🔍 **Diagnostic Steps**

### **1. Check Script Loading Status**
Visit your testing page: `http://localhost:3000/ad-system-test`

The enhanced diagnostics will show:
- ✅ **Script Status**: Whether NetPub script loaded successfully
- ✅ **Object Availability**: Whether NetPub advertising object is available
- ✅ **Configuration**: Verification meta tags and ads.txt file status
- ✅ **Error Details**: Specific error messages and failed URLs

### **2. Common Causes & Solutions**

#### **🌐 Network/Connectivity Issues**
**Symptoms:**
- Script fails to load from all URLs
- Network errors in browser console

**Solutions:**
1. **Check Internet Connection**: Ensure stable internet connection
2. **Try Different Network**: Test on different WiFi/mobile network
3. **Disable VPN**: Some VPNs block advertising scripts
4. **Check Firewall**: Corporate firewalls may block ad scripts

#### **🚫 Ad Blockers**
**Symptoms:**
- Script loads in incognito mode but not in regular browsing
- Browser extensions blocking requests

**Solutions:**
1. **Disable Ad Blockers**: Temporarily disable uBlock Origin, AdBlock Plus, etc.
2. **Whitelist Domain**: Add `netpub.media` and `fstatic.netpub.media` to whitelist
3. **Test in Incognito**: Use incognito/private browsing mode

#### **⏰ NetPub Account Status**
**Symptoms:**
- Script URLs return 404 or 403 errors
- All fallback URLs fail

**Solutions:**
1. **Verify Account Status**: Check if NetPub account is approved and active
2. **Contact NetPub Support**: Reach out to NetPub support team
3. **Check Publisher ID**: Verify `831b33a650047ee11a992b11fdadd8f3` is correct

#### **🔧 DNS/CDN Issues**
**Symptoms:**
- Intermittent loading failures
- Some users can load, others cannot

**Solutions:**
1. **Clear DNS Cache**: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
2. **Try Different DNS**: Use Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)
3. **Wait and Retry**: CDN issues usually resolve automatically

## 🛠 **Enhanced Script Loading**

The updated implementation includes:

### **Multiple Fallback URLs**
```javascript
const scriptUrls = [
  "https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js",
  "https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.js",
  "https://netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js",
  "https://netpub.media/static/831b33a650047ee11a992b11fdadd8f3.js"
];
```

### **Retry Logic**
- Automatically tries next URL if one fails
- 1-second delay between attempts
- Comprehensive error logging

### **Status Monitoring**
- `window.netpubLoaded` - Script loaded successfully
- `window.netpubLoadFailed` - All URLs failed to load
- Real-time diagnostics on testing page

## 🔧 **Manual Testing Steps**

### **1. Test Script URLs Directly**
Open these URLs in your browser:
1. `https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js`
2. `https://fstatic.netpub.media/static/831b33a650047ee11a992b11fdadd8f3.js`
3. `https://netpub.media/static/831b33a650047ee11a992b11fdadd8f3.min.js`

**Expected Result**: JavaScript code should load (not 404/403 error)

### **2. Check Browser Console**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for NetPub-related messages:
   - ✅ "Netpub script loaded successfully"
   - ❌ "Failed to load Netpub script"

### **3. Network Tab Analysis**
1. Open Developer Tools → Network tab
2. Refresh page
3. Filter by "netpub" or "fstatic"
4. Check status codes:
   - ✅ 200 OK = Success
   - ❌ 404 = Not Found
   - ❌ 403 = Forbidden
   - ❌ Failed = Network issue

## 📞 **When to Contact NetPub Support**

Contact NetPub support if:
1. **All script URLs return 404/403 errors**
2. **Account was recently approved but scripts still fail**
3. **Scripts worked before but suddenly stopped**
4. **Verification meta tag and ads.txt are correct but scripts fail**

**Include in your support request:**
- Publisher ID: `831b33a650047ee11a992b11fdadd8f3`
- Error messages from browser console
- Network tab screenshots showing failed requests
- Confirmation that ads.txt and verification meta are in place

## 🎯 **Expected Timeline After Approval**

Based on NetPub's typical timeline:
1. **Approval**: 24-72 hours after submission
2. **Script Activation**: 1-24 hours after approval
3. **Ad Display**: Within 1-3 seconds after script loads
4. **Optimization**: 3-7 days for best performance

## ✅ **Verification Checklist**

Before contacting support, verify:
- [ ] NetPub account is approved and active
- [ ] Verification meta tag is present in `<head>`
- [ ] ads.txt file is accessible at `/ads.txt`
- [ ] No ad blockers are interfering
- [ ] Internet connection is stable
- [ ] Testing in multiple browsers/devices

## 🚀 **Alternative Testing**

If NetPub scripts are not loading, you can still test the ad placement system:
1. **Layout Testing**: Ad containers and layouts work without scripts
2. **Responsive Testing**: Mobile/desktop layouts function correctly
3. **Component Testing**: All ad components render placeholder content
4. **Integration Testing**: Page layouts accommodate ad placements

The ad system is designed to gracefully handle script loading failures without breaking your website layout.

## 📊 **Monitoring & Analytics**

Use the enhanced diagnostics page (`/ad-system-test`) to:
- Monitor script loading status in real-time
- Track ad container placement
- Identify configuration issues
- Test different device views
- Debug script loading problems

The diagnostics automatically refresh every 5 seconds and provide comprehensive status information to help identify and resolve issues quickly.
