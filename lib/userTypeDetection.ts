// User Type Detection Utility
// This utility automatically detects whether a user is a viewer (customer) or merchant (restaurant owner)

export type UserType = 'viewer' | 'merchant';

interface DetectionResult {
  type: UserType;
  confidence: number;
  method: string;
}

export class UserTypeDetector {
  private static instance: UserTypeDetector;
  private userPatterns: Map<string, UserType> = new Map();

  static getInstance(): UserTypeDetector {
    if (!UserTypeDetector.instance) {
      UserTypeDetector.instance = new UserTypeDetector();
    }
    return UserTypeDetector.instance;
  }

  // Main detection method
  detectUserType(): DetectionResult {
    const methods = [
      this.detectByUrlParameters,
      this.detectByReferrer,
      this.detectByUserAgent,
      this.detectByUrlKeywords,
      this.detectByTrafficPattern,
      this.detectByStoredPreference
    ];

    let bestResult: DetectionResult = {
      type: 'viewer',
      confidence: 0.1,
      method: 'default'
    };

    for (const method of methods) {
      const result = method.call(this);
      if (result.confidence > bestResult.confidence) {
        bestResult = result;
      }
    }

    return bestResult;
  }

  // Detection by URL parameters (highest confidence)
  private detectByUrlParameters(): DetectionResult {
    if (typeof window === 'undefined') return { type: 'viewer', confidence: 0, method: 'url-params' };

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const isMerchant = urlParams.get('merchant') === 'true';

    if (type === 'merchant' || isMerchant) {
      return { type: 'merchant', confidence: 0.95, method: 'url-params' };
    } else if (type === 'viewer') {
      return { type: 'viewer', confidence: 0.95, method: 'url-params' };
    }

    return { type: 'viewer', confidence: 0, method: 'url-params' };
  }

  // Detection by referrer analysis
  private detectByReferrer(): DetectionResult {
    if (typeof window === 'undefined' || !document.referrer) {
      return { type: 'viewer', confidence: 0, method: 'referrer' };
    }

    try {
      const referrerUrl = new URL(document.referrer);
      const hostname = referrerUrl.hostname.toLowerCase();
      const pathname = referrerUrl.pathname.toLowerCase();

      // High confidence indicators
      if (hostname.includes('zayka.store') || hostname.includes('zayka')) {
        return { type: 'viewer', confidence: 0.9, method: 'referrer' };
      }

      // Business/restaurant related sites
      const businessKeywords = [
        'restaurant', 'food', 'catering', 'hotel', 'cafe', 'dining',
        'chef', 'kitchen', 'menu', 'bistro', 'pub', 'bar', 'grill'
      ];

      const hasBusinessKeyword = businessKeywords.some(keyword => 
        hostname.includes(keyword) || pathname.includes(keyword)
      );

      if (hasBusinessKeyword) {
        return { type: 'merchant', confidence: 0.8, method: 'referrer' };
      }

      // Social media and food delivery sites (likely viewers)
      const viewerKeywords = [
        'facebook', 'instagram', 'twitter', 'tiktok', 'youtube',
        'swiggy', 'zomato', 'uber', 'doordash', 'grubhub'
      ];

      const hasViewerKeyword = viewerKeywords.some(keyword => 
        hostname.includes(keyword)
      );

      if (hasViewerKeyword) {
        return { type: 'viewer', confidence: 0.7, method: 'referrer' };
      }

    } catch (error) {
      console.warn('Error parsing referrer:', error);
    }

    return { type: 'viewer', confidence: 0.1, method: 'referrer' };
  }

