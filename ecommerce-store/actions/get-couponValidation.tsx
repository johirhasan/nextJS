import { Coupon } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/coupons`;

const getCoupons = async (code: string): Promise<Coupon | null> => {
    try {
        const res = await fetch(`${URL}/${code}`);
        console.log({code, res});

        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(`Error ${res.status}: ${errorMessage}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Failed to fetch coupons:', error);
        return null; 
    }
}

export default getCoupons;
