"use client";

import { Checkbox as OnceUICheckbox } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface CheckboxProps extends React.ComponentProps<typeof OnceUICheckbox> {}

const Checkbox = forwardRef<
  React.ElementRef<typeof OnceUICheckbox>,
  CheckboxProps
>(({ ...props }, ref) => {
  return (
    <OnceUICheckbox ref={ref} {...props} />
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };