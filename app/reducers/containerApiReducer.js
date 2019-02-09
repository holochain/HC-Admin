import { FETCH_STATE } from '../actions/containerApi';

const INITIAL_STATE : State = {
 list_of_dna : [],
 list_of_running_instances :[],
 list_of_installed_instances : [],
 list_of_interfaces : [],
 agent_list:[],
 list_of_ui_bundle:[],
 list_of_ui_instances:[]
}

export default function(state = INITIAL_STATE, action: Action) : State {
  const { type, payload } = action
  switch (type) {
    case FETCH_STATE: {
      return { ...state };
    }

////////////////////////////////////////////////////////
    /* Reporting Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
    // LIST_OF_DNA
    case 'LIST_OF_DNA_SUCCESS': {
      console.log("LIST_OF_DNA_SUCCESS payload", payload);
      return { ...state, list_of_dna : payload };
    }

// LIST_OF_INSTANCES
    case 'LIST_OF_INSTANCES_SUCCESS': {
      console.log("LIST_OF_INSTANCES_SUCCESS payload", payload);
      return { ...state, list_of_installed_instances : payload };
    }

// LIST_OF_RUNNING_INSTANCES
    case 'LIST_OF_RUNNING_INSTANCES_SUCCESS': {
      console.log("LIST_OF_RUNNING_INSTANCES_SUCCESS payload", payload);
      return { ...state, list_of_running_instances : payload };
    }

// GET_INFO_INSTANCE
    case 'GET_INFO_INSTANCES_SUCCESS': {
      console.log("GET_INFO_INSTANCES_SUCCESS payload", payload);

      // const list_of_installed_instances = JSON.parse(payload);
      // console.log("Parsed REDUCER VERSION OF >>>> info_instances <<<<<", list_of_installed_instances);
      return { ...state, list_of_instance_info : payload };
    }

// LIST_OF_INTERFACES
    case 'LIST_OF_INTERFACES_SUCCESS': {
      console.log("LIST_OF_INTERFACES_SUCCESS payload", payload);
      return { ...state, list_of_interfaces : payload };
    }

////////////////////////////////////////////////////////
      /* Updating Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
// INSTALL_DNA_BY_ID_SUCCESS
    case 'INSTALL_DNA_FROM_FILE_SUCCESS': {
      console.log("INSTALL_DNA_FROM_FILE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'INSTALL_DNA_FROM_FILE_FAILURE': {
      console.log("INSTALL_DNA_FROM_FILE_FAILURE payload", payload);
      return { ...state };
    }

// UNINSTALL_DNA_BY_ID_SUCCESS
    case 'UNINSTALL_DNA_BY_ID_SUCCESS': {
      console.log("UNINSTALL_DNA_BY_ID_SUCCESS payload", payload);
      return { ...state };
    }

    case 'UNINSTALL_DNA_BY_ID_FAILURE': {
      console.log("UNINSTALL_DNA_BY_ID_FAILURE payload", payload);
      return { ...state };
    }

  // ADD_AGENT_DNA_INSTANCE
      case 'ADD_AGENT_DNA_INSTANCE_SUCCESS': {
        console.log("ADD_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
        return { ...state };
      }

      case 'ADD_AGENT_DNA_INSTANCE_FAILURE': {
        console.log("ADD_AGENT_DNA_INSTANCE_FAILURE payload", payload);
        return { ...state };
      }

  // REMOVE_AGENT_DNA_INSTANCE
      case 'REMOVE_AGENT_DNA_INSTANCE_SUCCESS': {
        console.log("REMOVE_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
        return { ...state };
      }

      case 'REMOVE_AGENT_DNA_INSTANCE_FAILURE': {
        console.log("REMOVE_AGENT_DNA_INSTANCE_FAILURE payload", payload);
        return { ...state };
      }

  // START_AGENT_DNA_INSTANCE
    case 'START_AGENT_DNA_INSTANCE_SUCCESS': {
      console.log("START_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'START_AGENT_DNA_INSTANCE_FAILURE': {
      console.log("START_AGENT_DNA_INSTANCE_FAILURE payload", payload);
      return { ...state };
    }

 // STOP_AGENT_DNA_INSTANCE
    case 'STOP_AGENT_DNA_INSTANCE_SUCCESS': {
      console.log("STOP_AGENT_DNA_INSTANCE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'STOP_AGENT_DNA_INSTANCE_FAILURE': {
      console.log("STOP_AGENT_DNA_INSTANCE_FAILURE payload", payload);
      return { ...state };
    }

////////////////////////////////////////////////////////////////////////
                  // INTERFACE API calls
////////////////////////////////////////////////////////////////////////
    // START_INTERFACE
    case 'START_INTERFACE_SUCCESS': {
      console.log("START_INTERFACE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'START_INTERFACE_FAILURE': {
      console.log("START_INTERFACE_FAILURE payload", payload);
      return { ...state };
    }

    // STOP_INTERFACE
    case 'STOP_INTERFACE_SUCCESS': {
      console.log("STOP_INTERFACE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'STOP_INTERFACE_FAILURE': {
      console.log("STOP_INTERFACE_FAILURE payload", payload);
      return { ...state };
    }

    // ADD_INTERFACE_INSTANCE
    case 'ADD_INSTANCE_TO_INTERFACE_SUCCESS': {
      console.log("ADD_INSTANCE_TO_INTERFACE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'ADD_INSTANCE_TO_INTERFACE_FAILURE': {
      console.log("ADD_INSTANCE_TO_INTERFACE_FAILURE payload", payload);
      return { ...state };
    }

    // REMOVE_INTERFACE_INSTANCE
    case 'REMOVE_INSTANCE_FROM_INTERFACE_SUCCESS': {
      console.log("REMOVE_INSTANCE_FROM_INTERFACE_SUCCESS payload", payload);
      return { ...state };
    }

    case 'REMOVE_INSTANCE_FROM_INTERFACE_FAILURE': {
      console.log("REMOVE_INSTANCE_FROM_INTERFACE_FAILURE payload", payload);
      return { ...state };
    }
    // GET_AGENT_LIST
    case 'GET_AGENT_LIST_SUCCESS': {
      console.log("GET_AGENT_LIST_SUCCESS payload", payload);
      return { ...state, agent_list:payload };
    }

    case 'GET_AGENT_LIST_FAILURE': {
      console.log("GET_AGENT_LIST_FAILURE payload", payload);
      return { ...state };
    }

    ////////////////////////////////////////////////////////////////////////
                      // AGENT API calls //
    ////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////
                      //  UI BUNDLEs API calls //
    ////////////////////////////////////////////////////////////////////////

    // GET_UI_LIST
    case 'GET_UI_LIST_SUCCESS': {
      // console.log("GET_UI_LIST_SUCCESS", payload);
      return { ...state, list_of_ui_bundle:payload };
    }

    case 'GET_UI_LIST_FAILURE': {
      // console.log("GET_UI_LIST_FAILURE", payload);
      return { ...state };
    }
    // INSTALL_UI
    case 'INSTALL_UI_SUCCESS': {
      // console.log("INSTALL_UI_SUCCESS", payload);
      return { ...state };
    }

    case 'INSTALL_UI_FAILURE': {
      // console.log("INSTALL_UI_FAILURE", payload);
      return { ...state };
    }
    // UNINSTALL_UI
    case 'UNINSTALL_UI_SUCCESS': {
      // console.log("UNINSTALL_UI_SUCCESS", payload);
      return { ...state};
    }

    case 'UNINSTALL_UI_FAILURE': {
      // console.log("UNINSTALL_UI_FAILURE", payload);
      return { ...state };
    }
    ////////////////////////////////////////////////////////////////////////
                      //  UI INTERFACES API calls //
    ////////////////////////////////////////////////////////////////////////

    // GET_UI_INSTANCE_LIST
    case 'GET_UI_INSTANCE_LIST_SUCCESS': {
      // console.log("GET_UI_INSTANCE_LIST_SUCCESS", payload);
      return { ...state, list_of_ui_instances:payload };
    }

    case 'GET_UI_INSTANCE_LIST_FAILURE': {
      // console.log("GET_UI_INSTANCE_LIST_FAILURE", payload);
      return { ...state };
    }
    // ADD_UI_INTERFACE
    case 'ADD_UI_INTERFACE_SUCCESS': {
      // console.log("ADD_UI_INTERFACE_SUCCESS", payload);
      return { ...state};
    }

    case 'ADD_UI_INTERFACE_FAILURE': {
      // console.log("GET_UI_INSTANCE_LIST_FAILURE", payload);
      return { ...state };
    }
    // REMOVE_UI_INTERFACe
    case 'REMOVE_UI_INTERFACe_SUCCESS': {
      return { ...state};
    }

    case 'REMOVE_UI_INTERFACe_FAILURE': {
      return { ...state };
    }
    // START_UI_INTERFACe
    case 'START_UI_INTERFACe_SUCCESS': {
      return { ...state};
    }

    case 'START_UI_INTERFACe_FAILURE': {
      return { ...state };
    }
    // STOP_UI_INTERFACe
    case 'STOP_UI_INTERFACe_SUCCESS': {
      return { ...state};
    }

    case 'STOP_UI_INTERFACe_FAILURE': {
      return { ...state };
    }
    ////////////////////////////////////////////////////////////////////////
                      // BRIDING API calls
                       //
    ////////////////////////////////////////////////////////////////////////




    ////////////////////////// DEFAULT //////////////////////////////

    default:
      return state
  }
}
