// packages block
import { FC, useContext, useEffect, useCallback } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { CardContent, Button, Dialog, DialogActions, DialogTitle, CircularProgress, Box, Grid } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import LocationController from "../controller";
import Selector from "../../../../common/Selector";
import CardComponent from "../../../../common/CardComponent";
// interfaces/types block/theme/svgs/constants
import { yupResolver } from "@hookform/resolvers/yup";
import { ListContext } from "../../../../../context/listContext";
import { renderFacilities, setRecord } from "../../../../../utils";
import { extendedContactSchema } from "../../../../../validationSchemas";
import { LocationModalProps, extendedContactInput } from "../../../../../interfacesTypes";
import {
  ServiceCode, ServiceCodes, useCreateContactMutation, useFindContactLazyQuery, useUpdateContactMutation
} from "../../../../../generated/graphql";
import {
  CANCEL, ADD_LOCATION, CREATE_LOCATION, ASSOCIATED_FACILITY, LOCATION_INFO, NAME, PHONE, CONTACT, EMAIL,
  UPDATE_LOCATION_TEXT, POS, MAPPED_SERVICE_CODES, FAX, ZIP_CODE, ADDRESS_2, ADDRESS, STATE, COUNTRY, CITY,
  EDIT_LOCATION
} from "../../../../../constants";

