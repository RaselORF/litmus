/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  MyHubAction,
  MyHubActions,
  HubDetails,
} from '../../models/redux/myhub';
import createReducer from './createReducer';

const initialState: HubDetails = {
  id: '',
  HubName: '',
  RepoURL: '',
  RepoBranch: '',
  RepoName: '',
  UserName: '',
};

export const hubDetails = createReducer<HubDetails>(initialState, {
  [MyHubActions.SET_MYHUB](state: HubDetails, action: MyHubAction) {
    return {
      ...state,
      ...(action.payload as Object),
    };
  },
});

export default hubDetails;
