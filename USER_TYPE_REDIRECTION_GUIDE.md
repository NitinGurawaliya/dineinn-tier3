# Automatic User Type Detection and Redirection System

## Overview

This system **automatically detects** user intent and redirects them to the appropriate platform without requiring manual input:
- **Viewers/Customers** → Automatically redirected to `zayka.store` to browse and order food
- **Merchants/Restaurant Owners** → Automatically redirected to DineInn signin page to manage their restaurant

## How It Works

### 1. Intelligent Automatic Detection

The system uses multiple detection methods with confidence scoring:

#### **Detection Methods (in order of priority):**

1. **URL Parameters** (95% confidence)
   - `?type=merchant` → Forces merchant detection
   - `?type=viewer` → Forces viewer detection
   - `?merchant=true` → Alternative merchant detection

2. **Referrer Analysis** (60-90% confidence)
   - Coming from `zayka.store` → Likely viewer
   - Coming from business/restaurant sites → Likely merchant
   - Coming from social media/food delivery → Likely viewer

3. **User Agent Analysis** (60-70% confidence)
   - Mobile devices → Likely viewer (customers)
   - Desktop with business software → Likely merchant

4. **URL Keywords** (60-75% confidence)
   - Business terms in URL → Likely merchant
   - Food/order terms → Likely viewer

5. **Traffic Pattern Analysis** (50-60% confidence)
   - Direct traffic → Likely viewer
   - Search engine traffic → Likely viewer

6. **Stored User Preference** (80% confidence)
   - Previous user choice stored in localStorage

### 2. Confidence-Based Redirection

- **High Confidence (≥60%)**: Automatic redirection with brief detection display
- **Low Confidence (<60%)**: Show manual selection interface
- **User Override**: "Not correct? Choose manually" option always available

### 3. Learning System

- Stores user preferences for future visits
- Learns from user behavior patterns
- Improves detection accuracy over time

## Implementation Details

### Core Detection Engine (`lib/userTypeDetection.ts`)

Sophisticated detection utility with:
- Multiple detection methods
- Confidence scoring
- User preference storage
- Learning capabilities

### Landing Page Changes (`app/page.tsx`)

- Automatic detection on page load
- Confidence-based decision making
- Fallback to manual selection
- User preference storage

### Merchant Recovery System

Created files to help merchants find their way back to DineInn:

1. **`public/merchant-banner.html`** - Standalone banner for zayka.store
2. **`public/embed-code.html`** - Embed instructions
3. **`components/MerchantBanner.tsx`** - React component version

## User Experience Flow

### For Viewers (Customers) - Automatic
1. Visit `yourdomain.com`
2. System automatically detects: "Customer" (e.g., 85% confidence via referrer)
3. Shows: "Detected: Customer • Confidence: 85% • Method: referrer"
4. Automatically redirected to `zayka.store` after 1.5 seconds
5. Can click "Not correct? Choose manually" if wrong

### For Merchants (Restaurant Owners) - Automatic
1. Visit `yourdomain.com`
2. System automatically detects: "Restaurant Owner" (e.g., 75% confidence via URL keywords)
3. Shows: "Detected: Restaurant Owner • Confidence: 75% • Method: url-keywords"
4. Automatically redirected to signin page after 1.5 seconds
5. Can click "Not correct? Choose manually" if wrong

### For Uncertain Cases - Manual Selection
1. Visit `yourdomain.com`
2. System detects low confidence (e.g., 45% confidence)
3. Shows manual selection interface with two cards
4. User explicitly chooses their role

### For Merchants on Zayka Store - Recovery
1. Merchant visits `zayka.store` (accidentally)
2. Sees DineInn banner: "Are you a Restaurant Owner?"
3. Clicks "Get Started" → Redirected to `yourdomain.com/?type=merchant`
4. System detects with 95% confidence and redirects to signin

## Detection Examples

### High Confidence Merchant Detection
```
User visits: yourdomain.com/restaurant/business-setup
Referrer: restaurant-management-software.com
User Agent: Desktop with QuickBooks
Result: Merchant (85% confidence) → Auto-redirect to signin
```

### High Confidence Viewer Detection
```
User visits: yourdomain.com
Referrer: zayka.store/menu/123
User Agent: Mobile iPhone
Result: Viewer (90% confidence) → Auto-redirect to zayka.store
```

### Low Confidence Case
```
User visits: yourdomain.com
Referrer: google.com (search)
User Agent: Desktop Chrome
Result: Viewer (45% confidence) → Show manual selection
```

## Configuration

### Update Domain Names

Replace `yourdomain.com` with your actual domain in:
- `app/page.tsx` (line with `window.location.href = "https://zayka.store"`)
- `public/merchant-banner.html` (href attribute)
- `public/embed-code.html` (all examples)

### Adjust Confidence Threshold

In `lib/userTypeDetection.ts`:
```typescript
getConfidenceThreshold(): number {
  return 0.6; // Change to 0.5 for more aggressive auto-redirect
}
```

### Customize Detection Methods

Add new detection methods in `lib/userTypeDetection.ts`:
```typescript
private detectByCustomMethod(): DetectionResult {
  // Your custom detection logic
  return { type: 'viewer', confidence: 0.7, method: 'custom' };
}
```

## Benefits

1. **Fully Automatic**: No manual selection required for most users
2. **Intelligent**: Uses multiple data points for accurate detection
3. **Confidence-Based**: Only auto-redirects when confident
4. **User-Friendly**: Always provides manual override option
5. **Learning**: Improves accuracy over time
6. **Flexible**: Multiple ways to trigger specific redirections
7. **Recovery System**: Helps merchants find their way back

## Testing

Test the automatic detection with these scenarios:

### High Confidence Tests
- `https://yourdomain.com/?type=merchant` → Should auto-redirect to signin
- `https://yourdomain.com/?type=viewer` → Should auto-redirect to zayka.store
- Visit from `zayka.store` → Should detect as viewer
- Visit from `restaurant-management.com` → Should detect as merchant

### Low Confidence Tests
- Direct visit with no referrer → Should show manual selection
- Visit from `google.com` → Should show manual selection

### Manual Override Tests
- Click "Not correct? Choose manually" → Should show selection interface
- Choose different option → Should redirect accordingly

## Analytics and Monitoring

The system provides detection insights:
- Detection method used
- Confidence level
- User override frequency
- Success rate tracking

## Future Enhancements

1. **Machine Learning**: Train models on user behavior patterns
2. **Geolocation**: Detect based on user location
3. **Time-based**: Different detection rules for different times
4. **A/B Testing**: Test different detection algorithms
5. **Analytics Dashboard**: Monitor detection accuracy and user flows 