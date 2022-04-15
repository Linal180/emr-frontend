// packages block
import { FC, } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import { BLACK_TWO } from '../../../../theme';
import { GeneralFormProps } from "../../../../interfacesTypes";
import {
  EMPTY_OPTION, GUARANTOR, NOTES, ORDERING_PROVIDER, PAYMENT, PAYMENT_TYPE, PRIMARY_INSURANCE_FOR_ORDER, PRIMARY_PROVIDER, PRINT, SAVE_TEXT,
  SECONDARY_INSURANCE_FOR_ORDER, SELF_PAY_RESTRICTION,
} from '../../../../constants';

const LabOrdersPaymentForm: FC<GeneralFormProps> = (): JSX.Element => {
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Card>
      <Box p={2}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{PAYMENT}</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="paymentType"
                  label={PAYMENT_TYPE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="selfPay"
                  label={SELF_PAY_RESTRICTION}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="primaryInsurance"
                  label={PRIMARY_INSURANCE_FOR_ORDER}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="secondaryInsurance"
                  label={SECONDARY_INSURANCE_FOR_ORDER}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Typography variant='h6'>{GUARANTOR}</Typography>

                <Box py={0.6} mb={2} color={BLACK_TWO}>
                  <Typography variant='body1'>James Lukewood</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="primaryProvider"
                  label={PRIMARY_PROVIDER}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="orderingProvider"
                  label={ORDERING_PROVIDER}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="Notes"
                  controllerLabel={NOTES}
                />
              </Grid>
            </Grid>

            <Box mb={3} display="flex">
              <Button type="submit" variant="contained" color="inherit" className="blue-button-new">{PRINT}</Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Card>
  );
};

export default LabOrdersPaymentForm;
