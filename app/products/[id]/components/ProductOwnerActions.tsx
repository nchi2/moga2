import Link from "next/link";
import { deleteProduct } from "../action";

interface ProductOwnerActionsProps {
    id: number;
}

export default function ProductOwnerActions({ id }: ProductOwnerActionsProps) {
    return (
        <form action={async () => {
            "use server";
            await deleteProduct(id);
        }}>
            <div className="flex flex-col gap-2 justify-center items-center p-5">
                <p className="text-neutral-400">* if you are the owner, you can delete the product.</p>
                <div className="flex gap-2">
                    <Link href={`/products/${id}/edit`} className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold">
                        Edit product
                    </Link>
                    <button type="submit" className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                        Delete product
                    </button>
                </div>
            </div>
        </form>
    );
} 