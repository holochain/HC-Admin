import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as helloWorldActions from '../actions/references/helloWorld';
import * as containerApiActions from '../actions/containerApi';
import type { counterStateType } from '../reducers/references/types';

// ** Middleware for HC Rust Container Communication ** >> Reference Holochain-UI //
import { holochainMiddleware } from '@holochain/hc-redux-middleware'
import { connect } from '../utils/hc-web-client';  // '@holochain/hc-web-client'
const url = 'ws:localhost:3000'
const hcWc = connect(url)

const history = createHashHistory();
const rootReducer = createRootReducer(history);

const configureStore = (initialState?: counterStateType) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // ** HC Rust Container Middleware ** >> Push HC middleware into middleware array //
  middleware.push(holochainMiddleware(hcWc));

  // Redux DevTools Configuration
  const actionCreators = {
    ...containerApiActions,
    ...helloWorldActions,
    ...routerActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const storeEnhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, storeEnhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default)
    );
  }
  return store;
};

export default { configureStore, history };
