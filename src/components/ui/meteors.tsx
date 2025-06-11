"use client";

import { Column } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface MeteorsProps extends React.HTMLAttributes<HTMLDivElement> {
  number?: number;
}

const Meteors = forwardRef<HTMLDivElement, MeteorsProps>(
  ({ children, number = 20, ...props }, ref) => {
    return (
      <Column ref={ref} {...props}>
        {children}
      </Column>
    );
  }
);

Meteors.displayName = "Meteors";

export { Meteors };