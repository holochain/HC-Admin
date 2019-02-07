// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import ToggleButton from "./ToggleButton";
import InstanceToggleButton from "./InstanceToggleButton";
import Jdenticon from "./Jdenticon";

/* Table Headers */
const dna_list_table_columns = (props, state) => {
  console.log("Table Columns Props", props);
  console.log("Table Columns State", state);
  // <Jdenticon hash={row.value} />

  const table_columns = [{
    Header: '',
    columns: [
    //   {
    //   Header: 'Type',
    //   accessor: 'type',
    //   Cell: row => (
    //     <div style={{ padding: '5px' }}>
    //     { row.value }
    //     </div>
    //   )
    // },
    {
      Header: 'DNA Name',
      accessor: 'dna_id',
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
          {row.value}
        </div>
      )
    }]
   }, {
    Header: '',
    columns: [{
      Header: 'Instances Exist',
      accessor: 'dna_instance',
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
          <ToggleButton
            installed={row.value}
            dnaList={props.list_of_dna}
            uninstallDna={props.uninstall_dna_by_id}
            installDna={props.install_dna_from_file}
          />
        </div>
      )
    }
    // , {
    //   Header: 'Interface',
    //   accessor: 'interface',
    //   Cell: row => (
    //     <div>
    //     { row.value }
    //     </div>
    //   )
    // }
  ]
  }];

  return table_columns;
}
export default dna_list_table_columns;


/* DNA Instance List Overview :: SubComponent*/
export const dna_instance_list_table_columns = (props, state) => {
  // console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);

  const table_columns = [{
    Header: '',
    columns: [{
      Header: 'Instance ID',
      accessor: 'instanceId',
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
    columns: [
    //   {
    //   Header: 'Type',
    //   accessor: 'type',
    //   Cell: row => (
    //     <div style={{ padding: '5px' }}>
    //     { row.value }
    //     </div>
    //   )
    // },
    {
      Header: 'DNA Name',
      accessor: 'dna_id',
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
            getInstances={props.get_info_instances}
            stopInstance={props.stop_agent_dna_instance}
            startInstance={props.start_agent_dna_instance}
          />
        </div>
      )
    },
    // TODO : Provide popup to show Details
    { Header: 'Web-Socket',
      accessor: 'websocket_interface',
      Cell: row => (
      <span>
        <span style={{
          color: row.value.length > 0 ? '#57d500'
            : row.value.admin === 0 ? '#ff2e00'
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
             : row.value.admin === 0 ? '#ff2e00'
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

// <Jdenticon hash={row.value} />
