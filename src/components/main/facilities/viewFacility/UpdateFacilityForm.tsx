// packages block
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
import UpdateFacilityController from './UpdateFacilityController';
// utils, interfaces and graphql block
import history from "../../../../history";
import { getPracticeType } from "../../../../utils";
import { ParamsType } from '../../../../interfacesTypes';
import { FacilityPayload, PracticeType, UpdateFacilityItemInput, useGetFacilityLazyQuery, useUpdateFacilityMutation } from "../../../../generated/graphql";
import { CLIA_ID_NUMBER, CODE, FACILITIES_ROUTE, FACILITY_BASIC_INFO, FACILITY_UPDATED, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, REVENUE_CODE, TAMXONOMY_CODE, UPDATE_FACILITY } from "../../../../constants";

const UpdateFacilityForm: FC = () => {
  const { id } = useParams<ParamsType>();
  const methods = useForm<UpdateFacilityItemInput>({ mode: "all" });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods;
  const [facility, setFacility] = useState<FacilityPayload['facility']>()
  const [getFacility, { loading: getFacilityLoading }] = useGetFacilityLazyQuery({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getFacility: { response, facility } } = data;

      if (response) {
        const { status } = response

        if (facility && status && status === 200) {
          const {
            name, cliaIdNumber, federalTaxId, insurancePlanType,
            npi, code, tamxonomyCode, revenueCode, practiceType,
          } = facility

          setFacility(facility)

          name && setValue('name', name)
          cliaIdNumber && setValue('cliaIdNumber', cliaIdNumber)
          federalTaxId && setValue('federalTaxId', federalTaxId)
          insurancePlanType && setValue('insurancePlanType', insurancePlanType)
          npi && setValue('npi', npi)
          code && setValue('code', code)
          tamxonomyCode && setValue('tamxonomyCode', tamxonomyCode)
          revenueCode && setValue('revenueCode', revenueCode)
          practiceType && setValue('practiceType', getPracticeType(practiceType) as PracticeType)

        }
      }
    }
  });

  const [updateFacility, { loading }] = useUpdateFacilityMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateFacility: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(FACILITY_UPDATED);
          reset()
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      getFacility({
        variables: {
          getFacility: {
            id
          }
        }
      })
    } else {
      Alert.error('Facility not found!')
    }
  }, [getFacility, id])

  const onSubmit: SubmitHandler<UpdateFacilityItemInput> = async (inputs: any) => {
    if (id) {
      const {
        name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode,
        revenueCode, practiceType, phone, email, fax, city, state, country
      } = inputs

      await updateFacility({
        variables: {
          updateFacilityInput: {
            updateFacilityItemInput: {
              id, name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, revenueCode, practiceType
            },
            updateContactInput: {
              id, phone, email, fax, city, state, country
            },
            updateBillingAddressInput: {
              id, phone, email, fax, city, state, country
            },
          }
        }
      })
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} item>
            <CardComponent cardTitle={FACILITY_BASIC_INFO} isEdit={true}>
              <UpdateFacilityController
                fieldType="text"
                controllerName="name"
                controllerLabel={NAME}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="cliaIdNumber"
                controllerLabel={CLIA_ID_NUMBER}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="insurancePlanType"
                controllerLabel={INSURANCE_PLAN_TYPE}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="npi"
                controllerLabel={NPI}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="code"
                controllerLabel={CODE}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="tamxonomyCode"
                controllerLabel={TAMXONOMY_CODE}
              />

              <UpdateFacilityController
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
        </Grid>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {UPDATE_FACILITY}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default UpdateFacilityForm;
