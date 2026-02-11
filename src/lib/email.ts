import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  phone: string;
}

// Email templates
const getEmailTemplate = (data: BookingEmailData) => {
  const { customerName, service, date, time, status } = data;

  const templates = {
    pending: {
      subject: 'Booking Received - Wellness IV Drip',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #14b8a6; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #14b8a6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Your Booking!</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>We have received your booking request for our IV therapy services. Our team will review your request and get back to you shortly.</p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #14b8a6;">Booking Details</h3>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></p>
              </div>

              <p>Our qualified nurses will contact you within 24 hours to confirm your appointment and discuss any specific requirements you may have.</p>

              <p>If you have any immediate questions, please don't hesitate to reach out:</p>
              <p>📞 <strong>Phone:</strong> 0450 480 698<br>
              📧 <strong>Email:</strong> admin@wellnessivdrip.com.au</p>
            </div>
            <div class="footer">
              <p>Wellness IV Drip Canberra<br>
              Premium Mobile IV Therapy Services</p>
              <p style="font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    },
    confirmed: {
      subject: 'Appointment Confirmed - Wellness IV Drip',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
            .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
            .checklist { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .checklist li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Your Appointment is Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>Great news! Your IV therapy appointment has been confirmed.</p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #10b981;">Confirmed Appointment Details</h3>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><span class="success-badge">✓ CONFIRMED</span></p>
              </div>

              <div class="checklist">
                <h3 style="color: #14b8a6;">What to Expect</h3>
                <ul>
                  <li>✓ Our qualified nurse will arrive at your location at the scheduled time</li>
                  <li>✓ Please ensure you are well-hydrated before the appointment</li>
                  <li>✓ Have a comfortable seating area ready</li>
                  <li>✓ The session typically takes 30-90 minutes depending on your service</li>
                  <li>✓ Payment can be made via card or bank transfer</li>
                </ul>
              </div>

              <p><strong>Need to reschedule or have questions?</strong><br>
              Please contact us at least 24 hours before your appointment:</p>
              <p>📞 <strong>Phone:</strong> 0450 480 698<br>
              📧 <strong>Email:</strong> admin@wellnessivdrip.com.au</p>

              <p>We look forward to providing you with premium IV therapy services!</p>
            </div>
            <div class="footer">
              <p>Wellness IV Drip Canberra<br>
              Premium Mobile IV Therapy Services</p>
              <p style="font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    },
    completed: {
      subject: 'Thank You - Wellness IV Drip',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Choosing Us!</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>Thank you for choosing Wellness IV Drip for your wellness needs. We hope you're already feeling the benefits of your IV therapy session!</p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #3b82f6;">Completed Session</h3>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${time}</p>
              </div>

              <h3 style="color: #14b8a6;">Post-Treatment Care</h3>
              <ul>
                <li>Stay well-hydrated over the next 24-48 hours</li>
                <li>Avoid strenuous exercise for the rest of the day</li>
                <li>You may experience increased energy and improved wellbeing</li>
                <li>Results typically last 1-2 weeks depending on the treatment</li>
              </ul>

              <p><strong>Book Your Next Session</strong><br>
              Regular IV therapy can help maintain optimal wellness. Contact us to schedule your next appointment:</p>
              <p>📞 <strong>Phone:</strong> 0450 480 698<br>
              📧 <strong>Email:</strong> admin@wellnessivdrip.com.au</p>

              <p>We'd love to hear about your experience! Your feedback helps us continue to provide exceptional service.</p>
            </div>
            <div class="footer">
              <p>Wellness IV Drip Canberra<br>
              Premium Mobile IV Therapy Services</p>
              <p style="font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    },
    cancelled: {
      subject: 'Appointment Cancelled - Wellness IV Drip',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ef4444; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #14b8a6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Cancelled</h1>
            </div>
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>This email confirms that your appointment has been cancelled as requested.</p>

              <div class="info-box">
                <h3 style="margin-top: 0; color: #ef4444;">Cancelled Appointment</h3>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Status:</strong> <span style="color: #ef4444; font-weight: bold;">Cancelled</span></p>
              </div>

              <p>We're sorry we won't be able to serve you at this time. If you'd like to reschedule or book a new appointment, we'd be happy to help!</p>

              <p><strong>Ready to Book Again?</strong><br>
              Contact us anytime to schedule a new appointment:</p>
              <p>📞 <strong>Phone:</strong> 0450 480 698<br>
              📧 <strong>Email:</strong> admin@wellnessivdrip.com.au</p>

              <p>We hope to serve you in the future and help you achieve your wellness goals.</p>
            </div>
            <div class="footer">
              <p>Wellness IV Drip Canberra<br>
              Premium Mobile IV Therapy Services</p>
              <p style="font-size: 12px; color: #9ca3af;">This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  };

  return templates[status];
};

export async function sendBookingStatusEmail(data: BookingEmailData) {
  try {
    const template = getEmailTemplate(data);

    const mailOptions = {
      from: `"Wellness IV Drip" <${process.env.SMTP_USER}>`,
      to: data.customerEmail,
      subject: template.subject,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email server verification failed:', error);
    return false;
  }
}
