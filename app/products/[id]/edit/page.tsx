import { getProduct } from "./action";
import EditProductForm from "./components/edit-product-form";
import { notFound } from "next/navigation";

export default async function EditProduct({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    try {
        const product = await getProduct(id);
        if (!product) {
            return notFound();
        }
        return <EditProductForm id={id} initialData={product} />;
    } catch (error) {
        console.error("Error fetching product:", error);
        return notFound();
    }
}