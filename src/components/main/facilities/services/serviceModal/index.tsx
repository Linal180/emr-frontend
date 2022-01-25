// packages block
import { FC, useState, ChangeEvent, useContext, useCallback, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogTitle, CircularProgress, FormControlLabel, Checkbox, Box, Grid, FormControl } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import ServiceController from "../controller";
import Selector from '../../../../common/Selector';
// interfaces/types block/theme/svgs/constants
import { renderFacilities, setRecord } from '../../../../../utils';
import { ListContext } from '../../../../../context/listContext';
import { serviceSchema } from '../../../../../validationSchemas';
import { extendedServiceInput, ServiceModalProps } from "../../../../../interfacesTypes";
import { CANCEL, ADD_SERVICE, SERVICE_NAME_TEXT, DURATION_TEXT, PRICE_TEXT, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, SERVICE_CREATED, FACILITY, SERVICE_UPDATED, UPDATE_SERVICE, ACTIVE_TEXT, ADD_FACILITY_SERVICE, UPDATE_FACILITY_SERVICE } from "../../../../../constants";
import { useCreateServiceMutation, useGetServiceLazyQuery, useUpdateServiceMutation } from "../../../../../generated/graphql";

const ServiceModal: FC<ServiceModalProps> = ({ setOpen, isOpen, isEdit, serviceId, reload }): JSX.Element => {
  const [checked, setChecked] = useState(false);
  const { facilityList } = useContext(ListContext)
  const methods = useForm<extendedServiceInput>({
    mode: "all",
    resolver: yupResolver(serviceSchema)
  });
  const { reset, setValue, handleSubmit, control, formState: { errors } } = methods;

  const handleClose = () => {
    setChecked(false)
    reset();
    setOpen && setOpen(!isOpen)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

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
          reset();
          handleClose();
          reload();
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
          reset()
          handleClose();
          reload();
        }
      }
    }
  });

  const onSubmit: SubmitHandler<extendedServiceInput> = async ({
    duration, facilityId, name, price, isActive,
  }) => {
    const { id: selectedFacilityId } = facilityId

    if (isEdit) {
      await updateService({
        variables: {
          updateServiceInput: {
            id: serviceId || '', name: name || '', duration: duration || "", isActive: checked, price: price || "", facilityId: selectedFacilityId || ""
          }
        }
      })
    } else {
      await createService({
        variables: {
          createServiceInput: {
            name: name || "",
            duration: duration || "",
            facilityId: selectedFacilityId || "",
            price: price || "",
            isActive: checked
          }
        }
      })
    }
  };

  const fetchServices = useCallback(() => {
    getService({
      variables: {
        getService: { id: serviceId || '' }
      }
    })
  }, [getService, serviceId])

  useEffect(() => {
    if (isEdit && serviceId) {
      fetchServices()
    }
  }, [fetchServices, isEdit, serviceId])

  const disableSubmit = createServiceLoading || updateServiceLoading || getServiceLoading

  const {
    name: { message: nameError } = {},
    facilityId: { message: facilityIdError } = {},
    price: { message: priceError } = {},
    duration: { message: durationError } = {},
  } = errors;

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">
        {isEdit ? UPDATE_FACILITY_SERVICE : ADD_FACILITY_SERVICE}
      </DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box ml={3} mr={3} pt={3}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  value={{ id: "", name: "" }}
                  label={FACILITY}
                  name="facilityId"
                  options={renderFacilities(facilityList)}
                  error={facilityIdError}
                />

                <Grid item md={12}>
                  <ServiceController
                    fieldType="text"
                    controllerName="name"
                    controllerLabel={SERVICE_NAME_TEXT}
                    error={nameError}
                  />
                </Grid>

                <Grid item md={12}>
                  <ServiceController
                    fieldType="text"
                    controllerName="duration"
                    controllerLabel={DURATION_TEXT}
                    error={durationError}
                  />
                </Grid>

                <Grid item md={12}>
                  <ServiceController
                    fieldType="text"
                    controllerName="price"
                    controllerLabel={PRICE_TEXT}
                    error={priceError}
                  />
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

                <DialogActions>
                  <Box pr={1}>
                    <Button onClick={handleClose} color="default">
                      {CANCEL}
                    </Button>
                  </Box>

                  <Button color="primary" type="submit" disabled={disableSubmit} variant="contained">
                    {disableSubmit && <CircularProgress size={20} color="inherit" />}
                    {isEdit ? UPDATE_SERVICE : ADD_SERVICE}
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </Box>
        </form >
      </FormProvider>
    </Dialog >
  );
};

export default ServiceModal;
