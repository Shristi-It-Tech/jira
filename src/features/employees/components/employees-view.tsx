// @ts-nocheck
'use client';

import { useMemo, useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGetEmployees } from '@/features/employees/api/use-get-employees';
import type { Employee } from '@/features/employees/types';
import { useAddMember } from '@/features/members/api/use-add-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberRole } from '@/features/members/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { EmployeeDialog } from './employee-dialog';

export const EmployeesView = () => {
  const workspaceId = useWorkspaceId();
  const [search, setSearch] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: employees, isLoading } = useGetEmployees({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });
  const { mutate: addMember, isPending: isAddingMember } = useAddMember();

  const filteredEmployees: Employee[] = useMemo(() => {
    if (!employees?.documents) return [];

    if (!search.trim()) return employees.documents;

    const normalizedSearch = search.toLowerCase();

    return employees.documents.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(normalizedSearch) ||
        employee.email.toLowerCase().includes(normalizedSearch) ||
        (employee.department ?? '').toLowerCase().includes(normalizedSearch)
      );
    });
  }, [employees, search]);

  return (
    <div className="flex h-full flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-semibold">Employees</h1>
        <p className="text-sm text-muted-foreground">Maintain your company directory and view employee status at a glance.</p>
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-4">
            <Input
              placeholder="Search employees by name, email, or department"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full md:w-80"
            />
          </div>

          <EmployeeDialog workspaceId={workspaceId} />
        </CardHeader>

        <div className="px-6">
          <DottedSeparator />
        </div>

        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading employees...</p>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
              <CardTitle className="text-lg">No employees found</CardTitle>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add your first employee to start tracking onboarding status, job details, and leave requests.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Job Title</th>
                    <th className="pb-3 font-medium">Employment Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEmployees.map((employee) => {
                    const existingMember = members?.documents.find(
                      (member) => member.employeeId === employee.$id || member.email === employee.email,
                    );

                    const isMember = Boolean(existingMember);
                    const isAdding = isAddingMember && selectedEmployeeId === employee.$id;

                    const handleOpenDialog = () => {
                      setSelectedEmployee(employee);
                      setPassword('');
                      setSelectedEmployeeId(employee.$id);
                      setIsDialogOpen(true);
                    };

                    return (
                      <tr key={employee.$id} className="text-sm">
                        <td className="py-3 font-medium">{employee.name}</td>
                        <td className="py-3 text-muted-foreground">{employee.email}</td>
                        <td className="py-3">{employee.department ?? '-'}</td>
                        <td className="py-3">{employee.jobTitle ?? '-'}</td>
                        <td className="py-3 capitalize">{employee.employmentType.replace('_', ' ').toLowerCase()}</td>
                        <td className="py-3 capitalize">{employee.employmentStatus.replace('_', ' ').toLowerCase()}</td>
                        <td className="py-3 text-right">
                          <Button
                            size="sm"
                            variant={isMember ? 'secondary' : 'default'}
                            disabled={isMember || isAdding}
                            onClick={handleOpenDialog}
                          >
                            {isMember ? 'Member' : isAdding ? 'Adding...' : 'Add to workspace'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedEmployee(null);
            setPassword('');
            setSelectedEmployeeId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add employee to workspace</DialogTitle>
            <DialogDescription>
              Set an initial password for {selectedEmployee?.name}. The employee can change it after signing in. Leave blank if they already
              have an account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{selectedEmployee?.email}</p>
            </div>

            <Input
              type="password"
              placeholder="Temporary password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isAddingMember}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                if (!workspaceId || !selectedEmployee) return;

                addMember(
                  {
                    json: {
                      workspaceId,
                      email: selectedEmployee.email,
                      name: selectedEmployee.name,
                      role: MemberRole.MEMBER,
                      password: password || undefined,
                    },
                  },
                  {
                    onSettled: () => {
                      setSelectedEmployee(null);
                      setPassword('');
                      setSelectedEmployeeId(null);
                      setIsDialogOpen(false);
                    },
                  },
                );
              }}
              disabled={isAddingMember}
            >
              {isAddingMember ? 'Adding...' : 'Add member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
