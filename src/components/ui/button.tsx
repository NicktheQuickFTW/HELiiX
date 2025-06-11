"use client";

import { Button as OnceUIButton } from "@once-ui-system/core";
import { forwardRef } from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

export interface ButtonProps extends React.ComponentProps<typeof OnceUIButton> {}

const Button = forwardRef<
  React.ElementRef<typeof OnceUIButton>,
  ButtonProps
>(({ children, className, variant = "primary", ...props }, ref) => {
  return (
    <OnceUIButton 
      ref={ref} 
      className={classNames(
        styles.button,
        styles[variant as keyof typeof styles] || styles.primary,
        className
      )}
      variant={variant}
      {...props}
    >
      {children}
    </OnceUIButton>
  );
});

Button.displayName = "Button";

export { Button };