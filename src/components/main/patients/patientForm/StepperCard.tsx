// packages block
import { Stepper, Step, StepLabel, Typography, useMediaQuery } from '@material-ui/core';
// components block
import CustomStepIcon from './CustomStepIcon';
// constants, interfaces and styles block
import {  RegisterPatientMenuNav } from "../../../../constants";
import { StepperComponentProps } from "../../../../interfacesTypes";
import { CustomConnector, useExternalPatientStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";

const StepperCard = ({ activeStep }: StepperComponentProps) => {
  const classes = useExternalPatientStyles();
  const matches = useMediaQuery('(min-width:960px)');

  return (
    <Stepper
      className={classes.customStepper}
      activeStep={activeStep}
      connector={<CustomConnector />}
      orientation={`${matches ? 'vertical' : 'horizontal'}`}
      style={{ position: 'relative' }}
      data-cy="newCourseStepper"
    >
      {RegisterPatientMenuNav.map(({ title }, index) => {
        return (
          <Step key={`${index}-${title}`}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              <Typography variant="h4" component="h5">
                {title}
              </Typography>
            </StepLabel>
          </Step>)
      })}
    </Stepper>
  );
};

export default StepperCard;