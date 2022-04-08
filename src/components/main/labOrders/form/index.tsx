// packages block
import { FC, useState, ChangeEvent } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Checkbox, FormControlLabel, FormGroup, Button, Collapse, } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import { BLACK_TWO } from '../../../../theme';
import { AddCircleOutline } from '@material-ui/icons';
import { GeneralFormProps } from "../../../../interfacesTypes";
import {
  ABNORMAL_FLAG, ADD_ANOTHER_SPECIMEN, APPOINTMENT_TEXT, COLLECTION_DATE, COLLECTION_TIME, CREATE_LAB_ORDER, DELETE, DESCRIPTION, DOCTOR_SIGNOFF,
  EDIT_LAB_ORDER, EMPTY_OPTION, NORMAL_RANGE, NORMAL_RANGE_UNITS, RESULT_UNITS, RESULT_VALUE, SAVE_TEXT, SPECIMEN_NOTES, SPECIMEN_TYPE, STATUS, 
  TEST_DATE, TEST_LOINC_CODE, TEST_NOTES, TEST_TIME
} from '../../../../constants';

const LabOrdersForm: FC<GeneralFormProps> = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState({ one: false });
  const [open, setOpen] = useState<boolean>(false);
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsChecked({ ...isChecked, [name]: event.target.checked });
  };

  return (
    <Card>
      <Box px={3}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{CREATE_LAB_ORDER}</Typography>
            </Box>

            <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{EDIT_LAB_ORDER}</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="appointment"
                  controllerLabel={APPOINTMENT_TEXT}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="status"
                  label={STATUS}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
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

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="code"
                  label={TEST_LOINC_CODE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="testDate"
                  label={TEST_DATE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="testTime"
                  label={TEST_TIME}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="testNotes"
                  controllerLabel={TEST_NOTES}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Typography variant='h6'>{DESCRIPTION}</Typography>

                <Box py={0.6} mb={2} color={BLACK_TWO}>
                  <Typography variant='body1'>N/A</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="specimenType"
                  label={SPECIMEN_TYPE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="collectionDate"
                  label={COLLECTION_DATE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="collectionTime"
                  label={COLLECTION_TIME}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="specimenNotes"
                  controllerLabel={SPECIMEN_NOTES}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} justifyContent="flex-end">
                  <Grid item md={4} sm={12} xs={12}>
                    <Collapse in={!open} mountOnEnter unmountOnExit>
                      <Box pb={3}
                        onClick={() => setOpen(!open)}
                        className="billing-box" display="flex" alignItems="center"
                      >
                        <AddCircleOutline color='inherit' />

                        <Typography>{ADD_ANOTHER_SPECIMEN}</Typography>
                      </Box>
                    </Collapse>
                  </Grid>
                </Grid>

                <Grid container spacing={3} justifyContent="flex-end">
                  <Grid item md={12} sm={12} xs={12}>
                    <Collapse in={open} mountOnEnter unmountOnExit>
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item md={4} sm={12} xs={12}>
                            <Selector
                              isRequired
                              name="specimenType"
                              label={SPECIMEN_TYPE}
                              value={EMPTY_OPTION}
                              options={[]}
                            />
                          </Grid>

                          <Grid item md={2} sm={12} xs={12}>
                            <Selector
                              isRequired
                              name="collectionDate"
                              label={COLLECTION_DATE}
                              value={EMPTY_OPTION}
                              options={[]}
                            />
                          </Grid>

                          <Grid item md={2} sm={12} xs={12}>
                            <Selector
                              isRequired
                              name="collectionTime"
                              label={COLLECTION_TIME}
                              value={EMPTY_OPTION}
                              options={[]}
                            />
                          </Grid>

                          <Grid item md={4} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="specimenNotes"
                              controllerLabel={SPECIMEN_NOTES}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Grid>
                </Grid>
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
            </Grid>

            <Box mb={3}>
              <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
            </Box>

            <Box mb={3} display="flex">
              <Button type="submit" variant="outlined" color="secondary">{DELETE}</Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
            </Box>
          </form>
        </FormProvider>
      </Box >
    </Card >
  );
};

export default LabOrdersForm;