import { getInstance } from '../utils/hc-web-client'
export const FETCH_STATE = 'FETCH_STATE';
// export const CALL_HOLOCHAIN_FUNC = 'CALL_HOLOCHAIN_FUNC';
// export const CALL_HOLOCHAIN_FUNC_SUCCESS = 'CALL_HOLOCHAIN_FUNC_SUCCESS';
// export const CALL_ZOME_FUNC = 'CALL_ZOME_FUNC';
// export const CALL_ZOME_FUNC_SUCCESS = 'CALL_ZOME_FUNC_SUCCESS';
//

// // test for info/instances
// export function call_holochain_instance_func() {
//   console.log(">> WS Client Action Called <<");
//   return {
//     type: 'CALL_HOLOCHAIN_FUNC',
//     payload: [],
//     meta: {
//     	holochainAction: true,
//     	callString: 'info/instances'
//     }
//   }
// }
//
// export function call_holochain_instance_func_success(params) {
//   // console.log("INFO/INSTANCES: Container Params:: ",params);
//   return {
//     type: 'CALL_HOLOCHAIN_FUNC_SUCCESS',
//     payload: params
//   }
// }
//
// // test for zome/
// export function call_zome_instance_func() {
//   console.log(">>ZOME: WS Client Action Called <<");
//
//   // getInstance()
//
//   return {
//     type: 'CALL_ZOME_FUNC',
//     payload: {content:"lisa", in_reply_to:"zoel"},
//     meta: {
//     	holochainAction: true,
//     	callString: 'Qm328wyq38924y/blog/main/create_post'
//     }
//   }
// }
//
// export function call_zome_instance_func_success(params) {
//   console.log("ZOME: Container Params:: ",params);
//   return {
//     type: 'CALL_ZOME_FUNC_SUCCESS',
//     payload: params
//   }
// }
//

function fetch_state() {
  return {
    type: FETCH_STATE
  };
}
