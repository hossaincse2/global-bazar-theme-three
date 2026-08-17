const STANDARD_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'Search',
  'AddToCart',
  'AddToWishlist',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
  'Lead',
  'CompleteRegistration',
]);

export const trackEvent = (eventName, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const isStandard = STANDARD_EVENTS.has(eventName);
    const method = isStandard ? 'track' : 'trackCustom';
    window.fbq(method, eventName, options);
  }
};
