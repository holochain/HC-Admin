import { FETCH_STATE } from '../actions/containerApi';

const INITIAL_STATE : State = {
  current_agent: { agent: { Hash: "", Name: "" } },
  profile_avatar: "",
}

export default function(state = INITIAL_STATE, action: Action) : State {
  const { type, payload } = action
  switch (type) {
    case FETCH_STATE: {
      return { ...state };
    }

    default:
      return state
  }
}
