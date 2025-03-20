import Container from "@/components/ui/container";
import CheckOutMainPage from "./components/check-out-MainPage";
import getSiteInfos from "@/actions/get-siteSetting";
import { SiteSettings } from "@/types"; 

interface CheckoutPagesProps {}

const Checkout: React.FC<CheckoutPagesProps> = async ({}) => {
    
    const siteSettings: SiteSettings[] = await getSiteInfos();

    const shippingOptions = siteSettings[0].shippingOptions;

    return (
        <div className="bg-white">
            <Container>
                <CheckOutMainPage shippingOptions = {shippingOptions} />
            </Container>
        </div>
    );
}
 
export default Checkout;