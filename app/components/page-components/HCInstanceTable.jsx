import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';
import classnames from 'classnames';
import cmd from 'node-cmd';
import * as electron from "electron";
import ReactTable from "react-table";
import { advancedExpandTableHOC } from "./SystemTable";
import "react-table/react-table.css";
import routes from '../../constants/routes';
import { filterApps } from "../../utils/table-filters";
import manageAllDownloadedApps from "../../utils/helper-functions";
import { dataRefactor, refactorBaseDna, refactorInstanceData } from "../../utils/data-refactor";
import logo from '../../assets/icons/HC_Logo.svg';
import { withStyles } from '@material-ui/core/styles';
import instance_table_columns, { instance_base_dna_table_columns } from './InstanceTableColumns'

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

// For the REACT TABLE Exapandable Version: Advanced HOC
const AdvancedExpandReactTable = advancedExpandTableHOC(ReactTable);

class HCInstanceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
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
      return ({ data });
    }
  }

  componentDidMount = () => {
    this.beginAppMontoring();
  }

  beginAppMontoring = () => {
    this.props.list_of_dna().then(res => {
    });

    this.props.list_of_installed_instances().then(res => {
    })
  this.props.list_of_running_instances().then(res => {
      // console.log("Home props after LIST_OF_RUNNING_INSTANCES call", this.props);
    })

    this.props.list_of_interfaces().then(res => {
    })
  }

  displayData = () => {
    // console.log("this.state inside displayData", this.state);
    if (this.props.containerApiCalls.list_of_running_instances){
      const { list_of_running_instances, list_of_installed_instances ,list_of_interfaces} = this.props.containerApiCalls;

      const table_dna_instance_info =  refactorInstanceData(list_of_installed_instances, list_of_running_instances,list_of_interfaces);

      this.setSearchBarDataReference(table_dna_instance_info, {});
      return table_dna_instance_info;
    }
  }

  displaySubComponentData = (row, parent_table_data) => {
    if (this.props.containerApiCalls.list_of_installed_instances){
      const { list_of_dna } = this.props.containerApiCalls;
      const instance_dna_id = row.original.dna_id;
      const instance_base_dna_table_info = refactorBaseDna(instance_dna_id, list_of_dna);
      this.setSearchBarDataReference(parent_table_data, instance_base_dna_table_info);
      return instance_base_dna_table_info;
    }
    else {
      this.setSearchBarDataReference(parent_table_data, {});
    }
  }


// for the HEADER custom search bar...
  setSearchBarDataReference = async (table_data, instance_base_dna_table_data) => {
    const reduced_table_data_obj = table_data.reduce(((result, current) => Object.assign(result, current)), {});
    const table_data_values_as_array =
      Object
      .keys(reduced_table_data_obj)
      .map(key => {
        // if the value of any of obj keys is, itslef, another object, then iteratively etner and return those values...
        if(typeof reduced_table_data_obj[key] === {}){
          return reduced_table_data_obj[key] = Object.keys(reduced_table_data_obj);
        }
        // otherwise return the value of the key (should be string...)
        return reduced_table_data_obj[key]
      })
      // for good measure, filter out any value that wasn't a string...
      .filter(newValue => typeof newValue === "string");

      let instance_base_dna_table_data_values_as_array = [];
    if (instance_base_dna_table_data !== [] && instance_base_dna_table_data.length > 0) {
      const reduced_instance_base_dna_table_data_obj = instance_base_dna_table_data.reduce(((result, current) => Object.assign(result, current)), {});
      instance_base_dna_table_data_values_as_array =
      Object
      .keys(reduced_instance_base_dna_table_data_obj)
      .map(key => {
        if(typeof reduced_instance_base_dna_table_data_obj[key] === {}){
          return reduced_instance_base_dna_table_data_obj[key] = Object.keys(reduced_instance_base_dna_table_data_obj);
        }
        return reduced_instance_base_dna_table_data_obj[key]
      })
      .filter(newValue => typeof newValue === "string");
    }
    const searchBarDataSet = await table_data_values_as_array.concat(instance_base_dna_table_data_values_as_array);
  }


  render() {
    if (!this.props.containerApiCalls.length === 0){
      return <div/>
    }

    const table_data = this.displayData();
    const columns = instance_table_columns(this.props, this.state);
    console.log("TABLE ::: ",table_data);
    return (
      <div className={classnames("App")}>
        <AdvancedExpandReactTable
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value
          }
          data={table_data ? table_data : []}
          columns={columns}
          className="-striped -highlight"
          defaultPageSize={5}
          showPagination={false}
          SubComponent={row => {
            const base_dna_data = this.displaySubComponentData(row, table_data);
            const base_dna_columns = instance_base_dna_table_columns(this.props, this.state);

            return (
              <div style={{ paddingTop: "2px" }}>
                <ReactTable
                  data={base_dna_data}
                  columns={base_dna_columns}
                  defaultPageSize={base_dna_data.length}
                  showPagination={false}
                  style = {{ margin: "0 auto", marginBottom: "5px", width:"90%", justifyItems:"center" }}
                />
             </div>
           );
         }}
      />
    </div>
  )}
}

export default HCInstanceTable;
