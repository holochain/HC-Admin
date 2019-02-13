// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import ToggleButton from "./ToggleButton";
import InstanceToggleButton from "./InstanceToggleButton";
import Jdenticon from "./Jdenticon";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";

/* Table Headers */
const dna_list_table_columns = (props, state) => {
  console.log("Table Columns Props", props);
  console.log("Table Columns State", state);

  const table_columns = [{
    Header: '',
    columns: [
    {
      expander: true,
      Header: () => (<strong>Instance Detail</strong>),
      width: 115,
      Expander: ({ isExpanded, ...rest }) =>
        <div>
          {isExpanded ?
            <span style={{
              color: '#95b9ed', // #072dc3de
              marginTop: '23px !important',
              fontSize: '20px',
            }}>&#x2303;</span>
            :
            <span style={{
              color: '#95b9ed', // #072dc3de
              marginTop: '20px !important',
              fontSize: '20px',
            }}>&#x2304;</span>
          }
        </div>,
      style: {
        cursor: "pointer",
        fontSize: 25,
        padding: "0",
        textAlign: "center",
        userSelect: "none"
      },
    }
  ]},{
    Header: '',
    columns: [
    {
      Header: 'DNA',
      width: 192,
      accessor: 'dna_id',
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["dna_id"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Hash ID',
      accessor: 'hash',
      width: 175,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["hash"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px', marginLeft:"22px" }}>
        {row.value !== "N/A" ?
          <Jdenticon hash={row.value} />
        :
          row.value
        }
        </div>
      )
    }]
   }, {
    Header: '',
    columns: [{
      Header: 'Available Instances',
      accessor: 'dna_instance',
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["dna_instance"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        {row.value === "Yes" ?
        <div>
          <CheckCircleOutlineIcon style={{ color: "#05a2b2"}}/>
        </div>
        :
        <div>
          <CancelIcon style={{ color: "#8b3e96"}}/>
        </div>
        }
        </div>
      )
    }, {
      Header: 'Install Status',
      accessor: 'status',
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["status"] }),
      filterAll: true,
      Cell: row => (
        <div>
          <ToggleButton
            installed={row.value}
            dnaList={props.list_of_dna}
            uninstallDna={props.uninstall_dna_by_id}
            installDna={props.install_dna_from_file}
          />
        </div>
      )
    }
  ]
  }];

  return table_columns;
}
export default dna_list_table_columns;


/* DNA Instance List Overview :: SubComponent*/
export const dna_instance_list_table_columns = (props, state) => {
  const table_columns = [{
    Header: '',
    columns: [{
      Header: 'Instance',
      width: 105,
      accessor: 'instanceId',
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["instanceId"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Agent',
      width: 100,
      accessor: 'agent_id',
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["agent_id"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }]
  }, {
    Header: '',
    columns: [
    {
      Header: 'DNA Name',
      width: 160,
      accessor: 'dna_id',
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["dna_id"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Installed Status',
      accessor: 'status',
      width: 130,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["status"] }),
      filterAll: true,
      Cell: row => (
        <div>
          <InstanceToggleButton
            installed={row.value}
            listInstances={props.list_of_instances}
            removeInstance={props.remove_agent_dna_instance}
            addInstance={props.add_agent_dna_instance}
          />
        </div>
      )
    },{
      Header: 'Running Status',
      accessor: 'running',
      width: 135,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["running"] }),
      filterAll: true,
      Cell: row => (
        <div>
          <InstanceToggleButton
            running={row.value}
            listRunningInstances={props.list_of_running_instances}
            getInstances={props.get_info_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
          />
        </div>
      )
    },
    // TODO : Provide popup to show Details
    { Header: 'On WebSocket',
      accessor: 'websocket_interface',
      width: 140,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["websocket_interface"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        {row.value.length > 0 ?
        <div>
          <CheckCircleOutlineIcon style={{ color: "#05a2b2"}}/>
        </div>
        :
        <div>
          <CancelIcon style={{ color: "#8b3e96"}}/>
        </div>
        }
        </div>
      )
     },
     // TODO : Provide popup to show Details
     { Header: 'On HTTP',
        accessor: 'http_interface',
        width: 104,
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["http_interface"] }),
        filterAll: true,
        Cell: row => (
          <div style={{ padding: '5px' }}>
          {row.value.length > 0 ?
          <div>
            <CheckCircleOutlineIcon style={{ color: "#05a2b2"}}/>
          </div>
          :
          <div>
            <CancelIcon style={{ color: "#8b3e96"}}/>
          </div>
          }
          </div>
        )
       }]
    }]
  return table_columns;
};
