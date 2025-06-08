import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const inventoryStats = [
  {
    title: "Planned",
    count: 0,
    percentage: 0,
    color: "blue",
  },
  {
    title: "Ordered",
    count: 0,
    percentage: 0,
    color: "orange",
  },
  {
    title: "Approved",
    count: 0,
    percentage: 0,
    color: "green",
  },
  {
    title: "Delivered",
    count: 0,
    percentage: 0,
    color: "purple",
  },
  {
    title: "Received",
    count: 0,
    percentage: 0,
    color: "pink",
  },
]

export function Dashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {inventoryStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <Badge variant="outline" className={`text-${stat.color}-500 border-${stat.color}-500`}>
              {stat.count}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.percentage}%</div>
            <Progress className={`mt-4 h-4`} value={stat.percentage} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
