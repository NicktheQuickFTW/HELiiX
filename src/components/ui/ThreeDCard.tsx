"use client";

import { Card } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface CardContainer3DProps extends React.ComponentProps<typeof Card> {}

const CardContainer3D = forwardRef<
  React.ElementRef<typeof Card>,
  CardContainer3DProps
>(({ children, ...props }, ref) => {
  return (
    <Card ref={ref} {...props}>
      {children}
    </Card>
  );
});

CardContainer3D.displayName = "CardContainer3D";

const CardBody3D = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

CardBody3D.displayName = "CardBody3D";

const CardItem3D = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

CardItem3D.displayName = "CardItem3D";

export { 
  CardContainer3D, 
  CardContainer3D as CardContainer,
  CardBody3D, 
  CardBody3D as CardBody,
  CardItem3D, 
  CardItem3D as CardItem 
};