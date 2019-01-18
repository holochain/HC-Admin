// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HCMonitorTablePage from '../components/pages/HCMonitorTablePage';
import * as ContainerApiActions from '../actions/containerApi.js';


type Props = {
  fetch_state: () => void,
  get_info_instances: () => Promise,
  install_dna_from_file: ()=> Promise
};

class HomePageContainer extends Component<Props> {
  constructor(props:Props){
    super(props);
  };

  render() {
    return <HCMonitorTablePage {...this.props} />;
  }
}

  function mapStateToProps({containerApiReducer}) {
    return {
      containerApiCalls:containerApiReducer,
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(ContainerApiActions, dispatch);
  }

  export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
