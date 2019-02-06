// Main Imports
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// electron:
import * as electron from "electron";
// ReactTable Imports
import ReactTable from "react-table";
import { advancedExpandTableHOC } from "./SystemTable";
import "react-table/react-table.css";
// Local Imports
import routes from '../../constants/routes';
import { filterApps } from "../../utils/table-filters";
import manageAllDownloadedApps from "../../utils/helper-functions";
import { dataRefactor, refactorBaseDna, refactorInstanceData } from "../../utils/data-refactor";

// import InstanceToggleButton from "./InstanceToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';

/* ReactTable */
// import instance_table_columns, { instance_dependencies_table_columns } from './InstanceTableColumns'


type HCDnaTableProps = {
  list_of_dna : [{
    id: String, // dna ID
    hash: String // dna HASH
  }],
  list_of_instances : [{
    id: String, // instance ID
    dna: String, // dna ID
    agent: String // agent ID
  }],
  list_of_running_instances :[{
    id: String, // instance ID
    dna: String, // dna idea
    agent: String // agent ID
  }],
  list_of_instance_info : [{
    id: String, // instance ID
    dna: String, // dna ID
    agent: String, // agent ID
    storage: { // currently removed from list_of_instance_info object.. >> discuss
      path: String, // currently N/A
      type: String // currently N/A
    }
  }],
  fetch_state: () => void,
  list_of_instances: () => Promise
};

type HCMonitorTableState = {
  data: {} | null,
  row: String,
  filter: any,
}

class HCUiTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
   // React Table data
      row: "",
      filter: null,
    };
  }


  render() {
    if (!this.props.list_of_installed_instances || this.props.list_of_installed_instances.length === 0){
      return <div/>
    }

    return (
      <div/>
  //     <div className={classnames("App")}>
  //       <ReactTable
  //         defaultPageSize={10}
  //         className="-striped -highlight"
  //         data={table_data}
  //         columns={columns}
  //         SubComponent={row => {
  //           console.log("row", row);
  //           const dependencies_data = this.displaySubComponentData(row);
  //           const dependencies_columns = instance_dependencies_table_columns(this.props, this.state);
  //
  //           return (
  //             <div style={{ paddingTop: "2px" }}>
  //               <ReactTable
  //                 data={dependencies_data}
  //                 columns={dependencies_dnlumns}
  //                 defaultPageSize={dependencies_data.length}
  //                 showPagination={false}
  //                 style = {{ margin: "0 auto", marginBottom: "50px", width:"90%", justifyItems:"center" }}
  //               />
  //            </div>
  //          );
  //        }}
  //     />
  //   </div>
    );
  };
}

export default HCUiTable;
