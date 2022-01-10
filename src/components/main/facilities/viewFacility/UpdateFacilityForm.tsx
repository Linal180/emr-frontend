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
import { CustomUpdateFacilityInputProps, ParamsType } from '../../../../interfacesTypes';
import { FacilityPayload, PracticeType, UpdateFacilityInput, UpdateFacilityItemInput, useGetFacilityLazyQuery, useUpdateFacilityMutation } from "../../../../generated/graphql";
import { CLIA_ID_NUMBER, CODE, FACILITIES_ROUTE, FACILITY_INFO, FACILITY_UPDATED, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, REVENUE_CODE, TAMXONOMY_CODE, UPDATE_FACILITY, FACILITY_CONTACT_INFO, CITY, COUNTRY, EMAIL, FAX, PHONE, STATE } from "../../../../constants";

const UpdateFacilityForm: FC = () => {
  const { id } = useParams<ParamsType>();
  const methods = useForm<CustomUpdateFacilityInputProps>({ mode: "all" });
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
            contacts, billingAddress
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

          if (contacts) {
            const { email, phone, mobile, fax, city, state, country } = contacts[0]
            email && setValue('email', email)
            phone && setValue('phone', phone)
            mobile && setValue('mobile', mobile)
            fax && setValue('fax', fax)
            city && setValue('city', city)
            state && setValue('state', state)
            country && setValue('country', country)
          }

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

  const onSubmit: SubmitHandler<CustomUpdateFacilityInputProps> = async ({
    name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, revenueCode,
    practiceType, phone, email, fax, city, state, country
  }) => {
    if (facility) {

      const { contacts, billingAddress } = facility;

      if (id && contacts && billingAddress) {
        const { id: contactId } = contacts[0]
        const { id: billingId } = billingAddress[0]

        await updateFacility({
          variables: {
            updateFacilityInput: {
              updateFacilityItemInput: {
                id, name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, revenueCode, practiceType
              },
              updateContactInput: {
                id: contactId, phone, email, fax, city, state, country
              },
              updateBillingAddressInput: {
                id: billingId, phone, email, fax, city, state, country
              },
            }
          }
        })
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid md={6} item>
            <CardComponent cardTitle={FACILITY_INFO} isEdit={true}>
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

          <Grid item md={6}>
            <CardComponent cardTitle={FACILITY_CONTACT_INFO} isEdit={true}>
              <UpdateFacilityController
                fieldType="text"
                controllerName="email"
                controllerLabel={EMAIL}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="phone"
                controllerLabel={PHONE}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="fax"
                controllerLabel={FAX}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="city"
                controllerLabel={CITY}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="state"
                controllerLabel={STATE}
              />

              <UpdateFacilityController
                fieldType="text"
                controllerName="country"
                controllerLabel={COUNTRY}
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
