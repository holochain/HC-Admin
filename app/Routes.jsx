import * as React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';

import CoreAppSelectionPage from './containers/references/CoreAppSelectionPage';

import ErrorPage from './components/pages/ErrorPage';
import HCMonitorTable from './containers/HCMonitorTablePageContainer';
import AppRenderer from './containers/AppRenderer';

export default () => (
  <AppRenderer>
    <Switch>
      // <Route exact path={routes.COREAPPS} component={CoreAppSelectionPage} />
      <Route exact path={routes.DNATABLE} component={HCMonitorTable} />
      <Route exact path={routes.HCMONITORTABLE} component={HCMonitorTable} />
      <Route  path={routes.ERROR} component={ErrorPage} />
    </Switch>
  </AppRenderer>
);

// <Route exact path={routes.UITABLE} component={UiTable} />
