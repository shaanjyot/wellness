# Email Notification Setup

This application uses Nodemailer to send professional email notifications when booking statuses change.

## Features

- **Automatic Email Notifications**: Customers receive emails when:
  - A new booking is created (Pending status)
  - Booking is confirmed
  - Booking is completed
  - Booking is cancelled

- **Professional Email Templates**: Each status has a beautifully designed HTML email template with:
  - Gradient header with brand colors
  - Clear booking details
  - Helpful information and next steps
  - Contact information
  - Responsive design

## Setup Instructions

### 1. Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Update `.env.local`**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   ```

### 2. Alternative SMTP Providers

#### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASSWORD=your-mailgun-smtp-password
```

#### AWS SES
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

## Email Templates

### Pending (New Booking)
- Thanks the customer for booking
- Shows booking details
- Mentions 24-hour confirmation timeline
- Provides contact information

### Confirmed
- Congratulates on confirmed appointment
- Shows confirmed details with green badge
- Includes "What to Expect" checklist
- Provides rescheduling information

### Completed
- Thanks customer for choosing the service
- Shows completed session details
- Provides post-treatment care instructions
- Encourages rebooking

### Cancelled
- Confirms cancellation
- Shows cancelled booking details
- Invites customer to rebook
- Maintains positive tone

## Testing

To test email functionality:

1. Create a test booking through the booking form
2. Check the server logs for email confirmation
3. Update booking status in admin dashboard
4. Verify customer receives appropriate email

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**
   - Ensure all SMTP variables are set in `.env.local`
   - Restart the development server after changes

2. **Gmail Issues**
   - Verify 2FA is enabled
   - Use App Password, not regular password
   - Check "Less secure app access" is NOT enabled (use App Password instead)

3. **Check Server Logs**
   - Look for email errors in terminal
   - Verify SMTP connection is successful

### Email Goes to Spam

1. **Add SPF Record** (for production)
   - Add SPF record to your domain's DNS
   - Example: `v=spf1 include:_spf.google.com ~all`

2. **Use Custom Domain**
   - Configure custom domain in Gmail
   - Verify domain ownership

3. **Warm Up Email**
   - Start with low volume
   - Gradually increase sending

## Production Deployment

For production on Vercel:

1. **Add Environment Variables in Vercel Dashboard**
   - Go to Project Settings → Environment Variables
   - Add all SMTP_* variables
   - Redeploy the application

2. **Consider Dedicated Email Service**
   - SendGrid (99 emails/day free)
   - Mailgun (5,000 emails/month free)
   - AWS SES (62,000 emails/month free)

3. **Monitor Email Delivery**
   - Check bounce rates
   - Monitor spam complaints
   - Track open rates (if using tracking pixels)

## Security Notes

- Never commit `.env.local` to version control
- Use App Passwords, not regular passwords
- Rotate credentials periodically
- Use environment-specific credentials
- Monitor for unauthorized usage

## Support

For issues or questions:
- Check server logs for detailed error messages
- Verify SMTP credentials are correct
- Test SMTP connection using the `verifyEmailConfig()` function
