import Image from "next/image";
import { toast } from "react-hot-toast";
import { X, Minus, Plus } from "lucide-react";
import { useRouter } from 'next/navigation'
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { useEffect, useState } from "react";

interface CartItemProps {
    data: Product;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();
    const [selectedSize, setSelectedSize] = useState(data.selectedSize || null);
    const [refresh,setRefresh] = useState(false);
    const router = useRouter();

    const calculateDiscountPrice = () => {
        return data.price - (data.price * (data.offer / 100));
    };

    useEffect(() => {      
    }, [refresh])
    

    const onRemove = () => {
        cart.removeItem(data.id, selectedSize); // Pass selectedSize to removeItem
        window.location.reload();
        // router.refresh();
        setRefresh(!refresh);
    };

    const onAddQuantity = () => {
        if (!selectedSize) {
            toast.error("Please select a size.");
            return;
        }
        if (data.stock > cart.getItemQuantity(data.id, selectedSize)) { // Pass selectedSize to getItemQuantity
            cart.addItem(data, selectedSize); // Pass selectedSize to addItem
        } else {
            toast.error("Not enough stock available.");
        }
    };

    const onReduceQuantity = () => {
        if (!selectedSize) {
            toast.error("Please select a size.");
            return;
        }
        cart.reduceItem(data.id, selectedSize); // Pass selectedSize to reduceItem
    };

    const hasOffer = data.offer > 0;
    const discountPrice = calculateDiscountPrice();

    // console.log({ data, selectedSize });
    console.log({hasOffer,discountPrice,data,selectedSize})

    return (
        <li className="flex py-6 border-b border-gray-300">
            <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
                <Image
                    fill
                    src={data.images[0].url}
                    alt={data.name}
                    className="object-cover object-center"
                />
            </div>
            <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="absolute z-10 right-0 top-0">
                    <IconButton onClick={onRemove} icon={<X size={15} />} />
                </div>
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold text-black">
                                    {data.name}
                                </p>
                                <div className="flex ml-2 gap-2">
                                    {data?.colors?.map((color) => (
                                        <div
                                            key={color.color.id}
                                            className="h-6 w-6 rounded-full border border-gray-600"
                                            style={{ backgroundColor: color.color.value }}
                                            title={color.color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2">
                                {hasOffer ? (
                                    <>
                                        <span className="text-xl font-semibold text-green-600">
                                            <Currency value={discountPrice} />
                                        </span>
                                        <span className="line-through text-gray-500 text-sm">
                                            <Currency value={data.price} />
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl font-semibold text-black">
                                        <Currency value={data.price} />
                                    </span>
                                )}
                            </div>
                            <div className="mt-1 flex items-center text-sm">
                                <p className="text-gray-500">
                                    <span className="font-semibold">Size:</span> {selectedSize ? `${selectedSize.name} (${selectedSize.value})` : 'Not selected'}
                                </p>
                            </div>
                            {!selectedSize && (
                                <div className="mt-2 text-red-500 text-sm">
                                    Please choose a size.
                                </div>
                            )}
                        </div>
                        <div className="flex items-center mt-2">
                            <IconButton onClick={onReduceQuantity} icon={<Minus size={15} />} />
                            <span className="mx-2">{cart.getItemQuantity(data.id, selectedSize)}</span> {/* Pass selectedSize to getItemQuantity */}
                            <IconButton onClick={onAddQuantity} icon={<Plus size={15} />} />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
