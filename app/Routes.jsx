import * as React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import WelcomePage from './containers/WelcomePage';
import HelloWorldPage from './containers/HelloWorldPage';
import CoreAppSelectionPage from './containers/CoreAppSelectionPage';

import Home from './containers/HomePage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HELLOWORLD} component={HelloWorldPage} />
      <Route path={routes.COREAPPS} component={CoreAppSelectionPage} />
      <Route path={routes.WELCOME} component={WelcomePage} />
      <Route path={routes.HOME} component={Home} />
    </Switch>
  </App>
);
