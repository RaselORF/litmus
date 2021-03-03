import { Paper, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { ButtonFilled, ButtonOutlined } from 'litmus-ui';
import React from 'react';
import { LitmusStepConnector } from './LitmusStepConnector';
import { LitmusStepIcon } from './LitmusStepIcon';
import { useStyles } from './styles';

interface LitmusStepperProps {
  steps: string[];
  activeStep: number;
  handleBack: () => void;
  handleNext: () => void;
  finishAction: React.ReactNode;
  hideNext?: boolean;
  disableNext?: boolean;
  moreStepperActions?: React.ReactNode;
}

const LitmusStepper: React.FC<LitmusStepperProps> = ({
  steps,
  activeStep,
  handleBack,
  handleNext,
  finishAction,
  hideNext,
  disableNext,
  moreStepperActions,
  children,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Stepper
        activeStep={activeStep}
        connector={<LitmusStepConnector />}
        className={classes.stepper}
        alternativeLabel
      >
        {steps.map((label, i) => (
          <Step key={label}>
            {activeStep === i ? (
              <StepLabel StepIconComponent={LitmusStepIcon}>
                <Typography
                  className={clsx(classes.label, classes.activeLabel)}
                >
                  {label}
                </Typography>
              </StepLabel>
            ) : activeStep < i ? (
              <StepLabel StepIconComponent={LitmusStepIcon}>
                <Typography
                  className={clsx(classes.label, classes.completedLabel)}
                >
                  {label}
                </Typography>
              </StepLabel>
            ) : (
              <StepLabel StepIconComponent={LitmusStepIcon}>
                <Typography className={classes.label}>{label}</Typography>
              </StepLabel>
            )}
          </Step>
        ))}
      </Stepper>

      {/* Stepper Content */}
      <Paper elevation={0} className={classes.stepperContent}>
        {children}
      </Paper>

      {/* Stepper Actions */}
      <div className={classes.stepperActions}>
        {activeStep >= 0 && (
          <ButtonOutlined onClick={handleBack}>
            <Typography>Back</Typography>
          </ButtonOutlined>
        )}
        {moreStepperActions}
        <div className={classes.endAction}>
          {activeStep !== steps.length - 1
            ? !hideNext && (
                <ButtonFilled onClick={handleNext} disabled={disableNext}>
                  <Typography>Next</Typography>
                </ButtonFilled>
              )
            : finishAction}
        </div>
      </div>
    </div>
  );
};

export { LitmusStepper };
