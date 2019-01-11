// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as StatsActions from "../actions/stats";
import Home from '../components/Home';

  function mapStateToProps({homeReducer}) {
    return {
      downloaded_apps: homeReducer.downloaded_apps,
      installed_apps : homeReducer.installed_apps,
      AllStats : homeReducer.AllStats
    };
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators(StatsActions, dispatch);
  }

  export default connect(mapStateToProps, mapDispatchToProps)(Home);
