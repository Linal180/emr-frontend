// packages block
import { FC, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography, Grid, } from '@material-ui/core';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
//components block
import Alert from '../../../../../common/Alert';
import Selector from '../../../../../common/Selector';
import PhoneField from '../../../../../common/PhoneInput';
import InputController from '../../../../../../controller';
import ConfirmModal from '../../../../../common/ConfirmModal';
import RadioController from '../../../../../../controller/RadioController';
import DoctorSelector from '../../../../../common/Selector/DoctorSelector';
// constants, history, styling block
import history from '../../../../../../history';
import { GREY_SIXTEEN } from '../../../../../../theme';
import { renderItem, setRecord } from '../../../../../../utils';
import { CareTeamsProps, UpdatePatientProviderInputsProps } from '../../../../../../interfacesTypes';
import {
  updatePatientProviderRelationSchema, updatePatientProviderSchema
} from '../../../../../../validationSchemas';
import {
  DoctorPatient, DoctorPatientRelationType, useGetDoctorLazyQuery, useGetPatientProviderLazyQuery,
  useUpdatePatientProviderMutation, useUpdatePatientProviderRelationMutation
} from '../../../../../../generated/graphql';
import {
  EMAIL, EMPTY_OPTION, FIRST_NAME, LAST_NAME, SAVE_TEXT, SPECIALTY, CANCEL, PROVIDER,
  DOCTORS_ROUTE, NOT_FOUND_EXCEPTION, PHONE, MAPPED_SPECIALTIES, PATIENT_PROVIDER_UPDATED,
  ADD_PROVIDER_TEXT, MAPPED_DOCTOR_PATIENT_RELATION, YES, PRIMARY_PROVIDER_DESCRIPTION,
  UPDATE_PRIMARY_PROVIDER, EDIT_PROVIDER,
} from '../../../../../../constants';

const CareTeamForm: FC<CareTeamsProps> = ({
  toggleSideDrawer, patientId, reload, doctorId, doctorPatientId, isEdit, doctorName, patientProvidersData
}): JSX.Element => {
  const [isOtherRelation, setIsOtherRelation] = useState<boolean>(false);
  const [openSave, setOpenSave] = useState<boolean>(false);
  const [relationInput, setRelationInput] =
    useState<DoctorPatientRelationType>(DoctorPatientRelationType.OtherProvider);

  const [otherRelationInput, setOtherRelationInput] = useState<string>('');
  const newPrimaryProvidersData = patientProvidersData?.find(item =>
    item.relation === DoctorPatientRelationType.PrimaryProvider)

  const methods = useForm<UpdatePatientProviderInputsProps>({
    mode: "all",
    defaultValues: { relation: DoctorPatientRelationType.OtherProvider },
    resolver: yupResolver(isEdit
      ? updatePatientProviderRelationSchema(isOtherRelation) : updatePatientProviderSchema(isOtherRelation)
    )
  });

  const { handleSubmit, setValue, watch } = methods
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
    setRelationInput(relation as DoctorPatientRelationType)
    setOtherRelationInput(otherRelation as string)

    if (isEdit) {
      const editPrimaryProvidersData = patientProvidersData?.find(({ id, relation }) =>
        relation === DoctorPatientRelationType.PrimaryProvider && doctorPatientId !== id)

      const { id } = editPrimaryProvidersData || {}
      if (id && relation === DoctorPatientRelationType.PrimaryProvider) {
        setOpenSave(true)
      } else {
        await updatePatientProviderRelation({
          variables: {
            updatePatientProviderRelationInputs: {
              id: doctorPatientId as string,
              otherRelation,
              relation: relation as DoctorPatientRelationType,
            }
          }
        })
      }
    } else {
      const { id } = newPrimaryProvidersData || {}

      if (relation === DoctorPatientRelationType.PrimaryProvider && id) {
        setOpenSave(true)
      } else {
        await updatePatientProvider({
          variables: {
            updatePatientProvider: {
              patientId: patientId as string,
              providerId: selectedProviderId as string,
              otherRelation: otherRelation,
              relation: relation as DoctorPatientRelationType,
            }
          }
        })
      }
    }
  }

  const submitHandlerData = async () => {
    if (isEdit) {
      await updatePatientProviderRelation({
        variables: {
          updatePatientProviderRelationInputs: {
            id: doctorPatientId as string,
            otherRelation: otherRelationInput,
            relation: relationInput as DoctorPatientRelationType,
          }
        }
      })
    } else {
      await updatePatientProvider({
        variables: {
          updatePatientProvider: {
            patientId: patientId as string,
            providerId: selectedProviderId as string,
            otherRelation: otherRelationInput,
            relation: relationInput as DoctorPatientRelationType,
          }
        }
      })
    }
  }

  const closeSlider = () => toggleSideDrawer && toggleSideDrawer()

  const handleSave = () => {
    setOpenSave(false)
    submitHandlerData()
  }

  useEffect(() => {
    selectedProviderId && getDoctor({ variables: { getDoctor: { id: selectedProviderId } } })
  }, [getDoctor, selectedProviderId])

  useEffect(() => {
    if (isEdit)
      getPatientProvider({
        variables: { patientProviderInputs: { patientId: patientId as string, providerId: doctorId as string } }
      })
  }, [getPatientProvider, isEdit, doctorId, patientId])

  useEffect(() => {
    setIsOtherRelation(relation === DoctorPatientRelationType.OtherProvider)
  }, [relation, watch])

  return (
    <Box maxWidth={500}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{isEdit ? EDIT_PROVIDER : ADD_PROVIDER_TEXT}</Typography>

            <Box display="flex" alignItems="center">
              <Button onClick={closeSlider} variant="text" color="inherit" className="danger">
                {CANCEL}
              </Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
            </Box>
          </Box>

          <Box mt={2} p={3}>
            {isEdit ? renderItem(PROVIDER, doctorName) :
              <DoctorSelector
                addEmpty
                isRequired
                shouldOmitFacilityId
                name="providerId"
                label={PROVIDER}
                careProviderData={patientProvidersData as DoctorPatient[]}
              />
            }

            <Box p={1} />

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

            <Box p={1} />
          </Box>
        </form>
      </FormProvider>

      <ConfirmModal
        title={UPDATE_PRIMARY_PROVIDER}
        isOpen={openSave}
        description={PRIMARY_PROVIDER_DESCRIPTION}
        handleSave={handleSave}
        actionText={YES}
        setOpen={(open: boolean) => setOpenSave(open)} />
    </Box>
  )
}

export default CareTeamForm;
