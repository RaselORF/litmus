import { Button, ButtonVariation, DropDown, Layout, SelectOption, TableV2, Text, useToaster } from '@harnessio/uicore';
import React, { useMemo } from 'react';
import type { Column, Row } from 'react-table';
import type { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useStrings } from '@strings';
import {
  GetProjectMembersOkResponse,
  ProjectMember,
  useRemoveInvitationMutation,
  useSendInvitationMutation
} from '@api/auth';
import { MemberEmail, MemberName } from './ActiveMembersListColumns';

interface PendingMembersTableViewProps {
  pendingMembers: ProjectMember[];
  isLoading: boolean;
  getPendingMembersRefetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<GetProjectMembersOkResponse, unknown>>;
}
export default function PendingMembersTableView({
  pendingMembers,
  getPendingMembersRefetch
}: PendingMembersTableViewProps): React.ReactElement {
  const { getString } = useStrings();

  const envColumns: Column<ProjectMember>[] = useMemo(
    () => [
      {
        Header: 'MEMBERS',
        id: 'username',
        width: '25%',
        accessor: 'username',
        Cell: MemberName
      },
      {
        Header: 'EMAIL',
        id: 'email',
        accessor: 'email',
        width: '25%',
        Cell: MemberEmail
      },
      {
        Header: 'PERMISSIONS',
        id: 'Role',
        width: '50%',
        disableSortBy: true,
        Cell: ({ row: { original: data } }: { row: Row<ProjectMember> }) => {
          const { projectID } = useParams<{ projectID: string }>();
          const { role } = data;
          const [memberRole, setMemberRole] = React.useState<'Editor' | 'Owner' | 'Viewer'>(role);
          const rolesDropDown: SelectOption[] = [
            {
              label: 'Editor',
              value: 'Editor'
            },
            {
              label: 'Viewer',
              value: 'Viewer'
            }
          ];

          const { showSuccess } = useToaster();
          const { mutate: sendInvitationMutation, isLoading: sendLoading } = useSendInvitationMutation(
            {},
            {
              onSuccess: () => {
                showSuccess('Invitation sent successfully');
                getPendingMembersRefetch();
              }
            }
          );

          const { mutate: removeInvitationMutation, isLoading: removeLoading } = useRemoveInvitationMutation(
            {},
            {
              onSuccess: () => {
                showSuccess('Invitation removed successfully');
                getPendingMembersRefetch();
              }
            }
          );

          return (
            <Layout.Horizontal flex={{ justifyContent: 'space-between' }} spacing="medium">
              <Layout.Horizontal flex={{ justifyContent: 'flex-start' }} spacing="small" margin={{ bottom: 'small' }}>
                <DropDown
                  value={memberRole}
                  items={rolesDropDown}
                  onChange={option => setMemberRole(option.label as 'Editor' | 'Owner' | 'Viewer')}
                />
              </Layout.Horizontal>
              <Layout.Horizontal flex={{ justifyContent: 'flex-start' }} spacing="medium">
                <Button
                  disabled={false}
                  loading={sendLoading}
                  onClick={() =>
                    sendInvitationMutation({
                      body: {
                        projectID: projectID,
                        userID: data.userID,
                        role: memberRole
                      }
                    })
                  }
                  variation={ButtonVariation.PRIMARY}
                  text="Resend"
                />
                <Button
                  disabled={false}
                  loading={removeLoading}
                  onClick={() =>
                    removeInvitationMutation({
                      body: {
                        projectID: projectID,
                        userID: data.userID
                      }
                    })
                  }
                  variation={ButtonVariation.SECONDARY}
                  text="Remove"
                />
              </Layout.Horizontal>
            </Layout.Horizontal>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getString]
  );
  return (
    <Layout.Vertical>
      <Text>Total Pending Invitations {pendingMembers.length}</Text>
      <TableV2<ProjectMember> columns={envColumns} sortable data={pendingMembers} />
    </Layout.Vertical>
  );
}
