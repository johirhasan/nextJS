"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useCart from '@/hooks/use-cart';
import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import { trackPageView, trackPurchase } from '@/lib/facebookPixel';

// Define the types for your form data and shipping options
interface ShippingOption {
    location: string;
    price: number;
}

interface FormData {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
    shippingMethod: string;
}

const CheckOutMainPage = ({ shippingOptions }: { shippingOptions: ShippingOption[] }) => {
    const cart = useCart();
    const items = cart.items;
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [phoneError, setPhoneError] = useState('');
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        trackPageView();
        setInitialized(true);
    }, [initialized]);

    const validatePhoneNumber = (value: string) => {
        const regex = /^(\+880|0)?1[3-9]\d{8}$/; // Bangladeshi phone number regex
        if (!regex.test(value)) {
            setPhoneError('Please enter a valid Bangladeshi phone number.');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!validatePhoneNumber(data.phone)) return;

        setLoading(true);
        // console.log({ data });

        const payload = {
            products: items.map((item) => ({
                id: item.id,
                quantity: item.quantity || 1,
                price: item.offer > 0 ? item.price * (1 - item.offer / 100) : item.price,
                size: item.selectedSize,
            })),
            paymentMethod: data.paymentMethod,
            shippingMethod: data.shippingMethod,
            shippingCost,
            customerDetails: {
                name: data.name,
                phone: data.phone,
                address: data.address,
            },
            phoneNumber: data.phone,
        };
        // console.log({ payload });
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, payload);

            // console.log(response.data);

            trackPurchase(response.data.orderId, calculateTotalPrice());

            toast.success('Order placed successfully!');
            router.push(`/checkout/order-success/${data.phone}`);
            // router.refresh();
        } catch (error) {
            toast.error('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalPrice = () => {
        const itemsTotal = items.reduce((total, item) => {
            const itemPrice = item.offer > 0 ? item.price * (1 - item.offer / 100) : item.price;
            return total + itemPrice * (item.quantity || 1);
        }, 0);
        return Number(itemsTotal) + Number(shippingCost);
    };

    const handleShippingMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMethod = e.target.value;

        // Find the selected shipping option dynamically based on the API data
        const selectedOption = shippingOptions.find((option) => option.location === selectedMethod);

        // Set the shipping cost based on the selected option's price
        const cost = selectedOption ? selectedOption.price : 0;

        setShippingCost(cost);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-wrap md:flex-nowrap">
            {/* Form Fields */}
            <div className="w-full md:w-2/3 p-4 space-y-6">
                <h1 className="text-4xl font-bold mb-4 text-center text-black-600">Checkout</h1>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block mb-2 font-medium text-gray-800">Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                            placeholder='Your Name'
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block mb-2 font-medium text-gray-800">Phone Number</label>
                        <input
                            type="text"
                            {...register('phone', { required: true, validate: validatePhoneNumber })}
                            className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 ${phoneError ? 'border-red-500' : ''}`}
                            placeholder='Your Phone Number'
                        />
                        {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-800">Address</label>
                    <input
                        type="text"
                        {...register('address', { required: true })}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                        placeholder='Your Full Address'
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-800">Payment Method</label>
                    <select
                        {...register('paymentMethod', { required: true })}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    >
                        <option value="Cash on Delivery">Cash on Delivery</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-800">Shipping Method</label>
                    <select
                        {...register('shippingMethod', { required: true })}
                        onChange={handleShippingMethodChange}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                    >
                        <option value="">Select Shipping Method</option>
                        {shippingOptions?.map((option) => (
                            <option key={option.location} value={option.location}>
                                {option.location} ({option.price}৳)
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200">
                    {loading ? 'Processing...' : 'Place Order'}
                </Button>
            </div>

            {/* Order Summary */}
            <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg shadow-inner space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between mb-2 border-b border-gray-300 pb-2">
                        <span className="font-medium">{item.name} ({item.quantity || 1})</span>
                        <span>
                            <Currency value={(item.offer > 0 ? item.price * (1 - item.offer / 100) : item.price) * (item.quantity || 1)} />
                        </span>
                    </div>
                ))}
                <div className="flex justify-between mb-2 font-medium text-gray-800">
                    <span>Shipping Cost</span>
                    <Currency value={shippingCost} />
                </div>
                <div className="flex justify-between font-semibold text-gray-900">
                    <span>Total</span>
                    <Currency value={calculateTotalPrice()} />
                </div>
            </div>
        </form>
    );
};

export default CheckOutMainPage;
