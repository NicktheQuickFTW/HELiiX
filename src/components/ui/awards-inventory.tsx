"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface Award {
  id: string
  name: string
  status: string
  quantity: number
  image: string | null
}

export function AwardsInventory() {
  const [awards] = useState<Award[]>([])
  const [search, setSearch] = useState("")

  const filteredAwards = awards.filter(award =>
    award.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Awards Inventory</h2>
        <Button>Add Award</Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search awards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAwards.map((award) => (
            <TableRow key={award.id}>
              <TableCell>
                {award.image ? (
                  <img 
                    src={award.image} 
                    alt={award.name} 
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{award.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`bg-${award.status.toLowerCase()}-500/10 text-${award.status.toLowerCase()}-500`}>
                  {award.status}
                </Badge>
              </TableCell>
              <TableCell>{award.quantity}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
