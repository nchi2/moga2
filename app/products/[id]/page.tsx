import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";
import { getIsOwner } from "./action";
import { getCachedProduct, getCachedProductTitle } from "./queries";
import ProductHeader from "./components/ProductHeader";
import ProductImage from "./components/ProductImage";
import ProductUserInfo from "./components/ProductUserInfo";
import ProductDetails from "./components/ProductDetails";
import ProductActions from "./components/ProductActions";
import ProductOwnerActions from "./components/ProductOwnerActions";

export async function generateMetadata({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = await getCachedProductTitle(Number(id));
    return {
        title: product?.title,
        description: product?.description,
        openGraph: {
            images: [
                { url: product?.photo },
            ],
        },
    }
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
    const { id: paramId } = await params;
    const id = Number(paramId);
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getCachedProduct(id);
    if (!product) {
        return notFound();
    }
    const isOwner = await getIsOwner(product.userId);

    return (
        <Suspense fallback={<Loading />}>
            <div className="mx-auto max-w-screen-md flex flex-col gap-5 justify-center">
                <ProductHeader id={id} />
                <ProductImage photo={product.photo} title={product.title} />
                <ProductUserInfo username={product.user.username} avatar={product.user.avatar} />
                <ProductDetails title={product.title} description={product.description} />
                <ProductActions id={id} price={product.price} />
                {isOwner && <ProductOwnerActions id={id} />}
            </div>
        </Suspense>
    );
}
