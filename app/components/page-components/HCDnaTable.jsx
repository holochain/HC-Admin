// Main Imports
import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
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
import AddInstanceForm from "./AddInstanceForm";
import ToggleButton from "./ToggleButton";
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

    this.props.list_of_installed_instances().then(res => {
      // this.callFetchState();
      console.log("Home props after list_of_installed_instances call", this.props);
    });

    this.props.get_agent_list().then(res => {
      // this.callFetchState();
      console.log("Home props after GET_AGENT_LIST call", this.props);
    });

    this.props.list_of_interfaces().then(res => {
      console.log("Home props after LIST_OF_INTERFACES call", this.props);
    })
  }

  getDownloadedApps = () => {
    // TODO: FIRST MAKE SURE the .hcadmin FOLDER and holochain-download FILE EXIST, and if not CREATE THEM !!
    // console.log("!!!!!!!!! ><><><><><><< INSIDE getDownloadedApps <><><><><><>< !!!!!!!!!!!");
    let self = this;
    console.log("******************::GET DOWNLOADED APPS::");
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
    console.log("this.state inside displayData", this.state);

    const { downloaded_apps } = this.state;
    // console.log('downloaded_apps && Object.keys(downloaded_apps).length > 0', downloaded_apps && Object.keys(downloaded_apps).length > 0);
      const { list_of_dna,
        // list_of_running_instances,
        list_of_instance_info } = this.props.containerApiCalls;

      // console.log("downloaded_apps", Object.keys(downloaded_apps));
      const table_files = refactorListOfDnas(downloaded_apps, list_of_dna, list_of_instance_info);
      return table_files;

  }

  displaySubComponentData = (row, parent_table_data) => {
    const current_dna_instances = row.original.status.instance_list;
    if (this.props.containerApiCalls.list_of_installed_instances && this.props.containerApiCalls.list_of_running_instances && current_dna_instances){
      // const dna_id = row.original.dna_id;
      const { list_of_running_instances, list_of_installed_instances } = this.props.containerApiCalls;
      const dna_instance_data_table_info =  refactorDnaInstanceData( current_dna_instances, list_of_installed_instances, list_of_running_instances );

      // console.log("DATA GOING TO INSTANCE BASE DNA TABLE >>>> !! dna_instance_data_table_info !! <<<<<<<< : ", dna_instance_data_table_info);
      return dna_instance_data_table_info;
    }
  }


 render() {
  console.log("Rending DNA TABLE : ", this.props);
  // console.log("! THIS.STATE.DATA.list_of_instance_info: ", !this.state.data.list_of_instance_info);
  if (!this.props.containerApiCalls.length === 0 ){
    return <div/>
  }

  const table_data = this.displayData();
  const columns = dna_list_table_columns(this.props, this.state);
  console.log("table_columns: ", table_data);
  console.log("table_columns: ", columns);

  return (
    <div className={classnames("App")}>
      <AdvancedExpandReactTable
        data={table_data ? table_data : []}
        columns={columns}
        className="-striped -highlight"
        defaultPageSize={table_data ? table_data.length : 5}
        showPagination={false}
        SubComponent={row => {
          const addInstance = (custom_agent_id, custom_instance_id, interfaceforInstance) => {
            // console.log("<><><><><> customAgentId <><><<><>", custom_agent_id);
            // console.log("<><><><><> customInstanceId <><><<><>", custom_instance_id);
            // console.log("<><><><><> interfaceforInstance <><><<><>", interfaceforInstance);
            const { dna_id } = row.original;
            const agent_id = custom_agent_id ? custom_agent_id : this.props.containerApiCalls.agent_list[0].id; // HC AGENT ID
            const instance_id = custom_instance_id ?  custom_instance_id : (dna_id + agent_id);
            const interface_id = interfaceforInstance;

            this.props.add_agent_dna_instance({id, dna_id, agent_id}).then(res => {
              this.props.add_instance_to_interface({instance_id, interface_id});
            })
          }

          if(row.original.status.instance_list === "N/A" || row.original.status.instance_list.length <= 0 ){
              return (
                <div style={{ paddingTop: "2px" }}>
                  <h3 style={{ color: "#567dbb", textAlign: "center" }}>No Instances Yet Exist</h3>

                  <div style={{ justifyItems: "center", display:"inline", margin:"2px 5px 8px 5px" }}>
                    <AddInstanceForm availableAgentList={this.props.containerApiCalls.agent_list}
                    assignInstanceNewInterface={this.props.containerApiCalls.list_of_interfaces} handleAddInstance={addInstance} />
                  </div>
                </div>
              )
            }
            else {
              const dna_instance_data = this.displaySubComponentData(row, table_data);
              const dna_instance_columns = dna_instance_list_table_columns(this.props, this.state);

              return (
                <div style={{ paddingTop: "2px", marginBottom:"8px" }}>
                  <div style={{ justifyItems: "center", display:"inline", margin:"2px" }}>
                    <AddInstanceForm availableAgentList={this.props.containerApiCalls.agent_list} assignInstanceNewInterface={this.props.containerApiCalls.list_of_interfaces}
                    handleAddInstance={addInstance} />
                  </div>

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
// const HCDnaTable = () => (
//   <div className="page-error">
//   <QueueAnim type="bottom">
//   <div key="1">
//   <HCDnaTableMain style={{textAlign:'center', margin:'0 auto'}} />
//   </div>
//   </QueueAnim>
//   </div>
// );
