// Main Imports
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cmd from 'node-cmd';
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
// import { hcJoin,hcUninstall,hcStart,hcStop } from "../utils/hc-install";
// import { getRunningApps,decideFreePort } from "../utils/running-app";

// import InstanceToggleButton from "./InstanceToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';

/* ReactTable */
import instance_table_columns, { instance_base_dna_table_columns } from './InstanceTableColumns'
// const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

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

class HCInstanceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
   // React Table data
      row: "",
      filter: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { list_of_running_instances, list_of_installed_instances } = props.containerApiCalls;

    if (!list_of_installed_instances) {
      return null;
    }
    else {
      const appData = { list_of_installed_instances, list_of_running_instances };
      const prevProps = state.prevProps || {};
      const data = prevProps.value !== appData ? appData : state.data
      console.log("data", data);
      return ({ data });
    }
  }

  // callFetchState = () => {
    //   this.props.fetch_state();
    // }

  componentDidMount = () => {
    this.beginAppMontoring();
  }

  beginAppMontoring = () => {
    // call for list_of_instances()
    this.props.get_info_instances().then(res=>{
      console.log("GET INFO INSTANCES: ",this.props);
    })

    // call for LIST_OF_DNA()
    this.props.list_of_dna().then(res => {
      // this.callFetchState();
      console.log("Home props after LIST_OF_DNA call", this.props);
    });

    this.props.list_of_installed_instances().then(res => {
      console.log("Home props after list_of_installed_instances call", this.props);
      console.log("this.state AFTER CONTAINER API CALLS", this.state);
    })

    // call for LIST_OF_RUNNING_INSTANCES ()
    this.props.list_of_running_instances().then(res => {
      console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
    })
  }

  displayData = () => {
    console.log("this.state inside displayData", this.state);
    if (this.props.containerApiCalls.list_of_installed_instances){
      const { list_of_running_instances, list_of_installed_instances ,list_of_instance_info} = this.props.containerApiCalls;

      const table_dna_instance_info =  refactorInstanceData(list_of_instance_info, list_of_installed_instances, list_of_running_instances);

      // console.log("DATA GOING TO INSTANCE MAIN TABLE >>>> !! table_dna_instance_info !! <<<<<<<< : ", table_dna_instance_info);
      return table_dna_instance_info;
    }
  }

  displaySubComponentData = (row) => {
    if (this.props.containerApiCalls.list_of_installed_instances){
      const { list_of_dna } = this.props.containerApiCalls;
      console.log(">>>>>> list_of_dna inside displaySubComponentData <<<<<<<<<<<", list_of_dna);
      const instance_dna_id = row.original.dna_id;
      const instance_base_dna_table_info = refactorBaseDna(instance_dna_id, list_of_dna);

      // console.log("DATA GOING TO INSTANCE SubComponent (the BASE DNA TABLE) >>>> !! instance_base_dna_table_info !! <<<<<<<< : ", instance_base_dna_table_info);
      return instance_base_dna_table_info;
    }
  }

  render() {
    if (!this.state.data.list_of_installed_instances || this.state.data.list_of_installed_instances.length === 0){
      return <div/>
    }

    const table_data = this.displayData();
    const columns = instance_table_columns(this.props, this.state);
    console.log("table_columns: ", columns);
    console.log("table_data: ", table_data);

    return (
      <div className={classnames("App")}>
        <ReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={table_data}
          columns={columns}
          SubComponent={row => {
            console.log("row", row);
            const base_dna_data = this.displaySubComponentData(row);
            const base_dna_columns = instance_base_dna_table_columns(this.props, this.state);

            return (
              <div style={{ paddingTop: "2px" }}>
                <ReactTable
                  data={base_dna_data}
                  columns={base_dna_columns}
                  defaultPageSize={base_dna_data.length}
                  showPagination={false}
                  style = {{ margin: "0 auto", marginBottom: "50px", width:"90%", justifyItems:"center" }}
                />
             </div>
           );
         }}
      />
    </div>
  )}
}

export default HCInstanceTable;

// STATUS & RUNNING BUTTON ALTERNATIVES :
    // renderStatusButton = (dna_id, status, running) => {
    //   const STOPBUTTON=(<button className="StopButton" type="button">Stop</button>);
    //   const STARTBUTTON=(<button className="StartButton" type="button">Start</button>);
    //   if(running){
    //     return (STOPBUTTON)
    //   }else if (!running){
    //     if(status==="installed"){
    //       return (STARTBUTTON)
    //     }
    //   }
    // }
    //
    // renderRunningButton = (dna_id, status, running) => {
    //   const INSTALLBUTTON=(<button className="InstallButton" type="button">Install</button>);
    //   const UNINSTALLBUTTON=(<button className="InstallButton" type="button">Uninstall</button>);
    //   if (!running){
    //     if (status === "installed") {
    //       return UNINSTALLBUTTON
    //     } else if (status === 'uninstalled') {
    //       return INSTALLBUTTON
    //     }
    //   }
    // }
