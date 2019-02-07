export const FETCH_STATE = 'FETCH_STATE';
export const GET_INFO_INSTANCES = 'GET_INFO_INSTANCES';

/*************************************************************************************************************************/
                                                    /* DNA FUNCTIONALITY */
/*************************************************************************************************************************/
////////////////////////////////////////////////////////
             /* Reporting Container DNAs */
////////////////////////////////////////////////////////
// call for LIST_OF_DNA ()
export function list_of_dna() {
  console.log(">> LIST_OF_DNA : payload <<");
  return {
    type: 'LIST_OF_DNA',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/dna/list`
    }
  }
}

////////////////////////////////////////////////////////
            /* Updating Container DNAs */
////////////////////////////////////////////////////////
// call for INSTALL_DNA_FROM_FILE ({id, path })
export function install_dna_from_file(payload) {
  console.log(">> INSTALL_DNA_FROM_FILE : payload <<", payload)
  return {
    type: 'INSTALL_DNA_FROM_FILE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/dna/install_from_file`
    }
  }
}

// call for UNINSTALL_DNA_BY_ID ({ id })
export function uninstall_dna_by_id(payload) {
  console.log(">> UNINSTALL_DNA_BY_ID : payload <<", payload)
  return {
    type: 'UNINSTALL_DNA_BY_ID',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/dna/uninstall`
    }
  }
}

// !!!!!!!!!!!!!!!! NEW DNA CALL THAT STILL NEED TO IMPLEMENT !!!!!!!!!!!!!!!!
// dna/create/from_template

/*************************************************************************************************************************/
                                             /* INSTANCES FUNCTIONALITY */
/*************************************************************************************************************************/
////////////////////////////////////////////////////////
    /* Reporting Container DNA-instances */
////////////////////////////////////////////////////////
// call LIST_OF_INSTANCES ()
export function list_of_installed_instances() {
  console.log(">> LIST_OF_INSTANCES : payload <<");
  return {
    type: 'LIST_OF_INSTANCES',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/instance/list`
    }
  }
}

// LIST_OF_RUNNING_INSTANCES ()
export function list_of_running_instances() {
  console.log(">> LIST_OF_RUNNING_INSTANCES : payload <<");
  return {
    type: 'LIST_OF_RUNNING_INSTANCES',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/instance/running`
    }
  }
}

// call for GET_INFO_INSTANCES ()
export function get_info_instances() {
  return {
    type: 'GET_INFO_INSTANCES',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: 'info/instances'
    }
  }
}


////////////////////////////////////////////////////////
    /* Updating Container DNA-instances */
////////////////////////////////////////////////////////
// call for ADD_AGENT_DNA_INSTANCE ({id, dna_id, agent_id})
export function add_agent_dna_instance(payload) {
  console.log(">> ADD_AGENT_DNA_INSTANCE : payload <<");
  return {
    type: 'ADD_AGENT_DNA_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/instance/add`
    }
  }
}

// call for REMOVE_AGENT_DNA_INSTANCE ({id, dna_id, agent_id})
export function remove_agent_dna_instance(payload) {
  console.log(">> REMOVE_AGENT_DNA_INSTANCE : payload <<");
  return {
    type: 'REMOVE_AGENT_DNA_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/instance/remove`
    }
  }
}

// call START_AGENT_DNA_INSTANCE ({ id })
export function start_agent_dna_instance(payload) {
  console.log(">> START_AGENT_DNA_INSTANCE : payload <<");
  return {
    type: 'START_AGENT_DNA_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/instance/start`
    }
  }
}

// call STOP_AGENT_DNA_INSTANCE ({ id })
export function stop_agent_dna_instance(payload) {
  console.log(">> STOP_AGENT_DNA_INSTANCE : payload <<");
  return {
    type: 'STOP_AGENT_DNA_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/instance/stop`
    }
  }
}


/*************************************************************************************************************************/
                                                    /* INTERFACE FUNCTIONALITY */
/*************************************************************************************************************************/
////////////////////////////////////////////////////////////////////////
              /* Reporting Container INTERFACES */
