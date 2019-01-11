// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import reducers and their typings :
import coreAppReducer from './coreAppSelection';
import helloWorldReducer from './helloWorld';
import { State as HelloWorldState } from '../actions/types';
import welcomeReducer from './welcome';
import homeReducer from './stats';

export interface RootState {
  helloWorld: HelloWorldState
}

export default function createRootReducer(history: History) {
  return combineReducers<RootState>({
    router: connectRouter(history),
    helloWorld: helloWorldReducer,
    welcomeReducer,
    coreAppReducer,
    homeReducer
  });
}
