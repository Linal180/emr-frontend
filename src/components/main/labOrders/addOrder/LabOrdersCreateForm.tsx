// packages block
import { FC, useState, } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, Collapse, } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import { AddCircleOutline } from '@material-ui/icons';
import { GeneralFormProps } from "../../../../interfacesTypes";
import {
  ADD_ANOTHER_SPECIMEN, ADD_ANOTHER_TEST, APPOINTMENT_TEXT, COLLECTION_DATE, COLLECTION_TIME, CREATE_LAB_ORDER,
  DIAGNOSES, EMPTY_OPTION, SAVE_TEXT, SPECIMEN_NOTES, SPECIMEN_TYPE, STATUS,
  TEST, TEST_DATE, TEST_NOTES, TEST_TIME
} from '../../../../constants';

const LabOrdersCreateForm: FC<GeneralFormProps> = (): JSX.Element => {
  const [openSpecimen, setOpenSpecimen] = useState<boolean>(false);
  const [openTest, setOpenTest] = useState<boolean>(false);
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
              <Typography variant='h4'>{CREATE_LAB_ORDER}</Typography>
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
                  name="status"
                  label={STATUS}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  isSearch
                  fieldType="text"
                  controllerName="search"
                  controllerLabel={DIAGNOSES}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  isSearch
                  fieldType="text"
                  controllerName="search"
                  controllerLabel={TEST}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  name="testDate"
                  label={TEST_DATE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
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
                <Grid container spacing={3} justifyContent="flex-end">
                  <Grid item md={4} sm={12} xs={12}>
                    <Collapse in={!openTest} mountOnEnter unmountOnExit>
                      <Box pb={3}
                        onClick={() => setOpenTest(!openTest)}
                        className="billing-box" display="flex" alignItems="center"
                      >
                        <AddCircleOutline color='inherit' />

                        <Typography>{ADD_ANOTHER_TEST}</Typography>
                      </Box>
                    </Collapse>
                  </Grid>
                </Grid>

                <Grid container spacing={3} justifyContent="flex-end">
                  <Grid item md={12} sm={12} xs={12}>
                    <Collapse in={openTest} mountOnEnter unmountOnExit>
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item md={4} sm={12} xs={12}>
                            <InputController
                              isSearch
                              fieldType="text"
                              controllerName="search"
                              controllerLabel={TEST}
                            />
                          </Grid>

                          <Grid item md={2} sm={12} xs={12}>
                            <Selector
                              name="testDate"
                              label={TEST_DATE}
                              value={EMPTY_OPTION}
                              options={[]}
                            />
                          </Grid>

                          <Grid item md={2} sm={12} xs={12}>
                            <Selector
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
                        </Grid>
                      </Box>
                    </Collapse>
                  </Grid>
                </Grid>
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
                  name="collectionDate"
                  label={COLLECTION_DATE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
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
                    <Collapse in={!openSpecimen} mountOnEnter unmountOnExit>
                      <Box pb={3}
                        onClick={() => setOpenSpecimen(!openSpecimen)}
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
                    <Collapse in={openSpecimen} mountOnEnter unmountOnExit>
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
                              name="collectionDate"
                              label={COLLECTION_DATE}
                              value={EMPTY_OPTION}
                              options={[]}
                            />
                          </Grid>

                          <Grid item md={2} sm={12} xs={12}>
                            <Selector
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

export default LabOrdersCreateForm;
