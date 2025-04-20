import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";

export const metadata = {
  title: "Home",
};

const getCachedProduct = nextCache(getInitialProducts, ["product-list"], {
  tags: ["product-list", "xxxx"],
});

async function getInitialProducts() {
  console.log("hit!!!!!");
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      createdAt: true,
      photo: true,
      id: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export const dynamic = "auto";
// export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCachedProduct();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <Link
        href="/home/add"
        className="bg-blue-500 text-white flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 transition-colors hover:bg-pink-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
