import React from 'react';
import ProjectsJoinedView from '@views/ProjectsJoined';
import { useListInvitationsQuery } from '@api/auth/index.ts';

export default function ProjectsJoinedController(): React.ReactElement {
  const {
    data,
    isLoading,
    refetch: projectsJoinedRefetch
  } = useListInvitationsQuery({
    invitation_state: 'Accepted'
  });

  return (
    <ProjectsJoinedView
      joinedProjects={data}
      useGetUserWithProjectQueryLoading={isLoading}
      projectsJoinedRefetch={projectsJoinedRefetch}
    />
  );
}