////////////////////////////////////////////////////////////////////////
// call LIST_OF_INTERFACES ()
export function list_of_interfaces() {
  console.log(">> LIST_OF_INTERFACES : payload <<");
  return {
    type: 'LIST_OF_INTERFACES',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/list`
    }
  }
}

////////////////////////////////////////////////////////
          /* Updating Container INTERFACES */
////////////////////////////////////////////////////////
// call START_INTERFACE ()
// NB: This call starts the INTERFACE by adding a new interface
export function start_interface() {
  console.log(">> START_INTERFACE <<");
  return {
    type: 'START_INTERFACE',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/add`
    }
  }
}

// call STOP_INTERFACE ()
// NB: This call stops the INTERFACE by removal of interface entirely
export function stop_interface() {
  console.log(">> ST0P_INTERFACE <<");
  return {
    type: 'ST0P_INTERFACE',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/remove`
    }
  }
}

// call ADD_INSTANCE_TO_INTERFACE ({ interface_id, instance_id })
// NB: This call restarts the interface to get change in effect
export function add_instance_to_interface(payload) {
  console.log(">> ADD_INSTANCE_TO_INTERFACE : payload <<");
  return {
    type: 'ADD_INSTANCE_TO_INTERFACE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/add_instance`
    }
  }
}

// call REMOVE_INSTANCE_FROM_INTERFACE({ PUT PAYLOAD REQS HERE })
// NB: This call restarts the interface to get change in effect
export function remove_instance_from_interface(payload) {
  console.log(">> REMOVE_INSTANCE_FROM_INTERFACE : payload <<");
  return {
    type: 'REMOVE_INSTANCE_FROM_INTERFACE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/remove_instance `
    }
  }
}


/*************************************************************************************************************************/
                                                    /* AGENT FUNCTIONALITY */
/*************************************************************************************************************************/
////////////////////////////////////////////////////////////////////////
              /* Reporting Container Agents */
////////////////////////////////////////////////////////////////////////
// admin/agent/list
export function get_agent_list() {
  console.log(">> GET_AGENT_LIST <<");
  return {
    type: 'GET_AGENT_LIST',
    payload:[],
    meta: {
    	holochainAction: true,
    	callString: `admin/agent/list`
    }
  }
}

////////////////////////////////////////////////////////
          /* Updating Container Agents */
////////////////////////////////////////////////////////
// admin/agent/add

// admin/agent/remove


/*************************************************************************************************************************/
                                                    /* UI FUNCTIONALITY */
/*************************************************************************************************************************/
////////////////////////////////////////////////////////
            /* Reporting Container UIs */
////////////////////////////////////////////////////////
// admin/ui/list
export function get_ui_list() {
  console.log(">> API CALL GET_UI_LIST");
  return {
    type: 'GET_UI_LIST',
    payload:[],
    meta: {
    	holochainAction: true,
    	callString: `admin/ui/list`
    }
  }
}

////////////////////////////////////////////////////////
          /* Updating Container UIs */
////////////////////////////////////////////////////////
// admin/ui/install
// @params : {id,root_dir}
export function install_ui(payload) {
  console.log(">> API CALL INSTALL_UI");
  return {
    type: 'INSTALL_UI',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/ui/install`
    }
  }
}

// admin/ui/uninstall
// @params : {id}
export function uninstall_ui(payload) {
  console.log(">> API CALL UNINSTALL_UI");
  return {
    type: 'UNINSTALL_UI',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/ui/uninstall`
    }
  }
}
////////////////////////////////////////////////////////
            /* UI Interfaces */
////////////////////////////////////////////////////////

// admin/ui_interface/list
// @params : {id}
export function get_ui_instance_list(payload) {
  console.log(">> API CALL GET_UI_INSTANCE_LIST");
  return {
    type: 'GET_UI_INSTANCE_LIST',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/ui_interface/list`
    }
  }
}
/*************************************************************************************************************************/
                                                  /* BRIDING FUNCTIONALITY */
/*************************************************************************************************************************/
////////////////////////////////////////////////////////
            /* Reporting Container Bridging */
////////////////////////////////////////////////////////


////////////////////////////////////////////////////////
          /* Updating Container Bridging */
////////////////////////////////////////////////////////


/*************************************************************************************************************************/
                                            /* GLOBAL REDUX STATE CHECK FUNCTIONALITY*/
/*************************************************************************************************************************/
////////////////////////////////////////////////////////
          /* Redux State Check */
////////////////////////////////////////////////////////
export function fetch_state() {
  return {
    type: FETCH_STATE
  };
}
