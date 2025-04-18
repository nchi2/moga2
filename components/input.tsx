import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
}

const _Input = (
    {
        name,
        errors = [],
        ...rest
    }: InputProps & InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
) => {
    return (
        <div className="flex flex-col gap-2">
            <input
                ref={ref}
                name={name}
                className="primary-input"
                {...rest} />
            {errors.map((error, index) =>
                <span key={index} className="text-red-500 font-medium">{error}</span>)}

        </div>
    )
}

export default forwardRef(_Input);