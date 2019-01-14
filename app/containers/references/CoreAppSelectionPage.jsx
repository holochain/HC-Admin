import { createHolochainAsyncAction } from '@holochain/hc-redux-middleware'
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CoreAppSelection from '../../components/references/CoreAppSelection';
import * as coreAppSelectionActions from '../../actions/references/coreAppSelection';

type Props = {
  coreApps: [],
  update_core_apps: () => void,
  fetch_state: () => void
};

class CoreAppSeletionPage extends Component<Props> {
  constructor(props:Props){
    super(props);
  };

  render() {
    return <CoreAppSelection />;
  }
}

function mapStateToProps({coreAppReducer}) {
  return {coreApps: coreAppReducer};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(coreAppSelectionActions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(CoreAppSeletionPage);


//////////////////////////////////////////////////////////////////////////////////
 //   Example Action Call CREATOR for HC Rust Call (with HC Middleware)
////////////////////////////////////////////////////////////////////////////////
// Step 1.`import { createHolochainAsyncAction } from '@holochain/hc-redux-middleware'`

// Step 2. Create a constant that holds the MetaData Call String specifics/address.
// eg.:
// const someFuncActionCreator = createHolochainAsyncAction('someApp', 'someZome', 'someCapability', 'someFunc')

// Step 3. Dispatch an action (alongside any parameters) to call the function (with params...).
// eg.:
// const action = someFuncActionCreator.create(params)
// dispatch(action)
// >> NB. The dispatched action RETURNS A PROMISE that resolves with the response(and appended "SUCCESS" suffix)
//  or fails with the error(and appended "FAILURE" suffix).
