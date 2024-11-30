export type ListFetchingError = { status: number; message: string };

type IdleState = {
  state: LIST_STATE_VALUE['IDLE'];
};

type LoadingState = {
  state: LIST_STATE_VALUE['LOADING'];
};

type SuccessState<T> = {
  state: LIST_STATE_VALUE['SUCCESS'];
  results: T[];
};

type ErrorState = {
  state: LIST_STATE_VALUE['ERROR'];
  error: ListFetchingError;
};

type LIST_STATE_VALUE = typeof LIST_STATE_VALUE;

export const LIST_STATE_VALUE = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export type ListStateValue = keyof typeof LIST_STATE_VALUE;

export type ComponentListState<T> =
  | IdleState
  | LoadingState
  | SuccessState<T>
  | ErrorState;
