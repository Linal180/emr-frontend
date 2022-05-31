// packages block
import { FC, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Typography, Grid, IconButton } from '@material-ui/core';
//components block
import Alert from '../../../../../common/Alert';
import Selector from '../../../../../common/Selector';
import PhoneField from '../../../../../common/PhoneInput';
import DoctorSelector from '../../../../../common/Selector/DoctorSelector';
// constants, history, styling block
import history from '../../../../../../history';
import { setRecord } from '../../../../../../utils';
import { GREY_SIXTEEN } from '../../../../../../theme';
import { CloseIcon } from '../../../../../../assets/svgs';
import InputController from '../../../../../../controller'
import { updatePatientProviderSchema } from '../../../../../../validationSchemas';
import { CareTeamsProps, UpdatePatientProviderInputsProps } from '../../../../../../interfacesTypes';
import { useGetDoctorLazyQuery, useUpdatePatientProviderMutation } from '../../../../../../generated/graphql';
import {
  EMAIL, EMPTY_OPTION, FIRST_NAME, LAST_NAME, USUAL_PROVIDER_ID, SAVE_TEXT, SPECIALTY,
  EDIT_PROVIDER, DOCTORS_ROUTE, NOT_FOUND_EXCEPTION, PHONE, MAPPED_SPECIALTIES, PATIENT_PROVIDER_UPDATED,
} from '../../../../../../constants';

const CareTeamForm: FC<CareTeamsProps> = ({ toggleSideDrawer, patientId, reload }): JSX.Element => {
  const methods = useForm<UpdatePatientProviderInputsProps>({
    mode: "all",
    resolver: yupResolver(updatePatientProviderSchema)
  });

  const { handleSubmit, setValue, watch } = methods
  const { providerId: { id: selectedProviderId } = {} } = watch()

  const [getDoctor] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(DOCTORS_ROUTE)
    },

    onCompleted(data) {
      const { getDoctor } = data || {};

      if (getDoctor) {
        const { response, doctor } = getDoctor

        if (response) {
          const { status } = response

          if (doctor && status && status === 200) {
            const { lastName, firstName, speciality, contacts } = doctor

            lastName && setValue('lastName', lastName)
            firstName && setValue('firstName', firstName)
            speciality && setValue('speciality', setRecord(speciality, speciality))

            if (contacts && contacts.length > 0) {
              const primaryContact = contacts.filter(contact => contact.primaryContact)[0]

              if (primaryContact) {
                const { email, phone, } = primaryContact
                email && setValue('email', email)
                phone && setValue('phone', phone)

              }
            }
          }
        }
      }
    }
  });

  const [updatePatientProvider] = useUpdatePatientProviderMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientProvider: { response } } = data

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(PATIENT_PROVIDER_UPDATED);
          reload && reload()
          toggleSideDrawer && toggleSideDrawer()
        }
      }
    }
  });

  const onSubmit: SubmitHandler<UpdatePatientProviderInputsProps> = async (inputs) => {
    const { providerId } = inputs;
    const { id: selectedProviderId } = providerId;
    if (patientId && selectedProviderId) {

      await updatePatientProvider({
        variables: {
          updatePatientProvider: {
            patientId: patientId,
            providerId: selectedProviderId
          }
        }
      })
    }
  }

  const closeSlider = () => toggleSideDrawer && toggleSideDrawer()


  useEffect(() => {
    if (selectedProviderId)
      getDoctor({ variables: { getDoctor: { id: selectedProviderId } } })
  }, [getDoctor, selectedProviderId])

  return (
    <Box maxWidth={500}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex" justifyContent="space-between"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} px={2} pt={2} pb={1}
          >
            <Typography variant='h3'>{EDIT_PROVIDER}</Typography>
            <IconButton onClick={closeSlider}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={2} p={3}>
            <DoctorSelector
              isRequired
              shouldOmitFacilityId
              name="providerId"
              label={USUAL_PROVIDER_ID}
            />

            <Box p={3} />

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="firstName"
                  controllerLabel={FIRST_NAME}
                  placeholder="Chadwick"
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="lastName"
                  controllerLabel={LAST_NAME}
                  placeholder="Lewis"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <PhoneField name="phone" label={PHONE} />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="email"
                  controllerName="email"
                  controllerLabel={EMAIL}
                  placeholder={EMAIL}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="speciality"
                  label={SPECIALTY}
                  value={EMPTY_OPTION}
                  options={MAPPED_SPECIALTIES}
                />
              </Grid>

              {/* <Grid item md={12} sm={12} xs={12}>
                <Box mb={2}>
                  <FormLabel component="legend">{RELATIONSHIP_TO_PATIENT}</FormLabel>
                </Box>

                <FormControl component="fieldset">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={PREFERRED_PROVIDER_IN_PRACTICE}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={BACKUP_PROVIDER_IN_PRACTICE}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={PRIMARY_PROVIDER}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={REFERRING_PROVIDER}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox color="primary" />
                      }
                      label={OTHER_PROVIDER}
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Box p={1} />

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerLabel={RELATION}
                  controllerName="realtion"
                  placeholder={ENTER_RELATION}
                />
              </Grid> */}
            </Grid>
          </Box>

          <Box py={3} pr={3} display="flex" justifyContent="flex-end" borderTop={`1px solid ${GREY_SIXTEEN}`}>
            <Button type="submit" variant="contained" color="secondary" size='large'>{SAVE_TEXT}</Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}

export default CareTeamForm;
