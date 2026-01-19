"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { th, enUS } from "date-fns/locale"
import "react-day-picker/style.css"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /** Language locale: "th" for Thai, "en" for English (default: "th") */
  lang?: "th" | "en"
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  lang = "th",
  ...props
}: CalendarProps) {
  const locale = lang === "th" ? th : enUS

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-4", className)}
      classNames={{
        months: "relative flex flex-col gap-4",
        month: "w-full",
        month_caption: "flex justify-center items-center h-9 mb-2",
        caption_label: "text-sm font-semibold text-gray-800",
        nav: "absolute top-0 left-0 right-0 flex items-center justify-between px-1",
        button_previous: cn(
          "h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600",
          "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200",
          "transition-all duration-200 cursor-pointer"
        ),
        button_next: cn(
          "h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600",
          "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200",
          "transition-all duration-200 cursor-pointer"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday: "text-gray-400 text-xs font-medium w-9 h-9 flex items-center justify-center",
        week: "flex w-full",
        day: "w-9 h-9 p-0 text-center text-sm",
        day_button: cn(
          "w-9 h-9 flex items-center justify-center rounded-lg font-normal cursor-pointer",
          "hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
        ),
        selected: cn(
          "bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-lg",
          "shadow-md shadow-indigo-500/25",
          "hover:from-indigo-600 hover:to-violet-700"
        ),
        today: "bg-indigo-100 text-indigo-700 font-semibold rounded-lg",
        outside: "text-gray-300 opacity-40",
        disabled: "text-gray-300 opacity-40 cursor-not-allowed",
        hidden: "invisible",
        range_start: "rounded-l-lg",
        range_end: "rounded-r-lg",
        range_middle: "bg-indigo-50 text-indigo-700 rounded-none",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
