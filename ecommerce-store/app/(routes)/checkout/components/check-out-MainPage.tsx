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
import Image from 'next/image';
import getCoupons from '@/actions/get-couponValidation';

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
    couponCode?: string; // Add coupon code to the form data
}

const CheckOutMainPage = ({ shippingOptions }: { shippingOptions: ShippingOption[] }) => {
    const cart = useCart();
    const items = cart.items;
    const [loading, setLoading] = useState(false);
    const [couponLoading,setCouponLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [phoneError, setPhoneError] = useState('');
    const [discount, setDiscount] = useState(0);
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>();
    const [initialized, setInitialized] = useState(false);
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [couponInfo,setCouponInfo] = useState(null);

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

    const handleCouponClick = () => {
        setShowCouponInput(true); 
      };
    
    const validateCoupon = async (code: string) => {
        setCouponLoading(true);
        try {
            // const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${code}`,{
            //     headers: { 'Cache-Control': 'no-cache' }
            // });

            const response = await getCoupons(code);
            const coupon = response;
            console.log("coupons",{coupon,response});
            setCouponInfo(coupon);
    
            // Check if the coupon is valid and active
            if (coupon.isValid && coupon.isActive) {
                let discountAmount = 0;
                const totalPrice = calculateTotalPrice();
                // console.log({totalPrice})
                if (coupon.discountType === 'PERCENTAGE') {
                    discountAmount = (coupon.discountAmount / 100) * totalPrice;
                    toast.success(`Coupon applied: ${coupon.discountAmount}% off!`);
                } else if (coupon.discountType === 'FIXED') {
                    discountAmount = coupon.discountAmount; // Fixed amount discount
                    toast.success(`Coupon applied: $${discountAmount} off!`);
                }
                setDiscount(discountAmount);
            } else {
                setDiscount(0);
                toast.error('Invalid coupon code.');
            }
        } catch (error) {
            setDiscount(0);
            console.log({error});
            toast.error('Failed to validate coupon.');
        }
        setCouponLoading(false);
    };
    
    

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (!validatePhoneNumber(data.phone)) return;

        setLoading(true);

        // Validate the coupon code before placing the order
        if (data.couponCode) {
            await validateCoupon(data.couponCode);
        }

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
            discount,
            couponInfo,
            customerDetails: {
                name: data.name,
                phone: data.phone,
                address: data.address,
            },
            phoneNumber: data.phone,
        };
        // console.log({payload});
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, payload);
            trackPurchase(response.data.orderId, calculateTotalPrice());
            toast.success('Order placed successfully!');
            router.push(`/checkout/order-success/${data.phone}`);
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
        return Number(itemsTotal) + Number(shippingCost) - Number(discount); // Subtract discount from total
    };

    const handleShippingMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMethod = e.target.value;
        const selectedOption = shippingOptions.find((option) => option.location === selectedMethod);
        const cost = selectedOption ? selectedOption.price : 0;
        setShippingCost(cost);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl text-sm mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-wrap md:flex-nowrap">
            {/* Form Fields */}
            <div className="w-full md:w-2/3 p-4 space-y-6">
                <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Checkout</h1>

                {/* Name and Phone */}
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

                {/* Address */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-800">Address</label>
                    <input
                        type="text"
                        {...register('address', { required: true })}
                        className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                        placeholder='Your Full Address'
                    />
                </div>

                {/* Payment and Shipping */}
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

                {/* Place Order Button */}
                <Button type="submit" disabled={loading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200">
                    {loading ? 'Processing...' : 'Place Order'}
                </Button>
            </div>

            {/* Order Summary & Coupon Section */}
            <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg shadow-inner space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Order Summary</h2>

                {items.map((item) => (
                    <div key={item.id} className="flex items-center mb-4">
                        <Image height={100} width={100} src={item.images[0].url} alt={item.name} className="w-16 h-16 rounded-lg mr-4 object-cover" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name} ({item?.selectedSize?.value || ""}) x {item.quantity} </p>
                            <Currency value={item.offer > 0 ? item.price * (1 - item.offer / 100) : item.price} />
                        </div>
                    </div>
                ))}

                {/* Coupon Section (Moved to Order Summary) */}
                <div className="mb-4">
                    <label className="block mb-2 font-medium text-gray-800">Coupon Code</label>
                    <div className="flex">
                        {showCouponInput ? (
                            <>
                                <input
                                    type="text"
                                    {...register('couponCode')}
                                    className="flex-1 p-3 border rounded-lg focus:ring focus:ring-blue-300"
                                    placeholder="Enter Coupon Code"
                                />
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const code = getValues('couponCode');
                                        if (code) validateCoupon(code);
                                    }}
                                    className="ml-2 bg-green-500 text-white rounded-lg py-3 px-4 transition duration-200 hover:bg-green-600"
                                >
                                    {couponLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        'Apply'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleCouponClick}
                                className="bg-blue-500 text-white rounded-lg py-3 px-4 transition duration-200 hover:bg-blue-600"
                            >
                                Add Coupon
                            </Button>
                        )}
                    </div>
                </div>

                {/* Summary Costs */}
                <div className="flex justify-between font-medium text-gray-800">
                    <span>Shipping Cost</span>
                    <Currency value={shippingCost} />
                </div>
                <div className={`flex justify-between font-medium ${discount > 0 ? 'text-green-500' : 'text-gray-800'}`}>
                    <span>Discount</span>
                    <Currency value={discount} />
                </div>
                <div className="flex justify-between font-bold text-gray-800">
                    <span>Total</span>
                    <Currency value={calculateTotalPrice()} />
                </div>
            </div>
        </form>
    );
};

export default CheckOutMainPage;
