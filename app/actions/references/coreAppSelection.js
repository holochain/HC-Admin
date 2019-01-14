export const FETCH_STATE = 'FETCH_STATE';
export const UPDATE_CORE_APPS = 'UPDATE_CORE_APPS';

export function update_core_apps(payload) {
  console.log("core apps updated: ", payload);
  return {
    type: UPDATE_CORE_APPS,
    payload
  };
}

export function fetch_state() {
  return {
    type: FETCH_STATE
  };
}

////////////////////////////////////////////////////////////////
 //        Example Action Call with  HC Middleware
//////////////////////////////////////////////////////////////
// This can follow the 1.) `happ/zome/capability/func` format
//   or may also call a container function directly  2.) such as `info/instances`.

// NB: The payload will be passed directly to the call to the holochain
//   function and must have fields that match the holochain function signature.


// // 1. `happ/zome/capability/func` example:
// export function call_holochain_func(params) {
//   type: 'CALL_HOLOCHAIN_FUNC',
//   payload: params,
//   meta: {
//   	holochainAction: true,
//   	callString: 'happ/zome/capability/func'
//   }
// }

// // 2. `info/instances` example:
// export function call_holochain_instance_func(params) {
//   type: 'CALL_HOLOCHAIN_FUNC',
//   payload: params,
//   meta: {
//   	holochainAction: true,
//   	callString: 'info/instances'
//   }
// }
