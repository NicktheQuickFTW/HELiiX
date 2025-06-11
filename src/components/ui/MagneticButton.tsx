"use client";

import { Button } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface MagneticButtonProps extends React.ComponentProps<typeof Button> {}

const MagneticButton = forwardRef<
  React.ElementRef<typeof Button>,
  MagneticButtonProps
>(({ children, ...props }, ref) => {
  return (
    <Button ref={ref} {...props}>
      {children}
    </Button>
  );
});

MagneticButton.displayName = "MagneticButton";

export { MagneticButton };