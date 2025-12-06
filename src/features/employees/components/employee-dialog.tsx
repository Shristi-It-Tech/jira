'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCreateEmployee } from '@/features/employees/api/use-create-employee';

import { EmployeeForm, type EmployeeFormValues } from './employee-form';

interface EmployeeDialogProps {
  workspaceId: string;
}

export const EmployeeDialog = ({ workspaceId }: EmployeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const handleSubmit = (values: EmployeeFormValues) => {
    createEmployee(
      {
        json: {
          ...values,
          workspaceId,
        },
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Employee</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add employee</DialogTitle>
          <DialogDescription>Create a new employee record with job details and employment status.</DialogDescription>
        </DialogHeader>

        <EmployeeForm workspaceId={workspaceId} onSubmit={handleSubmit} isSubmitting={isPending} submitLabel="Save employee" />
      </DialogContent>
    </Dialog>
  );
};
