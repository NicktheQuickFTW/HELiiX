"use client";

import { Card, Column, Row, Icon, Text, Heading } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface AlertProps extends React.ComponentProps<typeof Card> {
  variant?: "default" | "destructive";
}

const Alert = forwardRef<
  React.ElementRef<typeof Card>,
  AlertProps
>(({ children, variant = "default", ...props }, ref) => {
  return (
    <Card 
      ref={ref} 
      padding="m" 
      border={variant === "destructive" ? "red" : "neutral-alpha-medium"}
      background={variant === "destructive" ? "red-alpha-weak" : "neutral-alpha-weak"}
      {...props}
    >
      <Row gap="12" align="start">
        {children}
      </Row>
    </Card>
  );
});

Alert.displayName = "Alert";

const AlertTitle = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Heading ref={ref} variant="heading-strong-s" {...props}>
      {children}
    </Heading>
  );
});

AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Text ref={ref} variant="body-default-s" {...props}>
      {children}
    </Text>
  );
});

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };