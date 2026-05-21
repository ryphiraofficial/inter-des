import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Shadcn-style Calendar built on react-day-picker v9
 * Uses Tailwind v4 utility classes.
 */
export function Calendar({ className = "", classNames = {}, showOutsideDays = true, ...props }) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={`p-3 ${className}`}
            classNames={{
                months: "flex flex-col sm:flex-row gap-2",
                month: "flex flex-col gap-4",
                month_caption: "flex justify-center pt-1 relative items-center w-full",
                caption_label: "text-sm font-medium",
                nav: "flex items-center gap-1",
                button_previous: [
                    "absolute left-1 top-1",
                    "inline-flex items-center justify-center",
                    "h-7 w-7 rounded-md border border-gray-200 bg-transparent",
                    "p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 transition-opacity",
                ].join(" "),
                button_next: [
                    "absolute right-1 top-1",
                    "inline-flex items-center justify-center",
                    "h-7 w-7 rounded-md border border-gray-200 bg-transparent",
                    "p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 transition-opacity",
                ].join(" "),
                month_grid: "w-full border-collapse",
                weekdays: "flex",
                weekday: "text-gray-400 rounded-md w-8 font-normal text-[0.8rem] text-center",
                week: "flex w-full mt-2",
                day: [
                    "relative p-0 text-center text-sm",
                    "focus-within:relative focus-within:z-20",
                ].join(" "),
                day_button: [
                    "inline-flex items-center justify-center",
                    "h-8 w-8 rounded-md text-sm font-normal",
                    "hover:bg-indigo-100 hover:text-indigo-900",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
                    "transition-colors cursor-pointer",
                ].join(" "),
                selected: "[&>button]:bg-indigo-600 [&>button]:text-white [&>button]:hover:bg-indigo-700 [&>button]:hover:text-white",
                today: "[&>button]:font-bold [&>button]:text-indigo-600",
                outside: "[&>button]:text-gray-300 [&>button]:opacity-50",
                disabled: "[&>button]:text-gray-300 [&>button]:opacity-50 [&>button]:cursor-not-allowed",
                range_middle: "[&>button]:bg-indigo-100 [&>button]:rounded-none",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) =>
                    orientation === "left"
                        ? <ChevronLeft className="h-4 w-4" />
                        : <ChevronRight className="h-4 w-4" />,
            }}
            {...props}
        />
    );
}
