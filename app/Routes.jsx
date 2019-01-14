import * as React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import HelloWorldPage from './containers/references/HelloWorldPage';
import CoreAppSelectionPage from './containers/references/CoreAppSelectionPage';
import Home from './containers/HomePage';
import App from './containers/App';

export default () => (
  <App>
    <Switch>
      // <Route path={routes.HELLOWORLD} component={HelloWorldPage} />
      // <Route path={routes.COREAPPS} component={CoreAppSelectionPage} />
      <Route path={routes.HOME} component={Home} />
    </Switch>
  </App>
);
