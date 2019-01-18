// Main Imports
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cmd from 'node-cmd'
// electron:
import * as electron from "electron";
// ReactTable Imports
import ReactTable from "react-table";
import { advancedExpandTableHOC } from "./SystemTable";
import "react-table/react-table.css";
// Local Imports
import routes from '../../constants/routes';
import { filterApps } from "../../utils/table-filters";
import { monitorUninstalledApps } from "../../utils/helper-functions";
import { dataRefactor } from "../../utils/data-refactor";
// import { hcJoin,hcUninstall,hcStart,hcStop } from "../utils/hc-install";
// import { getRunningApps,decideFreePort } from "../utils/running-app";
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';


const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);
/* Table Headers */
const columns = [{
    Header: 'App Info',
    columns: [{
      Header: 'App Name',
      accessor: 'appName'
    }, {
      Header: 'Username',
      accessor: 'agent_id',
    }]
  }, {
    Header: 'App Details',
    columns: [{
      Header: 'Type',
      accessor: 'type'
    }, {
      Header: 'Hash',
      accessor: 'hash'
    },{
      Header: 'Instance ID',
      accessor: 'instanceId'
    }, {
      Header: 'Status',
      accessor: 'status',
      Cell: row => (
        <span>
          <span style={{
            color: row.value === 'installed' ? '#57d500'
              : row.value === 'uninstalled' ? '#ff2e00'
              : '#ffbf00',
            transition: 'all .3s ease'
          }}>
            &#x25cf;
          </span> {
            row.value === 'installed' ? `Installed`
            : row.value === 'uninstalled' ? `Uninstalled`
            : 'Bridging'
          }
        </span>
      )
    },{
      Header: 'Running',
      accessor: 'running',
      Cell: row => (
        <span>
          <span style={{
            color: row.value === true ? '#57d500'
              : row.value === false ? '#ff2e00'
              : '#ffbf00',
            transition: 'all .3s ease'
          }}>
            &#x25cf;
          </span> {
            row.value === true ? `Running`
            : row.value === false ? `Stopped`
            : 'Unknown'
          }
        </span>
      )
    }]
  }];

