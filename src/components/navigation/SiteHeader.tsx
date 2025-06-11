"use client";

import { Row, Column, Heading, Button, Logo } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface SiteHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const SiteHeader = forwardRef<HTMLDivElement, SiteHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <Row
        ref={ref}
        fillWidth
        paddingX="m"
        paddingY="s"
        border="neutral-alpha-weak"
        background="surface"
        align="center"
        justify="between"
        {...props}
      >
        {children}
      </Row>
    );
  }
);

SiteHeader.displayName = "SiteHeader";

const HeaderLogo = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { src?: string; href?: string }
>(({ src, href, children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {src ? (
        <Logo icon={src} href={href} size="s" />
      ) : (
        <Heading variant="heading-strong-l">{children}</Heading>
      )}
    </div>
  );
});

HeaderLogo.displayName = "HeaderLogo";

const HeaderNav = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Row ref={ref} gap="4" align="center" {...props}>
      {children}
    </Row>
  );
});

HeaderNav.displayName = "HeaderNav";

const HeaderActions = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <Row ref={ref} gap="8" align="center" {...props}>
      {children}
    </Row>
  );
});

HeaderActions.displayName = "HeaderActions";

export { SiteHeader, HeaderLogo, HeaderNav, HeaderActions };