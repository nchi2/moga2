import Image from "next/image";

interface ProductImageProps {
    photo: string;
    title: string;
}

export default function ProductImage({ photo, title }: ProductImageProps) {
    return (
        <div className="relative w-full aspect-square">
            <Image
                className="object-cover"
                fill
                src={`${photo}/public`}
                alt={title}
            />
        </div>
    );
} 