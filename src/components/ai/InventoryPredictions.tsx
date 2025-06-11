'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@once-ui-system/core'
import { TrendingUp, TrendingDown, Minus, Brain } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'

interface InventoryPredictionsProps {
  currentInventory: any[]
  historicalData?: any[]
}

export function InventoryPredictions({ currentInventory, historicalData }: InventoryPredictionsProps) {
  const [predictions, setPredictions] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generatePredictions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/predict-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentInventory, historicalData })
      })

      const data = await response.json()
      setPredictions(data)
      
      toast.success('Predictions generated', {
        description: `Analyzed ${data.predictions?.length || 0} items`
      })
    } catch (error) {
      toast.error('Failed to generate predictions')
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Predictions</h2>
        <Button onClick={generatePredictions} disabled={loading}>
          <Brain className="h-4 w-4 mr-2" />
          {loading ? 'Analyzing...' : 'Generate Predictions'}
        </Button>
      </div>

      {predictions && (
        <>
          {/* Insights */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Key Insights</h3>
            <ul className="space-y-2">
              {predictions.insights?.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Seasonal Trends */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Seasonal Trends</h3>
            <div className="space-y-2">
              {predictions.seasonalTrends?.map((trend: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{trend.period}</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trend.trend)}
                    <span className="text-sm font-medium">
                      {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Predictions Table */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Award Predictions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Award</th>
                    <th className="text-right py-2">Current</th>
                    <th className="text-right py-2">Next Week</th>
                    <th className="text-right py-2">Next Month</th>
                    <th className="text-right py-2">Reorder</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.predictions?.map((pred: any) => (
                    <tr key={pred.awardId} className="border-b">
                      <td className="py-2">{pred.awardName}</td>
                      <td className="text-right">{pred.currentStock}</td>
                      <td className="text-right">{pred.predictedDemand.nextWeek}</td>
                      <td className="text-right">{pred.predictedDemand.nextMonth}</td>
                      <td className="text-right">
                        {pred.currentStock <= pred.reorderPoint && (
                          <span className="text-red-500 font-medium">
                            Order {pred.recommendedOrderQuantity}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}