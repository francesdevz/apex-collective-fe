export type Variants = {
  hidden: Record<string, any>
  visible: Record<string, any>
  exit?: Record<string, any>
  hover?: Record<string, any>
  tap?: Record<string, any>
}

// types/facebook.types.ts
export interface FacebookAuthResponse {
  authResponse?: {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
    graphDomain: string;
    data_access_expiration_time: number;
  };
  status: string;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
      is_silhouette: boolean;
    };
  };
}

export interface BackendAuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

export interface FacebookLoginData {
  accessToken: string;
  userId: string;
  name: string;
  email: string;
  pictureUrl?: string;
}

export interface UseFacebookAuthProps {
  setIsLoading?: (loading: boolean) => void;
  onSuccess?: (data: BackendAuthResponse) => void;
  onError?: (error: string) => void;
}