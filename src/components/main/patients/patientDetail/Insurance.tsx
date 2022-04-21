// packages block
import { useState, ChangeEvent } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  Box, Typography, Collapse, colors, Card, Grid, Accordion, AccordionSummary, AccordionDetails, FormControl, FormGroup, FormControlLabel,
  Checkbox, Button,
} from "@material-ui/core";
// components block
import Search from "../../../common/Search";
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// constant, utils and styles block
import { BLUE_EIGHT, GRAY_TEN } from "../../../../theme";
import { AddInsuranceIcon, RightArrow } from "../../../../assets/svgs";
import {
  ADDRESS, ADDRESS_CTD, ADD_ANOTHER_COPAY_AMOUNT, ADD_INSURANCE, ADD_INSURANCE_INFORMATION, CHECK_ELIGIBILITY_TODAY, CHECK_PRIOR_DATE_OF_SERVICE,
  COINSURANCE_PERCENTAGE, COPAY_AMOUNTS, DOB, ELIGIBILITY, EMPLOYER, EMPTY_OPTION, EXPIRATION_DATE, FIRST_NAME, INSURANCE_AND_POLICIES, SUFFIX,
  INSURANCE_PAYER_NAME, INSURANCE_POLICY_DETAILS, ISSUE_DATE, LAST_NAME, LEGAL_SEX, MEMBER_ID_CERTIFICATE_NUMBER, SSN, MIDDLE_NAME, NOTES, STATE,
  ORDER_OF_BENEFIT, OVERRIDE_PAYER_RETURNED_RESULT, PATIENT_RELATIONSHIP_TO_POLICY_HOLDER, POLICY_GROUP_NUMBER, POLICY_HOLDER_DETAILS, SELECT,
  POLICY_HOLDER_ID_CERTIFICATION_NUMBER, PRICING_PRODUCT_TYPE, PRIMARY_CARE_PROVIDER, REFERRING_PROVIDER, INSURANCE_CARD, POLICY_INFORMATION,
  TAKE_A_PICTURE_OF_INSURANCE, ADD_UPLOAD_IMAGES, SAVE_TEXT,
} from "../../../../constants";

const InsuranceComponent = (): JSX.Element => {

  const [open, setOpen] = useState<boolean>(false)
  const [openNew, setOpenNew] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<string | false>(false);
  const [state, setState] = useState({ one: false, two: false, three: false })

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const search = (query: string) => { }

  return (
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
          <Box pb={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h4'>{INSURANCE_AND_POLICIES}</Typography>

            <Button type='submit' variant='contained' color='primary'>{SAVE_TEXT}</Button>
          </Box>

          <Box pt={3} pb={5}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item md={2} sm={12} xs={12}>
                    <Box mb={1.8}>
                      <Typography variant='body1'>{INSURANCE_PAYER_NAME}</Typography>
                    </Box>
                    <Search search={search} />
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

                <Box mt={4} />

                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='accordionCustomize'>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant='h4'>{POLICY_INFORMATION}</Typography>
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

                        <Grid item md={12} sm={12} xs={12}>
                          <Collapse in={!openNew} mountOnEnter unmountOnExit>
                            <Box
                              onClick={() => setOpenNew(!openNew)}
                              className="billing-box" textAlign="center"
                              maxWidth={280} margin="auto" mb={4}
                              borderBottom={`1px solid ${BLUE_EIGHT}`}
                            >
                              <Typography>{ADD_ANOTHER_COPAY_AMOUNT}</Typography>
                            </Box>
                          </Collapse>

                          <Grid container spacing={3} justifyContent="flex-end">
                            <Grid item md={8} sm={12} xs={12}>
                              <Collapse in={openNew} mountOnEnter unmountOnExit>
                                <Box>
                                  <Grid container spacing={3}>
                                    <Grid item md={6} sm={12} xs={12}>
                                      <Selector
                                        name="copayAmounts"
                                        label={COPAY_AMOUNTS}
                                        value={EMPTY_OPTION}
                                        options={[]}
                                      />
                                    </Grid>

                                    <Grid item md={3} sm={12} xs={12}>
                                      <InputController
                                        fieldType="text"
                                        controllerName="amount"
                                        controllerLabel={''}
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
                            controllerName="coinsurancePercentage"
                            controllerLabel={COINSURANCE_PERCENTAGE}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="referringProvider"
                            label={REFERRING_PROVIDER}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="primaryCareProvider"
                            label={PRIMARY_CARE_PROVIDER}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>

                        <Grid item md={2} sm={12} xs={12}>
                          <Selector
                            name="pricingProductType"
                            label={PRICING_PRODUCT_TYPE}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="notes"
                            controllerLabel={NOTES}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Box mt={4} />

                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className='accordionCustomize'>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant='h4'>{POLICY_HOLDER_DETAILS}</Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Box minWidth="100%" pt={3}>
                      <Grid container spacing={3}>
                        <Grid item md={4} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="policyId"
                            controllerLabel={POLICY_HOLDER_ID_CERTIFICATION_NUMBER}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="employer"
                            label={EMPLOYER}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={3} sm={12} xs={12}>
                          <Selector
                            name="suffix"
                            label={SUFFIX}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="firstName"
                            controllerLabel={FIRST_NAME}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="middleName"
                            controllerLabel={MIDDLE_NAME}
                          />
                        </Grid>

                        <Grid item md={3} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="lastName"
                            controllerLabel={LAST_NAME}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={4} sm={12} xs={12}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" p={1} mt={2} border={`1px solid ${colors.grey[300]}`}>
                            <Typography variant='h5'>99501-59001</Typography>
                            <RightArrow />
                          </Box>
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="address"
                            controllerLabel={ADDRESS}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="addressCTD"
                            controllerLabel={ADDRESS_CTD}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="select"
                            label={SELECT}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="state"
                            label={STATE}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={4} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="SSN"
                            controllerLabel={SSN}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="legalSex"
                            label={LEGAL_SEX}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            name="dob"
                            label={DOB}
                            value={EMPTY_OPTION}
                            options={[]}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Box mt={4} />

                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className='accordionCustomize'>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                  >
                    <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant='h4'>{ELIGIBILITY}</Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Box minWidth="100%" pt={3}>
                      <Grid container spacing={3}>
                        <Grid item md={12} sm={12} xs={12}>
                          <FormControl component="fieldset">
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox color="primary" checked={state.one} onChange={handleChangeForCheckBox("one")} />
                                }
                                label={CHECK_ELIGIBILITY_TODAY}
                              />

                              <FormControlLabel
                                control={
                                  <Checkbox color="primary" checked={state.two} onChange={handleChangeForCheckBox("two")} />
                                }
                                label={CHECK_PRIOR_DATE_OF_SERVICE}
                              />

                              <FormControlLabel
                                control={
                                  <Checkbox color="primary" checked={state.three} onChange={handleChangeForCheckBox("three")} />
                                }
                                label={OVERRIDE_PAYER_RETURNED_RESULT}
                              />
                            </FormGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Box mt={4} />

                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className='accordionCustomize'>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                  >
                    <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant='h4'>{INSURANCE_CARD}</Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Box minWidth="100%" pt={3}>
                      <Grid container spacing={3}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography variant='h5'>{TAKE_A_PICTURE_OF_INSURANCE}</Typography>

                          <Box p={2} />

                          <Button variant='contained' color='primary'>{ADD_UPLOAD_IMAGES}</Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </form>
            </FormProvider>
          </Box>
        </Collapse>
      </Box>
    </Card>
  );
};

export default InsuranceComponent;