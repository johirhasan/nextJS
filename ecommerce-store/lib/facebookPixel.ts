// lib/facebookPixel.ts

export const trackEvent = (event: string, params?: object) => {
    if (typeof window !== 'undefined') {
        try {
            if (typeof window.fbq === 'function') {
                window.fbq('track', event, params);
            } else {
                console.warn(`fbq is not defined. Event "${event}" not tracked.`);
            }
        } catch (error) {
            console.error(`Error tracking event "${event}":`, error);
        }
    }
};

// export const trackEvent = (event: string, params?: object) => {
//     if (typeof window !== 'undefined' && window.fbq) {
//       window.fbq('track', event, params);
//     }
//   };

export const trackPageView = () => {
    trackEvent('PageView');
};

export const trackAddToCart = (itemId: string, itemName: string, price: number) => {
    trackEvent('AddToCart', {
        content_ids: [itemId],
        content_name: itemName,
        value: price,
        currency: 'BDT', // Change as needed
    });
};

export const trackPurchase = (orderId: string, value: number) => {
    trackEvent('Purchase', {
        content_ids: [orderId],
        value: value,
        currency: 'BDT', // Change as needed
    });
};

