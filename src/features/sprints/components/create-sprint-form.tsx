'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { DatePicker } from '@/components/date-picker';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSprint } from '@/features/sprints/api/use-create-sprint';
import { SprintStatus } from '@/features/sprints/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

const formSchema = z
  .object({
    name: z.string().trim().min(1, 'Sprint name is required.'),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    status: z.nativeEnum(SprintStatus).default(SprintStatus.CLOSED),
  })
  .refine((data) => !!data.startDate, {
    message: 'Sprint start date is required.',
    path: ['startDate'],
  })
  .refine((data) => !!data.endDate, {
    message: 'Sprint end date is required.',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return data.endDate >= data.startDate;
    },
    {
      message: 'End date must be after start date.',
      path: ['endDate'],
    },
  );

export const CreateSprintForm = () => {
  const workspaceId = useWorkspaceId();
  const { mutate: createSprint, isPending } = useCreateSprint();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      startDate: undefined,
      endDate: undefined,
      status: SprintStatus.CLOSED,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createSprint(
      {
        json: {
          workspaceId,
          name: values.name,
          startDate: values.startDate!,
          endDate: values.endDate!,
          status: values.status,
        },
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Create Sprint</CardTitle>
      </CardHeader>

      <DottedSeparator className="mx-6" />

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sprint name</FormLabel>

                  <FormControl>
                    <Input {...field} placeholder="e.g. Sprint 24" disabled={isPending} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date ?? undefined)}
                        disabled={isPending}
                        placeholder="Select start date"
                      />
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
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date ?? undefined)}
                        disabled={isPending}
                        placeholder="Select end date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create sprint'}
            </Button>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SprintStatus.OPEN}>Open</SelectItem>
                      <SelectItem value={SprintStatus.CLOSED}>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
