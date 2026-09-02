import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ANALYTICS_CONFIG, trackPageView } from '@/services/analyticsService';

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // 1. Asynchronously load analytics scripts if IDs are configured
  useEffect(() => {
    // A. Google Tag Manager (GTM)
    if (ANALYTICS_CONFIG.gtmId && !document.getElementById('gtm-script')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'gtm-script';
      gtmScript.async = true;
      gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${ANALYTICS_CONFIG.gtmId}`;
      document.head.appendChild(gtmScript);

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
    }

    // B. Google Analytics 4 (GA4)
    if (ANALYTICS_CONFIG.ga4Id && !document.getElementById('ga4-script')) {
      const gaScript = document.createElement('script');
      gaScript.id = 'ga4-script';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4Id}`;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer?.push(args);
      }
      window.gtag = gtag;
      window.gtag('js', new Date());
      window.gtag('config', ANALYTICS_CONFIG.ga4Id, {
        send_page_view: false, // Handled dynamically on route changes
      });
    }

    // C. Meta Pixel
    if (ANALYTICS_CONFIG.metaPixelId && !document.getElementById('meta-pixel-script')) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.id = 'meta-pixel-script';
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */

      if (window.fbq) {
        window.fbq('init', ANALYTICS_CONFIG.metaPixelId);
      }
    }
  }, []);

  // 2. Track page views dynamically on route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsProvider;
