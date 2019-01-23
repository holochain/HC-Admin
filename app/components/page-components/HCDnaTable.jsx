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
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';
// ReactTable Imports
import ReactTable from "react-table";
import { advancedExpandTableHOC } from "./SystemTable";
import "react-table/react-table.css";
// Local Imports
import dna_list_table_columns, { dna_instance_list_table_columns } from './DnaTableColumns';
import routes from '../../constants/routes';
import { filterApps } from "../../utils/table-filters";
import manageAllDownloadedApps from "../../utils/helper-functions";
import { refactorDnaInstanceData, refactorListOfDnas, monitorUninstalledApps } from "../../utils/data-refactor";
import ToggleButton from "./ToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';

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
  get_info_instances: () => Promise,
  install_dna_from_file: ()=> Promise
};

type HCDnaTableState = {
  data: {} | null,
  downloaded_apps: {} | null,
  row: String,
  filter: any,
}

// For the REACT TABLE Exapandable Version: Advanced HOC
const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

class HCDnaTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      downloaded_apps: {},
   // React Table data
      row: "",
      filter: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { list_of_dna, list_of_instances, list_of_running_instances, list_of_instance_info } = props.containerApiCalls;
    console.log("DNA TABLE > Derived State: list_of_instance_info", list_of_instance_info);
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
    this.beginAppMontoring();
    // this.triggerWebClientCallTest();
  }

  callFetchState = () => {
    this.props.fetch_state();
  }

  beginAppMontoring = () => {
    // call to CMD to monitor all downloaded_apps
    this.getDownloadedApps();

    // call for GET_INFO_INSTANCES()
    this.props.get_info_instances().then(res => {
      console.log("Home props after INFO/INSTANCES call", this.props);
    });
    // call for LIST_OF_DNA()
    this.props.list_of_dna().then(res => {
      // this.callFetchState();
      console.log("Home props after LIST_OF_DNA call", this.props);
    });

    // call for LIST_OF_RUNNING_INSTANCES ()
    this.props.list_of_running_instances().then(res => {
      // this.callFetchState();
      console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
    });
  }

  getDownloadedApps = () => {
    // TODO: FIRST MAKE SURE the .hcadmin FOLDER and holochain-download FILE EXIST, and if not CREATE THEM !!
    // console.log("!!!!!!!!! ><><><><><><< INSIDE getDownloadedApps <><><><><><>< !!!!!!!!!!!");
    let self = this;
    cmd.get(
      `cd ~/.hcadmin/holochain-download && ls`,
      function(err, data, stderr) {
        if (!err) {
          console.log('~/.hcadmin/holochain-download contains these files =>> :\n', data)
          self.setState({
            downloaded_apps: manageAllDownloadedApps(data)
          });
          console.log("Apps state: ", self.state)
        }
        else {
          console.log('error', err)
        }
      }
    );
  }

  displayData = () => {
    // console.log("this.state inside displayData", this.state);
    const { downloaded_apps } = this.state;
    if (downloaded_apps && downloaded_apps!== {}){
      const { list_of_dna, list_of_running_instances, list_of_instance_info } = this.props.containerApiCalls;

      const table_files = refactorListOfDnas(downloaded_apps, list_of_dna, list_of_instance_info);

      // console.log("DATA GOING TO DNA TABLE >>>> !! table_files !! <<<<<<<< : ", table_files);
      return table_files;
    }
  }

    displaySubComponentData = (row) => {
      // console.log(">>>> ROW inside displaySubComponentData <<<<<", row.original.dna_id);
      const { list_of_running_instances, list_of_installed_instances } = this.props.containerApiCalls;
      if (list_of_installed_instances){
        // const dna_id = row.original.dna_id;
        const current_dna_instances = row.original.status.instance_list;
        // console.log("!!!!!!!!!!!! c urrent_dna_instance s!!!!!!!!!!!!!!!! ", current_dna_instances);

        const dna_instance_data_table_info =  refactorDnaInstanceData( current_dna_instances, list_of_installed_instances, list_of_running_instances );

        // console.log("DATA GOING TO INSTANCE BASE DNA TABLE >>>> !! dna_instance_data_table_info !! <<<<<<<< : ", dna_instance_data_table_info);
        return dna_instance_data_table_info;
      }
    }


  render() {
    console.log("PROPS:: ", this.props);
    // console.log("! THIS.STATE.DATA.list_of_instance_info: ", !this.state.data.list_of_instance_info);
    if (!this.state.data.list_of_dna || this.state.data.list_of_dna.length === 0){
      return <div/>
    }

    const table_data = this.displayData();
    const columns = dna_list_table_columns(this.props, this.state);
    // console.log("table_columns: ", columns);

    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={table_data}
          columns={columns}
          SubComponent={row => {

          if(row.original.status.instance_list === "N/A" || row.original.status.instance_list.length <= 0 ){
              return (
                <div style={{ paddingTop: "2px" }}>
                  <h3 style={{ color: "#567dbb", textAlign: "center" }}>No Instances Yet Exist</h3>
                </div>
              )
            }
            else {
              const dna_instance_data = this.displaySubComponentData(row);
              const dna_instance_columns = dna_instance_list_table_columns(this.props, this.state);
              return (
                <div style={{ paddingTop: "2px" }}>
                <ReactTable
                data={dna_instance_data}
                columns={dna_instance_columns}
                defaultPageSize={dna_instance_data.length}
                showPagination={false}
                style = {{ margin: "0 auto", marginBottom: "50px", width:"90%", justifyItems:"center" }}
                />
                </div>
              );
            }

         }}
      />
    </div>
  )}
}

