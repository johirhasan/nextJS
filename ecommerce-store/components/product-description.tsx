'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import ReviewForm from './review-form';
import { Review,AvatarImage } from '@/types';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


interface ProductDescriptionProps {
    description: string; // This should be HTML or rich text format
    reviews: Review[];
    avatar: AvatarImage[];
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ description,reviews,avatar }) => {
    const [activeTab, setActiveTab] = useState('description');

    console.log({reviews,avatar});
    
    const renderContent = () => {
        switch (activeTab) {
            case 'description':
                return (
                    <div className="mt-4 text-gray-700 leading-relaxed">
                        <ReactQuill
                            value={description}
                            readOnly
                            theme="bubble" // Use 'bubble' or 'snow' theme, 'bubble' is more compact
                        />
                    </div>
                );
                case 'reviews':
                    return (
                        <div className="mt-4 space-y-4">
                            <ReviewForm initialReviews={reviews} avatar={avatar} /> {/* Include the ReviewForm component */}
                        </div>
                    );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 transition-transform transform">
            <div className="flex justify-around border-b mb-4">
                <button
                    className={`py-2 px-4 focus:outline-none transition-colors duration-300 ${activeTab === 'description' ? 'border-b-2 border-green-500 text-green-500 font-semibold' : 'text-gray-600 hover:text-green-500'}`}
                    onClick={() => setActiveTab('description')}
                >
                    Description
                </button>
                <button
                    className={`py-2 px-4 focus:outline-none transition-colors duration-300 ${activeTab === 'reviews' ? 'border-b-2 border-green-500 text-green-500 font-semibold' : 'text-gray-600 hover:text-green-500'}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews
                </button>
            </div>
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default ProductDescription;
