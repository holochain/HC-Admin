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
import { dataRefactor, refactorInstanceData, listDownloadedApps, monitorUninstalledApps } from "../../utils/data-refactor";
// import { hcJoin,hcUninstall,hcStart,hcStop } from "../utils/hc-install";
// import { getRunningApps,decideFreePort } from "../utils/running-app";
import InstanceToggleButton from "./InstanceToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';

/* ReactTable */
const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);
/* Table Headers */
const table_columns = (props, state) => {


console.log("Table Columns Props", props);
  console.log("Table Columns State", state);
  //
  // const currentRowInstance = row._original.instanceId
  // console.log("Table Columns Row info", currentRowInstance);

  const table_columns = [{
    Header: '',
    columns: [{
      Header: 'App Name',
      accessor: 'dna_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Username',
      accessor: 'agent_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }]
  }, {
    Header: '',
    columns: [{
      Header: 'Type',
      accessor: 'type',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Hash ID',
      accessor: 'hash',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    },{
      Header: 'Instance ID',
      accessor: 'instanceId',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Status',
      accessor: 'status',
      Cell: row => (
        <div>
          <span style={{
            color: row.value.status === 'installed' ? '#57d500'
            : '#ff2e00',
            transition: 'all .3s ease'
          }}>
          &#x25cf;
          </span>
        { " " + row.value.status }
          <br/>
          <InstanceToggleButton
            installed={row.value}
            listInstances={props.list_of_instances}
            removeInstance={props.remove_agent_dna_instance}
            addInstance={props.add_agent_dna_instance}
          />
        </div>
      )
    },{
      Header: 'Running',
      accessor: 'running',
      Cell: row => (
        <div>
          <span style={{
            color: row.value.running ? '#57d500'
            : '#ff2e00',
            transition: 'all .3s ease'
          }}>
          &#x25cf;
          </span>
          { " " + row.value.running }
          <br/>
          <InstanceToggleButton
            running={row.value}
            listRunningInstances={props.list_of_running_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
          />
        </div>
      )
    },
    {
      Header: 'Interface',
      accessor: 'interface',
      Cell: row => (
        <div>
        { row.value }
        </div>
      )
    }]
  }];

  return table_columns;
}

type HCMonitorTableProps = {
  list_of_running_instances :[{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_installed_instances : [{
    id: String,
    dna: String,
    agent: String,
    // storage: {
    //   path: String,
    //   type: String
    // }
  }],
  fetch_state: () => void,
  list_of_instances: () => Promise,
};

type HCMonitorTableState = {
  data: {} | null,
  installed_apps: {} | null,
  row: String,
  filter: any,
}

class HCInstanceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      installed_instances: {},
      // downloaded_apps: {},
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

  componentDidMount = () => {
    this.beginAppMontoring();
  }

  // callFetchState = () => {
  //   this.props.fetch_state();
  // }

  beginAppMontoring = () => {
    // call for list_of_instances()
    this.props.get_info_instances().then(res=>{
      console.log("GET INFO INSTANCES: ",this.props);
    })
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

      // const filtered_apps = filterApps(installed_apps, downloaded_apps);
      // const app_data = dataRefactor(list_of_installed_instances, list_of_dna, list_of_running_instances, downloaded_apps);
      // console.log("App Data: ",app_data);

      const table_dna_instance_info =  refactorInstanceData(list_of_instance_info, list_of_installed_instances, list_of_running_instances);

      console.log("DATA GOING TO TABLE >>>> !! table_dna_instance_info !! <<<<<<<< : ", table_dna_instance_info);
      return table_dna_instance_info;
    }
  }

    renderStatusButton = (dna_id, status, running) => {
      const STOPBUTTON=(<button className="StopButton" type="button">Stop</button>);
      const STARTBUTTON=(<button className="StartButton" type="button">Start</button>);
      if(running){
        return (STOPBUTTON)
      }else if (!running){
        if(status==="installed"){
          return (STARTBUTTON)
        }
      }
    }

    renderRunningButton = (dna_id, status, running) => {
      const INSTALLBUTTON=(<button className="InstallButton" type="button">Install</button>);
      const UNINSTALLBUTTON=(<button className="InstallButton" type="button">Uninstall</button>);
      if (!running){
        if (status === "installed") {
          return UNINSTALLBUTTON
        } else if (status === 'uninstalled') {
          return INSTALLBUTTON
        }
      }
    }


  render() {
    if (this.state.data.list_of_installed_instances.length === 0){
      return <div/>
    }

    const table_data = this.displayData();

    const columns = table_columns(this.props, this.state);
    console.log("table_columns: ", columns);
    console.log("table_data: ", table_data);

    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          defaultPageSize={500}
          className="-striped -highlight"
          data={table_data}
          columns={columns}
          SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
            <div>
// ******** TODO: USE / reconfigure THE SubComponent Below for displaying the UI DNA dependencies, or the DNA links to/pairings with UI. ***********
              SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
                console.log("row._original.ui_pairing", row._original.ui_pairing);
                if (row._original.ui_pairing!==undefined){
                  return (
                    <div style={{ padding: "20px" }}>
                        UI Link: {row._original.dna_id}
                        <br/>
                        {this.renderStatusButton(row._original.dna_id,row._original.status,row._original.running)}
                        {this.renderRunningButton(row._original.dna_id,row._original.status,row._original.running)}
                    </div>
                  );
                } else if (row._original.dna_dependencies!==undefined) {
                  return (
                    <div style={{ padding: "20px" }}>
                        DNA Dependencies:
                           <ul>
                             <li>{row._original.dna_id} : {row._original.dna}</li>
                           </ul>
                        <br/>
                        {this.renderStatusButton(row._original.dna_id,row._original.status,row._original.running)}
                        {this.renderRunningButton(row._original.dna_id,row._original.status,row._original.running)}
                    </div>
                  );
                }
                else {
                  return (
                    <div style={{ padding: "20px" }}>
                        No DNA Dependencies or UI Pairings
                        <br/>
                        {this.renderStatusButton(row._original.dna_id,row._original.status,row._original.running)}
                        {this.renderRunningButton(row._original.dna_id,row._original.status,row._original.running)}
                    </div>);
                }
              }}
          </div>
        }}
      />
    </div>
  )}
}

export default HCInstanceTable;