  // Detection by user agent analysis
  private detectByUserAgent(): DetectionResult {
    if (typeof window === 'undefined') {
      return { type: 'viewer', confidence: 0, method: 'user-agent' };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    
    // Mobile users are more likely to be viewers (customers)
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    if (isMobile) {
      return { type: 'viewer', confidence: 0.6, method: 'user-agent' };
    }

    // Desktop users with business software indicators
    const businessSoftware = [
      'quickbooks', 'square', 'toast', 'lightspeed', 'aloha',
      'micros', 'revel', 'shopify', 'wix', 'wordpress'
    ];

    const hasBusinessSoftware = businessSoftware.some(software => 
      userAgent.includes(software)
    );

    if (hasBusinessSoftware) {
      return { type: 'merchant', confidence: 0.7, method: 'user-agent' };
    }

    return { type: 'viewer', confidence: 0.3, method: 'user-agent' };
  }

  // Detection by URL keywords
  private detectByUrlKeywords(): DetectionResult {
    if (typeof window === 'undefined') {
      return { type: 'viewer', confidence: 0, method: 'url-keywords' };
    }

    const currentUrl = window.location.href.toLowerCase();
    
    const businessTerms = [
      'restaurant', 'business', 'owner', 'manage', 'dashboard',
      'admin', 'panel', 'control', 'settings', 'setup'
    ];

    const hasBusinessTerm = businessTerms.some(term => currentUrl.includes(term));
    if (hasBusinessTerm) {
      return { type: 'merchant', confidence: 0.75, method: 'url-keywords' };
    }

    const viewerTerms = [
      'menu', 'order', 'food', 'delivery', 'takeout',
      'reservation', 'booking', 'review', 'rating'
    ];

    const hasViewerTerm = viewerTerms.some(term => currentUrl.includes(term));
    if (hasViewerTerm) {
      return { type: 'viewer', confidence: 0.6, method: 'url-keywords' };
    }

    return { type: 'viewer', confidence: 0.1, method: 'url-keywords' };
  }

  // Detection by traffic pattern analysis
  private detectByTrafficPattern(): DetectionResult {
    if (typeof window === 'undefined') {
      return { type: 'viewer', confidence: 0, method: 'traffic-pattern' };
    }

    const referrer = document.referrer;
    const isDirectTraffic = !referrer || referrer === window.location.origin;
    
    if (isDirectTraffic) {
      // Direct traffic is more likely to be viewers (customers)
      return { type: 'viewer', confidence: 0.5, method: 'traffic-pattern' };
    }

    // Search engine traffic analysis
    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo'];
    const isFromSearch = searchEngines.some(engine => 
      referrer.toLowerCase().includes(engine)
    );

    if (isFromSearch) {
      // Search traffic is more likely to be viewers
      return { type: 'viewer', confidence: 0.6, method: 'traffic-pattern' };
    }

    return { type: 'viewer', confidence: 0.3, method: 'traffic-pattern' };
  }

  // Detection by stored user preference
  private detectByStoredPreference(): DetectionResult {
    if (typeof window === 'undefined') {
      return { type: 'viewer', confidence: 0, method: 'stored-preference' };
    }

    try {
      const storedType = localStorage.getItem('dineinn-user-type') as UserType;
      if (storedType && (storedType === 'viewer' || storedType === 'merchant')) {
        return { type: storedType, confidence: 0.8, method: 'stored-preference' };
      }
    } catch (error) {
      console.warn('Error reading stored preference:', error);
    }

    return { type: 'viewer', confidence: 0, method: 'stored-preference' };
  }

  // Store user preference for future detection
  storeUserPreference(type: UserType): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('dineinn-user-type', type);
      
      // Also store a timestamp for potential expiration
      localStorage.setItem('dineinn-user-type-timestamp', Date.now().toString());
    } catch (error) {
      console.warn('Error storing user preference:', error);
    }
  }

  // Learn from user behavior
  learnFromBehavior(userId: string, type: UserType): void {
    this.userPatterns.set(userId, type);
  }

  // Get detection confidence threshold
  getConfidenceThreshold(): number {
    return 0.6; // 60% confidence threshold
  }

  // Check if detection is confident enough for automatic redirection
  shouldAutoRedirect(result: DetectionResult): boolean {
    return result.confidence >= this.getConfidenceThreshold();
  }
}

// Export singleton instance
export const userTypeDetector = UserTypeDetector.getInstance(); 