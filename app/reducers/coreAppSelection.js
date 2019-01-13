import { getType } from 'typesafe-actions'
import { FETCH_STATE, UPDATE_CORE_APPS } from '../actions/coreAppSelection';

const INITIAL_STATE : State = {
 core_apps  : []
}

export default function(state = INITIAL_STATE, action: Action) : State {
  const { type, payload } = action

  switch (type) {
    case UPDATE_CORE_APPS: {
      console.log("Core Apps", payload);
      const core_apps = payload
      return { ...state, core_apps};
    }

    case FETCH_STATE: {
      // console.log("Reducer state", state);
      return { ...state};
    }

    default:
      return state
  }
}

////////////////////////////////////////////////////////////////////////////////
 //   Example Reducer Format AFTER Container Call with HC Middleware
//////////////////////////////////////////////////////////////////////////////////
// When a call to holochain is completed the middleware will dispatch an action containing the response.
//  These actions have a type that is the same as the call but with _SUCCESS or _FAILURE appended, which
//  allows them to be used within the Reducer for better typed sorting/handling.

// Actions Returned by Resolved Promise:
// =========================================
// > eg. Success case with custom action call name
// {
//   type: 'CALL_HOLOCHAIN_FUNC_SUCCESS',
//   payload: { ... } // this contains the function call result
// }
//
// > eg. Failure case with metadata as title:
// {
//   type: 'someApp/someZome/someCapability/someFunc_FAILURE',
//   payload: { ... } // this contains details of the error
// }

// Use of appended success/failure indicators in Redux
// ====================================================
// import { getType } from 'typesafe-actions'
//
// export function reducer (state = initialState, action: AnyAction) {
//   switch (action.type) {
//     case getType(someFuncActionCreator.success):
//       // The type checker now knows that action.payload has type
//       // set in the definition using the generic
//       // You literally cant go wrong!
//
//     ...
//   }
// }
