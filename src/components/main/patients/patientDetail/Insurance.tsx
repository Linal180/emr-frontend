// packages block
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ExpandMore } from '@material-ui/icons';
import { Box, Typography, Collapse, colors, Card, Grid, Accordion, AccordionSummary, AccordionDetails, } from "@material-ui/core";
// components block
import Search from "../../../common/Search";
import Selector from '../../../common/Selector';
// constant, utils and styles block
import { BLUE_EIGHT, GRAY_TEN } from "../../../../theme";
import { AddInsuranceIcon } from "../../../../assets/svgs";
import { useTableStyles } from "../../../../styles/tableStyles";
import {
  ADDITIONAL_DETAILS,
  ADD_INSURANCE, ADD_INSURANCE_INFORMATION, COPAY_AMOUNTS, EMPTY_OPTION, EXPIRATION_DATE, INSURANCE_AND_POLICIES, INSURANCE_PAYER_NAME, INSURANCE_POLICY_DETAILS,
  ISSUE_DATE,
  MEMBER_ID_CERTIFICATE_NUMBER,
  ORDER_OF_BENEFIT, PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, POLICY_GROUP_NUMBER, POLICY_NAME,
} from "../../../../constants";
import InputController from '../../../../controller';

const InsuranceComponent = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<string | false>(false);
  const classes = useTableStyles();
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      <Card>
        <Box p={3}>
          <Collapse in={!open} mountOnEnter unmountOnExit>
            <Box onClick={() => setOpen(!open)}>
              <Box pb={2} mb={5} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{INSURANCE_POLICY_DETAILS}</Typography>
              </Box>

              <Box
                className='pointer-cursor' bgcolor={GRAY_TEN} border={`1px dashed ${BLUE_EIGHT}`}
                borderRadius={6} p={3} mb={4} display="flex" alignItems="center"
              >
                <AddInsuranceIcon />

                <Box pl={2}>
                  <Typography component="h4" variant="h5">{ADD_INSURANCE}</Typography>
                  <Typography component="h5" variant="body2">{ADD_INSURANCE_INFORMATION}</Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>

          <Collapse in={open} mountOnEnter unmountOnExit>
            <Box pb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{INSURANCE_AND_POLICIES}</Typography>
            </Box>

            <Box pt={3} pb={5}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item md={2} sm={12} xs={12}>
                      <Box className={classes.searchOuterContainer} pb={0}>
                        <Box pl={3.8}>
                          <Typography variant='body1'>{INSURANCE_PAYER_NAME}</Typography>
                        </Box>
                        <Search search={Search} />
                      </Box>
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <Box className={classes.searchOuterContainer}>
                        <Box pl={3.8}>
                          <Typography variant='body1'>{POLICY_NAME}</Typography>
                        </Box>
                        <Search search={Search} />
                      </Box>
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <Typography variant='body1'>{ORDER_OF_BENEFIT}</Typography>
                      <Selector
                        name="orderBenefit"
                        label={''}
                        value={EMPTY_OPTION}
                        options={[]}
                      />
                    </Grid>
                  </Grid>


                  <Box mt={4}>

                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='accordionCustomize'>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                          <Typography variant='h4'>{ADDITIONAL_DETAILS}</Typography>
                        </Box>
                      </AccordionSummary>

                      <AccordionDetails>
                        <Box minWidth="100%" pt={3}>
                          <Grid container spacing={3}>
                            <Grid item md={4} sm={12} xs={12}>
                              <Selector
                                name="patientRelationship"
                                label={PATIENT_RELATIONSHIP_TO_POLICY_HOLDER}
                                value={EMPTY_OPTION}
                                options={[]}
                              />
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                              <InputController
                                fieldType="text"
                                controllerName="memberId"
                                controllerLabel={MEMBER_ID_CERTIFICATE_NUMBER}
                              />
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                              <InputController
                                fieldType="text"
                                controllerName="policyNumber"
                                controllerLabel={POLICY_GROUP_NUMBER}
                              />
                            </Grid>

                            <Grid item md={2} sm={12} xs={12}>
                              <InputController
                                fieldType="text"
                                controllerName="issueDate"
                                controllerLabel={ISSUE_DATE}
                              />
                            </Grid>

                            <Grid item md={2} sm={12} xs={12}>
                              <InputController
                                fieldType="text"
                                controllerName="expirationDate"
                                controllerLabel={EXPIRATION_DATE}
                              />
                            </Grid>

                            <Grid item md={4} sm={12} xs={12}>
                              <Selector
                                name="copayAmounts"
                                label={COPAY_AMOUNTS}
                                value={EMPTY_OPTION}
                                options={[]}
                              />
                            </Grid>

                            <Grid item md={2} sm={12} xs={12}>
                              <InputController
                                fieldType="text"
                                controllerName="amount"
                                controllerLabel={''}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </form>
              </FormProvider>
            </Box>
          </Collapse>
        </Box>
      </Card>
    </>
  );
};

export default InsuranceComponent;