import { ReactNode } from "react";

interface ProductLayoutProps {
    children: ReactNode;
}

export default function ProductLayout({ children }: ProductLayoutProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {children}
        </div>
    );
} 