// packages block
import clsx from 'clsx';
import { Box, Button, Step, StepIconProps, StepLabel, Stepper, Typography } from '@material-ui/core';
import { FC, useState } from 'react';
import { LAB_ORDER_SIDEDRAWER_STEPS, LAB_ORDER_STEPS, NEW_LAB_ORDER, NEXT, SUBMIT } from '../../../../constants';
import { CheckInConnector, useCheckInStepIconStyles } from '../../../../styles/checkInStyles';
import LabOrdersCreateForm from './LabOrdersCreateForm';
import LabOrdersProviderForm from './LabOrdersProviderForm';
import { Check, ChevronRight } from '@material-ui/icons';
import BillingComponent from '../../checkIn/BillingComponent';
import { useLabOrderStyles } from '../../../../styles/labOrderStyles';
import { GREY_SIXTEEN } from '../../../../theme';

const CheckInStepIcon = (props: StepIconProps) => {
  const classes = useCheckInStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

export const AddLabOrdersComponent: FC = (): JSX.Element => {
  const labOrderClasses = useLabOrderStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [labOrderNumber, setLabOrderNumber] = useState<string>('')
  const handleStep = (step: number, orderNumber?: string) => {
    setActiveStep(step);
    orderNumber && setLabOrderNumber(orderNumber)
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CreateOrderForm />
      case 1:
        return <ProviderOrderForm />
      case 2:
        return <BillingComponent submitButtonText={SUBMIT} labOrderNumber={labOrderNumber} />
      default:
        return 'Unknown step';
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const handleForward = () => {
    setActiveStep(activeStep + 1);
  };

  const CreateOrderForm = () => <LabOrdersCreateForm handleStep={handleStep} />

  const ProviderOrderForm = () => <LabOrdersProviderForm labOrderNumber={labOrderNumber} handleStep={handleStep} />

  return (

    <Box maxWidth={500} style={{ border: '1px solid red' }}>
      <Box
        display="flex" justifyContent="space-between" alignItems="center"
        borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
      >
        <Typography variant='h3'>{NEW_LAB_ORDER}</Typography>

        <Button type="submit" variant="contained" color="primary">{NEXT}</Button>
      </Box>

      <Box className={labOrderClasses.labOrderBox}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
          {LAB_ORDER_SIDEDRAWER_STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel onClick={() => handleStep(index)} StepIconComponent={CheckInStepIcon}>
                <Box ml={0} display='flex' alignItems='center' className='pointer-cursor'>
                  {label}
                  <Box p={0.5} />
                  {!(LAB_ORDER_STEPS.length - 1 === index) ? <ChevronRight /> : ''}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box p={2} />

      <Box>
        <Typography>{getStepContent(activeStep)}</Typography>
      </Box>
    </Box>
  )
}