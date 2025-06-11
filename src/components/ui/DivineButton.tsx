"use client";

import { Button } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface DivineButtonProps extends React.ComponentProps<typeof Button> {}

const DivineButton = forwardRef<
  React.ElementRef<typeof Button>,
  DivineButtonProps
>(({ children, ...props }, ref) => {
  return (
    <Button ref={ref} {...props}>
      {children}
    </Button>
  );
});

DivineButton.displayName = "DivineButton";

export { DivineButton };