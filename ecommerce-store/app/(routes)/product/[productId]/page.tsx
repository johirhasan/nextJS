import getAvatarImages from "@/actions/get-avatarImage";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import getReviews from "@/actions/get-reviews";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductDescription from "@/components/product-description";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

interface ProductPagesProps {
    params: {
        productId: string;
    }
}

// const ProductPage: React.FC<ProductPagesProps> = async ({
//     params
// }) => {
//     const product = await getProduct(params.productId);

//     const [suggestedProducts, review, avatar] = await Promise.all([
//         getProducts({ categoryId: product?.category?.id }),
//         getReviews(params.productId),
//         getAvatarImages()
//     ])
//     console.error("HELLO IM HERE")
//     console.log({product,suggestedProducts,review,avatar})
    
//     return (
//         <div className="bg-white">
//             <Container>
//                 <div className="px-4 py-10 sm:px-6 lg:px-8">
//                     <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
//                         <Gallery images={product.images} />
//                         <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
//                             <Info data={product} />
//                         </div>
//                     </div>
//                     {/* <hr className="my-6" /> */}
//                     <ProductDescription
//                         description={product.description}
//                         reviews={review.data}
//                         avatar={avatar}
//                     />
//                     <hr className="my-6" />
//                     <ProductList title="Related Items" items={suggestedProducts} />
//                 </div>
//             </Container>
//         </div>
//     );
// }

const ProductPage: React.FC<ProductPagesProps> = async ({
    params
}) => {
    let product:any;
    
    try {
        product = await getProduct(params.productId);
        
        if (!product) {
            throw new Error("Product not found");
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        // Optionally, you can return an error message or redirect
        return <div>Error: {error.message}</div>;
    }

    const [suggestedProducts, review, avatar] = await Promise.all([
        getProducts({ categoryId: product.category.id }),
        getReviews(params.productId),
        getAvatarImages()
    ]);

    // console.log({ product, suggestedProducts, review, avatar });
    console.log("Product",JSON.stringify(product,null,2));

    return (
        <div className="bg-white">
            <Container>
                <div className="px-4 py-10 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        <Gallery images={product.images} />
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <Info data={product} />
                        </div>
                    </div>
                    <ProductDescription
                        description={product.description}
                        reviews={review.data}
                        avatar={avatar}
                    />
                    <hr className="my-6" />
                    <ProductList title="Related Items" items={suggestedProducts} />
                </div>
            </Container>
        </div>
    );
}

 
export default ProductPage;