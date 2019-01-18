export const FETCH_STATE = 'FETCH_STATE';

////////////////////////////////////////////////////////
    /* Reporting Container DNAs/DNA-instances */
////////////////////////////////////////////////////////
// call for FETCH_AGENT_ID_HASH ()
// export function fetch_agent_id() {
//   console.log(">> fetching AGENT_ID_HASH <<");
//   return {
//     type: 'FETCH_AGENT_ID_HASH',
//     payload: [],
//     meta: {
//     	holochainAction: true,
//     	callString: `admin/agent/hash`
//     }
//   }
// }

// Reference to Proto: 
// const mapDispatchToProps = dispatch => ({
//   fetchProfile: () => {
//     return fetchPOST('/fn/profile/getProfile')
//       .then(profileInfo => {
//         dispatch({ type: 'FETCH_PROFILE', profileInfo })
//       })
//   },
// });

// state check
export function fetch_state() {
  return {
    type: FETCH_STATE
  };
}
