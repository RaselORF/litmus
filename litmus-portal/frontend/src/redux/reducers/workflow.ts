/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WorkflowAction,
  WorkflowActions,
  WorkflowData,
} from '../../models/redux/workflow';
import createReducer from './createReducer';

const initialState: WorkflowData = {
  name: '',
  link: '',
  yaml: '',
  id: '',
  description: '',
  weights: [],
  isCustomWorkflow: false,
  isRecurring: false,
  isDisabled: false,
  chaosEngineChanged: false,
  namespace: 'litmus',
  clusterid: '',
  cronSyntax: '',
  scheduleType: {
    scheduleOnce: 'now',
    recurringSchedule: '',
  },
  scheduleInput: {
    hour_interval: 0,
    day: 1,
    weekday: 'Monday',
    time: new Date(),
    date: new Date(),
  },
  customWorkflow: {
    experiment_name: '',
    hubName: '',
    repoUrl: '',
    repoBranch: '',
    experimentYAML: '',
    yaml: '',
    index: -1,
    description: '',
  },
  customWorkflows: [],
  stepperActiveStep: 1,
  clustername: '',
  workflowIcon: '',
};

export const workflowData = createReducer<WorkflowData>(initialState, {
  [WorkflowActions.SET_WORKFLOW_DETAILS](
    state: WorkflowData,
    action: WorkflowAction
  ) {
    return {
      ...state,
      ...(action.payload as Object),
    };
  },
});

export default workflowData;
