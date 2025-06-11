"use client";

import { Input as OnceUIInput } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface InputProps extends React.ComponentProps<typeof OnceUIInput> {}

const Input = forwardRef<
  React.ElementRef<typeof OnceUIInput>,
  InputProps
>(({ ...props }, ref) => {
  return (
    <OnceUIInput ref={ref} {...props} />
  );
});

Input.displayName = "Input";

export { Input };