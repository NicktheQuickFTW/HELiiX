'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trophy } from 'lucide-react';
import { toast } from 'sonner';

// Form validation schema
const addAwardSchema = z.object({
  name: z.string().min(1, 'Award name is required').max(100, 'Name too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description too long'),
  sport_id: z.string().min(1, 'Sport is required'),
  award_type: z.string().min(1, 'Award type is required'),
  season_year: z.number().min(2020).max(2030),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(1000),
  recipient_name: z.string().optional(),
  recipient_details: z.string().optional(),
  school_id: z.string().optional(),
  team_id: z.string().optional(),
  status: z.enum(['planned', 'approved', 'ordered', 'in_production', 'shipped', 'delivered', 'distributed', 'completed', 'cancelled']),
});

type AddAwardFormData = z.infer<typeof addAwardSchema>;

// Sports list for Big 12
const sports = [
  { value: '1', label: 'Football', code: 'FB' },
  { value: '2', label: "Men's Basketball", code: 'BB-M' },
  { value: '3', label: "Women's Basketball", code: 'BB-W' },
  { value: '4', label: 'Baseball', code: 'HB' },
  { value: '5', label: 'Softball', code: 'SB' },
  { value: '6', label: "Men's Tennis", code: 'TN-M' },
  { value: '7', label: "Women's Tennis", code: 'TN-W' },
  { value: '8', label: "Men's Golf", code: 'GF-M' },
  { value: '9', label: "Women's Golf", code: 'GF-W' },
  { value: '10', label: "Men's Track & Field", code: 'TF-M' },
  { value: '11', label: "Women's Track & Field", code: 'TF-W' },
  { value: '12', label: "Men's Cross Country", code: 'CC-M' },
  { value: '13', label: "Women's Cross Country", code: 'CC-W' },
  { value: '14', label: 'Volleyball', code: 'VB' },
  { value: '15', label: 'Soccer', code: 'SC' },
  { value: '16', label: 'Wrestling', code: 'WW' },
  { value: '17', label: 'Gymnastics', code: 'GY' },
];

// Big 12 Schools
const schools = [
  { value: '1', label: 'Arizona', code: 'ARIZ' },
  { value: '2', label: 'Arizona State', code: 'ASU' },
  { value: '3', label: 'Baylor', code: 'BAY' },
  { value: '4', label: 'BYU', code: 'BYU' },
  { value: '5', label: 'Cincinnati', code: 'CIN' },
  { value: '6', label: 'Colorado', code: 'COL' },
  { value: '7', label: 'Houston', code: 'HOU' },
  { value: '8', label: 'Iowa State', code: 'ISU' },
  { value: '9', label: 'Kansas', code: 'KU' },
  { value: '10', label: 'Kansas State', code: 'KSU' },
  { value: '11', label: 'Oklahoma State', code: 'OSU' },
  { value: '12', label: 'TCU', code: 'TCU' },
  { value: '13', label: 'Texas Tech', code: 'TTU' },
  { value: '14', label: 'UCF', code: 'UCF' },
  { value: '15', label: 'Utah', code: 'UTAH' },
  { value: '16', label: 'West Virginia', code: 'WVU' },
];

interface AddAwardDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddAwardDialog({ trigger, onSuccess }: AddAwardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddAwardFormData>({
    resolver: zodResolver(addAwardSchema),
    defaultValues: {
      name: '',
      description: '',
      sport_id: '',
      award_type: 'individual_award',
      season_year: new Date().getFullYear(),
      quantity: 1,
      status: 'planned',
      recipient_name: '',
      recipient_details: '',
    },
  });

  const onSubmit = async (data: AddAwardFormData) => {
    setIsLoading(true);
    try {
      const awardData = {
        name: data.name,
        description: data.description,
        sport_id: parseInt(data.sport_id),
        award_type: data.award_type,
        season_year: data.season_year,
        quantity: data.quantity,
        status: data.status,
        recipient_name: data.recipient_name || null,
        recipient_details: data.recipient_details || null,
        school_id: data.school_id ? parseInt(data.school_id) : null,
        team_id: data.team_id ? parseInt(data.team_id) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('awards')
        .insert([awardData]);

      if (error) {
        throw error;
      }

      toast.success('Award created successfully!');
      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating award:', error);
      toast.error('Failed to create award. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Award
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Add New Award
          </DialogTitle>
          <DialogDescription>
            Create a new award for the Big 12 Conference. Fill in the details below to add it to the inventory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
                <CardDescription>Essential award details and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Award Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Player of the Year - Baseball" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sport_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sports.map((sport) => (
                              <SelectItem key={sport.value} value={sport.value}>
                                {sport.label} ({sport.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the award and its significance..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear description of what this award recognizes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="award_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Award Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="player_of_year">Player of the Year</SelectItem>
                            <SelectItem value="individual_award">Individual Award</SelectItem>
                            <SelectItem value="freshman_of_year">Freshman of the Year</SelectItem>
                            <SelectItem value="academic_honor">Academic Honor</SelectItem>
                            <SelectItem value="coach_of_year">Coach of the Year</SelectItem>
                            <SelectItem value="all_conference">All Conference</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="season_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season Year *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="2025"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="1"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recipient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recipient Information</CardTitle>
                <CardDescription>Optional recipient and school details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipient_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., John Smith or Kansas Team" {...field} />
                        </FormControl>
                        <FormDescription>
                          Individual player, team, or coach name
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="school_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select school" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {schools.map((school) => (
                              <SelectItem key={school.value} value={school.value}>
                                {school.label} ({school.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="recipient_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional details about the recipient, achievements, statistics, etc."
                          className="min-h-[60px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
                <CardDescription>Current award status</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="ordered">Ordered</SelectItem>
                          <SelectItem value="in_production">In Production</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="distributed">Distributed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Award'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}