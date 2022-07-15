// packages block
import { FC, useEffect, useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from '../../../../common/Alert';
import PageHeader from '../../../../common/PageHeader';
import BackButton from '../../../../common/BackButton';
import InputController from '../../../../../controller';
import CardComponent from '../../../../common/CardComponent';
import CheckboxController from '../../../../common/CheckboxController';
// utils, interfaces and graphql block
import history from '../../../../../history';
import { serviceSchema } from '../../../../../validationSchemas';
import { excludeLeadingZero, renderItem, renderLoading } from '../../../../../utils';
import { extendedServiceInput, GeneralFormProps, ParamsType } from '../../../../../interfacesTypes';
import {
  useCreateServiceMutation, useGetCurrentFacilityLazyQuery, useGetServiceLazyQuery,
  FacilityPayload, useUpdateServiceMutation
} from "../../../../../generated/graphql";
import {
  ACTIVE_TEXT, CREATE_SERVICE, DURATION_TEXT, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FACILITY_SERVICES_ROUTE, SERVICE_UPDATED, UPDATE_SERVICE, FORBIDDEN_EXCEPTION,
  PRICE_TEXT, SERVICE_CREATED, SERVICE_NAME_TEXT, SERVICE_NOT_FOUND, SERVICE_INFO,
  FACILITIES_ROUTE, FACILITY, NOT_FOUND_EXCEPTION, SELECT_COLOR_TEXT, FACILITIES_BREAD,
  FACILITY_SERVICES_TEXT, FACILITY_SERVICE_EDIT_BREAD, FACILITY_SERVICE_NEW_BREAD,
  SERVICES_BREAD, SOMETHING_WENT_WRONG,
} from "../../../../../constants";

const ServiceForm: FC<GeneralFormProps> = ({ isEdit, id }): JSX.Element => {
  const { facilityId: currentFacility } = useParams<ParamsType>()
  const [facility, setFacility] = useState<FacilityPayload['facility']>()

  const methods = useForm<extendedServiceInput>({
    mode: "all",
    resolver: yupResolver(serviceSchema)
  });
  const { setValue, handleSubmit, watch } = methods;
  const { isActive } = watch()

  const [getService, { loading: getServiceLoading }] = useGetServiceLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_SERVICES_ROUTE}`)
    },

    onCompleted(data) {
      const { getService } = data || {};

      if (getService) {
        const { response, service } = getService

        if (response) {
          const { status } = response

          if (service && status && status === 200) {
            const { name, isActive, price, duration, color, facility } = service || {}

            name && setValue('name', name)
            price && setValue('price', price)
            color && setValue('color', color)
            duration && setValue('duration', duration)
            isActive && setValue('isActive', isActive as boolean)

            !!facility && setFacility(facility)
          }
        }
      }
    }
  });

  const [createService, { loading: createServiceLoading }] = useCreateServiceMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createService: { response } } = data;

      if (response) {
        const { status } = response
        if (status && status === 200) {
          Alert.success(SERVICE_CREATED);
          history.push(`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_SERVICES_ROUTE}`)
        }
      }
    }
  });

  const [updateService, { loading: updateServiceLoading }] = useUpdateServiceMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateService: { response } } = data;

      if (response) {
        const { status, message } = response

        if (status && message && status === 200) {
          Alert.success(SERVICE_UPDATED);
          history.push(`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_SERVICES_ROUTE}`)
        }
      }
    }
  });

  const [getFacility, { loading: getFacilityLoading }] = useGetCurrentFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(FACILITIES_ROUTE)
    },

    onCompleted(data) {
      const { getFacility } = data || {};

      if (getFacility) {
        const { response, facility } = getFacility

        if (response) {
          const { status } = response

          if (facility && status && status === 200) {
            setFacility(facility)
          }
        }
      }
    }
  });

  const setCurrentFacility = useCallback(async (id: string) => {
    try {
      id ? await getFacility({
        variables: { getFacility: { id } }
      }) : Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [getFacility]);

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getService({
          variables: { getService: { id } }
        })
      } else Alert.error(SERVICE_NOT_FOUND)
    } else setCurrentFacility(currentFacility || '')
  }, [currentFacility, getService, id, isEdit, setCurrentFacility])

  const onSubmit: SubmitHandler<extendedServiceInput> = async ({
    duration, name, price, color, isActive
  }) => {
    const serviceInput = {
      name: name || '', duration: excludeLeadingZero(duration) || "", isActive: isActive,
      price: excludeLeadingZero(price) || "", facilityId: currentFacility || '', color: color || 'black'
    };

    if (!!currentFacility) {
      if (isEdit) {
        await updateService({
          variables: {
            updateServiceInput: { id: id || '', ...serviceInput }
          }
        })
      } else {
        await createService({
          variables: {
            createServiceInput: { ...serviceInput }
          }
        })
      }
    } else Alert.error(SOMETHING_WENT_WRONG)
  };

  const isLoading = createServiceLoading || updateServiceLoading || getServiceLoading || getFacilityLoading
  const { name: facilityName } = facility || {}

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex'>
            <BackButton to={`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_SERVICES_ROUTE}`} />

            <Box ml={2} />

            <PageHeader
              title={FACILITY_SERVICES_TEXT}
              path={[
                FACILITIES_BREAD, SERVICES_BREAD(currentFacility || ''),
                isEdit ? FACILITY_SERVICE_EDIT_BREAD : FACILITY_SERVICE_NEW_BREAD
              ]}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary"
            disabled={isLoading}
          >
            {isEdit ? UPDATE_SERVICE : CREATE_SERVICE}

            {isLoading &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>

        <Box maxHeight="calc(100vh - 190px)">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={SERVICE_INFO}>
                {getServiceLoading ?
                  renderLoading(FACILITY) : renderItem(FACILITY, facilityName)
                }

                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={SERVICE_NAME_TEXT}
                  loading={getServiceLoading}
                />

                <Grid container spacing={2}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      isRequired
                      fieldType="number"
                      controllerName="duration"
                      loading={getServiceLoading}
                      controllerLabel={DURATION_TEXT}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="price"
                      loading={getServiceLoading}
                      controllerLabel={PRICE_TEXT}
                    />
                  </Grid>
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="color"
                    controllerName="color"
                    loading={getServiceLoading}
                    controllerLabel={SELECT_COLOR_TEXT}
                  />
                </Grid>

                <Grid md={12} item>
                  <CheckboxController
                    margin="none"
                    controllerName="isActive"
                    controllerLabel={ACTIVE_TEXT}
                    defaultValue={isActive as boolean}
                  />
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default ServiceForm;
