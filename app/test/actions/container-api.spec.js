import { spy } from 'sinon';
import * as containerApiActions from '../../actions/containerApi.js';
import * as containerApiResponseActions from '../../actions/containerApiResponseStatus.js';

describe('actions', () => {
  it('should return all info about the running app instances', () => {
    const fn = containerApiActions.call_holochain_instance_func();
    expect(fn).toBeInstanceOf(Object);
    const dispatch = spy();
    const getState = () => ({ info_instances_success: true });
    fn(dispatch, getState);
    expect(dispatch.calledWith({ type: containerApiResponseActions.CALL_HOLOCHAIN_FUNC_SUCCESS })).toBe(true);
  });
});
