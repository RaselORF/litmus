import { useMutation, useQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import { ButtonFilled, ButtonOutlined } from 'litmus-ui';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import YAML from 'yaml';
import { LitmusStepper } from '../../components/LitmusStepper';
import Loader from '../../components/Loader';
import useStyles from '../../components/WorkflowStepper/styles';
import Scaffold from '../../containers/layouts/Scaffold';
import { UPDATE_SCHEDULE } from '../../graphql/mutations';
import { SCHEDULE_DETAILS } from '../../graphql/queries';
import {
  CreateWorkFlowInput,
  UpdateWorkflowResponse,
  WeightMap,
} from '../../models/graphql/createWorkflowData';
import { ScheduleDataVars, Schedules } from '../../models/graphql/scheduleData';
import { experimentMap, WorkflowData } from '../../models/redux/workflow';
import useActions from '../../redux/actions';
import * as TemplateSelectionActions from '../../redux/actions/template';
import * as WorkflowActions from '../../redux/actions/workflow';
import { history } from '../../redux/configureStore';
import { RootState } from '../../redux/reducers';
import { validateWorkflowName } from '../../utils/validate';
import parsed from '../../utils/yamlUtils';
import ChooseAWorkflowAgent from '../../views/CreateWorkflow/ChooseAWorkflowAgent';
import ChooseWorkflow from '../../views/CreateWorkflow/ChooseWorkflow/index';
import ReliablityScore from '../../views/CreateWorkflow/ReliabilityScore';
import ScheduleWorkflow from '../../views/CreateWorkflow/ScheduleWorkflow';
import TuneWorkflow from '../../views/CreateWorkflow/TuneWorkflow/index';
import VerifyCommit from '../../views/CreateWorkflow/VerifyCommit';
import { cronWorkflow, workflowOnce } from './templates';

interface URLParams {
  workflowName: string;
  projectID: string;
}

interface Weights {
  experimentName: string;
  weight: number;
}

function getSteps(): string[] {
  return [
    'Target Cluster',
    'Choose a workflow',
    'Tune workflow',
    'Reliability score',
    'Schedule',
    'Verify and Commit',
  ];
}

function getStepContent(
  stepIndex: number,
  gotoStep: (page: number) => void
): React.ReactNode {
  switch (stepIndex) {
    case 0:
      return <ChooseAWorkflowAgent />;
    case 1:
      return <ChooseWorkflow />;
    case 2:
      return <TuneWorkflow />;
    case 3:
      return <ReliablityScore />;
    case 4:
      return <ScheduleWorkflow />;
    case 5:
      return (
        <VerifyCommit
          isEditable={false}
          gotoStep={(page: number) => gotoStep(page)}
        />
      );
    default:
      return <ChooseAWorkflowAgent />;
  }
}

const EditScheduledWorkflow = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const template = useActions(TemplateSelectionActions);
  const workflowData: WorkflowData = useSelector(
    (state: RootState) => state.workflowData
  );
  const workflow = useActions(WorkflowActions);
  // Get Parameters from URL
  const paramData: URLParams = useParams();

  // Apollo query to get the scheduled data
  const { data, loading } = useQuery<Schedules, ScheduleDataVars>(
    SCHEDULE_DETAILS,
    {
      variables: { projectID: paramData.projectID },
      fetchPolicy: 'cache-and-network',
    }
  );

  const wfDetails =
    data &&
    data.getScheduledWorkflows.filter(
      (wf) => wf.workflow_name === paramData.workflowName
    )[0];
  const doc = new YAML.Document();
  const a: Weights[] = [];
  useEffect(() => {
    if (wfDetails !== undefined) {
      for (let i = 0; i < wfDetails?.weightages.length; i++) {
        a.push({
          experimentName: wfDetails?.weightages[i].experiment_name,
          weight: wfDetails?.weightages[i].weightage,
        });
      }
      doc.contents = JSON.parse(wfDetails?.workflow_manifest);
      workflow.setWorkflowDetails({
        workflow_id: wfDetails?.workflow_id,
        name: wfDetails?.workflow_name,
        yaml: doc.toString(),
        id: 0,
        description: wfDetails?.workflow_description,
        weights: a,
        isCustomWorkflow: wfDetails?.isCustomWorkflow,
        clusterid: wfDetails?.cluster_id,
        cronSyntax: wfDetails?.cronSyntax,
        scheduleType: {
          scheduleOnce:
            wfDetails?.cronSyntax === '' ? 'now' : 'recurringSchedule',
          recurringSchedule: '',
        },
        scheduleInput: {
          hour_interval: 0,
          day: 1,
          weekday: 'Monday',
          time: new Date(),
          date: new Date(),
        },
      });
    }
    template.selectTemplate({ selectTemplateID: 0, isDisable: false });
  }, [data]);

  const {
    yaml,
    weights,
    description,
    isCustomWorkflow,
    isDisabled,
    cronSyntax,
    name,
    clusterid,
    scheduleType,
  } = workflowData;

  const [activeStep, setActiveStep] = React.useState(4);

  const selectedProjectID = useSelector(
    (state: RootState) => state.userData.selectedProjectID
  );
  const isDisable = useSelector(
    (state: RootState) => state.selectTemplate.isDisable
  );
  const userRole = useSelector((state: RootState) => state.userData.userRole);
  const scheduleOnce = workflowOnce;
  const scheduleMore = cronWorkflow;
  const [invalidYaml, setinValidYaml] = React.useState(false);
  const steps = getSteps();

  function EditYaml() {
    const oldParsedYaml = YAML.parse(yaml);
    const NewLink: string = ' ';
    let NewYaml: string = ' ';
    if (
      oldParsedYaml.kind === 'Workflow' &&
      scheduleType.scheduleOnce !== 'now'
    ) {
      const oldParsedYaml = YAML.parse(yaml);
      const newParsedYaml = YAML.parse(scheduleMore);
      delete newParsedYaml.spec.workflowSpec;
      newParsedYaml.spec.schedule = cronSyntax;
      delete newParsedYaml.metadata.generateName;
      newParsedYaml.metadata.name = workflowData.name;
      newParsedYaml.metadata.labels = {
        workflow_id: workflowData.workflow_id,
      };
      newParsedYaml.spec.workflowSpec = oldParsedYaml.spec;
      const tz = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
      Object.entries(tz).forEach(([key, value]) => {
        newParsedYaml.spec[key] = value;
      });
      NewYaml = YAML.stringify(newParsedYaml);
      workflow.setWorkflowDetails({
        link: NewLink,
        yaml: NewYaml,
      });
    }
    if (
      oldParsedYaml.kind === 'CronWorkflow' &&
      scheduleType.scheduleOnce === 'now'
    ) {
      const oldParsedYaml = YAML.parse(yaml);
      const newParsedYaml = YAML.parse(scheduleOnce);
      delete newParsedYaml.spec;
      delete newParsedYaml.metadata.generateName;
      newParsedYaml.metadata.name = workflowData.name;
      newParsedYaml.spec = oldParsedYaml.spec.workflowSpec;
      newParsedYaml.metadata.labels = {
        workflow_id: workflowData.workflow_id,
      };
      NewYaml = YAML.stringify(newParsedYaml);
      workflow.setWorkflowDetails({
        link: NewLink,
        yaml: NewYaml,
      });
    }
    if (
      oldParsedYaml.kind === 'CronWorkflow' &&
      scheduleType.scheduleOnce !== 'now' &&
      !isDisabled
    ) {
      const newParsedYaml = YAML.parse(yaml);
      newParsedYaml.spec.schedule = cronSyntax;
      newParsedYaml.spec.suspend = false;
      delete newParsedYaml.metadata.generateName;
      newParsedYaml.metadata.name = workflowData.name;
      newParsedYaml.metadata.labels = { workflow_id: workflowData.workflow_id };
      const tz = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
      Object.entries(tz).forEach(([key, value]) => {
        newParsedYaml.spec[key] = value;
      });
      NewYaml = YAML.stringify(newParsedYaml);
      workflow.setWorkflowDetails({
        link: NewLink,
        yaml: NewYaml,
      });
    }
    if (oldParsedYaml.kind === 'CronWorkflow' && isDisabled === true) {
      const newParsedYaml = YAML.parse(yaml);
      newParsedYaml.spec.suspend = true;
      const tz = {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
      Object.entries(tz).forEach(([key, value]) => {
        newParsedYaml.spec[key] = value;
      });
      NewYaml = YAML.stringify(newParsedYaml);
      workflow.setWorkflowDetails({
        link: NewLink,
        yaml: NewYaml,
      });
    }
  }

  const handleNext = () => {
    if (activeStep === 2) {
      const tests = parsed(yaml);
      const arr: experimentMap[] = [];
      const hashMap = new Map();
      weights.forEach((weight) => {
        hashMap.set(weight.experimentName, weight.weight);
      });
      tests.forEach((test) => {
        let value = 10;
        if (hashMap.has(test)) {
          value = hashMap.get(test);
        }
        arr.push({ experimentName: test, weight: value });
      });
      workflow.setWorkflowDetails({
        weights: arr,
      });
      if (arr.length === 0) {
        setinValidYaml(true);
      } else {
        setinValidYaml(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 4) {
      EditYaml();
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep === 2) {
      setinValidYaml(false);
    } else if (activeStep === 4 && isDisable === true) {
      template.selectTemplate({ isDisable: false });
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [createChaosWorkFlow] = useMutation<
    UpdateWorkflowResponse,
    CreateWorkFlowInput
  >(UPDATE_SCHEDULE);

  const handleMutation = () => {
    if (name.length !== 0 && description.length !== 0 && weights.length !== 0) {
      const weightData: WeightMap[] = [];

      weights.forEach((data) => {
        weightData.push({
          experiment_name: data.experimentName,
          weightage: data.weight,
        });
      });

      /* JSON.stringify takes 3 parameters [object to be converted,
      a function to alter the conversion, spaces to be shown in final result for indentation ] */
      const yml = YAML.parse(yaml);
      const yamlJson = JSON.stringify(yml, null, 2); // Converted to Stringified JSON

      const chaosWorkFlowInputs = {
        workflow_id: wfDetails?.workflow_id,
        workflow_manifest: yamlJson,
        cronSyntax,
        workflow_name: name,
        workflow_description: description,
        isCustomWorkflow,
        weightages: weightData,
        project_id: selectedProjectID,
        cluster_id: clusterid,
      };

      createChaosWorkFlow({
        variables: { ChaosWorkFlowInput: chaosWorkFlowInputs },
      });
    }
  };

  const handleOpen = () => {
    handleMutation();
  };

  function gotoStep({ page }: { page: number }) {
    setActiveStep(page);
  }

  // Check correct permissions for user
  if (userRole === 'Viewer')
    return (
      <>
        <Typography
          variant="h3"
          align="center"
          style={{ marginTop: '10rem', marginBottom: '3rem' }}
        >
          {t('schedule.missingPerm')}
        </Typography>
        <Typography variant="h6" align="center">
          {t('schedule.requiredPerm')}
        </Typography>
        <br />
        <Typography variant="body1" align="center">
          {t('schedule.contact')}
        </Typography>

        {/* Back Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          <ButtonFilled onClick={() => history.goBack()}>
            {t('schedule.backBtn')}
          </ButtonFilled>
        </div>
      </>
    );

  return (
    <Scaffold>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <LitmusStepper
            steps={getSteps()}
            activeStep={activeStep}
            handleBack={handleBack}
            handleNext={handleNext}
            finishAction={() => {}}
          >
            {getStepContent(activeStep, (page: number) => gotoStep({ page }))}
          </LitmusStepper>

          {/* Control Buttons */}

          <div className={classes.buttonGroup}>
            {activeStep === steps.length - 2 ? (
              <ButtonOutlined disabled onClick={handleBack}>
                <Typography>Back</Typography>
              </ButtonOutlined>
            ) : activeStep !== 1 ? (
              <ButtonOutlined onClick={handleBack}>
                <Typography>Back</Typography>
              </ButtonOutlined>
            ) : null}
            {activeStep === steps.length - 1 ? (
              <ButtonFilled
                disabled={validateWorkflowName(name)}
                onClick={handleOpen}
              >
                <div>{t('workflowStepper.finish')}</div>
              </ButtonFilled>
            ) : (
              <ButtonFilled onClick={() => handleNext()} disabled={isDisable}>
                <div>
                  {t('workflowStepper.next')}
                  <img
                    alt="next"
                    src="/icons/nextArrow.svg"
                    className={classes.nextArrow}
                  />
                </div>
              </ButtonFilled>
            )}
            {invalidYaml ? (
              <Typography className={classes.yamlError}>
                <strong>{t('workflowStepper.continueError')}</strong>
              </Typography>
            ) : null}
          </div>
        </div>
      )}
    </Scaffold>
  );
};

export default EditScheduledWorkflow;
