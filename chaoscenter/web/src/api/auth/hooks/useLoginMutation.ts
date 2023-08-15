/* eslint-disable */
// This code is autogenerated using @harnessio/oats-cli.
// Please do not modify this code directly.
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import type { LoginResponse } from '../schemas/LoginResponse';
import type { ErrorModel } from '../schemas/ErrorModel';
import { fetcher, FetcherOptions } from 'services/fetcher';

export type LoginRequestBody = {
  password: string;
  username: string;
};

export type LoginOkResponse = LoginResponse;

export type LoginErrorResponse = ErrorModel;

export interface LoginProps extends Omit<FetcherOptions<unknown, LoginRequestBody>, 'url'> {
  body: LoginRequestBody;
}

export function login(props: LoginProps): Promise<LoginOkResponse> {
  return fetcher<LoginOkResponse, unknown, LoginRequestBody>({
    url: `/auth/login`,
    method: 'POST',
    ...props
  });
}

export type LoginMutationProps<T extends keyof LoginProps> = Omit<LoginProps, T> & Partial<Pick<LoginProps, T>>;

/**
 * This API is used to login into auth server.
 */
export function useLoginMutation<T extends keyof LoginProps>(
  props: Pick<Partial<LoginProps>, T>,
  options?: Omit<
    UseMutationOptions<LoginOkResponse, LoginErrorResponse, LoginMutationProps<T>>,
    'mutationKey' | 'mutationFn'
  >
) {
  return useMutation<LoginOkResponse, LoginErrorResponse, LoginMutationProps<T>>(
    (mutateProps: LoginMutationProps<T>) => login({ ...props, ...mutateProps } as LoginProps),
    options
  );
}
