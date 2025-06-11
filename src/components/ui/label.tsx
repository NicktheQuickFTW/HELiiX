"use client";

import { Text } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface LabelProps extends React.ComponentProps<typeof Text> {}

const Label = forwardRef<
  React.ElementRef<typeof Text>,
  LabelProps
>(({ children, ...props }, ref) => {
  return (
    <Text 
      ref={ref} 
      variant="label-default-s" 
      weight="medium"
      {...props}
    >
      {children}
    </Text>
  );
});

Label.displayName = "Label";

export { Label };