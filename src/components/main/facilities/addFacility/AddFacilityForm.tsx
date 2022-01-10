// packages block
import { FC } from 'react';
import { Button, Box, CircularProgress, Grid, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import Alert from "../../../common/Alert";
import AddFacilityController from "./AddFacilityController";
import CardComponent from "../../../common/CardComponent";
import SelectController from "./SelectController";
// utils, interfaces and graphql block
import history from "../../../../history";
import { CreateBillingAddressInput, CreateContactInput, CreateFacilityInput, CreateFacilityItemInput, PracticeType, useCreateFacilityMutation, UserRole } from "../../../../generated/graphql";
import { ADD_FACILITY, CITY, CLIA_ID_NUMBER, CODE, COUNTRY, EMAIL, FACILITY_ID, FAX, FEDERAL_TAX_ID, INSURANCE_PLAN_TYPE, MAMMOGRAPHY_CERTIFICATION_NUMBER, MOBILE, NAME, NPI, PAGER, PHONE, PRACTICE_TYPE, REVENUE_CODE, SERVICE_CODE, STATE, STATE_IMMUNIZATION_ID, TAMXONOMY_CODE, ZIP_CODE, FACILITY_CREATED, FACILITIES_ROUTE, CREATE_FACILITY, FACILITY_BASIC_INFO, MAPPED_PRACTICE_TYPES, FACILITY_CONTACT_INFO, FACILITY_BILLING_INFO } from "../../../../constants";

const AddFacilityForm: FC = () => {
  const methods = useForm<CreateFacilityInput>({ mode: "all" });
  const { reset, handleSubmit, control, formState: { errors } } = methods;

  const [createFacility, { loading }] = useCreateFacilityMutation({
    onError({ message }) {
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

  const onSubmit: SubmitHandler<CreateFacilityInput> = async () => {
  };
  // const onSubmit: SubmitHandler<CreateFacilityInput> = async ({ createFacilityItemInput: {
  //   name,
  //   cliaIdNumber,
  //   federalTaxId,
  //   insurancePlanType,
  //   npi,
  //   code,
  //   tamxonomyCode,
  //   revenueCode,
  //   practiceType
  // },
  //   createContactInput: {
  //     phone,
  //     email,
  //     fax,
  //     city,
  //     state,
  //     country
  //   },
  //   createBillingAddressInput: {
  //     phone: billingPhone,
  //     email: billingEmail,
  //     fax: billingEax,
  //     city: billingCity,
  //     state: billingState,
  //     country: billingCountry
  //   }
  // }) => {
  //   await createFacility({
  //     variables: {
  //       createFacilityInput: {
  //         createFacilityItemInput: {
  //           name,
  //           cliaIdNumber,
  //           federalTaxId,
  //           insurancePlanType,
  //           npi,
  //           code,
  //           tamxonomyCode,
  //           revenueCode,
  //           practiceType
  //         },
  //         createContactInput: {
  //           phone,
  //           email,
  //           fax,
  //           city,
  //           state,
  //           country
  //         },
  //         createBillingAddressInput: {
  //           phone,
  //           email,
  //           fax,
  //           city,
  //           state,
  //           country
  //         },
  //         // createBillingAddressInput: {
  //         //   phone: billingPhone,
  //         //   email: billingEmail,
  //         //   fax: billingEax,
  //         //   city: billingCity,
  //         //   state: billingState,
  //         //   country: billingCountry
  //         // }
  //       }
  //     }
  //   })
  // };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} item>
            <CardComponent cardTitle={FACILITY_BASIC_INFO} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="name"
                controllerLabel={NAME}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="cliaIdNumber"
                controllerLabel={CLIA_ID_NUMBER}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="insurancePlanType"
                controllerLabel={INSURANCE_PLAN_TYPE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="npi"
                controllerLabel={NPI}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="code"
                controllerLabel={CODE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="tamxonomyCode"
                controllerLabel={TAMXONOMY_CODE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="revenueCode"
                controllerLabel={REVENUE_CODE}
              />

              <Controller
                name="practiceType"
                defaultValue={PracticeType.Hospital}
                render={({ field }) => <FormControl fullWidth>
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
                }
              />
            </CardComponent>
          </Grid>

          <Grid item md={6}>
            <CardComponent cardTitle={FACILITY_CONTACT_INFO} isEdit={true}>
              <AddFacilityController
                fieldType="text"
                controllerName="email"
                controllerLabel={EMAIL}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="phone"
                controllerLabel={PHONE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="fax"
                controllerLabel={FAX}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="city"
                controllerLabel={CITY}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="state"
                controllerLabel={STATE}
              />

              <AddFacilityController
                fieldType="text"
                controllerName="country"
                controllerLabel={COUNTRY}
              />
            </CardComponent>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {CREATE_FACILITY}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddFacilityForm;
