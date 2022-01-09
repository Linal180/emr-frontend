// packages block
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@material-ui/core";
import { FormProvider, useForm } from "react-hook-form";
// components block
import AddFacilityController from "./AddFacilityController";
import CardComponent from "../../../common/CardComponent";
import SelectController from "./SelectController";
// utils, interfaces and graphql block
import { addUserValidationSchema } from "../../../../validationSchemas";
import { ADD_FACILITY, ADDRESS, ADDRESS_2, CITY, CLIA_ID_NUMBER, CODE, COUNTRY, EMAIL, FACILITY_ID, FAX, FEDERAL_TAX_ID, INSURANCE_PLAN_TYPE, MAMMOGRAPHY_CERTIFICATION_NUMBER, MOBILE, NAME, NPI, PAGER, PHONE, PRACTICE_TYPE, REVENUE_CODE, SERVICE_CODE, STATE, STATEIMMUNIZATION_ID, TAMXONOMY_CODE, USER_ID, ZIP_CODE } from "../../../../constants";
import { CreateFacilityInput } from "../../../../generated/graphql";

const AddFacilityComponent = (): JSX.Element => {
  const methods = useForm<CreateFacilityInput>({
    mode: "all",
  });
  const { control } = methods;

  return (
    <FormProvider {...methods}>
      <form>
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
                controllerLabel={STATEIMMUNIZATION_ID}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="tamxonomyCode"
                control={control}
                controllerLabel={TAMXONOMY_CODE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="userId"
                control={control}
                controllerLabel={USER_ID}
              />
            </CardComponent>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default AddFacilityComponent;
