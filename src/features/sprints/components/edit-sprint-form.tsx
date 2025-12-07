'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DatePicker } from '@/components/date-picker';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateSprint } from '@/features/sprints/api/use-update-sprint';
import { updateSprintSchema } from '@/features/sprints/schema';
import type { Sprint } from '@/features/sprints/types';
import { SprintStatus } from '@/features/sprints/types';

interface EditSprintFormProps {
  sprint: Sprint;
  onCancel: () => void;
}

export const EditSprintForm = ({ sprint, onCancel }: EditSprintFormProps) => {
  const { mutate: updateSprint, isPending } = useUpdateSprint();

  const form = useForm<z.infer<typeof updateSprintSchema>>({
    resolver: zodResolver(updateSprintSchema),
    defaultValues: {
      name: sprint.name,
      startDate: new Date(sprint.startDate),
      endDate: new Date(sprint.endDate),
      status: sprint.status,
    },
  });

  useEffect(() => {
    form.reset({
      name: sprint.name,
      startDate: new Date(sprint.startDate),
      endDate: new Date(sprint.endDate),
      status: sprint.status,
    });
  }, [sprint, form]);

  const onSubmit = (values: z.infer<typeof updateSprintSchema>) => {
    updateSprint(
      {
        param: { sprintId: sprint.$id },
        json: values,
      },
      {
        onSuccess: () => {
          onCancel();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sprint name</FormLabel>

              <FormControl>
                <Input {...field} placeholder="Enter sprint name" disabled={isPending} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>

                <FormControl>
                  <DatePicker {...field} disabled={isPending} placeholder="Select start date" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>

                <FormControl>
                  <DatePicker {...field} disabled={isPending} placeholder="Select end date" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>

              <Select disabled={isPending} value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>

                <FormMessage />

                <SelectContent>
                  <SelectItem value={SprintStatus.OPEN}>Open</SelectItem>
                  <SelectItem value={SprintStatus.CLOSED}>Closed</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <DottedSeparator />

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" disabled={isPending} onClick={onCancel}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
