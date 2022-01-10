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
import { CITY, CLIA_ID_NUMBER, CODE, COUNTRY, CREATE_FACILITY, EMAIL, FACILITIES_ROUTE, FACILITY_INFO, FACILITY_CONTACT_INFO, FACILITY_CREATED, FAX, FORBIDDEN_EXCEPTION, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, PHONE, REVENUE_CODE, STATE, TAMXONOMY_CODE } from "../../../../constants";

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
        <Box maxHeight="calc(100vh - 240px)" overflow="auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={FACILITY_INFO} isEdit={true}>
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
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="practice-type" shrink>Practice Type</InputLabel>

                      <Select
                        labelId="practice-type"
                        id="practice-type-select"
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
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            {CREATE_FACILITY}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AddFacilityForm;
