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
import {manageAllDownloadedUI} from "../../utils/helper-functions";
import {uiTableDataRefactored} from "../../utils/data-refactor";

// import InstanceToggleButton from "./InstanceToggleButton"
import logo from '../../assets/icons/HC_Logo.svg';
// MUI Imports:
import { withStyles } from '@material-ui/core/styles';

/* ReactTable */
import ui_bundle_table_columns,{ui_interface_table_columns}  from './ColumnsUITable'


type HCMonitorTableState = {
  downloaded_ui_bundles: {}|null,
}

const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

class HCUiTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    downloaded_ui_bundles: null,
    };
  }

  componentDidMount = () => {
    // console.log("UI Table LOADING...");
    this.monitoringUI();
  }
  monitoringUI = () => {
    this.getDownloadedBundles();
    this.props.get_ui_list().then(res => {
      // console.log("Loading list of UI Bundles: ", this.props);
    });
    this.props.get_ui_instance_list().then(res => {
      // console.log("Loading list of UI instances: ", this.props);
    });
  }

  getDownloadedBundles = () => {
    let self = this;
    cmd.get(
      `cd ~/.hcadmin/downloaded-ui && ls`,
      function(err, data, stderr) {
        if (!err) {
          self.setState({
            downloaded_ui_bundles: manageAllDownloadedUI(data)
          });
        }
        else {
          console.log('error', err)
        }
      }
    );
  }

  displayData= ()=>{
    const { list_of_ui_bundle, list_of_ui_instances } = this.props.containerApiCalls;
    return uiTableDataRefactored(list_of_ui_bundle, list_of_ui_instances,this.state.downloaded_ui_bundles );
  }

  displayInterfaceData = (row) => {
      const interface_details =  row.original.ui_instance.map(instance =>{
        return {
          ui_interface_id:instance.id,
          interface_type:instance.dna_interface,
          port:instance.port
        }
      })
  return interface_details;
  }


  render() {
    console.log("Rending UI TABLE : ", this.props);
    if (!this.props.containerApiCalls.length === 0 ){
      return <div/>
    }
    const columns = ui_bundle_table_columns(this.props, this.state);
    const table_data= this.displayData();
    console.log("UI Table Data: ", table_data);

    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          defaultPageSize={10}
          className="-striped -highlight"
          data={table_data}
          columns={columns}
          SubComponent={row => {
            {/*const addInstance = (custom_agent_id, custom_instance_id, interfaceforInstance) => {
              console.log("<><><><><> customAgentId <><><<><>", custom_agent_id);
              console.log("<><><><><> customInstanceId <><><<><>", custom_instance_id);
              console.log("<><><><><> interfaceforInstance <><><<><>", interfaceforInstance);
              const { dna_id } = row.original;
              const agent_id = custom_agent_id ? custom_agent_id : this.props.containerApiCalls.agent_list[0].id; // HC AGENT ID
              const instance_id = custom_instance_id ?  custom_instance_id : (dna_id + agent_id);
              const interface_id = interfaceforInstance;

              this.props.add_agent_dna_instance({id, dna_id, agent_id}).then(res => {
                this.props.add_instance_to_interface({instance_id, interface_id});
              })
            }*/}

            if(!row.original.ui_instance_exist){
                return (
                  <div style={{ paddingTop: "2px" }}>
                    <h3 style={{ color: "#567dbb", textAlign: "center" }}>No Instances Yet Exist</h3>

                    {/*<div style={{ justifyItems: "center", display:"inline", margin:"2px 5px 8px 5px" }}>
                      <AddInstanceForm availableAgentList={this.props.containerApiCalls.agent_list}
                      assignInstanceNewInterface={this.props.containerApiCalls.list_of_interfaces} handleAddInstance={addInstance} />
                    </div>*/}
                  </div>
                )
              }
              else {
                const dna_instance_data = this.displayInterfaceData(row);

                return (
                  <div style={{ paddingTop: "2px", marginBottom:"8px" }}>
                    {/*<div style={{ justifyItems: "center", display:"inline", margin:"2px" }}>
                      <AddInstanceForm availableAgentList={this.props.containerApiCalls.agent_list} assignInstanceNewInterface={this.props.containerApiCalls.list_of_interfaces}
                      handleAddInstance={addInstance} />
                    </div>*/}

                    <ReactTable
                      data={dna_instance_data}
                      columns={ui_interface_table_columns()}
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

export default HCUiTable;
