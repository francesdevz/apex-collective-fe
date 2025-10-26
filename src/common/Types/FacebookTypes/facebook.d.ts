
export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: string;
  signedRequest: string;
  userID: string;
}

export interface FacebookLoginResponse {
  authResponse: FacebookAuthResponse | null;
  status: string;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  email: string;
  picture?: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

export interface FacebookSDK {
  init(params: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }): void;
  login(
    callback: (response: FacebookLoginResponse) => void,
    options?: { scope: string }
  ): void;
  api(
    path: string,
    params: { fields: string },
    callback: (response: FacebookUserProfile) => void
  ): void;
  getLoginStatus(callback: (response: FacebookLoginResponse) => void): void;
  logout(callback: () => void): void;
}

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: FacebookSDK;
  }
}