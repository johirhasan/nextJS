'use client';

import { useEffect, useState } from 'react';
import { BlockIps } from '@/types';

const IpBlocker = ({ children, blockIps }: { children: React.ReactNode, blockIps: BlockIps }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading to show the spinner (can adjust the duration or remove if not necessary)
    const timeoutId = setTimeout(() => setIsLoading(false), 500);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (blockIps.isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m6.938-2.062A8 8 0 1112 4a8 8 0 016.938 10.938z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mt-4 text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">Your IP address has been blocked due to suspicious activity. Please contact support if you believe this is a mistake.</p>
          <button className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">Contact Support</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default IpBlocker;
