import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface ProductHeaderProps {
    id: number;
}

export default function ProductHeader({ id }: ProductHeaderProps) {
    return (
        <div className="p-3 text-lg text-neutral-400 z-10 flex items-center gap-2">
            <Link href="/home" className="hover:text-white">
                <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <span>Product #{id}</span>
        </div>
    );
} 