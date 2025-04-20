import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  title: string;
  price: number;
  photo: string;
  createdAt: Date;
}

export default function ListProduct({
  id,
  title,
  price,
  photo,
  createdAt,
}: Product) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <Image
        className="size-28 rounded-md"
        src={`${photo}/public`}
        alt={title}
        width={500}
        height={500}
      />
      <div className="flex flex-col">
        <span className="text-lg">{title}</span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
        <span className="text-sm text-neutral-400">
          {formatToTimeAgo(createdAt.toString())}
        </span>
      </div>
    </Link>
  );
}
