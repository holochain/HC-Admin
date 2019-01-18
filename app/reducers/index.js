// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
// import reducers and their typings :
import { State as HelloWorldState } from '../actions/references/types';
import helloWorldReducer from './references/helloWorld';
import stats from './references/stats';
import coreAppSelectionReducer from './references/coreAppSelection';
import containerApiReducer from './containerApiReducer';
import profileApiReducer from './profileApiReducer';


export interface RootState {
  helloWorld: HelloWorldState
}

export default function createRootReducer(history: History) {
  return combineReducers<RootState>({
    router: connectRouter(history),
    // helloWorld: helloWorldReducer,
    // coreAppSelectionReducer,
    // stats,
    profileApiReducer,
    containerApiReducer
  });
}
