"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

const OrderSuccess = () => {
  const params = useParams();

  useEffect(() => {
    toast.success('Your order has been placed successfully!');
  }, []);

  // Replace with the actual phone number logic
  const phoneNumber = params['order-success']; // This should be dynamically retrieved
  // console.log({params});
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-green-600">Thank you for your order!</h2>
          <p className="mt-2 text-sm text-gray-600">Your order has been placed successfully. We will process it shortly.</p>
        </div>
        <div className="flex items-center justify-center mt-6">
          <Image height={500} width={500} src="/images/thank-you.webp" alt="Thank You" className="w-40 h-40" />
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600">You will receive an email confirmation shortly.</p>
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-center gap-4">
            <Link href="/" passHref>
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Continue Shopping
              </div>
            </Link>
            <Link href={`/checkout/order-list/${phoneNumber}`} passHref>
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Your Orders
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