export default HCDnaTable;

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

/////////////////////////////////////////////////////////////////////
// triggerWebClientCall = () => {
// // call for GET_INFO_INSTANCES()
//   this.props.get_info_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after INFO/INSTANCES call", this.props);
//   })
//
// // call for INSTALL_DNA_FROM_FILE ({ id, path })
//   const dna_file = {
//     id: "app spec instance 3",
//     path: "/home/lisa/Documents/gitrepos/holochain/holochain-rust/app_spec/dist/app_spec.hcpkg"
//   };
//   this.props.install_dna_from_file(dna_file).then(res => {
//     this.callFetchState();
//     console.log("Home props after INSTALL call", this.props);
//   })
//
// // call for LIST_OF_DNA()
//   this.props.list_of_dna().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_DNA call", this.props);
//   })
//
// // call for ADD_AGENT_DNA_INSTANCE ({ id })
//   const agent_dna_instance = {
//     id: "app spec instance 4",
//     dna_id:"app spec rust",
//     agent_id:"test agent 1"
//   }
//   this.props.add_agent_dna_instance(agent_dna_instance).then(res => {
//     this.callFetchState();
//     console.log("Home props after ADD_AGENT_DNA_INSTANCE call", this.props);
//   })
//
//   // call for LIST_OF_INSTANCES ()
//   this.props.list_of_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_INSTANCES call", this.props);
//   })
//
// // call for START_AGENT_DNA_INSTANCE ({ id })
//   const start_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.start_agent_dna_instance(start_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after START_AGENT_DNA_INSTANCE call", this.props);
//   })
//
//   // call for LIST_OF_RUNNING_INSTANCES ()
//   this.props.list_of_running_instances().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
//   })
//
// // call for STOP_AGENT_DNA_INSTANCE ({ id })
//   const stop_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.stop_agent_dna_instance(stop_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after STOP_AGENT_DNA_INSTANCE call", this.props);
//   })
//
// // call for UNINSTALL_DNA_BY_ID ({ id })
//   const dna_by_id = {id: "app spec instance 4"}
//   this.props.uninstall_dna_by_id(dna_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after DNA_BY_ID call", this.props);
//   })
//
// // call for REMOVE_AGENT_DNA_INSTANCE ({ id })
//   const remove_agent_dna_instance_by_id = { id: "app spec instance 4" }
//   this.props.remove_agent_dna_instance(remove_agent_dna_instance_by_id).then(res => {
//     this.callFetchState();
//     console.log("Home props after REMOVE_AGENT_DNA_INSTANCE call", this.props);
//   })


////////////////////////////////////////////////////////////////////////
                  // INTERFACE API calls
////////////////////////////////////////////////////////////////////////

// // call for START_INTERFACE ()
//   this.props.start_interface().then(res => {
//     this.callFetchState();
//     console.log("Home props after START_INTERFACE call", this.props);
//   })

// // call for ADD_INSTANCE_TO_INTERFACE ({ PUT PAYLOAD REQS HERE })
//   this.props.add_instance_to_interface().then(res => {
//     this.callFetchState();
//     console.log("Home props after ADD_INSTANCE_TO_INTERFACE call", this.props);
//   })

// // call for LIST_OF_INTERFACES ()
//   this.props.list_of_interfaces().then(res => {
//     this.callFetchState();
//     console.log("Home props after LIST_OF_INTERFACES call", this.props);
//   })

// // call for REMOVE_INSTANCE_FROM_INTERFACE ({ PUT PAYLOAD REQS HERE })
//   this.props.remove_instance_from_interface().then(res => {
//     this.callFetchState();
//     console.log("Home props after REMOVE_INSTANCE_FROM_INTERFACE call", this.props);
//   })

// // call for STOP_INTERFACE ()
//   this.props.stop_interface().then(res => {
//     this.callFetchState();
//     console.log("Home props after STOP_INTERFACE call", this.props);
//   })

/////////////////////////////////////////////////////////////////////
