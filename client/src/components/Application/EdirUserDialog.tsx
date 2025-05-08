'use client';

import type React from 'react';

import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const positions = [
  'Full Stack Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI/ML Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
];

const levels = ['Intern', 'Junior', 'Intermediate', 'Senior'];

export function EditUserDialog({
  userData,
  setUserData,
}: {
  userData: any;
  setUserData: any;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phoneNo: userData?.phoneNo || '',
    position: userData?.appliedPosition || '',
    level: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format the position with level if level is selected
      const formattedPosition = formData.level
        ? `${formData.level} ${formData.position}`
        : formData.position;

      const { error } = await supabase
        .from('applicant_details')
        .update({
          applicant_name: formData.name,
          applicant_email: formData.email,
          applicant_phone_number: formData.phoneNo,
          applied_position: formattedPosition,
        })
        .eq('applicant_email', formData.email);

      if (error) throw error;

      // Update local state
      setUserData({
        ...userData,
        name: formData.name,
        email: formData.email,
        phoneNo: formData.phoneNo,
        appliedPosition: formattedPosition,
      });

      toast.success('User details updated successfully');
      setOpen(false);
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error('Failed to update user details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger id="edit-user-dialog" className="hidden">
        Open
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Applicant Details</DialogTitle>
          <DialogDescription>
            Update the applicant's information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNo" className="text-right">
                Phone
              </Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Select
                value={formData.position}
                onValueChange={(value) => handleSelectChange('position', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Level
              </Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange('level', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
