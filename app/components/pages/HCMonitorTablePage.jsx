// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dashboard from '../page-components/Dashboard'
import HCDnaTable from '../page-components/HCDnaTable';
import HCInstanceTable from '../page-components/HCInstanceTable';
import HCUiTable from '../page-components/HCUiTable';
import HCHelpPage from '../pages/HCHelpPage';
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
      tableData: []
    }
  };

  render() {
    const { classes } = this.props;
    const gutterBottom : boolean = true;
    const {location} = this.props.history;
    console.log(">>>> location: >>>", location);

    const setTableData = (tableData) => {
      // console.log(" >>>>>>>>>,  searchBarDataSet (INSIDE HCMonitorTablePage ROUTER) ,<<<<<<<", searchBarDataSet);
      this.setState({
        tableData
      });
    }

    return (
      <Dashboard {...this.props} tableData={this.state.tableData}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Typography className={classes.mainHeader} style={{color:"rgb(149, 185, 237)", fontFamily:"Raleway"}} variant="display1" gutterBottom={gutterBottom} component="h2" >
            {location.pathname === "/" ? `Instances`: location.pathname.toString().substring(1).toUpperCase() } Overview Table
          </Typography>
          <div className={classes.tableContainer}>
          {location.pathname === "/" ?
            <HCInstanceTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            location.pathname === "/dna" ?
            // this should be the dna table
            <HCDnaTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            location.pathname === "/ui" ?
            // this should be the ui table
            <HCUiTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            // this should default the help page
            <HCHelpPage className={classes.appTable} {...this.props} />
          }
          </div>
        </main>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(HCMonitorTablePage);
