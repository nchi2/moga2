import { formatToWon } from "@/lib/utils";
import { createChatRoom } from "../action";
import { redirect } from "next/navigation";

interface ProductActionsProps {
    id: number;
    price: number;
}

export default function ProductActions({ id, price }: ProductActionsProps) {
    return (
        <div className="flex justify-between items-center p-5">
            <span className="font-semibold text-xl">
                price : {formatToWon(price)}원
            </span>
            <form action={async () => {
                "use server";
                const result = await createChatRoom(id.toString());
                if ("error" in result) {
                    return;
                }
                redirect(`/chat/${result.roomId}`);
            }}>
                <button type="submit" className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
                    채팅하기
                </button>
            </form>
        </div>
    );
} 