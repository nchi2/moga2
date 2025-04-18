"use client";

export default function ViewDetailsButton({ id }: { id: string }) {

    return (
        <button
            onClick={() => {
                window.location.href = `/products/${id}`;
            }}
            className="bg-blue-500 text-white px-6  py-2 mt-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
            자세히 보기
        </button>
    );
} 