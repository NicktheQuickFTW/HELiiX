"use client";

import { Card as OnceUICard, Column, Heading, Text } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface CardProps extends React.ComponentProps<typeof OnceUICard> {}

const Card = forwardRef<
  React.ElementRef<typeof OnceUICard>,
  CardProps
>(({ children, ...props }, ref) => {
  return (
    <OnceUICard ref={ref} {...props}>
      {children}
    </OnceUICard>
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="4" paddingBottom="16" {...props}>
      {children}
    </Column>
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Heading ref={ref} variant="heading-strong-m" {...props}>
      {children}
    </Heading>
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Text ref={ref} variant="body-default-s" onBackground="neutral-weak" {...props}>
      {children}
    </Text>
  );
});

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="16" {...props}>
      {children}
    </Column>
  );
});

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };