export const FETCH_STATE = 'FETCH_STATE';
export const GET_INFO_INSTANCES = 'GET_INFO_INSTANCES';

////////////////////////////////////////////////////////
    /* Reporting Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
// call LIST_OF_INTERFACES ()
export function list_of_instances() {
  console.log(">> LIST_OF_INSTANCES : payload <<");
  return {
    type: 'LIST_OF_INSTANCES',
    payload: [],
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/list`
    }
  }
}


////////////////////////////////////////////////////////
    /* Updating Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
// STARTS INTERFACE:
// call START_AGENT_DNA_INSTANCE ({ id })
export function start_agent_dna_instance(payload) {
  console.log(">> START_AGENT_DNA_INSTANCE : payload <<");
  return {
    type: 'START_AGENT_DNA_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/add`
    }
  }
}

// STOPS INTERFACE
// call STOP_AGENT_DNA_INSTANCE ({ id })
export function stop_agent_dna_instance(payload) {
  console.log(">> STOP_AGENT_DNA_INSTANCE : payload <<");
  return {
    type: 'STOP_AGENT_DNA_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/remove`
    }
  }
}

// ADDS INTANCE TO INTERFACE
// call ADD_INTERFACE_INSTANCE ()
// NB: This call restarts the interface FIRST, to get change in effect
export function start_agent_dna_instance(payload) {
  console.log(">> ADD_INTERFACE_INSTANCE : payload <<");
  return {
    type: 'ADD_INTERFACE_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/add_instance `
    }
  }
}

// REMOVES INSTANCE FROM INTERFACE
// call REMOVE_INTERFACE_INSTANCE ()
// NB: This call restarts the interface FIRST, to get change in effect
export function remove_interface_instance(payload) {
  console.log(">> REMOVE_INTERFACE_INSTANCE : payload <<");
  return {
    type: 'REMOVE_INTERFACE_INSTANCE',
    payload,
    meta: {
    	holochainAction: true,
    	callString: `admin/interface/remove_instance `
    }
  }
}

// state check
export function fetch_interface_state() {
  return {
    type: FETCH_INTERFACE_STATE
  };
}

/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////
      /* Working Container APIs*/
///////////////////////////////////////////
// [ ] admin/interface/list

// [ ] admin/interface/add (starts the interface)
// [ ] admin/interface/remove (stops the interface)

// [ ] admin/interface/add_instance (restarts the interface to get change in effect)
// [ ] admin/interface/remove_instance (restarts the interface to get change in effect)

// NB: Be sure to set `admin = true` in container basic.toml config
/////////////////////////////////////////////////////////////////////////
