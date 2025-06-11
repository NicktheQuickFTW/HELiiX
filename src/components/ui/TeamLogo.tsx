"use client";

import { Logo } from "@once-ui-system/core";
import { forwardRef } from "react";

export interface TeamLogoProps extends React.ComponentProps<typeof Logo> {
  team?: string;
  variant?: "light" | "dark";
}

const TeamLogo = forwardRef<
  React.ElementRef<typeof Logo>,
  TeamLogoProps
>(({ team, variant = "light", ...props }, ref) => {
  const getTeamLogo = (teamName?: string) => {
    if (!teamName) return "/assets/logos/teams/big12.svg";
    
    const teamSlug = teamName.toLowerCase().replace(/\s+/g, "_");
    const basePath = variant === "dark" ? "/assets/logos/teams/dark" : "/assets/logos/teams/light";
    return `${basePath}/${teamSlug}-${variant}.svg`;
  };

  return (
    <Logo 
      ref={ref} 
      icon={getTeamLogo(team)}
      {...props}
    />
  );
});

TeamLogo.displayName = "TeamLogo";

export { TeamLogo };