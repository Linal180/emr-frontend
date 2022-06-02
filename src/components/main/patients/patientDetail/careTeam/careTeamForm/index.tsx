// packages block
import { FC, useEffect, useState } from 'react';
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
import { renderItem, setRecord } from '../../../../../../utils';
import { GREY_SIXTEEN } from '../../../../../../theme';
import { CloseIcon } from '../../../../../../assets/svgs';
import InputController from '../../../../../../controller'
import { updatePatientProviderRelationSchema, updatePatientProviderSchema } from '../../../../../../validationSchemas';
import { CareTeamsProps, UpdatePatientProviderInputsProps } from '../../../../../../interfacesTypes';
import { DoctorPatientRelationType, useGetDoctorLazyQuery, useGetPatientProviderLazyQuery, useUpdatePatientProviderMutation, useUpdatePatientProviderRelationMutation } from '../../../../../../generated/graphql';
import {
  EMAIL, EMPTY_OPTION, FIRST_NAME, LAST_NAME, USUAL_PROVIDER_ID, SAVE_TEXT, SPECIALTY,
  DOCTORS_ROUTE, NOT_FOUND_EXCEPTION, PHONE, MAPPED_SPECIALTIES, PATIENT_PROVIDER_UPDATED, ADD_PROVIDER_TEXT, MAPPED_DOCTOR_PATIENT_RELATION,
} from '../../../../../../constants';
import RadioController from '../../../../../../controller/RadioController';

const CareTeamForm: FC<CareTeamsProps> = ({ toggleSideDrawer, patientId, reload, doctorId, doctorPatientId, isEdit, doctorName }): JSX.Element => {
  const [isOtherRelation, setIsOtherRelation] = useState<boolean>(false);
  const methods = useForm<UpdatePatientProviderInputsProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? updatePatientProviderRelationSchema(isOtherRelation) : updatePatientProviderSchema(isOtherRelation))
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = methods
  const { providerId: { id: selectedProviderId } = {}, relation } = watch()

  const [getPatientProvider] = useGetPatientProviderLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(DOCTORS_ROUTE)
    },

    onCompleted(data) {
      const { getPatientProvider } = data || {};

      if (getPatientProvider) {
        const { response, provider } = getPatientProvider

        if (response) {
          const { status } = response

          if (provider && status && status === 200) {
            const { otherRelation, relation, doctor } = provider
            const { lastName, firstName, speciality, contacts } = doctor || {}

            lastName && setValue('lastName', lastName)
            firstName && setValue('firstName', firstName)
            otherRelation && setValue('otherRelation', otherRelation)
            relation && setValue('relation', relation)
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

  const [updatePatientProviderRelation] = useUpdatePatientProviderRelationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientProviderRelation: { response } } = data

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
    const { otherRelation, relation } = inputs;

    if (isEdit) {
      await updatePatientProviderRelation({
        variables: {
          updatePatientProviderRelationInputs: {
            id: doctorPatientId as string,
            otherRelation,
            relation: relation as DoctorPatientRelationType,
          }
        }
      })
    } else {

      await updatePatientProvider({
        variables: {
          updatePatientProvider: {
            patientId: patientId as string,
            providerId: doctorId as string,
            otherRelation,
            relation: relation as DoctorPatientRelationType,
          }
        }
      })
    }  
  }

  const closeSlider = () => toggleSideDrawer && toggleSideDrawer()

  useEffect(() => {
    selectedProviderId && getDoctor({ variables: { getDoctor: { id: selectedProviderId } } })
  }, [getDoctor, selectedProviderId])

  useEffect(() => {
    if (isEdit)
      getPatientProvider({ variables: { patientProviderInputs: { patientId: patientId as string, providerId: doctorId as string } } })
  }, [getPatientProvider, isEdit, doctorId, patientId])

  useEffect(() => {
    if (relation === DoctorPatientRelationType.OtherProvider) {
      setIsOtherRelation(true)
    }
  }, [relation, watch])

  return (
    <Box maxWidth={500}>
      <FormProvider {...methods}>
        {JSON.stringify(errors)}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex" justifyContent="space-between"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} px={2} pt={2} pb={1}
          >
            <Typography variant='h3'>{ADD_PROVIDER_TEXT}</Typography>
            <IconButton onClick={closeSlider}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={2} p={3}>
            {isEdit ? renderItem(USUAL_PROVIDER_ID, doctorName) :
              <DoctorSelector
                isRequired
                shouldOmitFacilityId
                name="providerId"
                label={USUAL_PROVIDER_ID}
              />
            }

            <Box p={3} />

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="firstName"
                  controllerLabel={FIRST_NAME}
                  placeholder="Chadwick"
                  disabled
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="lastName"
                  controllerLabel={LAST_NAME}
                  placeholder="Lewis"
                  disabled
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <PhoneField name="phone" label={PHONE} disabled />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="email"
                  controllerName="email"
                  controllerLabel={EMAIL}
                  placeholder={EMAIL}
                  disabled
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="speciality"
                  label={SPECIALTY}
                  value={EMPTY_OPTION}
                  options={MAPPED_SPECIALTIES}
                  disabled
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <RadioController
                  name='relation'
                  options={MAPPED_DOCTOR_PATIENT_RELATION}
                  label={'Relationship to Patient'} />

              </Grid>

              {relation === DoctorPatientRelationType.OtherProvider &&
                <InputController
                  fieldType="text"
                  controllerName="otherRelation"
                  placeholder="Enter Relation"
                  margin={'none'}
                />}
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
