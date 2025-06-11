"use client";

import { Textarea as OnceUITextarea } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface TextareaProps extends React.ComponentProps<typeof OnceUITextarea> {}

const Textarea = forwardRef<
  React.ElementRef<typeof OnceUITextarea>,
  TextareaProps
>(({ ...props }, ref) => {
  return (
    <OnceUITextarea ref={ref} {...props} />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };