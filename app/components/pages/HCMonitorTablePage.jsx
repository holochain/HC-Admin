// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HCMonitorTable from '../page-components/HCMonitorTable';
import Dashboard from '../page-components/Dashboard'
import * as ContainerApiActions from '../../actions/containerApi';
import { withStyles } from '@material-ui/core/styles';
import styles from '../styles/page-styles/DefaultPageMuiStyles'
import Typography from '@material-ui/core/Typography';

type Props = {
  fetch_state: () => void,
  get_info_instances: () => Promise,
  install_dna_from_file: ()=> Promise
};

class HCMonitorTablePage extends Component<Props> {
  constructor(props:Props){
    super(props);
    this.state = {
      open:true,
    }
  };

  render() {
    const { classes } = this.props;
    const gutterBottom : boolean = true;

    return (
      <Dashboard>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography className={classes.mainHeader} style={{color:"rgb(149, 185, 237)", fontFamily:"Raleway"}} variant="display1" gutterBottom={gutterBottom} component="h2" >
            {this.props.history.location === "/UI" ? `UI`: `DNA` } Overview Table
          </Typography>
          <div className={classes.tableContainer}>
            <HCMonitorTable className={classes.appTable} {...this.props} />
          </div>
        </main>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(HCMonitorTablePage);
