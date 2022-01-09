// packages block
import { FC } from 'react';
import { Button, Box, CircularProgress, Grid } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import Alert from "../../../common/Alert";
import AddFacilityController from "./AddFacilityController";
import CardComponent from "../../../common/CardComponent";
import SelectController from "./SelectController";
// utils, interfaces and graphql block
import history from "../../../../history";
import { CreateBillingAddressInput, CreateContactInput, CreateFacilityInput, CreateFacilityItemInput, useCreateFacilityMutation } from "../../../../generated/graphql";
import { ADD_FACILITY, ADDRESS, ADDRESS_2, CITY, CLIA_ID_NUMBER, CODE, COUNTRY, EMAIL, FACILITY_ID, FAX, FEDERAL_TAX_ID, INSURANCE_PLAN_TYPE, MAMMOGRAPHY_CERTIFICATION_NUMBER, MOBILE, NAME, NPI, PAGER, PHONE, PRACTICE_TYPE, REVENUE_CODE, SERVICE_CODE, STATE, STATE_IMMUNIZATION_ID, TAMXONOMY_CODE, ZIP_CODE, FACILITY_CREATED, FACILITIES_ROUTE } from "../../../../constants";

const AddFacilityComponent: FC = () => {
  const methods = useForm<CreateFacilityInput | CreateBillingAddressInput | CreateFacilityItemInput | CreateContactInput>({ mode: "all" });
  const { reset, handleSubmit, control, formState: { errors } } = methods;

  const [createFacility, { loading }] = useCreateFacilityMutation({
    onError() {
      return null;
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

  const onSubmit: SubmitHandler<CreateFacilityInput | CreateBillingAddressInput | CreateFacilityItemInput | CreateContactInput> = async () => {
    console.log("createFacility");

  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid lg={6} item>
            <CardComponent cardTitle={ADD_FACILITY} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="name"
                control={control}
                controllerLabel={NAME}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="code"
                control={control}
                controllerLabel={CODE}
              />

            </CardComponent>

            <CardComponent cardTitle={ADD_FACILITY} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="email"
                control={control}
                controllerLabel={EMAIL}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="phone"
                control={control}
                controllerLabel={PHONE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="address"
                control={control}
                // error={firstNameError}
                controllerLabel={ADDRESS}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="address2"
                control={control}
                controllerLabel={ADDRESS_2}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="city"
                control={control}
                controllerLabel={CITY}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="country"
                control={control}
                controllerLabel={COUNTRY}
              />

              <SelectController
                controllerName="practiceType"
                control={control}
                controllerLabel={PRACTICE_TYPE}
              />
            </CardComponent>
          </Grid>

          <Grid lg={6} item>
            <CardComponent cardTitle={ADD_FACILITY} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="email"
                control={control}
                controllerLabel={EMAIL}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="zipCode"
                control={control}
                controllerLabel={ZIP_CODE}
              />

            </CardComponent>

            <CardComponent cardTitle={ADD_FACILITY} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="cliaIdNumber"
                control={control}
                controllerLabel={CLIA_ID_NUMBER}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="facilityId"
                control={control}
                controllerLabel={FACILITY_ID}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="fax"
                control={control}
                // error={repeatPasswordError}
                controllerLabel={FAX}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="federalTaxId"
                control={control}
                controllerLabel={FEDERAL_TAX_ID}
              />

              <SelectController
                controllerName="insurancePlanType"
                control={control}
                controllerLabel={INSURANCE_PLAN_TYPE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="mammographyCertificationNumber"
                control={control}
                controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="mobile"
                control={control}
                controllerLabel={MOBILE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="npi"
                control={control}
                controllerLabel={NPI}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="pager"
                control={control}
                controllerLabel={PAGER}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="revenueCode"
                control={control}
                controllerLabel={REVENUE_CODE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="serviceCode"
                control={control}
                controllerLabel={SERVICE_CODE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="state"
                control={control}
                controllerLabel={STATE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="stateImmunizationId"
                control={control}
                controllerLabel={STATE_IMMUNIZATION_ID}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="tamxonomyCode"
                control={control}
                controllerLabel={TAMXONOMY_CODE}
              />
            </CardComponent>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Create Facility
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddFacilityComponent;
