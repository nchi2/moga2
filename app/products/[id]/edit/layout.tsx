import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "제품 수정",
    description: "당신의 제품 정보를 수정하세요.",
};

export default async function EditProductLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    // params.id를 사용하기 전에 await를 사용하여 비동기적으로 처리
    const productId = params.id;

    return (
        <div className="min-h-screen bg-neutral-900">
            <div className="max-w-screen-md mx-auto">
                <div className="p-3 text-lg text-neutral-400 z-10 grid grid-cols-3 items-center">
                    <div className="flex justify-start">
                        <Link href={`/products/${productId}`} className="hover:text-white">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <span>제품 수정</span>
                    </div>
                    <div className="flex justify-end">
                        {/* 오른쪽 공간은 비워둠 */}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
} 