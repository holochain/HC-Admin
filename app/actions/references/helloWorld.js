import { Dispatch } from 'redux'
import { ActionTypes, Action, IHelloWorldService } from './types'
import * as services from './services';

// interface between window and main electron app >> uses IPC
export default function(service: IHelloWorldService) {
  function sayHello () {
    return async function(dispatch: Dispatch<Action>) {
      dispatch({
        type: ActionTypes.SAY_HELLO,
        payload: {
          message: 'waiting for response'
        }
      })

      return dispatch({
        type: ActionTypes.RECEIVED_HELLO,
        payload: {
          message: await services()
        }
      })
    }
  }
  return {
    sayHello
  }
}
