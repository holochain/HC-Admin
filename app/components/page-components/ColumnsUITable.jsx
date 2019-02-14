// Principal Imports
import * as React from 'react';
import * as redux from 'redux';
import { handleLoadLinkInBrowser } from "../../utils/helper-functions";
import ToggleButtonUIBundle from "./ToggleButtonUIBundle";
import ToggleButtonUIInterface from "./ToggleButtonUIInterface";
import InstanceToggleButton from "./InstanceToggleButton";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
// Imports necessary to support browser target for port opening via ui port link
import electron, { shell } from 'electron';
import * as electronBrowser from "electron-open-link-in-browser";

const WEB_INTERFACE_ENV =
  process.env.NODE_ENV === 'production'
    ? "https://"
    : 'http://localhost:';


/* Table Headers */
const ui_bundle_table_columns = (props, state) => {
  // console.log("Table Columns Props", props);
  // console.log("Table Columns State", state);

  const table_columns = [{
    Header: '',
    columns: [
      {
        expander: true,
        Header: () => (<strong>Interface Detail</strong>),
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
    ]},
    {
        Header: '',
        columns: [
        {
        Header: 'UI Bundle',
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
          <div style={{ padding: '5px' }}>
          {row.value ?
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
      Header: 'Installed Status',
      accessor: 'status',
      Cell: row => (
        <div>
        <ToggleButtonUIBundle
            installed={row.value.value}
            values={row.value}
            dnaList={props.list_of_dna}
            uninstallUIBundle={props.uninstall_ui}
            installUIBundle={props.install_ui}
          />
        </div>
      )
    }
  ]
}];

  return table_columns;
}
export default ui_bundle_table_columns;


export const ui_interface_table_columns = (props) => {
const table_columns = [{
    Header: '',
    columns: [{
      Header: 'Interface',
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
    }, {
      Header: 'Port',
      accessor: 'port',
      Cell: row => (
        <div style={{ padding: '5px' }}>
        <a style={{ color:'#05a2b2' }} onClick={() => handleLoadLinkInBrowser(WEB_INTERFACE_ENV + row.value)}>{ row.value }</a>
      </div>
      )
    }, {
      Header: 'Running Status',
      accessor: 'port_check',
      Cell: row => (
        <div>
        <ToggleButtonUIInterface
            running={row.value[0].port_running}
            values={row.value[0]}
            stop_ui_interface={props.stop_ui_interface}
            start_ui_interface={props.start_ui_interface}
          />
        </div>
    )
    }]
  }];
  return table_columns;
}

// PORT LOGIC >> Opens up child window (still in electron container):
// href={WEB_INTERFACE_ENV + row.value}
// target="_blank"

// ALTERNATIVE VIEW: TOGGLE RUNNING UI Button to allow control over turning on/off UI...
// Cell: row => (
//   <div>
//   <span>
//     <span style={{
//       color: row.value[0].port_running === true ? '#57d500'
//         : row.value[0].port_running === false ? '#ff2e00'
//         : '#ffbf00',
//       transition: 'all .3s ease'
//     }}>
//       &#x25cf;
//     </span> {
//       row.value[0].port_running === true ? `Running`
//       : row.value[0].port_running === false ? `Stopped`
//       : 'NA'
//     }
//   </span>
//   <br/>
//   <ToggleButtonUIInterface
//       running={row.value[0].port_running}
//       values={row.value[0]}
//       stop_ui_interface={props.stop_ui_interface}
//       start_ui_interface={props.start_ui_interface}
//     />
//   </div>
// )
