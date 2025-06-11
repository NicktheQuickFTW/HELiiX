"use client";

import { Line } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface SeparatorProps extends React.ComponentProps<typeof Line> {
  orientation?: "horizontal" | "vertical";
}

const Separator = forwardRef<
  React.ElementRef<typeof Line>,
  SeparatorProps
>(({ orientation = "horizontal", ...props }, ref) => {
  return (
    <Line 
      ref={ref} 
      vert={orientation === "vertical"}
      background="neutral-alpha-medium"
      {...props}
    />
  );
});

Separator.displayName = "Separator";

export { Separator };