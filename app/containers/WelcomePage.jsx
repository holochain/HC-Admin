import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Welcome from '../components/Welcome';
import * as WelcomeActions from '../actions/welcome';

type Props = {
  fetch_state: () => void,
  call_holochain_instance_func: () => void,
  call_zome_instance_func: ()=> void
};

class WelcomePage extends Component<Props> {
  constructor(props:Props){
    super(props);
  };

  render() {
    return <Welcome {...this.props} />;
  }
}

function mapStateToProps({welcomeReducer}) {
  return {welcome: welcomeReducer};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WelcomeActions, dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(WelcomePage);
