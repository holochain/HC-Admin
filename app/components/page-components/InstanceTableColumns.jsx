// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import ToggleButton from "./ToggleButton";
import InstanceToggleButton from "./InstanceToggleButton";
import matchSorter from 'match-sorter'
import Jdenticon from "./Jdenticon";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";

/* Instance Overview : Main Table Headers */
const instance_table_columns = (props, state) => {
  // console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);

  const table_columns = [{
    Header: '',
    columns: [
    {
      expander: true,
      Header: () => (<strong>Base Detail</strong>),
      width: 128,
      filterMethod: () =>
      (
        <div>
          <Search style={{ color: "#95b9ed"}}/>
        </div>
      ),
        filterAll: true,
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
        Header: 'Instance',
        id: 'dna_id',
        width: 157,
        accessor: d => d.dna_id,
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["dna_id"] }),
          filterAll: true,

        Cell: row => (
          <div style={{ padding: '5px' }}>
              { row.value }
          </div>
        )
      }, {
      Header: 'Agent',
      id: 'agent_id',
      accessor: d => d.agent_id,
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
  columns: [{
      Header: 'Installed Status',
      id: 'status',
      accessor:"status",
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["status.status"] }),
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
    }, {
      Header: 'Running Status',
      id: 'running',
      accessor:  "running",
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["running.running"] }),
        filterAll: true,
      Cell: row => (
        <div>
          <InstanceToggleButton
            running={row.value}
            listRunningInstances={props.list_of_running_instances}
            getInstances={props.list_of_installed_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
            addInterface={props.add_instance_to_interface}
          />
        </div>
      )
    },   // TODO : Provide popup to show Details
      { Header: 'On WebSocket',
        accessor: 'websocket_interface',
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
export default instance_table_columns;


export const instance_base_dna_table_columns = (props, state) => {
  const table_columns = [{
    Header: '',
    columns: [
    {
      Header: 'DNA Name',
      accessor: 'dna_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'DNA Hash',
      accessor: 'hash',
      Cell: row => (
        <div style={{ padding: '5px', marginLeft:"22px" }}>
        {row.value !== "N/A" ?
          <Jdenticon hash={row.value} />
        :
          row.value
        }
        </div>
      )
    },{
      Header: 'Status',
      accessor: 'status',
      Cell: row => (
        <div>
          <InstanceToggleButton
            installed={row.value}
            addInterface={props.add_instance_to_interface}
            removeInstance={props.remove_agent_dna_instance}
            addInstance={props.add_agent_dna_instance}
          />
        </div>
      )
    }]
  }]
  return table_columns;
};
