# SaaS Payment System Setup Guide

This guide covers implementing a complete SaaS payment system with UPI autopay, free trials, and subscription management for your restaurant management platform.

## 📋 Table of Contents

1. [Payment Strategy Overview](#payment-strategy-overview)
2. [Database Schema Changes](#database-schema-changes)
3. [Payment Provider Options](#payment-provider-options)
4. [API Routes & Endpoints](#api-routes--endpoints)
5. [Frontend Integration](#frontend-integration)
6. [Subscription Management](#subscription-management)
7. [Free Trial Implementation](#free-trial-implementation)
8. [Security & Compliance](#security--compliance)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Checklist](#deployment-checklist)

---

## 🎯 Payment Strategy Overview

### Pricing Tiers
- **Monthly Plan**: ₹X/month (no free trial)
- **Yearly Plan**: ₹Y/year (1-2 months free trial)

### Payment Flow
1. User signs up → Onboarding → Payment selection
2. Payment processing → Subscription activation
3. Auto-renewal setup → Monthly/Yearly billing
4. Trial management → Conversion tracking

---

## 🗄️ Database Schema Changes

### 1. **Subscriptions Table**
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurant_details(id),
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  trial_ends_at TIMESTAMP,
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **Payments Table**
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id),
  restaurant_id INTEGER REFERENCES restaurant_details(id),
  payment_provider VARCHAR(50) NOT NULL, -- 'razorpay', 'stripe', etc.
  payment_method VARCHAR(50) NOT NULL, -- 'upi', 'card', 'netbanking'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider_payment_id VARCHAR(255),
  provider_refund_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **UPI Autopay Table**
```sql
CREATE TABLE upi_autopay (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER REFERENCES restaurant_details(id),
  subscription_id INTEGER REFERENCES subscriptions(id),
  upi_id VARCHAR(100) NOT NULL,
  mandate_id VARCHAR(255) NOT NULL,
  mandate_status VARCHAR(20) NOT NULL DEFAULT 'active',
  mandate_amount DECIMAL(10,2) NOT NULL,
  mandate_frequency VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
  mandate_start_date DATE NOT NULL,
  mandate_end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. **Update Restaurant Details Table**
```sql
ALTER TABLE restaurant_details 
ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired', 'cancelled')),
ADD COLUMN subscription_plan VARCHAR(20) DEFAULT NULL CHECK (subscription_plan IN ('monthly', 'yearly')),
ADD COLUMN trial_ends_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
ADD COLUMN subscription_ends_at TIMESTAMP;
```

---

## 💳 Payment Provider Options

### 1. **Razorpay (Recommended for India)**
- **Pros**: UPI autopay, excellent documentation, good support
- **Cons**: Limited to India
- **Features**: UPI mandates, subscription management, webhooks

### 2. **Stripe**
- **Pros**: Global, excellent features, great documentation
- **Cons**: Limited UPI support, higher fees
- **Features**: Subscription management, webhooks, global cards

### 3. **PayU**
- **Pros**: Good UPI support, competitive pricing
- **Cons**: Less documentation, smaller ecosystem
- **Features**: UPI mandates, subscription management

### 4. **PhonePe**
- **Pros**: Native UPI support, good for Indian market
- **Cons**: Limited features, newer to business payments
- **Features**: UPI mandates, basic subscription

---

## 🛣️ API Routes & Endpoints

### 1. **Subscription Management**
```
POST   /api/subscriptions/create
GET    /api/subscriptions/:id
PUT    /api/subscriptions/:id
DELETE /api/subscriptions/:id
POST   /api/subscriptions/:id/cancel
POST   /api/subscriptions/:id/reactivate
```

### 2. **Payment Processing**
```
POST   /api/payments/create
POST   /api/payments/verify
GET    /api/payments/:id
POST   /api/payments/:id/refund
```

### 3. **UPI Autopay**
```
POST   /api/upi-mandate/create
POST   /api/upi-mandate/verify
DELETE /api/upi-mandate/:id
GET    /api/upi-mandate/:id/status
```

### 4. **Trial Management**
```
POST   /api/trial/activate
GET    /api/trial/status
POST   /api/trial/extend
```

### 5. **Webhooks**
```
POST   /api/webhooks/razorpay
POST   /api/webhooks/stripe
POST   /api/webhooks/payu
```

---

## 🎨 Frontend Integration

### 1. **Onboarding Flow**
```typescript
// Onboarding component with payment selection
interface OnboardingStep {
  step: 'restaurant-details' | 'payment-selection' | 'payment-processing' | 'setup-complete';
}

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  trialDays?: number;
  features: string[];
}
```

### 2. **Payment Components**
- Payment method selection (UPI, Card, Net Banking)
- UPI ID input and validation
- Payment confirmation modal
- Subscription status dashboard

### 3. **Subscription Dashboard**
- Current plan details
- Billing history
- Payment method management
- Plan upgrade/downgrade options

---

## 🔄 Subscription Management

### 1. **Subscription States**
```typescript
enum SubscriptionStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}
```

### 2. **Billing Cycles**
- **Monthly**: 30-day cycles, no trial
- **Yearly**: 365-day cycles, 14-day trial

### 3. **Auto-renewal Logic**
```typescript
// Check subscription status daily
async function checkSubscriptionStatus() {
  const subscriptions = await getExpiringSubscriptions();
  
  for (const subscription of subscriptions) {
    if (subscription.status === 'active' && subscription.autoRenew) {
      await processRenewal(subscription);
    } else if (subscription.status === 'trial' && isTrialExpired(subscription)) {
      await handleTrialExpiration(subscription);
    }
  }
}
```

---

## 🆓 Free Trial Implementation

### 1. **Trial Logic**
```typescript
// Only yearly plans get trial
const trialDays = plan.interval === 'yearly' ? 14 : 0;

// Trial activation
async function activateTrial(restaurantId: number, planType: 'yearly') {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);
  
  await createSubscription({
    restaurantId,
    planType,
    status: 'trial',
    trialEndsAt,
    currentPeriodEnd: trialEndsAt
  });
}
```

### 2. **Trial Expiration Handling**
```typescript
async function handleTrialExpiration(subscription: Subscription) {
  // Send reminder emails
  await sendTrialExpirationReminder(subscription);
  
  // Update subscription status
  await updateSubscriptionStatus(subscription.id, 'expired');
  
  // Restrict access to premium features
  await restrictRestaurantAccess(subscription.restaurantId);
}
```

---

## 🔒 Security & Compliance

### 1. **PCI Compliance**
- Never store card details
- Use payment provider tokens
- Implement proper encryption

### 2. **Data Protection**
- Encrypt sensitive payment data
- Implement audit logging
- Regular security audits

### 3. **Webhook Security**
```typescript
// Verify webhook signatures
function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## 🧪 Testing Strategy

### 1. **Test Cards (Razorpay)**
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`
- UPI: Use test UPI IDs

### 2. **Test Scenarios**
- Successful payment
- Failed payment
- Trial activation
- Subscription renewal
- Payment failure handling
- Refund processing

### 3. **Webhook Testing**
- Use ngrok for local testing
- Test all webhook events
- Verify signature validation

---

## 🚀 Deployment Checklist

### 1. **Environment Variables**
```env
# Payment Provider
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Database
DATABASE_URL=your_database_url

# App Configuration
NEXT_PUBLIC_APP_URL=your_app_url
SUBSCRIPTION_TRIAL_DAYS=14
```

### 2. **Database Migration**
```sql
-- Run all schema changes
-- Create indexes for performance
-- Set up foreign key constraints
```

### 3. **Monitoring Setup**
- Payment success/failure rates
- Subscription conversion rates
- Trial-to-paid conversion
- Revenue metrics

---

## 📊 Analytics & Metrics

### 1. **Key Metrics**
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Trial conversion rate
- Churn rate
- Average Revenue Per User (ARPU)

### 2. **Tracking Events**
```typescript
// Track subscription events
analytics.track('subscription_created', {
  plan_type: 'yearly',
  amount: 9999,
  trial_days: 14
});

analytics.track('trial_converted', {
  plan_type: 'yearly',
  conversion_days: 10
});
```

---

## 🔧 Implementation Steps

### Phase 1: Foundation (Week 1-2)
1. Set up database schema
2. Choose payment provider
3. Create basic subscription models

### Phase 2: Core Features (Week 3-4)
1. Implement payment processing
2. Create subscription management
3. Set up UPI autopay

### Phase 3: Trial System (Week 5-6)
1. Implement free trial logic
2. Create trial expiration handling
3. Set up reminder system

### Phase 4: Frontend (Week 7-8)
1. Create onboarding flow
2. Build subscription dashboard
3. Implement payment UI

### Phase 5: Testing & Launch (Week 9-10)
1. Comprehensive testing
2. Security audit
3. Production deployment

---

## 📞 Support & Resources

### Documentation
- [Razorpay UPI Autopay](https://razorpay.com/docs/payments/upi-autopay/)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions)
- [PayU Documentation](https://payu.in/docs/)

### Community
- Payment provider support channels
- Developer forums
- Stack Overflow tags

---

**This guide provides a complete roadmap for implementing SaaS payments. Start with Phase 1 and work through each phase systematically.** 