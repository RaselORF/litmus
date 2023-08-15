import { Button, ButtonVariation, Dialog, Layout, Popover, TableV2, Text, useToggleOpen } from '@harnessio/uicore';
import React, { useMemo } from 'react';
import type { Column, Row } from 'react-table';
import type { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { Classes, Menu, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { useStrings } from '@strings';
import type { GetProjectMembersOkResponse, ProjectMember } from '@api/auth';
import { killEvent } from '@utils';
import { PermissionGroup } from '@models';
import RbacMenuItem from '@components/RbacMenuItem';
import RemoveMemberController from '@controllers/RemoveMember/RemoveMember';
import { MemberEmail, MemberName, MemberPermission } from './ActiveMembersListColumns';
import css from './ProjectMember.module.scss';

interface ActiveMembersTableViewProps {
  activeMembers: ProjectMember[];
  isLoading: boolean;
  getMembersRefetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<GetProjectMembersOkResponse, unknown>>;
}
export default function ActiveMembersTableView({
  activeMembers,
  getMembersRefetch
}: ActiveMembersTableViewProps): React.ReactElement {
  const { getString } = useStrings();
  const envColumns: Column<ProjectMember>[] = useMemo(
    () => [
      {
        Header: 'MEMBERS',
        id: 'username',
        width: '40%',
        accessor: 'username',
        Cell: MemberName
      },
      {
        Header: 'EMAIL',
        id: 'email',
        accessor: 'email',
        width: '30%',
        Cell: MemberEmail
      },
      {
        Header: 'PERMISSIONS',
        id: 'role',
        accessor: 'role',
        width: '30%',
        Cell: MemberPermission
      },
      {
        Header: '',
        id: 'threeDotMenu',
        disableSortBy: true,
        Cell: ({ row: { original: data } }: { row: Row<ProjectMember> }) => {
          const { open: openDeleteModal, isOpen: isDeleteModalOpen, close: hideDeleteModal } = useToggleOpen();
          // const { open: openEditModal, isOpen: isEditOpen, close: hideEditModal } = useToggleOpen();

          return (
            <Layout.Vertical flex={{ justifyContent: 'center', alignItems: 'flex-end' }} onClick={killEvent}>
              <Popover
                className={Classes.DARK}
                position={Position.LEFT}
                interactionKind={PopoverInteractionKind.HOVER}
                disabled={data.role === 'Owner'}
              >
                <Button variation={ButtonVariation.ICON} icon="Options" />
                <Menu style={{ backgroundColor: 'unset' }}>
                  {/* <RbacMenuItem icon="edit" text="Edit Role" onClick={openEditModal} permission={PermissionGroup.OWNER} /> */}
                  <RbacMenuItem
                    icon="trash"
                    text="Remove Member"
                    onClick={openDeleteModal}
                    permission={PermissionGroup.OWNER}
                  />
                </Menu>
              </Popover>
              {isDeleteModalOpen && (
                <Dialog
                  isOpen={isDeleteModalOpen}
                  canOutsideClickClose={false}
                  canEscapeKeyClose={false}
                  onClose={() => hideDeleteModal()}
                  className={css.nameChangeDialog}
                >
                  <RemoveMemberController
                    userID={data.userID}
                    username={data.username}
                    hideDeleteModal={hideDeleteModal}
                    getMembersRefetch={getMembersRefetch}
                  />
                </Dialog>
              )}
            </Layout.Vertical>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getString]
  );
  return (
    <Layout.Vertical>
      <Text>Total Pending Invitations {activeMembers.length}</Text>
      <TableV2<ProjectMember> columns={envColumns} sortable data={activeMembers} />
    </Layout.Vertical>
  );
}
