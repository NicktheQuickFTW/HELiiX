"use client";

import { DatePicker as OnceUIDatePicker } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface CalendarProps extends React.ComponentProps<typeof OnceUIDatePicker> {}

const Calendar = forwardRef<
  React.ElementRef<typeof OnceUIDatePicker>,
  CalendarProps
>(({ ...props }, ref) => {
  return (
    <OnceUIDatePicker ref={ref} {...props} />
  );
});

Calendar.displayName = "Calendar";

export { Calendar };