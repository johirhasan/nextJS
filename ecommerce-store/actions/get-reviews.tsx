import { Review } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/reviews`;

const getReviews = async (id: string): Promise<Review> => {
    const res = await fetch(`${URL}/${id}`);
    return res.json();
}

export default getReviews;