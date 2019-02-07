// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import ToggleButtonUIBundle from "./ToggleButtonUIBundle";
import InstanceToggleButton from "./InstanceToggleButton";

/* Table Headers */
const ui_bundle_table_columns = (props, state) => {
  // console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);

  const table_columns = [{
    Header: '',
    columns: [{
      Header: 'UI Bundle Name',
      accessor: 'ui_bundle_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Hash',
      accessor: 'hash',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }]
   }, {
    Header: '',
    columns: [{
      Header: 'Interfaces Exist',
      accessor: 'ui_instance_exist',
      Cell: row => (
      <span>
        <span style={{
          color: row.value  ? '#57d500'
            : !row.value ? '#ff2e00'
            : '#ffbf00',
          transition: 'all .3s ease'
        }}>
          &#x25cf;
        </span> {
          row.value
        }
      </span>
    )
    }, {
      Header: 'Status',
      accessor: 'status',
      Cell: row => (
        <div>
        <span>
          <span style={{
            color: row.value.value === 'Installed' ? '#57d500'
              : row.value.value === 'Uninstalled' ? '#ff2e00'
              : '#ffbf00',
            transition: 'all .3s ease'
          }}>
            &#x25cf;
          </span> {
            row.value.value === 'Installed' ? `Installed`
            : row.value.value === 'Uninstalled' ? `Uninstalled`
            : 'Bridging'
          }
        </span>
        <br/>
        <ToggleButtonUIBundle
            installed={row.value.value}
            values={row.value}
            dnaList={props.list_of_dna}
            uninstallUIBundle={props.uninstall_ui}
            installUIBundle={props.install_ui}
          />
        </div>
    )
    }]
  }];

  return table_columns;
}
export default ui_bundle_table_columns;

export const ui_interface_table_columns = () => {

  const table_columns = [{
    Header: '',
    columns: [{
      Header: 'Interface Id',
      accessor: 'ui_interface_id',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    }, {
      Header: 'Type',
      accessor: 'interface_type',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        { row.value }
        </div>
      )
    },
    {
      Header: 'Port',
      accessor: 'port',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        <a href={"http://localhost:"+row.value}>{ row.value }</a>
      </div>
      )
    }]
  }];
  return table_columns;
}
