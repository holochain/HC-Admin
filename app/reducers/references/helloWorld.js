import { ActionTypes, Action, State } from '../../actions/references/types'

const INITIAL_STATE : State = {
  message: ''
}

export default function(state = INITIAL_STATE, action: Action) : State {
  const { type, payload } = action

  switch (type) {
    case ActionTypes.SAY_HELLO: {
      return { ...state, message: payload.message }
    }

    case ActionTypes.RECEIVED_HELLO: {
      return { ...state, message: payload.message }
    }

    default:
      return state
  }
}
