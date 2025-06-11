"use client";

import { Dropdown, Option } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface SelectProps extends React.ComponentProps<typeof Dropdown> {}

const Select = forwardRef<
  React.ElementRef<typeof Dropdown>,
  SelectProps
>(({ children, ...props }, ref) => {
  return (
    <Dropdown ref={ref} {...props}>
      {children}
    </Dropdown>
  );
});

Select.displayName = "Select";

const SelectContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

SelectContent.displayName = "SelectContent";

const SelectItem = forwardRef<
  React.ElementRef<typeof Option>,
  React.ComponentProps<typeof Option>
>(({ children, ...props }, ref) => {
  return (
    <Option ref={ref} {...props}>
      {children}
    </Option>
  );
});

SelectItem.displayName = "SelectItem";

const SelectTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

SelectTrigger.displayName = "SelectTrigger";

const SelectValue = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

SelectValue.displayName = "SelectValue";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };