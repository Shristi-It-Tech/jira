'use client';

import { ArrowLeft, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useState } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAddMember } from '@/features/members/api/use-add-member';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { MemberRole } from '@/features/members/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm('Remove member', 'This member will be removed from this workspace.', 'destructive');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>(MemberRole.MEMBER);

  const { data: members } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: addMember, isPending: isAddingMember } = useAddMember();

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();

    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      },
    );
  };

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const isPending = isDeletingMember || isUpdatingMember || members?.documents.length === 1;

  const resetInviteForm = () => {
    setInviteName('');
    setInviteEmail('');
    setInvitePassword('');
    setInviteRole(MemberRole.MEMBER);
  };

  const handleInviteMember = () => {
    if (!workspaceId) return;

    addMember(
      {
        json: {
          workspaceId,
          name: inviteName || undefined,
          email: inviteEmail,
          password: invitePassword || undefined,
          role: inviteRole,
        },
      },
      {
        onSuccess: () => {
          setIsInviteOpen(false);
          resetInviteForm();
        },
      },
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <ConfirmDialog />

      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Link>
        </Button>

        <CardTitle className="text-xl font-bold">Members list</CardTitle>

        <Dialog
          open={isInviteOpen}
          onOpenChange={(open) => {
            setIsInviteOpen(open);
            if (!open) resetInviteForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="ml-auto" disabled={isAddingMember}>
              Invite member
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add member</DialogTitle>
              <DialogDescription>Invite an employee or external collaborator to this workspace.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-name">Full name</Label>
                <Input
                  id="invite-name"
                  placeholder="Ada Lovelace"
                  value={inviteName}
                  onChange={(event) => setInviteName(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="ada@example.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-password">Temporary password</Label>
                <Input
                  id="invite-password"
                  type="password"
                  placeholder="Set only if the user has no account yet"
                  value={invitePassword}
                  onChange={(event) => setInvitePassword(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank if the member already created an account. Otherwise, provide a temporary password.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Select value={inviteRole} onValueChange={(value: MemberRole) => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MemberRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={MemberRole.MEMBER}>Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button disabled={isAddingMember || !inviteEmail} onClick={handleInviteMember}>
                {isAddingMember ? 'Adding...' : 'Add member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {members?.documents.map((member, i) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar name={member.name} className="size-10" fallbackClassName="text-lg" />

              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="to-muted-foreground text-xs">{member.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger disabled={isPending} asChild>
                  <Button title="View options" className="ml-auto" variant="secondary" size="icon">
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                    disabled={isPending}
                  >
                    Set as Administrator
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                    disabled={isPending}
                  >
                    Set as Member
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isPending}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {i < members.documents.length - 1 && <Separator className="my-2.5" />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
