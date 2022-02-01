// packages block
import { FC, useEffect, useContext, ChangeEvent, useState } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid } from "@material-ui/core";
// components block
import Alert from '../../../../common/Alert';
import ServiceController from '../controller';
import Selector from '../../../../common/Selector';
import CardComponent from '../../../../common/CardComponent';
import ViewDataLoader from '../../../../common/ViewDataLoader';
// utils, interfaces and graphql block
import history from '../../../../../history';
import { ListContext } from '../../../../../context';
import { serviceSchema } from '../../../../../validationSchemas';
import { renderFacilities, setRecord } from '../../../../../utils';
import { extendedServiceInput, GeneralFormProps, ParamsType } from '../../../../../interfacesTypes';
import {
  useCreateServiceMutation, useGetServiceLazyQuery, useUpdateServiceMutation
} from "../../../../../generated/graphql";
import {
  ACTIVE_TEXT, CREATE_SERVICE, DURATION_TEXT, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FACILITY_SERVICES_ROUTE, SERVICE_UPDATED, UPDATE_SERVICE, FORBIDDEN_EXCEPTION,
  PRICE_TEXT, SERVICE_CREATED, SERVICE_NAME_TEXT, SERVICE_NOT_FOUND, SERVICE_INFO,
  FACILITIES_ROUTE, FACILITY,
} from "../../../../../constants";

const ServiceForm: FC<GeneralFormProps> = ({ isEdit, id }): JSX.Element => {
  const { facilityId: currentFacility } = useParams<ParamsType>()
  const [checked, setChecked] = useState(false);
  const { facilityList } = useContext(ListContext)
  const methods = useForm<extendedServiceInput>({
    mode: "all",
    resolver: yupResolver(serviceSchema)
  });
  const { setValue, handleSubmit, control, formState: { errors } } = methods;

  const [getService, { loading: getServiceLoading }] = useGetServiceLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getService: { response, service } } = data;

      if (response) {
        const { status } = response

        if (service && status && status === 200) {
          const { name, isActive, price, duration, facility } = service || {}
          const { id: facilityId, name: facilityName } = facility || {};
          facilityId && setValue('facilityId', setRecord(facilityId, facilityName || ""))
          name && setValue('name', name)
          price && setValue('price', price)
          duration && setValue('duration', duration)
          isActive && setValue('isActive', isActive)
          isActive && setChecked(isActive)
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

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getService({
          variables: {
            getService: { id }
          }
        })
      } else Alert.error(SERVICE_NOT_FOUND)
    }
  }, [getService, id, isEdit])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onSubmit: SubmitHandler<extendedServiceInput> = async ({ duration, facilityId, name, price }) => {
    const { id: selectedFacilityId } = facilityId

    if (isEdit) {
      await updateService({
        variables: {
          updateServiceInput: {
            id: id || '', name: name || '', duration: duration || "", isActive: checked,
            price: price || "", facilityId: selectedFacilityId || "",
          }
        }
      })
    } else {
      await createService({
        variables: {
          createServiceInput: {
            name: name || "", duration: duration || "", facilityId: selectedFacilityId || "",
            price: price || "", isActive: checked
          }
        }
      })
    }
  };

  const disableSubmit = createServiceLoading || updateServiceLoading || getServiceLoading

  const {
    name: { message: nameError } = {},
    facilityId: { id: facilityIdError } = {},
    price: { message: priceError } = {},
    duration: { message: durationError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={SERVICE_INFO}>
                {getServiceLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Selector
                      isRequired
                      value={{ id: "", name: "" }}
                      label={FACILITY}
                      name="facilityId"
                      options={renderFacilities(facilityList)}
                      error={facilityIdError?.message}
                    />

                    <ServiceController
                      isRequired
                      fieldType="text"
                      controllerName="name"
                      controllerLabel={SERVICE_NAME_TEXT}
                      error={nameError}
                    />

                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <ServiceController
                          isRequired
                          fieldType="text"
                          controllerName="duration"
                          controllerLabel={DURATION_TEXT}
                          error={durationError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <ServiceController
                          isRequired
                          fieldType="text"
                          controllerName="price"
                          controllerLabel={PRICE_TEXT}
                          error={priceError}
                        />
                      </Grid>
                    </Grid>

                    <Grid md={12} item>
                      <Controller
                        name="isActive"
                        control={control}
                        render={() => {
                          return (
                            <FormControl>
                              <FormControlLabel label={ACTIVE_TEXT} id={"isActive"} control={<Checkbox color="primary" value={checked} checked={checked} onChange={handleChange} />} />
                            </FormControl>
                          )
                        }}
                      />
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={disableSubmit}
          >
            {isEdit ? UPDATE_SERVICE : CREATE_SERVICE}

            {disableSubmit &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default ServiceForm;
