// @flow
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// mui custom styling imports
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// local imports
import * as ContainerApiActions from '../../actions/containerApi';
import Dashboard from '../page-components/Dashboard';
import HCDnaTable from '../page-components/HCDnaTable';
import HCInstanceTable from '../page-components/HCInstanceTable';
import HCUiTable from '../page-components/HCUiTable';
import HCHelpPage from './HCHelpPage';
import ErrorPage from './ErrorPage';
import styles from '../styles/page-styles/DefaultPageMuiStyles'


class HCMonitorTablePage extends React.Component<Props> {
  constructor(props:Props){
    super(props);
    this.state = {
      tableData: []
    }
  };

  render() {
    const { classes, ...newProps } = this.props;
    const gutterBottom : boolean = true;
    const { location } = this.props.history;
    console.log(">>>> location: >>>", location);

    const setTableData = (tableData) => {
      // console.log(" >>>>>>>>>,  searchBarDataSet (INSIDE HCMonitorTablePage ROUTER) ,<<<<<<<", searchBarDataSet);
      this.setState({
        tableData
      });
    }

    return (
      <Dashboard {...newProps} tableData={this.state.tableData}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />

         {/* Page routing : */}
          <div className={classes.tableContainer}>
          { location.pathname === "/" ?
          // this should route to the ui table
            <HCUiTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            location.pathname === "/ui" ?
            // this should route to the ui table
              <HCUiTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            location.pathname === "/dna" ?
            // this should route to the dna table
              <HCDnaTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            location.pathname === "/instance" ?
            // this should route to the instance table
              <HCInstanceTable className={classes.appTable} {...this.props} setSearchData={this.setTableData} />
          :
            location.pathname === "/help" ?
            // this should route to the help page
            <HCHelpPage className={classes.appTable} {...this.props} />
          :
            // this should default to the 404 page >> none matched...
            <ErrorPage />
          }
          </div>
        </main>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(HCMonitorTablePage);
