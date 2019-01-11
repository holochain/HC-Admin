import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type Dispatch = ReduxDispatch<Action>;
export type Store = ReduxStore<GetState, Action>;

export const ActionTypes = {
  SAY_HELLO : 'SAY_HELLO',
  RECEIVED_HELLO : 'RECEIVED_HELLO'
}

export type Action = {
  type: ActionTypes,
  payload: {
    message: string
  }
}
export type GlobalState = {
  message: string,
  counter: number
}

export type GetState = () => State;

// for the helloWorld component
export interface IHelloWorldService {
  sayHelloToMainProcess: () => Promise<any>
}

// for the counter component
// export type counterStateType = {
//   +counter: number
// };
