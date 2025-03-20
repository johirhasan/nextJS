"use client";

import { useEffect } from 'react';

interface FacebookPixelProps {
    facebookPixelId: string;
}

const FacebookPixel = ({ facebookPixelId }: FacebookPixelProps) => {
    useEffect(() => {
        if (facebookPixelId) {
            const script = document.createElement('script');
            script.innerHTML = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${facebookPixelId}');
                fbq('track', 'PageView');
            `;

            // Handle script loading errors
            script.onerror = () => {
                console.error("Failed to load Facebook Pixel script.");
            };

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [facebookPixelId]);

    return (
        <>
            <noscript>
                <img
                    height={1}
                    width={1}
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1`}
                />
            </noscript>
        </>
    );
};

export default FacebookPixel;
