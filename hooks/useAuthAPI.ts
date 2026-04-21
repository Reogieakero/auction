import Constants from 'expo-constants';

export const useAuthAPI = () => {
  const getBackendUrl = (): string => {
    return Constants.expoConfig?.extra?.BACKEND_URL || 'http://192.168.1.6:3000';
  };

  const sendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to send verification code',
        };
      }

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to send verification code',
      };
    }
  };

  const verifyOTP = async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to verify code. Please try again.',
        };
      }

      return {
        success: true,
        message: 'OTP verified successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Verification failed. Please try again.',
      };
    }
  };

  const resendOTP = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Failed to resend code. Please try again.',
        };
      }

      return {
        success: true,
        message: 'Verification code has been resent',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to resend verification code. Please try again.',
      };
    }
  };

  return {
    sendOTP,
    verifyOTP,
    resendOTP,
  };
};
