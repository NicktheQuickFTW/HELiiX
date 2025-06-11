"use client";

import { ToggleButton } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface SwitchProps extends React.ComponentProps<typeof ToggleButton> {}

const Switch = forwardRef<
  React.ElementRef<typeof ToggleButton>,
  SwitchProps
>(({ ...props }, ref) => {
  return (
    <ToggleButton ref={ref} {...props} />
  );
});

Switch.displayName = "Switch";

export { Switch };