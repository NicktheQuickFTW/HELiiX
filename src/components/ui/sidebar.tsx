"use client";

import { Column, Row } from "@once-ui-system/core";
import { forwardRef, createContext, useContext, useState } from "react";

export * from "../navigation/AppSidebar";

interface SidebarContextType {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ children, defaultOpen = true, open, onOpenChange, ...props }, ref) => {
    const [openState, setOpenState] = useState(defaultOpen);
    const [openMobile, setOpenMobile] = useState(false);
    const currentOpen = open ?? openState;
    
    const handleOpenChange = (newOpen: boolean) => {
      if (open === undefined) {
        setOpenState(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    const toggleSidebar = () => {
      handleOpenChange(!currentOpen);
    };

    return (
      <SidebarContext.Provider
        value={{
          state: currentOpen ? "expanded" : "collapsed",
          open: currentOpen,
          setOpen: handleOpenChange,
          openMobile,
          setOpenMobile,
          isMobile: false,
          toggleSidebar,
        }}
      >
        <div ref={ref} {...props}>
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);

SidebarProvider.displayName = "SidebarProvider";

const SidebarInset = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return (
      <Column ref={ref} fillWidth fillHeight {...props}>
        {children}
      </Column>
    );
  }
);

SidebarInset.displayName = "SidebarInset";

export { SidebarProvider, SidebarInset };