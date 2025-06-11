"use client";

import { Card } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface DivineCardProps extends React.ComponentProps<typeof Card> {}

const DivineCard = forwardRef<
  React.ElementRef<typeof Card>,
  DivineCardProps
>(({ children, ...props }, ref) => {
  return (
    <Card ref={ref} {...props}>
      {children}
    </Card>
  );
});

DivineCard.displayName = "DivineCard";

export { DivineCard };