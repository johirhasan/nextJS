import { AvatarImage } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/avatar`;

const getAvatarImages = async (): Promise<AvatarImage> => {
    const res = await fetch(`${URL}`);

    return res.json();
}

export default getAvatarImages;