// packages block
import clsx from 'clsx';
import { Box, Card, Grid, Step, StepIconProps, StepLabel, Stepper, Typography } from '@material-ui/core';
import { FC, useState } from 'react';
import { LAB_ORDER, LAB_ORDER_STEPS, SUBMIT } from '../../../../constants';
import { CheckInConnector, useCheckInStepIconStyles } from '../../../../styles/checkInStyles';
import PageHeader from '../../../common/PageHeader';
import LabOrdersCreateForm from './LabOrdersCreateForm';
import LabOrdersProviderForm from './LabOrdersProviderForm';
import { Check } from '@material-ui/icons';
import BillingComponent from '../../checkIn/BillingComponent';

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
        return <BillingComponent submitButtonText={SUBMIT} labOrderNumber={labOrderNumber}/>
      default:
        return 'Unknown step';
    }
  }

  const CreateOrderForm = () => <LabOrdersCreateForm handleStep={handleStep} />

  const ProviderOrderForm = () => <LabOrdersProviderForm labOrderNumber={labOrderNumber} handleStep={handleStep} />

  return (
    <>
      <PageHeader title={LAB_ORDER} />
      <Card>
        <Box p={2}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item md={6} sm={12} xs={12}>
              <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
                {LAB_ORDER_STEPS.map((label, index) => (
                  <Step key={label}>
                    <StepLabel StepIconComponent={CheckInStepIcon}>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Box p={2} />

      <Box>
        <Typography>{getStepContent(activeStep)}</Typography>
      </Box>
    </>
  )
}