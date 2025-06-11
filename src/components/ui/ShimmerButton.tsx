"use client";

import { Button } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface ShimmerButtonProps extends React.ComponentProps<typeof Button> {}

const ShimmerButton = forwardRef<
  React.ElementRef<typeof Button>,
  ShimmerButtonProps
>(({ children, ...props }, ref) => {
  return (
    <Button ref={ref} {...props}>
      {children}
    </Button>
  );
});

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };