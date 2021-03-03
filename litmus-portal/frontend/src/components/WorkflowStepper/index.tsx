import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { ButtonFilled, ButtonOutlined } from 'litmus-ui';
import localforage from 'localforage';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Row from '../../containers/layouts/Row';
import useActions from '../../redux/actions';
import * as AlertActions from '../../redux/actions/alert';
import { RootState } from '../../redux/reducers';
import ChooseAWorkflowAgent from '../../views/CreateWorkflow/ChooseAWorkflowAgent';
import ChooseWorkflow from '../../views/CreateWorkflow/ChooseWorkflow/index';
import ReliablityScore from '../../views/CreateWorkflow/ReliabilityScore';
import ScheduleWorkflow from '../../views/CreateWorkflow/ScheduleWorkflow';
import TuneWorkflow from '../../views/CreateWorkflow/TuneWorkflow/index';
import WorkflowSettings from '../../views/CreateWorkflow/WorkflowSettings';
import { LitmusStepper } from '../LitmusStepper';
import useStyles from './styles';

interface ControlButtonProps {
  position: string;
}

interface ChildRef {
  onNext: () => void;
}

interface AlertBoxProps {
  message: string;
}

const steps: string[] = [
  'Choose Agent',
  'Choose a workflow',
  'Workflow Settings',
  'Tune workflow',
  'Reliability score',
  'Schedule',
  'Verify and Commit',
];

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getStepContent(
  stepIndex: number,
  childRef: React.MutableRefObject<ChildRef | undefined>
): React.ReactNode {
  switch (stepIndex) {
    case 0:
      return <ChooseAWorkflowAgent ref={childRef} />;
    case 1:
      return <ChooseWorkflow />;
    case 2:
      return <WorkflowSettings />;
    case 3:
      return <TuneWorkflow />;
    case 4:
      return <ReliablityScore />;
    case 5:
      return <ScheduleWorkflow />;
    case 6:
      return (
        // <VerifyCommit isEditable gotoStep={(page: number) => gotoStep(page)} />
        <ScheduleWorkflow />
      );
    default:
      return <ChooseAWorkflowAgent />;
  }
}

const WorkflowStepper = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const childRef = useRef<ChildRef>();

  const [activeStep, setActiveStep] = React.useState(0);
  const [proceed, shouldProceed] = React.useState<boolean>(false);

  const isAlertOpen = useSelector(
    (state: RootState) => state.alert.isAlertOpen
  );
  const alert = useActions(AlertActions);

  useEffect(() => {
    localforage
      .getItem('selectedScheduleOption')
      .then((value) => (value ? shouldProceed(true) : shouldProceed(false)));
  }, [proceed]);

  // } else if (activeStep === 1 && !proceed) {
  //   // If none of the workflow options (Choose Predefined, Create Custom,  ..)
  //   // are selected then do not proceed
  //   setIsAlertOpen(true);
  // } else {

  const handleNext = () => {
    if (childRef.current && childRef.current.onNext()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /** 
    Control Buttons
    ------------------------------------------------------------------------------
    When active step is zero (First Step) there won't be a Back button
    When active step is the last step in the stepper the button will change to Finish
    All steps in the middle will have next and back buttons
  * */

  const ControlButton: React.FC<ControlButtonProps> = ({ position }) => {
    return (
      <>
        {activeStep === 0 && position === 'top' ? ( // Only show Next button at Top for Step 0
          <ButtonFilled onClick={() => handleNext()}>Next</ButtonFilled>
        ) : activeStep === 0 && position !== 'top' ? ( // Don't show Next button at Bottom for Step 0
          <></>
        ) : activeStep === 1 &&
          window.screen.height < 1080 &&
          position !== 'top' ? (
          <></>
        ) : activeStep === steps.length - 1 ? ( // Show Finish button at Bottom for Last Step
          <ButtonFilled onClick={() => {}}>Finish</ButtonFilled>
        ) : position === 'top' ? ( // Apply headerButtonWrapper style for top button's div
          <div className={classes.headerButtonWrapper} aria-label="buttons">
            <ButtonOutlined onClick={() => handleBack()}>Back</ButtonOutlined>
            <ButtonFilled onClick={() => handleNext()}>Next</ButtonFilled>
          </div>
        ) : (
          // Apply bottomButtonWrapper style for top button's div
          <div className={classes.bottomButtonWrapper} aria-label="buttons">
            <ButtonOutlined onClick={() => handleBack()}>Back</ButtonOutlined>
            <ButtonFilled onClick={() => handleNext()}>Next</ButtonFilled>
          </div>
        )}
      </>
    );
  };

  /** 
    Alert
    ------------------------------------------------------------------------------
    Displays a snackbar with the appropriate message whenever a condition is not satisfied
  * */

  const AlertBox: React.FC<AlertBoxProps> = ({ message }) => {
    return (
      <div>
        {isAlertOpen ? (
          <Snackbar
            open={isAlertOpen}
            autoHideDuration={6000}
            onClose={() => alert.changeAlertState(false)}
          >
            <Alert
              onClose={() => alert.changeAlertState(false)}
              severity="error"
            >
              {message}
            </Alert>
          </Snackbar>
        ) : (
          <></>
        )}
      </div>
    );
  };

  function getAlertMessage(stepNumber: number) {
    switch (stepNumber) {
      case 0:
        return t(`workflowStepper.step1.errorSnackbar`);
      case 1:
        return t(`workflowStepper.step2.errorSnackbar`);
      default:
        return '';
    }
  }

  return (
    <div className={classes.root}>
      {/* Alert */}
      <AlertBox message={getAlertMessage(activeStep)} />

      {/* Header */}
      <div className={classes.headWrapper}>
        <Row justifyContent="space-between">
          <Typography className={classes.header}>
            {t(`workflowStepper.scheduleNewChaosWorkflow`)}
          </Typography>
          <ControlButton position="top" />
        </Row>
      </div>
      <br />
      {/* Stepper */}
      <LitmusStepper
        steps={steps}
        activeStep={activeStep}
        handleBack={handleBack}
        handleNext={() => handleNext()}
        finishAction={() => {}}
      >
        {getStepContent(activeStep, childRef)}
      </LitmusStepper>
      {/* Control Buttons */}
      {/* <div className={classes.bottomWrapper}>
        <ControlButton position="bottom" />
      </div> */}
    </div>
  );
};

export default WorkflowStepper;
