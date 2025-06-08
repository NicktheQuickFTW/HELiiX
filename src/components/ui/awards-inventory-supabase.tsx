"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Upload, Eye, Edit2, Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSupabaseUpload } from "@/lib/hooks/use-supabase-upload"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { AutoCategorize } from "@/components/ai/auto-categorize"

interface Award {
  id: number
  name: string
  description?: string | null
  status: 'planned' | 'ordered' | 'approved' | 'delivered' | 'received'
  quantity: number
  imageUrl?: string | null
  category?: string
  tags?: string[]
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

export function AwardsInventorySupabase() {
  const [awards, setAwards] = useState<Award[]>([])
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAward, setEditingAward] = useState<Award | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planned" as Award['status'],
    quantity: 0,
    imageUrl: "",
    category: "",
    tags: [] as string[]
  })

  const { startUpload, isUploading } = useSupabaseUpload({
    onUploadComplete: (results) => {
      if (results[0]) {
        setFormData(prev => ({ ...prev, imageUrl: results[0].url }))
      }
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`)
    }
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
      console.error('Failed to fetch awards:', error)
      toast.error('Failed to fetch awards')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
      } else {
        toast.error('Please select an image file')
      }
    }
  }

  const handleUpload = async () => {
    if (selectedFile) {
      await startUpload([selectedFile], 'heliix-awards')
    }
  }

  const handleSubmit = async () => {
    try {
      const method = editingAward ? 'PUT' : 'POST'
      const url = editingAward ? `/api/awards?id=${editingAward.id}` : '/api/awards'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchAwards()
        setIsAddDialogOpen(false)
        resetForm()
        toast.success(editingAward ? 'Award updated' : 'Award created', {
          description: editingAward 
            ? `${formData.name} has been updated successfully`
            : `${formData.name} has been added to inventory`,
          action: {
            label: "View",
            onClick: () => console.log("View award", formData),
          },
        })
      }
    } catch (error) {
      toast.error('Failed to save award', {
        description: 'Please check your connection and try again',
        action: {
          label: "Retry",
          onClick: () => handleSubmit(),
        },
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "planned",
      quantity: 0,
      imageUrl: "",
      category: "",
      tags: []
    })
    setEditingAward(null)
    setSelectedFile(null)
  }

  const handleEdit = (award: Award) => {
    setEditingAward(award)
    setFormData({
      name: award.name,
      description: award.description || "",
      status: award.status,
      quantity: award.quantity,
      imageUrl: award.imageUrl || "",
      category: award.category || "",
      tags: award.tags || []
    })
    setIsAddDialogOpen(true)
  }

  const filteredAwards = awards.filter(award =>
    award.name.toLowerCase().includes(search.toLowerCase()) ||
    award.description?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusCounts = () => {
    const counts: Record<Award['status'], number> = {
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

      <Separator className="my-6" />

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
              {formData.name && (
                <div className="grid gap-2">
                  <Label>AI Categorization</Label>
                  <AutoCategorize 
                    name={formData.name} 
                    description={formData.description}
                    onCategorize={(category, tags) => {
                      setFormData({ ...formData, category, tags })
                    }}
                  />
                </div>
              )}
              <Separator />
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
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    size="sm"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingAward ? 'Update' : 'Create'} Award
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="my-4" />

      <Input
        placeholder="Search awards..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
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
                  <img src={award.imageUrl} alt={award.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded" />
                )}
              </TableCell>
              <TableCell className="font-medium">{award.name}</TableCell>
              <TableCell>{award.description}</TableCell>
              <TableCell>
                {award.category ? (
                  <Badge variant="secondary">{award.category}</Badge>
                ) : '-'}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[award.status]}>
                  {award.status}
                </Badge>
              </TableCell>
              <TableCell>{award.quantity}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(award)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  {award.imageUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={award.imageUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}