import Link from "next/link";

export default function SocialLogin() {
    return (
        <>
            <div className="w-full h-px bg-neutral-500"></div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center">
                    <Link href={"/kakao/start"} className="primary-btn flex items-center justify-center gap-3 bg-[#FEE500] text-black hover:bg-[#FDD835]">
                        <svg
                            className="size-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 4C6.477 4 2 7.477 2 12C2 14.991 3.657 17.128 6 18.326V22L9.5 20C10.043 20.05 10.517 20.05 11 20C15.523 20 20 16.523 20 12C20 7.477 15.523 4 12 4Z"
                                fill="currentColor"
                            />
                        </svg>
                        <span>Continue with Kakao</span>
                    </Link>
                </div>
                <div className="flex items-center justify-center">
                    <Link href={"/github/start"} className="primary-btn flex items-center justify-center gap-3 bg-[#24292F] text-white hover:bg-[#1B1F23]">
                        <svg
                            className="size-6"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        <span>Continue with GitHub</span>
                    </Link>
                </div>
                {/* <div className="flex items-center justify-center">
                    <Link href={"/sms"} className="primary-btn flex items-center justify-center gap-3">
                        <span><ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" /></span>
                        <span>Contunue with SMS</span>
                    </Link>
                </div> */}
            </div>
        </>
    )
}