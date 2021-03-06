// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import type { GlobalState } from '../actons/types';
// ** Middleware for HC Rust Container Communication ** >> Reference Holochain-UI //
import { holochainMiddleware } from '@holochain/hc-redux-middleware'
import { connect } from '../utils/hc-web-client';  // '@holochain/hc-web-client'


const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const url = 'ws:localhost:3000';
const hcWc = connect(url);
const holochain= holochainMiddleware(hcWc);
const enhancer = applyMiddleware(thunk, router, holochain);


function configureStore(initialState?: GlobalState) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
