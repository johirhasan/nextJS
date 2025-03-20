"use client";

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { AvatarImage, Review } from '@/types';
import Image from 'next/image';

interface ReviewFormProps {
  onSubmit: (review: Review) => void;
  avatars: AvatarImage[];
}

interface ReviewProps {
    initialReviews: Review[];
    avatar: AvatarImage[];
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, avatars }) => {
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [phone, setPhone] = useState('');
  // const [avatar, setAvatar] = useState(avatars[0]);
  const [avatar, setAvatar] = useState(avatars?.length ? avatars[0] : '');
  const [loading, setLoading] = useState(false);

  const params = useParams();

  const handleStarClick = (ratingValue: number) => {
    setRating(ratingValue);
  };

  const isValidBangladeshiNumber = (phone: string) => {
    const bangladeshPhoneRegex = /^(01[3-9]\d{8})$/;
    return bangladeshPhoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment || rating === 0 || !phone) {
      toast.error('Please fill in all fields and select a rating.');
      return;
    }
  
    if (!isValidBangladeshiNumber(phone)) {
      toast.error('Please enter a valid Bangladeshi phone number.');
      return;
    }
  
    const newReview: Review = {
        author, comment, rating, phone, avatar:avatar.url,
        data: [],
        id: '',
        productId: '',
        product: []
    };
    setLoading(true);

    console.log({newReview})
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${params.productId}`, newReview);
  
        if (response.status === 201 || response.status === 200) {
            onSubmit(newReview);
            setAuthor('');
            setComment('');
            setRating(0);
            setPhone('');
            setAvatar(avatars[0]);
            toast.success('Review submitted successfully!');
        } else {
            toast.error('Failed to submit review. Please try again.');
        }
    } catch (error) {
        if (error?.response?.status === 403) {
            toast.error('No valid orders found for this phone number.');
        } else {
            toast.error('An error occurred while submitting the review.');
        }
        console.error(error);
    } finally {
        setLoading(false);
    }

};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex items-center mt-2 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-3xl transition-colors duration-200 ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              onClick={() => handleStarClick(star)}
              title={`${star} Star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm hover:border-green-400"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={`mt-2 px-4 py-2 border ${
            isValidBangladeshiNumber(phone) ? 'border-gray-300' : 'border-red-500'
          } rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm hover:border-green-400`}
          placeholder="Phone number used for purchase"
        />
        {!isValidBangladeshiNumber(phone) && phone && (
          <span className="text-red-500 text-sm mt-1">Invalid Bangladeshi phone number.</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm hover:border-green-400"
          placeholder="Write your review here"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Choose Avatar</label>
        <div className="mt-2 flex space-x-4">
          {avatars?.length > 0 && avatars?.map((av, index) => (
            <img
              key={index}
              src={av.url}
              alt={av?.description || ""}
              className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                avatar === av ? 'border-green-500' : 'border-transparent'
              }`}
              onClick={() => setAvatar(av)}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
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
          'Submit Review'
        )}
      </button>
    </form>
  );
};

interface ReviewListProps {
  reviews: Review[];
}

const REVIEWS_PER_PAGE = 3; 

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="mt-4 space-y-4">
      {reviews.length === 0 ? (
        <p className="mt-2 text-gray-600">No reviews yet.</p>
      ) : (
        paginatedReviews.map((review, index) => (
          <div key={index} className="border-t border-gray-200 pt-4 flex items-start space-x-4">
            <img src={review.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-gray-800 font-medium">{review.author}</p>
              <div className="mt-1 text-yellow-500">
                {Array(review.rating).fill('★').join('')} {Array(5 - review.rating).fill('☆').join('')}
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {reviews.length > REVIEWS_PER_PAGE && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            Previous
          </button>
          <p className="text-gray-700">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};



export default function Reviews({initialReviews, avatar}: ReviewProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const addReview = (review: Review) => {
    setReviews([...reviews, review]);
  };

  return (
    <div className="p-4">
      <ReviewForm onSubmit={addReview} avatars={avatar} />
      <ReviewList reviews={reviews} />
    </div>
  );
}
