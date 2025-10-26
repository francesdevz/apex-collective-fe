// src/hooks/useFacebookSDK.ts
import { useEffect, useState } from 'react';
import type { FacebookSDK } from '../../common/Types/FacebookTypes/facebook';

const useFacebookSDK = () => {
  const [fb, setFb] = useState<FacebookSDK | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSDK = () => {
      if (window.FB) {
        try {
          window.FB.init({
            appId: import.meta.env.VITE_FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          setFb(window.FB);
          setError(null);
        } catch (err) {
          setError('Failed to initialize Facebook SDK');
          console.error('Facebook SDK initialization error:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.fbAsyncInit = initializeSDK;

    if (!window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        initializeSDK();
      };
      script.onerror = () => {
        setError('Failed to load Facebook SDK');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      initializeSDK();
    }
    return () => {
      window.fbAsyncInit = undefined;
    };
  }, []);
  return { fb, isLoading, error };
};

export default useFacebookSDK;


