"use client";

import { Column } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {}

const BorderBeam = forwardRef<HTMLDivElement, BorderBeamProps>(
  ({ children, ...props }, ref) => {
    return (
      <Column ref={ref} {...props}>
        {children}
      </Column>
    );
  }
);

BorderBeam.displayName = "BorderBeam";

export { BorderBeam };