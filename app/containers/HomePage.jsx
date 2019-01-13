// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as ContainerApiActions from '../actions/containerApi.js';
// import * as StatsActions from "../actions/stats";

type Props = {
  fetch_state: () => void,
  get_info_instances: () => Promise,
  install_dna_from_file: ()=> Promise
};

class HomePage extends Component<Props> {
  constructor(props:Props){
    super(props);
  };

  render() {
    return <Home {...this.props} />;
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

  export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
