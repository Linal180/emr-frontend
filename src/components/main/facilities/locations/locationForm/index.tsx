// packages block
import { FC, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from '../../../../common/Alert';
import Selector from '../../../../common/Selector';
import PhoneField from '../../../../common/PhoneInput';
import InputController from '../../../../../controller';
import CardComponent from '../../../../common/CardComponent';
import ViewDataLoader from '../../../../common/ViewDataLoader';
// utils, interfaces and graphql block
import history from "../../../../../history";
import { ListContext } from '../../../../../context';
import { renderFacilities, setRecord } from '../../../../../utils';
import { extendedContactSchema } from '../../../../../validationSchemas';
import { extendedContactInput, GeneralFormProps, ParamsType } from '../../../../../interfacesTypes';
import {
  ServiceCode, ServiceCodes, useCreateContactMutation, useFindContactLazyQuery, useUpdateContactMutation
} from "../../../../../generated/graphql";
import {
  ADDRESS, ADDRESS_2, ASSOCIATED_FACILITY, CITY, CONTACT, COUNTRY, CREATE_LOCATION, ZIP_CODE,
  EMAIL, EMPTY_OPTION, FACILITIES_ROUTE, FACILITY_LOCATIONS_ROUTE, FAX, LOCATION_CREATED, LOCATION_INFO,
  LOCATION_NOT_FOUND, LOCATION_UPDATED, MAPPED_SERVICE_CODES, NAME, PHONE, POS, STATE, UPDATE_LOCATION, MAPPED_STATES,
} from "../../../../../constants";

const LocationForm: FC<GeneralFormProps> = ({ isEdit, id }): JSX.Element => {
  const { facilityId: currentFacility } = useParams<ParamsType>()
  const { facilityList } = useContext(ListContext)
  const methods = useForm<extendedContactInput>({
    mode: "all",
    resolver: yupResolver(extendedContactSchema)
  });
  const { handleSubmit, setValue } = methods;

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
          const { name, email, phone, zipCode, fax, address, address2, city, state,
            serviceCode, country, facilityId } = contact || {}

          facilityId && setCurrentFacility(facilityId)
          fax && setValue('fax', fax)
          name && setValue('name', name)
          city && setValue('city', city)
          email && setValue('email', email)
          phone && setValue('phone', phone)
          zipCode && setValue('zipCode', zipCode)
          address && setValue('address', address)
          country && setValue('country', country)
          address2 && setValue('address2', address2)
          state && setValue('state', setRecord(state, state))
          serviceCode && setValue('serviceCode', setRecord(serviceCode, serviceCode))
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
        const { status } = response;

        if (status && status === 200) {
          Alert.success(LOCATION_CREATED)
          history.push(`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_LOCATIONS_ROUTE}`)
        }
      }
    }
  })

  const [updateContact, { loading: updateContactLoading }] = useUpdateContactMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateContact: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(LOCATION_UPDATED)
          history.push(`${FACILITIES_ROUTE}/${currentFacility}${FACILITY_LOCATIONS_ROUTE}`)
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
      id ?
        getContact({ variables: { getContact: { id } } })
        :
        Alert.error(LOCATION_NOT_FOUND)
    } else
      setCurrentFacility(currentFacility || '');
  }, [currentFacility, getContact, id, isEdit, setCurrentFacility])

  const onSubmit: SubmitHandler<extendedContactInput> = async ({
    name, facilityId, serviceCode, email, phone, fax,
    zipCode, address, address2, city, state, country
  }) => {

    const { id: selectedFacility } = facilityId;
    const { id: selectedState } = state;
    const { id: selectedServiceCode } = serviceCode || {};
    const contactInput = {
      name: name || '', email: email || '', phone: phone || '', fax: fax || '',
      zipCode: zipCode || '', address: address || '', address2: address2 || '', city: city || '',
      state: selectedState || '', country: country || '', primaryContact: false,
      serviceCode: selectedServiceCode as ServiceCodes || ServiceCode.Ambulance_24,
      facilityId: selectedFacility || '',
    };

    if (isEdit) {
      id ?
        await updateContact({
          variables: { updateContactInput: { id, ...contactInput } }
        })
        :
        Alert.error(LOCATION_NOT_FOUND)
    } else {
      await createContact({
        variables: {
          createContactInput: { ...contactInput }
        }
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={LOCATION_INFO}>
                {getContactLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="name"
                      controllerLabel={NAME}
                    />

                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="facilityId"
                          value={EMPTY_OPTION}
                          label={ASSOCIATED_FACILITY}
                          options={renderFacilities(facilityList)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="serviceCode"
                          value={EMPTY_OPTION}
                          label={POS}
                          options={MAPPED_SERVICE_CODES}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={CONTACT}>
                {getContactLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <InputController
                      isRequired
                      fieldType="email"
                      controllerName="email"
                      controllerLabel={EMAIL}
                    />

                    <Grid container spacing={2}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="phone" label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="fax" label={FAX} />
                      </Grid>
                    </Grid>

                    <InputController
                      fieldType="text"
                      controllerName="zipCode"
                      controllerLabel={ZIP_CODE}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="address"
                      controllerLabel={ADDRESS}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="address2"
                      controllerLabel={ADDRESS_2}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="city"
                          controllerLabel={CITY}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          value={EMPTY_OPTION}
                          label={STATE}
                          name="state"
                          options={MAPPED_STATES}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="country"
                          controllerLabel={COUNTRY}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={createContactLoading || updateContactLoading}
          >
            {isEdit ? UPDATE_LOCATION : CREATE_LOCATION}

            {(createContactLoading || updateContactLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default LocationForm;
