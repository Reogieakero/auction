# Auction Backend - OTP Email Service

Simple Node.js/Express backend for sending OTP verification emails via Gmail.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Gmail

To send emails, you need a Gmail account and an app-specific password:

1. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Windows Computer** (or your device)
3. Google will generate a 16-character password
4. Copy this password

### 3. Create `.env` File

Create a `backend/.env` file with your Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `your-app-specific-password` with the 16-character password from step 2

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Send OTP
**POST** `/api/send-otp`

Send a verification code to user's email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to user@example.com"
}
```

### Verify OTP
**POST** `/api/verify-otp`

Verify the OTP provided by user.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Resend OTP
**POST** `/api/resend-otp`

Send a new verification code to user's email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification code resent to user@example.com"
}
```

## Features

- ✅ 6-digit OTP generation
- ✅ Email verification via Gmail
- ✅ OTP expiration (10 minutes)
- ✅ Resend OTP with cooldown
- ✅ Beautiful HTML email templates
- ✅ Development mode with OTP logging
- ✅ CORS support for React Native Expo

## Troubleshooting

### "Failed to authenticate user" Error
- Verify your Gmail credentials in `.env`
- Ensure you're using an app-specific password, not your regular Gmail password
- Check that 2FA is enabled on your Gmail account

### "Failed to send verification code" Error
- Ensure backend server is running on port 3000
- Check network connectivity
- Verify `.env` file is in the `backend/` directory

### CORS Issues
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- For Expo, use `exp://localhost:8081` or your machine's IP

## Production Considerations

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Move OTP storage to database** - Use MongoDB, PostgreSQL, etc.
3. **Use professional email service** - SendGrid, AWS SES, or Firebase
4. **Add rate limiting** - Prevent spam/brute force attacks
5. **Add logging** - Store OTP attempts for audit trail
6. **HTTPS only** - Use SSL/TLS in production
7. **Secure API** - Add authentication tokens, API keys

## Dependencies

- **express** - Web framework
- **nodemailer** - Email sending
- **cors** - Cross-origin requests
- **dotenv** - Environment configuration

## License

MIT
