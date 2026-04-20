# Environment Configuration

This project uses environment variables to securely manage API keys and configuration.

## Setup

### 1. Firebase Configuration

The Firebase configuration is now stored in environment variables:

- **`.env`** - Local development environment variables
- **`app.json`** - Expo configuration for production builds

### 2. Environment Variables

#### Firebase Keys (Required)
```env
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

#### Backend Configuration
```env
BACKEND_URL=http://192.168.1.6:3000
```

### 3. Getting Firebase Keys

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** > **General** > **Your apps**
4. Click on your web app or create one
5. Copy the config values from the SDK setup

### 4. Security Notes

- ✅ `.env` file is gitignored (won't be committed)
- ✅ API keys are not hardcoded in source code
- ✅ Different configs for development/production
- ⚠️ Never commit `.env` files to version control
- ⚠️ Rotate API keys if accidentally exposed

### 5. Updating Configuration

**For Development:**
- Edit `.env` file
- Restart Expo development server

**For Production:**
- Update `app.json` extra section
- Rebuild the app

### 6. Backend Configuration

The backend URL is configurable for different environments:
- Development: `http://192.168.1.6:3000` (your local IP)
- Production: Your deployed backend URL

Update the `BACKEND_URL` in both `.env` and `app.json` when deploying.