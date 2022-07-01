// packages block
import { FC, useEffect, useContext, useCallback } from 'react';
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
import ViewDataLoader from '../../../../common/ViewDataLoader';
import CheckboxController from '../../../../common/CheckboxController';
import FacilitySelector from '../../../../common/Selector/FacilitySelector';
// utils, interfaces and graphql block
import history from '../../../../../history';
import { setRecord } from '../../../../../utils';
import { ListContext } from '../../../../../context';
import { serviceSchema } from '../../../../../validationSchemas';
import { extendedServiceInput, GeneralFormProps, ParamsType } from '../../../../../interfacesTypes';
import {
  useCreateServiceMutation, useGetServiceLazyQuery, useUpdateServiceMutation
} from "../../../../../generated/graphql";
import {
  ACTIVE_TEXT, CREATE_SERVICE, DURATION_TEXT, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FACILITY_SERVICES_ROUTE, SERVICE_UPDATED, UPDATE_SERVICE, FORBIDDEN_EXCEPTION,
  PRICE_TEXT, SERVICE_CREATED, SERVICE_NAME_TEXT, SERVICE_NOT_FOUND, SERVICE_INFO,
  FACILITIES_ROUTE, FACILITY, NOT_FOUND_EXCEPTION, SELECT_COLOR_TEXT, FACILITIES_BREAD,
  FACILITY_SERVICES_TEXT, FACILITY_SERVICE_EDIT_BREAD, FACILITY_SERVICE_NEW_BREAD,
  SERVICES_BREAD,
} from "../../../../../constants";

const ServiceForm: FC<GeneralFormProps> = ({ isEdit, id }): JSX.Element => {
  const { facilityId: currentFacility } = useParams<ParamsType>()
  const { facilityList } = useContext(ListContext)

  const methods = useForm<extendedServiceInput>({
    mode: "all",
    resolver: yupResolver(serviceSchema)
  });
  const { setValue, handleSubmit, formState: { errors } } = methods;

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
            const { name, isActive, price, facilityId, duration, color } = service || {}

            facilityId && setCurrentFacility(facilityId)
            name && setValue('name', name)
            price && setValue('price', price)
            color && setValue('color', color)
            duration && setValue('duration', duration)
            isActive && setValue('isActive', isActive as boolean)
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

  const setCurrentFacility = useCallback((id: string) => {
    const selectedFacility = facilityList?.filter(facility => facility?.id === id)[0]

    id && selectedFacility && setValue('facilityId', setRecord(id, selectedFacility.name))
  }, [facilityList, setValue]);

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getService({
          variables: { getService: { id } }
        })
      } else Alert.error(SERVICE_NOT_FOUND)
    } else {
      setCurrentFacility(currentFacility || '')
    }
  }, [currentFacility, getService, id, isEdit, setCurrentFacility])

  const onSubmit: SubmitHandler<extendedServiceInput> = async ({ duration, facilityId, name, price, color, isActive }) => {
    const { id: selectedFacilityId } = facilityId
    const serviceInput = {
      name: name || '', duration: duration || "", isActive: isActive,
      price: price || "", facilityId: selectedFacilityId || "", color: color || 'black'
    };

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
  };

  const disableSubmit = createServiceLoading || updateServiceLoading || getServiceLoading

  const {
    name: { message: nameError } = {},
    price: { message: priceError } = {},
    facilityId: { id: facilityIdError } = {},
    duration: { message: durationError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box display='flex'>
            <BackButton to={`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_SERVICES_ROUTE}`} />

            <Box ml={2} />

            <PageHeader
              title={FACILITY_SERVICES_TEXT}
              path={[FACILITIES_BREAD, SERVICES_BREAD(currentFacility || ''), isEdit ? FACILITY_SERVICE_EDIT_BREAD : FACILITY_SERVICE_NEW_BREAD]}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary"
            disabled={disableSubmit}
          >
            {isEdit ? UPDATE_SERVICE : CREATE_SERVICE}

            {disableSubmit &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>

        <Box maxHeight="calc(100vh - 190px)">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={SERVICE_INFO}>
                {getServiceLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <FacilitySelector
                      addEmpty
                      isRequired
                      label={FACILITY}
                      name="facilityId"
                      error={facilityIdError?.message}
                    />

                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="name"
                      controllerLabel={SERVICE_NAME_TEXT}
                      error={nameError}
                    />

                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="number"
                          controllerName="duration"
                          controllerLabel={DURATION_TEXT}
                          error={durationError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="price"
                          controllerLabel={PRICE_TEXT}
                          error={priceError}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="color"
                        controllerName="color"
                        controllerLabel={SELECT_COLOR_TEXT}
                      />
                    </Grid>

                    <Grid md={12} item>
                      <CheckboxController controllerName="isActive" controllerLabel={ACTIVE_TEXT} margin="none" />
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default ServiceForm;
