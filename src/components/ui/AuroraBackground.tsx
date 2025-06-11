"use client";

import { Background } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface AuroraBackgroundProps extends React.ComponentProps<typeof Background> {}

const AuroraBackground = forwardRef<
  React.ElementRef<typeof Background>,
  AuroraBackgroundProps
>(({ children, ...props }, ref) => {
  return (
    <Background ref={ref} {...props}>
      {children}
    </Background>
  );
});

AuroraBackground.displayName = "AuroraBackground";

export { AuroraBackground };