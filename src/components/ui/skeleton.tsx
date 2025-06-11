"use client";

import { Skeleton as OnceUISkeleton } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface SkeletonProps extends React.ComponentProps<typeof OnceUISkeleton> {}

const Skeleton = forwardRef<
  React.ElementRef<typeof OnceUISkeleton>,
  SkeletonProps
>(({ ...props }, ref) => {
  return (
    <OnceUISkeleton ref={ref} {...props} />
  );
});

Skeleton.displayName = "Skeleton";

export { Skeleton };