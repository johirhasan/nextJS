import { BlockIps } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/block-ip`;

const getBlockIps = async (): Promise<BlockIps[]> => {
    const res = await fetch(URL);

    return res.json();
}

export default getBlockIps;