import Link from "next/link";

export default function Home() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="my-auto flex flex-col items-center gap-2 *:font-medium ">
                <span className="text-10xl">🍋</span>
                <h3 className="text-1.5xl text-center">
                    감성 가득한 쇼핑몰,<br />
                    합리적인 가격에 만나보세요!
                </h3>
            </div>
            <div className="w-full flex flex-col items-center gap-3">
                <Link href="/create-account"
                    className="primary-btn text-lg bg-blue-500 hover:bg-pink-500 transition-colors duration-300">
                    시작하기
                </Link>
                <div className="flex gap-2">
                    <span>이미 계정이 있나요?</span>
                    <Link href="/login" className="hover:underline underline-offset-4;">LOGIN</Link>
                </div>
            </div>
        </div>
    )
}