import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root'; //root.tsx
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const store = configureStore();

ReactDOM.render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./Root', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
