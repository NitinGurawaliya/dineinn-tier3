# WhatsApp API Integration Setup Guide

This guide will help you set up WhatsApp API integration for the bulk messaging feature in your restaurant management system.

## 🚀 Available WhatsApp API Providers

### 1. WAMR API (Recommended for Easy Setup)
- **Website**: https://wamr.app/api
- **Pros**: Easy setup, good documentation, reasonable pricing
- **Cons**: Third-party service

### 2. Green API (Self-Hosted Option)
- **Website**: https://green-api.com/
- **Pros**: Self-hosted, no monthly fees, full control
- **Cons**: Requires technical setup, needs a WhatsApp phone number

### 3. Twilio WhatsApp API (Enterprise)
- **Website**: https://www.twilio.com/whatsapp
- **Pros**: Reliable, enterprise-grade, official Meta partner
- **Cons**: Expensive, requires business verification

### 4. 360dialog (Enterprise)
- **Website**: https://www.360dialog.com/
- **Pros**: Official Meta partner, enterprise features
- **Cons**: Expensive, requires business verification

## 📋 Setup Instructions

### Option 1: WAMR API (Recommended)

1. **Sign up for WAMR API**:
   - Go to https://wamr.app/api
   - Create an account
   - Get your API key from the dashboard

2. **Add Environment Variables**:
   ```env
   WAMR_API_KEY=your_wamr_api_key_here
   ```

3. **Test the Integration**:
   - The system will automatically use WAMR if the API key is configured
   - No additional setup required

### Option 2: Green API (Self-Hosted)

1. **Set up Green API**:
   - Follow the setup guide at https://green-api.com/
   - You'll need a WhatsApp phone number and the Green API instance

2. **Add Environment Variables**:
   ```env
   GREEN_API_ID=your_green_api_instance_id
   GREEN_API_TOKEN=your_green_api_token
   ```

3. **Configure the API**:
   - The system will automatically use Green API if both credentials are configured

### Option 3: Twilio WhatsApp API

1. **Sign up for Twilio**:
   - Go to https://www.twilio.com/whatsapp
   - Create an account and get approved for WhatsApp Business API
   - Get your Account SID and Auth Token

2. **Add Environment Variables**:
   ```env
   TWILIO_API_KEY=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```

### Option 4: 360dialog

1. **Sign up for 360dialog**:
   - Go to https://www.360dialog.com/
   - Get approved for WhatsApp Business API
   - Get your API key

2. **Add Environment Variables**:
   ```env
   DIALOG360_API_KEY=your_360dialog_api_key
   ```

## 🔧 Configuration Priority

The system automatically chooses the API provider based on this priority order:
1. WAMR API (if `WAMR_API_KEY` is set)
2. Green API (if both `GREEN_API_ID` and `GREEN_API_TOKEN` are set)
3. Twilio (if both `TWILIO_API_KEY` and `TWILIO_AUTH_TOKEN` are set)
4. 360dialog (if `DIALOG360_API_KEY` is set)

## 📱 Features

### Bulk Messaging
- Select multiple customers or "Select All"
- Send the same message to all selected customers
- Real-time status updates
- Error handling for failed messages

### Individual Messaging
- Send personalized messages to individual customers
- Professional dialog interface
- Character counter and validation

### Message Management
- Rate limiting to avoid API restrictions
- Batch processing for large customer lists
- Detailed success/failure reporting

## 🛠️ API Endpoints

### Send Individual Message
```
POST /api/whatsapp/send-message
{
  "phone": "1234567890",
  "message": "Hello from your restaurant!"
}
```

### Send Bulk Message
```
POST /api/whatsapp/send-bulk-message
{
  "customerIds": [1, 2, 3, 4],
  "message": "Special offer for our valued customers!"
}
```

## 🔒 Security Features

- Authentication middleware for all API calls
- Restaurant-specific customer filtering
- Input validation and sanitization
- Rate limiting to prevent abuse

## 📊 Monitoring and Logging

- Detailed error logging for failed messages
- Success/failure statistics
- API response tracking
- Customer-specific message history

## 🚨 Troubleshooting

### Common Issues

1. **"WhatsApp API key not configured"**
   - Check your environment variables
   - Ensure the API key is correct
   - Verify the provider is properly set up

2. **"Failed to send message"**
   - Check your API provider's status
   - Verify phone number format
   - Check API rate limits

3. **"No valid customers found"**
   - Ensure customers are properly linked to your restaurant
   - Check customer data in the database

### Testing

1. **Test with a single customer first**
2. **Verify phone number format** (should be 10 digits for India)
3. **Check API provider dashboard** for message delivery status
4. **Monitor server logs** for detailed error information

## 💡 Best Practices

1. **Start with WAMR API** for easy setup and testing
2. **Use bulk messaging sparingly** to avoid rate limits
3. **Test messages** before sending to large customer lists
4. **Monitor delivery rates** and customer responses
5. **Keep messages professional** and relevant to your restaurant

## 📞 Support

If you encounter issues:
1. Check the API provider's documentation
2. Review server logs for error details
3. Test with a single message first
4. Contact the API provider's support if needed

## 🔄 Migration Between Providers

To switch between providers:
1. Set up the new provider's credentials
2. Update environment variables
3. The system will automatically use the new provider
4. Test with a few messages before bulk sending

---

**Note**: WhatsApp Business API usage is subject to Meta's policies and your chosen provider's terms of service. Ensure compliance with local regulations and WhatsApp's messaging policies. 