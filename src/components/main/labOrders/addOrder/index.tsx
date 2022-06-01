// packages block
import clsx from 'clsx';
import { Box, Card, Grid, Step, StepIconProps, StepLabel, Stepper, Typography } from '@material-ui/core';
import { FC, useState } from 'react';
import { LAB_ORDER, LAB_ORDER_STEPS } from '../../../../constants';
import { CheckInConnector, useCheckInStepIconStyles } from '../../../../styles/checkInStyles';
import PageHeader from '../../../common/PageHeader';
import LabOrdersCreateForm from './LabOrdersCreateForm';
import LabOrdersPaymentForm from './LabOrdersPaymentForm';
import { Check } from '@material-ui/icons';

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

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CreateOrderForm />
      case 1:
        return <PaymentOrderForm />
      default:
        return 'Unknown step';
    }
  }

  const CreateOrderForm = () => <LabOrdersCreateForm />

  const PaymentOrderForm = () => <LabOrdersPaymentForm />

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
                      <StepLabel onClick={handleStep(index)} StepIconComponent={CheckInStepIcon}>{label}</StepLabel>
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