// packages block
import { Stepper, Step, StepLabel, Typography} from '@material-ui/core';
// components block
import CustomStepIcon from './CustomStepIcon';
// constants, interfaces and styles block
import { StepperComponentProps } from "../../interfacesTypes";
import { CustomConnector, useExternalPatientStyles } from "../../styles/publicAppointmentStyles/externalPatientStyles";
import { ActionType } from '../../reducers/patientReducer';

const StepperCard = ({ activeStep, stepperData, dispatch }: StepperComponentProps) => {
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
      {stepperData?.map(({ title }, index) => {
        return (
          <Step key={`${index}-${title}`}>
            <StepLabel className='pointer-cursor' StepIconComponent={CustomStepIcon} onClick={() => dispatch && dispatch({
              type: ActionType.SET_ACTIVE_STEP, activeStep: index
            })}>
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