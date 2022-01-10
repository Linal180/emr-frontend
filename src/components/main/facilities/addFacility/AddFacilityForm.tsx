// packages block
import { FC } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
import AddFacilityController from "./AddFacilityController";
// utils, interfaces and graphql block
import history from "../../../../history";
import { CreateFacilityInput, PracticeType, useCreateFacilityMutation } from "../../../../generated/graphql";
import { CITY, CLIA_ID_NUMBER, CODE, COUNTRY, FACILITY_TYPE, FACILITY_IDS, CREATE_FACILITY, BILLING_ADDRESS, EMAIL, FACILITIES_ROUTE, FACILITY_INFO, FACILITY_CONTACT_INFO, FACILITY_CREATED, FAX, FORBIDDEN_EXCEPTION, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, PHONE, REVENUE_CODE, STATE, TAMXONOMY_CODE, FACILITY_CONTACT, ZIP, ADDRESS, ADDRESS_2, PRACTICE_TYPE, BANK_ACCOUNT, FEDERAL_TAX_ID, MAMMOGRAPHY_CERTIFICATION_NUMBER, MERCHANT_ID, STATE_IMMUNIZATION_ID, LOCATION_ID, POS } from "../../../../constants";

const AddFacilityForm: FC = () => {
  const methods = useForm<CreateFacilityInput>({ mode: "all" });
  const { reset, handleSubmit } = methods;

  const [createFacility, { loading }] = useCreateFacilityMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error("Email or username already exists!")
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createFacility: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(FACILITY_CREATED);
          reset()
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<CreateFacilityInput> = async (inputs: any) => {
    const { name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, revenueCode, practiceType, phone, email, fax, city, state, country } = inputs;

    await createFacility({
      variables: {
        createFacilityInput: {
          createFacilityItemInput: {
            name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, revenueCode, practiceType
          },
          createContactInput: {
            phone, email, fax, city, state, country
          },
          createBillingAddressInput: {
            phone, email, fax, city, state, country
          },
        }
      }
    })
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} item>
            <CardComponent cardTitle={FACILITY_INFO} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="name"
                controllerLabel={NAME}
              />

              <Controller
                name="practiceType"
                defaultValue={PracticeType.Hospital}
                render={({ field }) => (
                  <FormControl fullWidth margin='normal'>
                    <InputLabel id="demo-customized-select-label-practice-type" shrink>Practice Type</InputLabel>
                    <Select
                      labelId="demo-customized-select-label-practice-type"
                      id="demo-customized-select-1"
                      variant="outlined"
                    >
                      {MAPPED_PRACTICE_TYPES.map((type, index: number) => {
                        const { label, value } = type;

                        return <MenuItem key={index} value={value}>{label}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                )}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="code"
                controllerLabel={CODE}
              />
            </CardComponent>
          </Grid>

          <Grid item md={6}>
            <CardComponent cardTitle={FACILITY_CONTACT} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="email"
                controllerLabel={EMAIL}
              />

              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="phone"
                    controllerLabel={PHONE}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="fax"
                    controllerLabel={FAX}
                  />
                </Grid>
              </Grid>

              <AddFacilityController
                fieldType="text"
                controllerName="zipCode"
                controllerLabel={ZIP}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="address"
                controllerLabel={ADDRESS}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="address2"
                controllerLabel={ADDRESS_2}
              />

              <Grid container spacing={3}>
                <Grid item md={4}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="city"
                    controllerLabel={CITY}
                  />

                </Grid>
                <Grid item md={4}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="state"
                    controllerLabel={STATE}
                  />

                </Grid>
                <Grid item md={4}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="country"
                    controllerLabel={COUNTRY}
                  />
                </Grid>
              </Grid>
            </CardComponent>
          </Grid>

          <Grid item md={6}>
            <CardComponent cardTitle={BILLING_ADDRESS} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="billingEmail"
                controllerLabel={EMAIL}
              />

              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="billingPhone"
                    controllerLabel={PHONE}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="billingFax"
                    controllerLabel={FAX}
                  />
                </Grid>
              </Grid>

              <AddFacilityController
                fieldType="text"
                controllerName="billingZipCode"
                controllerLabel={ZIP}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="billingAddress"
                controllerLabel={ADDRESS}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="billingAddress2"
                controllerLabel={ADDRESS_2}
              />

              <Grid container spacing={3}>
                <Grid item md={4}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="billingCity"
                    controllerLabel={CITY}
                  />

                </Grid>
                <Grid item md={4}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="billingState"
                    controllerLabel={STATE}
                  />

                </Grid>
                <Grid item md={4}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="billingCountry"
                    controllerLabel={COUNTRY}
                  />
                </Grid>

                <AddFacilityController
                  fieldType="text"
                  controllerName="billingPracticeType"
                  controllerLabel={PRACTICE_TYPE}
                />

                <AddFacilityController
                  fieldType="text"
                  controllerName="billingBankAccount"
                  controllerLabel={BANK_ACCOUNT}
                />

              </Grid>
            </CardComponent>
          </Grid>

          <Grid item md={6}>
            <CardComponent cardTitle={FACILITY_IDS} isEdit={true}>
              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="cliaIdNumber"
                    controllerLabel={CLIA_ID_NUMBER}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="federalTaxId"
                    controllerLabel={FEDERAL_TAX_ID}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="tamxonomyCode"
                    controllerLabel={TAMXONOMY_CODE}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="revenueCode"
                    controllerLabel={REVENUE_CODE}
                  />
                </Grid>
              </Grid>

              <AddFacilityController
                fieldType="text"
                controllerName="facilityType"
                controllerLabel={FACILITY_TYPE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="insurancePlanType"
                controllerLabel={INSURANCE_PLAN_TYPE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="mammographyCertificationNumber"
                controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
              />

              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="npi"
                    controllerLabel={NPI}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="pos"
                    controllerLabel={POS}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="merchantId"
                    controllerLabel={MERCHANT_ID}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="billingType"
                    controllerLabel={PHONE}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="stateImmunizationId"
                    controllerLabel={STATE_IMMUNIZATION_ID}
                  />
                </Grid>

                <Grid item md={6}>
                  <AddFacilityController
                    fieldType="text"
                    controllerName="locationId"
                    controllerLabel={LOCATION_ID}
                  />
                </Grid>
              </Grid>
            </CardComponent>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {CREATE_FACILITY}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form >
    </FormProvider >
  );
};

export default AddFacilityForm;
