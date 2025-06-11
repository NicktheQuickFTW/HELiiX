"use client";

import { Avatar as OnceUIAvatar } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface AvatarProps extends React.ComponentProps<typeof OnceUIAvatar> {}

const Avatar = forwardRef<
  React.ElementRef<typeof OnceUIAvatar>,
  AvatarProps
>(({ ...props }, ref) => {
  return (
    <OnceUIAvatar ref={ref} {...props} />
  );
});

Avatar.displayName = "Avatar";

const AvatarImage = forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ ...props }, ref) => {
  return <img ref={ref} {...props} />;
});

AvatarImage.displayName = "AvatarImage";

const AvatarFallback = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
});

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };