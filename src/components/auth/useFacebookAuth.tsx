import { useState } from 'react';
import useFacebookSDK from './useFacebookSDK';
import type {
    FacebookAuthResponse,
    FacebookUserProfile,
    BackendAuthResponse,
    FacebookLoginData,
    UseFacebookAuthProps,
} from '../../Types/FacebookTypes/types';

import ApiService from '../../ApiService/ApiService';

import type { FacebookLoginResponse } from '../../Types/FacebookTypes/facebook';

export const useFacebookAuth = ({ setIsLoading, onSuccess, onError }: UseFacebookAuthProps) => {

  const { fb, isLoading: isFBSDKLoading, error: fbError } = useFacebookSDK();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authenticateWithBackend = async (data: FacebookLoginData): Promise<BackendAuthResponse> => {
    try {
      const response = await ApiService.getInstance().post("/api/auth/facebook", data);
      if (!response.statusText || response.status < 200 || response.status >= 300) {
        const errorText = await response.statusText;
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      return await response.request;
    } catch (error) {
      throw new Error(`Backend authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getUserProfile = async (): Promise<FacebookUserProfile> => {
    return new Promise((resolve, reject) => {
      if (!fb) {
        reject(new Error('Facebook SDK not available'));
        return;
      }

      fb.api('/me', { fields: 'name,email,picture' }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response);
        }
      });
    });
  };

const performFacebookLogin = async (): Promise<FacebookLoginResponse> => {
  return new Promise((resolve, reject) => {
    if (!fb) {
      reject(new Error('Facebook SDK not available'));
      return;
    }

    fb.login(
      (response: FacebookLoginResponse) => {
        resolve(response);
      }, 
      { scope: 'public_profile,email' }
    );
  });
};

  const handleAuthenticationSuccess = (data: BackendAuthResponse) => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    onSuccess?.(data);
  };

  const handleFacebookLogin = async (): Promise<void> => {
    
    if (!fb) {
      const error = 'Facebook SDK not loaded';
      console.error(error);
      onError?.(error);
      return;
    }

    setIsAuthenticating(true);
    try {

      const facebookResponse = await performFacebookLogin();

      if (!facebookResponse.authResponse) {
        throw new Error('Facebook login cancelled or failed');
      }

      const userProfile = await getUserProfile();

      const loginData: FacebookLoginData = {
        accessToken: facebookResponse.authResponse.accessToken,
        userId: facebookResponse.authResponse.userID,
        name: userProfile.name,
        email: userProfile.email,
        pictureUrl: userProfile.picture?.data?.url
      };

      const backendResponse = await authenticateWithBackend(loginData);

      if (backendResponse.success || backendResponse.token) {
        handleAuthenticationSuccess(backendResponse);
      } else {
        throw new Error(backendResponse.message || 'Authentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Facebook login failed';
      onError?.(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const isFacebookReady = !!fb && !isFBSDKLoading && !fbError;

  return {
    handleFacebookLogin,
    isAuthenticating: isAuthenticating || isFBSDKLoading,
    isFBSDKLoading,
    fbError,
    isFacebookReady
  };
};

export default useFacebookAuth;