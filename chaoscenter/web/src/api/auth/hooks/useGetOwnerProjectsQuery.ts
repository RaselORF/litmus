/* eslint-disable */
// This code is autogenerated using @harnessio/oats-cli.
// Please do not modify this code directly.
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type { Project } from '../schemas/Project';
import { fetcher, FetcherOptions } from 'services/fetcher';

export type GetOwnerProjectsOkResponse = {
  data?: Project[];
};

export type GetOwnerProjectsErrorResponse = unknown;

export interface GetOwnerProjectsProps extends Omit<FetcherOptions<unknown, unknown>, 'url'> {}

export function getOwnerProjects(props: GetOwnerProjectsProps): Promise<GetOwnerProjectsOkResponse> {
  return fetcher<GetOwnerProjectsOkResponse, unknown, unknown>({
    url: `/auth/get_owner_projects`,
    method: 'GET',
    ...props
  });
}

/**
 * This API is used to list all the project IDs in which the user is the owner
 *
 */
export function useGetOwnerProjectsQuery(
  props: GetOwnerProjectsProps,
  options?: Omit<UseQueryOptions<GetOwnerProjectsOkResponse, GetOwnerProjectsErrorResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery<GetOwnerProjectsOkResponse, GetOwnerProjectsErrorResponse>(
    ['getOwnerProjects'],
    ({ signal }) => getOwnerProjects({ ...props, signal }),
    options
  );
}
