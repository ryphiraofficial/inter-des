import * as React from "react";

/**
 * Shadcn-style Input component using Tailwind v4 utilities
 */
export const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
    return (
        <input
            type={type}
            ref={ref}
            className={[
                "flex h-10 w-full rounded-md border border-gray-200",
                "bg-white px-3 py-2 text-sm text-gray-900",
                "placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:border-indigo-500",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-colors",
                className,
            ].join(" ")}
            {...props}
        />
    );
});

Input.displayName = "Input";
