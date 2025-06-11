"use client";

import { Badge as OnceUIBadge } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface BadgeProps extends React.ComponentProps<typeof OnceUIBadge> {}

const Badge = forwardRef<
  React.ElementRef<typeof OnceUIBadge>,
  BadgeProps
>(({ children, ...props }, ref) => {
  return (
    <OnceUIBadge ref={ref} {...props}>
      {children}
    </OnceUIBadge>
  );
});

Badge.displayName = "Badge";

export { Badge };