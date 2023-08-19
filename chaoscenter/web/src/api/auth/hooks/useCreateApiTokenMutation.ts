/* eslint-disable */
// This code is autogenerated using @harnessio/oats-cli.
// Please do not modify this code directly.
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import type { CreateApiTokenResponse } from '../schemas/CreateApiTokenResponse';
import type { ErrorModel } from '../schemas/ErrorModel';
import { fetcher, FetcherOptions } from 'services/fetcher';

export type CreateApiTokenRequestBody = {
  expiration_date_in_days: number;
  name: string;
  user_id: string;
};

export type CreateApiTokenOkResponse = CreateApiTokenResponse;

export type CreateApiTokenErrorResponse = ErrorModel;

export interface CreateApiTokenProps extends Omit<FetcherOptions<unknown, CreateApiTokenRequestBody>, 'url'> {
  body: CreateApiTokenRequestBody;
}

export function createApiToken(props: CreateApiTokenProps): Promise<CreateApiTokenOkResponse> {
  return fetcher<CreateApiTokenOkResponse, unknown, CreateApiTokenRequestBody>({
    url: `/auth/token`,
    method: 'POST',
    ...props
  });
}

export type CreateApiTokenMutationProps<T extends keyof CreateApiTokenProps> = Omit<CreateApiTokenProps, T> &
  Partial<Pick<CreateApiTokenProps, T>>;

/**
 * This API is used to create api-token for a user
 */
export function useCreateApiTokenMutation<T extends keyof CreateApiTokenProps>(
  props: Pick<Partial<CreateApiTokenProps>, T>,
  options?: Omit<
    UseMutationOptions<CreateApiTokenOkResponse, CreateApiTokenErrorResponse, CreateApiTokenMutationProps<T>>,
    'mutationKey' | 'mutationFn'
  >
) {
  return useMutation<CreateApiTokenOkResponse, CreateApiTokenErrorResponse, CreateApiTokenMutationProps<T>>(
    (mutateProps: CreateApiTokenMutationProps<T>) =>
      createApiToken({ ...props, ...mutateProps } as CreateApiTokenProps),
    options
  );
}
