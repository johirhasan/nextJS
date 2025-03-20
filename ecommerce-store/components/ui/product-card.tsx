"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "@/types";
import IconButton from "@/components/ui/icon-button";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Currency from "@/components/ui/currency";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";

interface ProductCardProps {
    data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const cart = useCart();
    const previewModal = usePreviewModal();
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            handleNextImage();
        }, 5000); // Automatically change image every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [currentImageIndex]);

    const handleClick = () => {
        router.push(`/product/${data?.id}`);
    };

    const onPreview = (event: React.MouseEvent) => {
        event.stopPropagation();
        previewModal.onOpen(data);
    };

    const onAddToCart = (event: React.MouseEvent) => {
        event.stopPropagation();
        cart.addItem(data);
    };

    const calculateDiscountPrice = () => {
        return data.price - (data.price * (data.offer / 100));
    };

    const hasOffer = data.offer > 0;
    const discountPrice = calculateDiscountPrice();

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? data.images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
            {/* Carousel container */}
            <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
                {/* Image rendering */}
                <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {data.images.map((image, index) => (
                        <div key={index} className="relative w-full h-64 flex-shrink-0">
                            <Image
                                src={image.url}
                                alt={`Image ${image.url}`}
                                layout="fill" // This ensures the image fills the container
                                objectFit="cover" // This will maintain the aspect ratio of the image
                                className="rounded-md" // Class for rounded corners
                            />
                        </div>
                    ))}
                </div>

                {/* Preview and Add to Cart Icons */}
                <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
                    <div className="flex gap-x-6 justify-center">
                        <IconButton
                            onClick={onPreview}
                            icon={<Expand size={20} className="text-gray-600" />}
                        />
                        <IconButton
                            onClick={handleClick}
                            icon={<ShoppingCart size={20} className="text-gray-600" />}
                        />
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-y-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold text-lg">{data.name}</p>
                        <p className="text-sm text-gray-500">{data.category?.name}</p>
                    </div>
                    {hasOffer && (
                        <div className="flex flex-col items-end">
                            <span className="text-red-500 text-xl font-semibold">{data.offer}% OFF</span>
                            <span className="line-through text-gray-500 text-lg">
                                <Currency value={data.price} />
                            </span>
                        </div>
                    )}
                </div>
                <div className="text-2xl font-bold">
                    {hasOffer ? (
                        <span className="text-green-600">
                            <Currency value={discountPrice} />
                        </span>
                    ) : (
                        <Currency value={data.price} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