type HCMonitorTableProps = {
  list_of_dna : [{
    id: String,
    hash: String
  }],
  list_of_instances : [{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_running_instances :[{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_instance_info : [{
    id: String,
    dna: String,
    agent: String,
    storage: {
      path: String,
      type: String
    }
  }],
  fetch_state: () => void,
  get_info_instances: () => Promise,
  install_dna_from_file: ()=> Promise
};

type HCMonitorTableState = {
  data: {} | null,
  row: String,
  filter: any,
  ////////
  list_of_dna : [{
    id: String,
    hash: String
  }],
  list_of_instances : [{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_running_instances :[{
    id: String,
    dna: String,
    agent: String
  }],
  list_of_instance_info : [{
    id: String,
    dna: String,
    agent: String,
    storage: {
      path: String,
      type: String
    }
  }],
}

class HCMonitorTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list_of_dna : [{
        id: "",
        hash: ""
      }],
      list_of_instances : [{
        id: "",
        dna: "",
        agent: ""
      }],
      list_of_running_instances :[{
        id: "",
        dna: "",
        agent: ""
      }],
      list_of_instance_info : [{
        id: "",
        dna: "",
        agent: "",
        storage: {
          path: "",
          type: "file"
        }
      }],
      downloaded_apps: {
        appName: ""
      },
   // React Table data
      data: {},
      row: "",
      filter: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { list_of_dna, list_of_instances, list_of_running_instances, list_of_instance_info } = props.containerApiCalls;

    if (!list_of_instance_info) {
      return null;
    }
    else {
      const appData = { list_of_instance_info, list_of_dna, list_of_running_instances };
      const prevProps = state.prevProps || {};
      const data = prevProps.value !== appData ? appData : state.data

      console.log("data", data);
      return ({ data });
    }
  }

  componentDidMount = () => {
    // this.triggerWebClientCallTest();
    this.beginAppMontoring();
  }

  callFetchState = () => {
    this.props.fetch_state();
  }

  beginAppMontoring = () => {
    // call to CMD to monitor all downloaded_apps
    // this.getDownloadedApps();

    // call for GET_INFO_INSTANCES()
    this.props.get_info_instances().then(res => {
      console.log("Home props after INFO/INSTANCES call", this.props);
      if(this.props.containerApiCalls.list_of_instance_info) {
        const installed_apps = this.props.containerApiCalls.list_of_instance_info;
        // console.log("................installed_apps : ", installed_apps);
        this.setState({
          installed_apps,
          downloaded_apps: installed_apps // TODO: delete this part once the DOWNLOAD FOLDER functionality is in place.
        });

        // call for LIST_OF_DNA()
        this.props.list_of_dna().then(res => {
          this.callFetchState();
          console.log("Home props after LIST_OF_DNA call", this.props);
        })

        // call for LIST_OF_RUNNING_INSTANCES ()
        this.props.list_of_running_instances().then(res => {
          this.callFetchState();
          console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
        })

        console.log("this.state AFTER CONTAINER API CALLS", this.state);
      }
    })
  }

  getDownloadedApps = () => {
    let self = this;
    cmd.get(
      `cd ~/.hcadmin/holochain-download && ls`,
      function(err, data, stderr) {
        if (!err) {
          console.log('~/.hcadmin/holochain-download contains these files :\n>>', data)
          self.setState({
            downloaded_apps: manageAllDownloadedApps(data)
          });
          console.log("Apps state: ", self.state)
        } else {
          console.log('error', err)
        }
      }
    );
  }

  displayData = () => {
    console.log("this.state inside displayData", this.state);
    if (this.state.installed_apps){
      const { installed_apps, downloaded_apps } = this.state;
      const { list_of_dna, list_of_instances, list_of_running_instances, list_of_instance_info } = this.props.containerApiCalls;

      // const filtered_apps = filterApps(installed_apps, downloaded_apps);
      const app_data = dataRefactor(list_of_instance_info, list_of_dna, list_of_running_instances, downloaded_apps);
      console.log("App Data: ",app_data);
      return app_data;
    }
  }


  render() {
    if (this.state.data.list_of_instance_info.length === 0){
      return <div>this.props.list_of_instance_info is empty or undefined...</div>
    }

    const table_data = this.displayData();
    console.log("Table Data: ", table_data);

    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          data={table_data}
          columns={columns}
          defaultPageSize={500}
          className="-striped -highlight"
          SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
            <div/>
// ******** TODO: USE / reconfigure THE SubComponent Below for displaying the UI DNA dependencies, or the DNA links to/pairings with UI. ***********

          // SubComponent={({ row, nestingPath, toggleRowSubComponent }) => {
          //   if(row._original.ui_pairing!==undefined){
          //     return (
          //       <div style={{ padding: "20px" }}>
          //           UI Link: {row._original.uiLink}
          //           <br/>
          //           {this.renderStatusButton(row._original.appName,row._original.status,row._original.running)}
          //           {this.renderRunningButton(row._original.appName,row._original.status,row._original.running)}
          //       </div>
          //     );
          //   }else if (row._original.dna_dependencies!==undefined) {
          //     return (
          //       <div style={{ padding: "20px" }}>
          //           DNA Dependencies:
          //              <ul>
          //                <li>{row._original.appName} : {row._original.dna}</li>
          //              </ul>
          //           <br/>
          //           {this.renderStatusButton(row._original.appName,row._original.status,row._original.running)}
          //           {this.renderRunningButton(row._original.appName,row._original.status,row._original.running)}
          //       </div>
          //     );
          //   }
          //   else{
          //     return (
          //       <div style={{ padding: "20px" }}>
          //           No Bridges
          //           <br/>
          //           {this.renderStatusButton(row._original.appName,row._original.status,row._original.running)}
                //     {this.renderRunningButton(row._original.appName,row._original.status,row._original.running)}
                // </div>);
            // }
          }}
        />
      </div>
    )
  }
}

export default HCMonitorTable;