const LocationModal: FC<LocationModalProps> = ({ setOpen, isOpen, isEdit, locationId, reload }): JSX.Element => {
  const { facilityList } = useContext(ListContext)
  const methods = useForm<extendedContactInput>({ mode: "all", resolver: yupResolver(extendedContactSchema) });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods;

  const handleClose = () => {
    reset();
    setOpen && setOpen(!isOpen)
  }

  const [getContact, { loading: getContactLoading }] = useFindContactLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getContact: { response, contact } } = data;

      if (response) {
        const { status } = response

        if (contact && status && status === 200) {
          const { name, email, phone, zipCode, fax, address, address2, city, state, serviceCode, country, facility } = contact || {}
          const { id, name: facilityName } = facility || {};

          fax && setValue('fax', fax)
          name && setValue('name', name)
          city && setValue('city', city)
          email && setValue('email', email)
          state && setValue('state', state)
          phone && setValue('phone', phone)
          zipCode && setValue('zipCode', zipCode)
          address && setValue('address', address)
          country && setValue('country', country)
          address2 && setValue('address2', address2)
          facility && setValue('facilityId', setRecord(id || '', facilityName || ''))
          serviceCode && setValue('serviceCode', setRecord(serviceCode || '', serviceCode || ''))
        }
      }
    }
  });

  const [updateContact, { loading: updateContactLoading }] = useUpdateContactMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateContact: { response } } = data;

      if (response) {
        const { status, message } = response

        if (status && message && status === 200) {
          Alert.success(message)
          reset();
          handleClose();
          reload();
        }
      }
    }
  });

  const [createContact, { loading: createContactLoading }] = useCreateContactMutation({
    onError({ message }) {
      Alert.error(message);
    },

    onCompleted(data) {
      const { createContact: { response } } = data;

      if (response) {
        const { status, message } = response;

        if (status && message && status === 200) {
          Alert.success(message)
          reset();
          handleClose();
          reload();
        }
      }
    }
  })

  const onSubmit: SubmitHandler<extendedContactInput> = async ({
    name, facilityId, serviceCode, email, phone, fax,
    zipCode, address, address2, city, state, country
  }) => {

    const { id: selectedFacility } = facilityId;
    const { id: selectedServiceCode } = serviceCode || {};

    if (isEdit) {
      await updateContact({
        variables: {
          updateContactInput: {
            id: locationId || '', name: name || '', email: email || '', phone: phone || '', fax: fax || '',
            zipCode: zipCode || '', address: address || '', address2: address2 || '', city: city || '',
            state: state || '', country: country || '', primaryContact: false, facilityId: selectedFacility || '',
            serviceCode: selectedServiceCode as ServiceCodes || ServiceCode.Ambulance_24
          }
        }
      })
    } else {
      await createContact({
        variables: {
          createContactInput: {
            name: name || '', email: email || '', phone: phone || '', fax: fax || '', zipCode: zipCode || '',
            address: address || '', address2: address2 || '', city: city || '', state: state || '',
            country: country || '', primaryContact: false, facilityId: selectedFacility || '',
            serviceCode: selectedServiceCode as ServiceCodes || ServiceCode.Ambulance_24
          }
        }
      })
    }
  }
  const fetchContact = useCallback(() => {
    getContact({
      variables: {
        getContact: { id: locationId || '' }
      }
    })
  }, [getContact, locationId])

  useEffect(() => {
    if (isEdit && locationId) {
      fetchContact();
    }
  }, [fetchContact, isEdit, locationId])

  const { email: { message: emailError } = {},
    fax: { message: faxError } = {},
    city: { message: cityError } = {},
    name: { message: nameError } = {},
    phone: { message: phoneError } = {},
    state: { message: stateError } = {},
    country: { message: countryError } = {},
    zipCode: { message: zipCodeError } = {},
    address: { message: addressError } = {},
    address2: { message: address2Error } = {},
    facilityId: { message: facilityError } = {},
    serviceCode: { message: serviceCodeError } = {},
  } = errors;

  const disableSubmit = createContactLoading || updateContactLoading || getContactLoading

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog"
      aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="alert-dialog">
            {isEdit ? EDIT_LOCATION : ADD_LOCATION}
          </DialogTitle>

          <Box display="flex">
            <CardContent>
              <Box minHeight="calc(100vh - 300px)">
                <Grid container spacing={1}>
                  <Grid item md={6}>
                    <CardComponent cardTitle={LOCATION_INFO}>
                      <LocationController
                        fieldType="text"
                        controllerName="name"
                        error={nameError}
                        controllerLabel={NAME}
                      />

                      <Selector
                        value={{ id: "", name: "" }}
                        label={ASSOCIATED_FACILITY}
                        name="facilityId"
                        error={facilityError}
                        options={renderFacilities(facilityList)}
                      />

                      <Selector
                        value={{ id: "", name: "" }}
                        label={POS}
                        name="serviceCode"
                        error={serviceCodeError}
                        options={MAPPED_SERVICE_CODES}
                      />
                    </CardComponent>
                  </Grid>

                  <Grid md={6} item>
                    <CardComponent cardTitle={CONTACT}>
                      <LocationController
                        fieldType="email"
                        controllerName="email"
                        error={emailError}
                        controllerLabel={EMAIL}
                      />

                      <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                          <LocationController
                            fieldType="text"
                            controllerName="phone"
                            error={phoneError}
                            controllerLabel={PHONE}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <LocationController
                            fieldType="text"
                            controllerName="fax"
                            error={faxError}
                            controllerLabel={FAX}
                          />
                        </Grid>
                      </Grid>

                      <LocationController
                        fieldType="text"
                        controllerName="zipCode"
                        error={zipCodeError}
                        controllerLabel={ZIP_CODE}
                      />

                      <LocationController
                        fieldType="text"
                        controllerName="address"
                        error={addressError}
                        controllerLabel={ADDRESS}
                      />

                      <LocationController
                        fieldType="text"
                        controllerName="address2"
                        error={address2Error}
                        controllerLabel={ADDRESS_2}
                      />

                      <Grid container spacing={3}>
                        <Grid item md={4}>
                          <LocationController
                            fieldType="text"
                            controllerName="city"
                            controllerLabel={CITY}
                            error={cityError}
                          />

                        </Grid>

                        <Grid item md={4}>
                          <LocationController
                            fieldType="text"
                            controllerName="state"
                            controllerLabel={STATE}
                            error={stateError}
                          />
                        </Grid>

                        <Grid item md={4}>
                          <LocationController
                            fieldType="text"
                            controllerName="country"
                            controllerLabel={COUNTRY}
                            error={countryError}
                          />
                        </Grid>
                      </Grid>
                    </CardComponent>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Box>

          <DialogActions>
            <Box pr={1}>
              <Button onClick={handleClose} color="default">
                {CANCEL}
              </Button>
            </Box>

            <Button color="primary" type="submit" disabled={disableSubmit} variant="contained">
              {disableSubmit && <CircularProgress size={20} color="inherit" />}
              {isEdit ? UPDATE_LOCATION_TEXT : CREATE_LOCATION}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default LocationModal;
