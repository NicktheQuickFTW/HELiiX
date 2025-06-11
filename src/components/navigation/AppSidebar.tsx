"use client";

import { Column, Row, Button, Text, Line } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sidebar" | "floating" | "inset";
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
}

const AppSidebar = forwardRef<HTMLDivElement, AppSidebarProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <Column
        ref={ref}
        fillHeight
        padding="m"
        background="surface"
        border="neutral-alpha-weak"
        gap="16"
        style={{ width: "240px", minWidth: "240px" }}
        className={className}
        {...props}
      >
        {children}
      </Column>
    );
  }
);

AppSidebar.displayName = "AppSidebar";

const SidebarContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="8" fillWidth {...props}>
      {children}
    </Column>
  );
});

SidebarContent.displayName = "SidebarContent";

const SidebarGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="4" {...props}>
      {children}
    </Column>
  );
});

SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Text ref={ref} variant="label-default-xs" onBackground="neutral-weak" {...props}>
      {children}
    </Text>
  );
});

SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarMenu = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="2" {...props}>
      {children}
    </Column>
  );
});

SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      justify="start"
      fillWidth
      {...props}
    >
      {children}
    </Button>
  );
});

SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="8" paddingBottom="16" {...props}>
      {children}
      <Line background="neutral-alpha-weak" />
    </Column>
  );
});

SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Column ref={ref} gap="8" paddingTop="16" {...props}>
      <Line background="neutral-alpha-weak" />
      {children}
    </Column>
  );
});

SidebarFooter.displayName = "SidebarFooter";

export {
  AppSidebar,
  AppSidebar as Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
};