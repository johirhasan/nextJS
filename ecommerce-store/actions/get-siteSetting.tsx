import { SiteSettings } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/siteSetting`;

const getSiteInfos = async (): Promise<SiteSettings> => {
    const res = await fetch(`${URL}`);

    return res.json();
}

export default getSiteInfos;