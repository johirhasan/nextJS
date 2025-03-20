"use client";

import { useState } from "react";
import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import usePreviewModal from "@/hooks/use-preview-modal";
import { trackAddToCart } from "@/lib/facebookPixel";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<{ name: string, value: string } | null>(null);
  const [isBuyNowClicked, setIsBuyNowClicked] = useState(false); // New state to track button click
  const previewModal = usePreviewModal();

  const onAddToCart = () => {
    if (quantity > data.stock) {
      toast.error(`Only ${data.stock} items available.`);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
  
    for (let i = 0; i < quantity; i++) {
      cart.addItem(data, selectedSize);
    }

    // Tract the Add to Cart Event For FB
    trackAddToCart(data.id, data.name, Number(data.price));
    
    toast.success("Item(s) added to cart.");
  };

  const onBuyNow = () => {
    if (isBuyNowClicked) return; // Prevent multiple clicks

    if (quantity > data.stock) {
      toast.error(`Only ${data.stock} items available.`);
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    setIsBuyNowClicked(true); // Disable button after click

    for (let i = 0; i < quantity; i++) {
      cart.addItem(data, selectedSize);
    }
    router.push('/checkout');
    previewModal.onClose();
  };
  
  const incrementQuantity = () => {
    if (quantity < data.stock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    } else {
      toast.error(`Maximum stock reached.`);
    }
  }

  const decrementQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  }

  const calculateDiscountPrice = () => {
    return data.price - (data.price * (data.offer / 100));
  }

  const hasOffer = data.offer > 0;
  const discountPrice = calculateDiscountPrice();
  const discountPercentage = data.offer;
  const isOutOfStock = data.stock <= 0;
  const isLowStock = data.stock > 0 && data.stock < 10;

  console.log("Inside Info: ",{data});

  return (
    <div className="p-6 border rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      
      {isOutOfStock && (
        <p className="text-red-500 font-semibold mt-2">This item is currently out of stock.</p>
      )}
      {isLowStock && (
        <p className="text-orange-500 font-semibold mt-2">Hurry up! Only {data.stock} left in stock.</p>
      )}

      <div className="mt-3 flex items-end justify-between">
        <div>
          {hasOffer ? (
            <div className="flex flex-col">
              <span className="text-red-500 text-xl font-semibold">
                {discountPercentage}% OFF
              </span>
              <span className="line-through text-gray-500 text-lg">
                <Currency value={data.price} />
              </span>
              <span className="text-2xl text-green-600 font-bold">
                <Currency value={discountPrice} />
              </span>
              <span className="text-lg text-green-500">
                Save <Currency value={data.price - discountPrice} />
              </span>
            </div>
          ) : (
            <div className="text-2xl text-gray-900">
              <Currency value={data.price} />
            </div>
          )}
        </div>
      </div>
      <hr className="my-4" />
     
      <div className="mt-2 mb-1 text-blue-800 text-base font-medium bg-blue-100 p-3 rounded-lg shadow-sm flex items-center gap-2">
        Please choose a size to order.
      </div>
   

      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div className="flex gap-x-2">
            {data?.size?.map(sizes => (
              <div
                key={sizes.sizeId}
                className={`cursor-pointer p-2 border rounded-lg ${sizes.size.value === selectedSize?.value ? 'bg-blue-500 text-white' : 'bg-white'}`}
                title={sizes.size.name}
                onClick={() => setSelectedSize({ name: sizes.size.name, value: sizes.size.value })}
              >
                <span>{sizes.size.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-x-5">
          <h3 className="font-semibold text-black">Colors:</h3>
          <div className="flex gap-x-2">
            {data?.colors?.map(color => (
              <div
                key={color.colorId}
                className="h-6 w-6 rounded-full border border-gray-600 cursor-pointer"
                title={color.color.name}
                style={{ backgroundColor: color.color.value }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center gap-x-2">
          <Button onClick={decrementQuantity} className="flex items-center gap-x-2">
            -
          </Button>
          <span>{quantity}</span>
          <Button onClick={incrementQuantity} className="flex items-center gap-x-2">
            +
          </Button>
        </div>
      </div>
     
      <div className="mt-10 flex flex-col md:flex-row items-center gap-y-3 gap-x-3">
        <Button
          onClick={onAddToCart}
          disabled={isOutOfStock || !selectedSize}
          className={`w-full md:w-auto flex items-center justify-center gap-x-2 ${isOutOfStock ? "bg-gray-400 text-gray-600 cursor-not-allowed" : ""}`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          <ShoppingCart />
        </Button>
        <Button
          onClick={onBuyNow}
          disabled={isOutOfStock || !selectedSize || isBuyNowClicked}
          className={`w-full md:w-auto flex items-center justify-center gap-x-2 ${isOutOfStock || isBuyNowClicked ? "bg-gray-400 text-gray-600 cursor-not-allowed" : ""}`}
        >
          Buy Now
          <ShoppingBag />
        </Button>
      </div>


    </div>
  );
}

export default Info;
