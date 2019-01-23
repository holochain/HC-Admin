// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import ToggleButton from "./ToggleButton";
import InstanceToggleButton from "./InstanceToggleButton";

/* Instance Overview : Main Table Headers */
const instance_table_columns = (props, state) => {
  console.log("Table Columns Props", props);
  console.log("Table Columns State", state);

  const table_columns = [{
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
      Header: 'Instance Name',
      accessor: 'instanceId',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
        Header: 'DNA Name',
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
    }, {
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
            getInstances={props.list_of_installed_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
          />
        </div>
      )
    }, {
      Header: 'Interface',
      accessor: 'interface',
      Cell: row => (
        <div>
        { row.value }
        </div>
      )
     }]
    }, {
      Header: '',
      columns: [
      {
        expander: true,
        Header: () => (<strong>Base DNA</strong>),
        width: 65,
        Expander: ({ isExpanded, ...rest }) =>
          <div>
            {isExpanded
              ? <span style={{
                color: '#00838c',
                marginTop: '20px',
                fontSize: '35px',
              }}>&#x2303;</span>
              :
              <span style={{
                color: '#00838c',
                marginTop: '15px',
                fontSize: '35px',
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
    ]
  }]
  return table_columns;
};
export default instance_table_columns;


export const instance_base_dna_table_columns = (props, state) => {
  console.log("Table Columns Props", props);
  console.log("Table Columns State", state);
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
        { row.value }
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
            listInstances={props.list_of_instances}
            removeInstance={props.remove_agent_dna_instance}
            addInstance={props.add_agent_dna_instance}
          />
        </div>
      )
    }]
  }]
  return table_columns;
};
