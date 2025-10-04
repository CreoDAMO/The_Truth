
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      if (window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: location.pathname + location.search,
        });
      }
      
      // Console log for development
      console.log(`📊 Page view: ${location.pathname}`);
    };

    trackPageView();
  }, [location]);
};

export default usePageTracking;
