import { FETCH_STATE, CALL_HOLOCHAIN_FUNC, CALL_HOLOCHAIN_FUNC_SUCCESS, CALL_ZOME_FUNC, CALL_ZOME_FUNC_SUCCESS } from '../actions/welcome';

const INITIAL_STATE : State = {
 welcome_page_state  : []
}

export default function(state = INITIAL_STATE, action: Action) : State {
  console.log(">>>>>>>>>>>>>>>REDUCER",action);

  const { type, payload } = action
  switch (type) {

    case FETCH_STATE: {
      console.log("Reducer state", state);
      return { ...state};
    }

    case CALL_HOLOCHAIN_FUNC: {
      console.log("CALL_HOLOCHAIN_FUNC state", payload);
      return { ...state};
    }

    case CALL_HOLOCHAIN_FUNC_SUCCESS: {
      console.log("CALL_HOLOCHAIN_FUNC_SUCCESS state", payload);
      return { ...state};
    }

    case CALL_ZOME_FUNC: {
      console.log("CALL_ZOME_FUNC state", payload);
      return { ...state};
    }

    case CALL_ZOME_FUNC_SUCCESS: {
      console.log("CALL_HOLOCHAIN_FUNC_SUCCESS state", payload);
      return { ...state};
    }

    default:
      return state
  }
}
