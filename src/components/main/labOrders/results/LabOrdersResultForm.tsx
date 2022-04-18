// packages block
import { FC, useState, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, FormControlLabel, FormGroup, Checkbox, } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import { GeneralFormProps } from "../../../../interfacesTypes";
import {
  ABNORMAL_FLAG, DOCTOR_SIGNOFF, EMPTY_OPTION, NORMAL_RANGE, NORMAL_RANGE_UNITS, RESULTS, RESULT_UNITS, RESULT_VALUE, SAVE_TEXT, SCANNED_IN_RESULTS,
} from '../../../../constants';

const LabOrdersResultForm: FC<GeneralFormProps> = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState({ one: false });

  const methods = useForm<any>({
    mode: "all",
  });

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsChecked({ ...isChecked, [name]: event.target.checked });
  };

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Card>
      <Box px={3}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{RESULTS}</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <Box pt={2}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox color="primary" checked={isChecked.one} onChange={handleChangeForCheckBox("one")} />
                      }
                      label={DOCTOR_SIGNOFF}
                    />
                  </FormGroup>
                </Box>
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="resultValue"
                  controllerLabel={RESULT_VALUE}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="resultUnits"
                  controllerLabel={RESULT_UNITS}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="normalRange"
                  controllerLabel={NORMAL_RANGE}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="normalUnits"
                  controllerLabel={NORMAL_RANGE_UNITS}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="abnormalFlag"
                  label={ABNORMAL_FLAG}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="scanned"
                  label={SCANNED_IN_RESULTS}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>
            </Grid>

            <Box mb={3}>
              <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Card>
  );
};

export default LabOrdersResultForm;
