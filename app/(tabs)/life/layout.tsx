import { Metadata } from "next";

export const metadata: Metadata = {
    title: "동네생활",
    description: "동네생활 게시판입니다.",
};
export default function LifeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-900">
            <div className="max-w-screen-md mx-auto">
                {children}
            </div>
        </div>
    );
} 