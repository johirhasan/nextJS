'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

interface Order {
  id: string;
  createdAt: string;
  total: string;
  status: string;
  productNames:string;
}

interface OrderListProps {
  phoneNumber: string;
}

const OrderList: React.FC<OrderListProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const phoneNumber = params['order-list']

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${phoneNumber}`);
        setOrders(response.data.orders);
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
      }
    //    finally {
    //     setIsLoading(false);
    //   }
    };

    fetchOrders();
  }, [phoneNumber]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg font-semibold text-gray-600">Loading...</p>
//       </div>
//     );
//   }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">{error}</p>
      </div>
    );
  }
  console.log({orders});
  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-100 to-blue-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-2xl font-semibold text-gray-600">No orders are available!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
            <thead className="bg-blue-50 border-b border-gray-200">
            <tr>
                <th className="p-4 text-lg font-semibold text-left text-gray-700">Order ID</th>
                <th className="p-4 text-lg font-semibold text-left text-gray-700 min-w-[200px]">Products</th>
                <th className="p-4 text-lg font-semibold text-left text-gray-700">Order Date</th>
                <th className="p-4 text-lg font-semibold text-left text-gray-700">Total Amount</th>
                <th className="p-4 text-lg font-semibold text-left text-gray-700">Status</th>
                {/* <th className="p-4 text-lg font-semibold text-left text-gray-700">View</th> */}
            </tr>
            </thead>
            <tbody>
            {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-blue-50 transition-colors duration-300">
                <td className="p-4 text-base font-medium text-gray-800">{order.id}</td>
                <td className="p-4 text-base font-medium text-gray-800 min-w-[200px]">{order.productNames}</td>
                <td className="p-4 text-base font-medium text-gray-800">{format(new Date(order.createdAt), "MMMM d, yyyy")}</td>
                <td className="p-4 text-base font-medium text-gray-800">{order.total}৳</td>
                <td className="p-4 text-base font-medium">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Shipping' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Success' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Hold' ? 'bg-gray-100 text-gray-800' :
                        order.status === 'Return' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Return-Success' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                {order.status}
                </span>
                </td>
                {/* <td className="p-4 text-base font-medium">
                    <button className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300">
                    <Eye className="mr-2" />
                    View
                    </button>
                </td> */}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
      )}
    </div>
  )
}

export default OrderList;
