// packages block
import { FormProvider, useForm } from 'react-hook-form';
import { GREY_SIXTEEN } from '../../../theme';
import { Box, Button, Grid, Typography } from '@material-ui/core';
// component block
import Selector from '../../common/Selector';
import DatePicker from '../../common/DatePicker';
import InputController from '../../../controller';
// constants, history, styling block
import {
  CPT_CODE_PROCEDURE_CODE, DESCRIPTION, EFFECTIVE_DATE, EMPTY_OPTION, EXPIRATION_DATE, FEE_SCHEDULE,
  LONG_DESCRIPTION, MODIFIER, PRACTICE, PRICING, SAVE_TEXT, SERVICE_FEE_CHARGE, SHORT_DESCRIPTION
} from '../../../constants';

const FeeScheduleForm = () => {
  const methods = useForm({
    mode: "all",
  });

  return (
    <Box maxWidth={480}>
      <FormProvider {...methods}>
        <form>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{FEE_SCHEDULE}</Typography>

            <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
          </Box>

          <Box p={2} mt={2} maxHeight="calc(100vh - 100px)" className="overflowY-auto">
            <Grid container spacing={3} direction="row">
              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  name="practice"
                  label={PRACTICE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="pricing"
                  controllerLabel={PRICING}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} direction="row">
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="cptCode"
                      controllerLabel={CPT_CODE_PROCEDURE_CODE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="modifier"
                      controllerLabel={MODIFIER}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} direction="row">
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker
                      name="effectiveDate"
                      label={EFFECTIVE_DATE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker
                      name="expirationDate"
                      label={EXPIRATION_DATE}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="description"
                  controllerLabel={DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="shortDescription"
                  controllerLabel={SHORT_DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  controllerName="longDescription"
                  controllerLabel={LONG_DESCRIPTION}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="number"
                  controllerName="coInsurancePercentage"
                  controllerLabel={SERVICE_FEE_CHARGE}
                  className="input-dollar-class custom-num-input"
                />
              </Grid>
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}
export default FeeScheduleForm;
