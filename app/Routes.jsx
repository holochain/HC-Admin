import * as React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import ErrorPage from './components/pages/ErrorPage';
import HCMonitorTablePageContainer from './containers/HCMonitorTablePageContainer';
import AppRenderer from './containers/AppRenderer';

export default () => (
  <AppRenderer>
    <Switch>
      <Route exact path={routes.UI} component={HCMonitorTablePageContainer} />
      <Route exact path={routes.DNA} component={HCMonitorTablePageContainer} />
      <Route exact path={routes.INSTANCE} component={HCMonitorTablePageContainer} />
      <Route  path={routes.ERROR} component={ErrorPage} />
    </Switch>
  </AppRenderer>
);

// <Route exact path={routes.HCMONITORTABLE} component={HCMonitorTablePageContainer} />
