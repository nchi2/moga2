interface ProductDetailsProps {
    title: string;
    description: string;
}

export default function ProductDetails({ title, description }: ProductDetailsProps) {
    return (
        <div className="p-5 pb-10">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p>{description}</p>
        </div>
    );
} 