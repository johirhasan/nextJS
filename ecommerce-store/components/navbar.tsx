import Link from "next/link";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import getSiteInfos from "@/actions/get-siteSetting";
import Image from "next/image";

export const revalidate = 0;

const Navbar = async () => {
  const [categories, siteSetting] = await Promise.all([
    getCategories(),
    getSiteInfos(),
  ]);
  const logo = siteSetting[0].logoUrl;

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <Image
              src={logo}
              alt="Logo"
              height={220} // Increased for larger size
              width={220}  // Increased for larger size
              className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain" // Increased sizes for all screen sizes
            />
          </Link>
          <MainNav data={categories} />
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
