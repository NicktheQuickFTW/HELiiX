"use client"

import { Card, Badge } from "@once-ui-system/core"
import { TeamLogo } from "@/components/ui/team-logo"

const big12Schools = [
  { name: "Arizona", location: "Tucson, AZ", status: "active" },
  { name: "Arizona State", location: "Tempe, AZ", status: "active" },
  { name: "Baylor", location: "Waco, TX", status: "active" },
  { name: "BYU", location: "Provo, UT", status: "active" },
  { name: "Cincinnati", location: "Cincinnati, OH", status: "active" },
  { name: "Colorado", location: "Boulder, CO", status: "active" },
  { name: "Houston", location: "Houston, TX", status: "active" },
  { name: "Iowa State", location: "Ames, IA", status: "active" },
  { name: "Kansas", location: "Lawrence, KS", status: "active" },
  { name: "Kansas State", location: "Manhattan, KS", status: "active" },
  { name: "Oklahoma State", location: "Stillwater, OK", status: "active" },
  { name: "TCU", location: "Fort Worth, TX", status: "active" },
  { name: "Texas Tech", location: "Lubbock, TX", status: "active" },
  { name: "UCF", location: "Orlando, FL", status: "active" },
  { name: "Utah", location: "Salt Lake City, UT", status: "active" },
  { name: "West Virginia", location: "Morgantown, WV", status: "active" },
]

export function Big12SchoolsGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Big 12 Conference Members
          <Badge variant="secondary">{big12Schools.length} Schools</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {big12Schools.map((school) => (
            <div
              key={school.name}
              className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
            >
              <div className="mb-2 group-hover:scale-105 transition-transform">
                <TeamLogo 
                  team={school.name} 
                  size="lg" 
                  className="mx-auto"
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{school.name}</p>
                <p className="text-xs text-muted-foreground">{school.location}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}