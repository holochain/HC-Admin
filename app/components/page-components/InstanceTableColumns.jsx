// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import ToggleButton from "./ToggleButton";
import InstanceToggleButton from "./InstanceToggleButton";
import matchSorter from 'match-sorter'
import Jdenticon from "./Jdenticon";

/* Instance Overview : Main Table Headers */
const instance_table_columns = (props, state) => {
  // console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);

  const table_columns = [{
    Header: '',
    columns: [{
        Header: 'Type',
        accessor: 'type',
        filterMethod: (filter, rows) =>
          matchSorter(rows, filter.value, { keys: ["type"] }),
        filterAll: true,
        Cell: row => (
          <div style={{ padding: '5px' }}>
          { row.value }
          </div>
        )
      }, {
      Header: 'Instance Name',
      id: "instanceId",
      accessor: d => d.instanceId,
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["instanceId"] }),
      filterAll: true,
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
        Header: 'DNA Name',
        id: 'dna_id',
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
      Header: 'Username',
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
      Header: 'Status',
      id: 'status',
      accessor:"status",
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["status.status"] }),
        filterAll: true,
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
    }, {
      Header: 'Running',
      id: 'running',
      accessor:  "running",
      filterMethod: (filter, rows) =>
        matchSorter(rows, filter.value, { keys: ["running.running"] }),
        filterAll: true,
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
            getInstances={props.list_of_installed_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
            addInterface={props.add_instance_to_interface}

          />
        </div>
      )
    },   // TODO : Provide popup to show Details
      { Header: 'Web-Socket',
        accessor: 'websocket_interface',
        Cell: row => (
        <span>
          <span style={{
            color: row.value.length > 0 ? '#57d500'
              : row.value.length === 0 ? '#ff2e00'
              : '#ffbf00',
            transition: 'all .3s ease'
          }}>
            &#x25cf;
          </span> {
            row.value.driver
          }
        </span>
      )
       },
       // TODO : Provide popup to show Details
      { Header: 'http',
         accessor: 'http_interface',
         Cell: row => (
         <span>
           <span style={{
             color: row.value.length > 0? '#57d500'
               : row.value.length === 0 ? '#ff2e00'
               : '#ffbf00',
             transition: 'all .3s ease'
           }}>
             &#x25cf;
           </span> {
             row.value.admin
           }
         </span>
       )
        }]
    }]
  return table_columns;
};
export default instance_table_columns;


export const instance_base_dna_table_columns = (props, state) => {
  // console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);
  const table_columns = [{
    Header: 'Instance Base DNA',
    columns: [{
      Header: 'DNA Name',
      accessor: 'dna_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Type',
      accessor: 'type',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'DNA Hash',
      accessor: 'hash',
      Cell: row => (
        <div style={{ padding: '5px' }}>
          {row.value}
        </div>
      )
    },{
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
          <InstanceToggleButton // change this to ToggleButton, once it is complete...
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
