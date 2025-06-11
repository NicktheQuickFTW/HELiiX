"use client";

import { Tabs as OnceUITabs, Column, Row, Button } from "@once-ui-system/core";
import { forwardRef, createContext, useContext, useState } from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ children, value, defaultValue, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const currentValue = value ?? internalValue;
    
    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <Column ref={ref} gap="16" {...props}>
          {children}
        </Column>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

const TabsList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return (
      <Row ref={ref} gap="4" {...props}>
        {children}
      </Row>
    );
  }
);

TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ComponentProps<typeof Button> {
  value: string;
}

const TabsTrigger = forwardRef<
  React.ElementRef<typeof Button>,
  TabsTriggerProps
>(({ children, value, ...props }, ref) => {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;

  return (
    <Button
      ref={ref}
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      onClick={() => context?.onValueChange(value)}
      {...props}
    >
      {children}
    </Button>
  );
});

TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    
    if (context?.value !== value) {
      return null;
    }

    return (
      <Column ref={ref} gap="16" {...props}>
        {children}
      </Column>
    );
  }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };