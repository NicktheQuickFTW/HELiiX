"use client";

import { Dropdown, Option, Button } from "@once-ui-system/core";
import { forwardRef, createContext, useContext, useState } from "react";

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, open, onOpenChange, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open ?? internalOpen;
    
    const handleOpenChange = (newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    return (
      <DropdownMenuContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ children, onClick, ...props }, ref) => {
  const context = useContext(DropdownMenuContext);
  
  return (
    <Button
      ref={ref}
      onClick={(e) => {
        context?.setOpen(!context.open);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Button>
  );
});

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const context = useContext(DropdownMenuContext);
  
  if (!context?.open) {
    return null;
  }

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef<
  React.ElementRef<typeof Option>,
  React.ComponentProps<typeof Option>
>(({ children, ...props }, ref) => {
  return (
    <Option ref={ref} {...props}>
      {children}
    </Option>
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return <div ref={ref} {...props} />;
});

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};