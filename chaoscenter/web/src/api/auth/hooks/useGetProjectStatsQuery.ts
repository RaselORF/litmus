/* eslint-disable */
// This code is autogenerated using @harnessio/oats-cli.
// Please do not modify this code directly.
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetcher, FetcherOptions } from 'services/fetcher';

export type GetProjectStatsOkResponse = { [key: string]: any };

export type GetProjectStatsErrorResponse = unknown;

export interface GetProjectStatsProps extends Omit<FetcherOptions<unknown, unknown>, 'url'> {}

export function getProjectStats(props: GetProjectStatsProps): Promise<GetProjectStatsOkResponse> {
  return fetcher<GetProjectStatsOkResponse, unknown, unknown>({
    url: `/auth/get_projects_stats`,
    method: 'GET',
    ...props
  });
}

/**
 * This API is used to get overall stats for all the projects(accessible only to admin).
 */
export function useGetProjectStatsQuery(
  props: GetProjectStatsProps,
  options?: Omit<UseQueryOptions<GetProjectStatsOkResponse, GetProjectStatsErrorResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery<GetProjectStatsOkResponse, GetProjectStatsErrorResponse>(
    ['getProjectStats'],
    ({ signal }) => getProjectStats({ ...props, signal }),
    options
  );
}
