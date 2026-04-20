const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:8081', 'exp://localhost:8081'],
  credentials: true
}));

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Store OTPs in memory (in production, use a database)
const otpStore = new Map();

/**
 * POST /api/send-otp
 * Sends OTP to user's email
 * Body: { email: string }
 * Response: { success: boolean, message: string, otp: string (dev only) }
 */
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with email for 10 minutes (600 seconds)
    otpStore.set(email, {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Email HTML template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 28px; font-weight: 700; color: #0a0a0a; margin: 0 0 10px 0; }
            .subtitle { font-size: 14px; color: #666; margin: 0; }
            .content { margin: 30px 0; }
            .otp-box { background: #f0f0f0; border-left: 4px solid #000; padding: 20px; margin: 20px 0; text-align: center; }
            .otp-code { font-size: 32px; font-weight: 700; color: #000; letter-spacing: 4px; font-family: 'Courier New', monospace; }
            .otp-info { font-size: 12px; color: #999; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Auction App</h1>
              <p class="subtitle">Email Verification</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up with Auction App! To verify your email address and complete your registration, please use the verification code below:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-info">This code expires in 10 minutes</div>
              </div>
              <p>Enter this code in the verification screen to confirm your email.</p>
              <p><strong>Important:</strong> Do not share this code with anyone. Our team will never ask for this code.</p>
            </div>
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
              <p>&copy; ${new Date().getFullYear()} Auction App. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Auction App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Auction App',
      html: htmlTemplate,
    });

    console.log(`OTP sent to ${email}: ${otp}`);

    // Return success (do NOT send OTP in production)
    res.json({
      success: true,
      message: `Verification code sent to ${email}`,
      // In development, return OTP for testing. Remove in production!
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/verify-otp
 * Verifies OTP for email
 * Body: { email: string, otp: string }
 * Response: { success: boolean, message: string }
 */
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const storedOtpData = otpStore.get(email);

    // Check if OTP exists for this email
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new one.',
      });
    }

    // Check if OTP has expired
    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      });
    }

    // Check if OTP matches
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please try again.',
      });
    }

    // OTP is valid, remove it from storage
    otpStore.delete(email);

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/resend-otp
 * Resends OTP to email
 * Body: { email: string }
 * Response: { success: boolean, message: string }
 */
app.post('/api/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email is required',
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP in store
    otpStore.set(email, {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Email HTML template (same as send-otp)
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .title { font-size: 28px; font-weight: 700; color: #0a0a0a; margin: 0 0 10px 0; }
            .subtitle { font-size: 14px; color: #666; margin: 0; }
            .content { margin: 30px 0; }
            .otp-box { background: #f0f0f0; border-left: 4px solid #000; padding: 20px; margin: 20px 0; text-align: center; }
            .otp-code { font-size: 32px; font-weight: 700; color: #000; letter-spacing: 4px; font-family: 'Courier New', monospace; }
            .otp-info { font-size: 12px; color: #999; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">Auction App</h1>
              <p class="subtitle">Email Verification</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Here is your new verification code:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-info">This code expires in 10 minutes</div>
              </div>
              <p>Enter this code in the verification screen to confirm your email.</p>
              <p><strong>Important:</strong> Do not share this code with anyone. Our team will never ask for this code.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Auction App. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Auction App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification Code - Auction App',
      html: htmlTemplate,
    });

    console.log(`OTP resent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: `Verification code resent to ${email}`,
      // In development, return OTP for testing
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Auction Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Email service: ${process.env.EMAIL_USER ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log('\nEndpoints:');
  console.log('  POST /api/send-otp - Send OTP to email');
  console.log('  POST /api/verify-otp - Verify OTP');
  console.log('  POST /api/resend-otp - Resend OTP');
  console.log('  GET /api/health - Health check\n');
});
