"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Edit2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UploadButton } from "@/lib/uploadthing"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface Award {
  id: number
  name: string
  description?: string | null
  status: 'planned' | 'ordered' | 'approved' | 'delivered' | 'received'
  quantity: number
  imageUrl?: string | null
  createdAt: string
  updatedAt: string
}

const statusColors = {
  planned: "bg-gray-500/10 text-gray-500",
  ordered: "bg-blue-500/10 text-blue-500",
  approved: "bg-purple-500/10 text-purple-500",
  delivered: "bg-orange-500/10 text-orange-500",
  received: "bg-green-500/10 text-green-500"
}

export function AwardsInventoryEnhanced() {
  const [awards, setAwards] = useState<Award[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAward, setEditingAward] = useState<Award | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planned" as Award['status'],
    quantity: 0,
    imageUrl: ""
  })

  useEffect(() => {
    fetchAwards()
  }, [])

  const fetchAwards = async () => {
    try {
      const response = await fetch('/api/awards')
      const data = await response.json()
      setAwards(data)
    } catch (error) {
      console.error('Error fetching awards:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingAward ? '/api/awards' : '/api/awards'
      const method = editingAward ? 'PUT' : 'POST'
      const body = editingAward 
        ? { id: editingAward.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchAwards()
        setIsAddDialogOpen(false)
        setEditingAward(null)
        setFormData({
          name: "",
          description: "",
          status: "planned",
          quantity: 0,
          imageUrl: ""
        })
      }
    } catch (error) {
      console.error('Error saving award:', error)
    }
  }

  const filteredAwards = awards.filter(award =>
    award.name.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusCounts = () => {
    const counts = {
      planned: 0,
      ordered: 0,
      approved: 0,
      delivered: 0,
      received: 0
    }
    awards.forEach(award => {
      counts[award.status]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="p-4">
            <div className="text-sm text-gray-500 capitalize">{status}</div>
            <div className="text-2xl font-bold">{count}</div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Awards Inventory</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Award
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAward ? 'Edit' : 'Add'} Award</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value as Award['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <UploadButton<OurFileRouter>
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setFormData({...formData, imageUrl: res[0].url})
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`)
                  }}
                />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingAward ? 'Update' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAwards.map((award) => (
            <TableRow key={award.id}>
              <TableCell>
                {award.imageUrl ? (
                  <img 
                    src={award.imageUrl} 
                    alt={award.name} 
                    className="w-12 h-12 object-cover rounded cursor-pointer"
                    onClick={() => window.open(award.imageUrl!, '_blank')}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    No Image
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{award.name}</TableCell>
              <TableCell className="text-sm text-gray-600">{award.description || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColors[award.status]}>
                  {award.status}
                </Badge>
              </TableCell>
              <TableCell>{award.quantity}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAward(award)
                    setFormData({
                      name: award.name,
                      description: award.description || "",
                      status: award.status,
                      quantity: award.quantity,
                      imageUrl: award.imageUrl || ""
                    })
                    setIsAddDialogOpen(true)
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}