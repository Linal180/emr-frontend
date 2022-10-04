// packages block
import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
// components block
import CustomStepIcon from './CustomStepIcon';
// constants, interfaces and styles block
import { StepperComponentProps } from "../../interfacesTypes";
import { CustomConnector, useExternalPatientStyles } from "../../styles/publicAppointmentStyles/externalPatientStyles";

const StepperCard = ({ activeStep, stepperData, handleStep }: StepperComponentProps) => {
  const classes = useExternalPatientStyles();
  // const matches = useMediaQuery('(min-width:960px)');

  return (
    <Stepper
      className={classes.customStepper}
      activeStep={activeStep}
      connector={<CustomConnector />}
      orientation='vertical'
      style={{ position: 'relative' }}
      data-cy="newCourseStepper"
    >
      {stepperData?.map(({ title, completed: customCompleted }, index) => {
        return (
          <Step key={`${index}-${title}`}>
            <StepLabel className='pointer-cursor' StepIconComponent={(props) => <CustomStepIcon
              {...{ ...props, completed: customCompleted ?? props.completed }}
            />} onClick={() => handleStep && handleStep(index)}>
              <Typography variant="h4" component="h5">
                {title}
              </Typography>
            </StepLabel>
          </Step>)
      })}
    </Stepper >
  );
};

export default StepperCard;