// packages block
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
// components block
import moment from 'moment';
import Loader from '../../../common/Loader';
import AppointmentSelector from '../../../common/Selector/AppointmentSelector';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import TestsSelector from '../../../common/Selector/TestSelector';
// interfaces, graphql, constants block
import { CrossIcon } from '../../../../assets/svgs';
import {
  APPOINTMENT_TEXT, NOTES, PRIMARY_PROVIDER, TEST, TESTS_FIELD_VALIDATION_MESSAGE
} from '../../../../constants';
import InputController from '../../../../controller';
import { DoctorPatientRelationType, useGetPatientLazyQuery } from '../../../../generated/graphql';
import {
  LabOrderInitialScreenProps, LabOrdersCreateFormInput, ParamsType, SelectorOption
} from "../../../../interfacesTypes";
import { BLUE } from '../../../../theme';
import { renderItem, setRecord } from '../../../../utils';

const LabOrderComponent: FC<LabOrderInitialScreenProps> = ({ appointmentInfo, setTestsToRemove, handleStep, setCurrentTest }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const [isLoading, setIsLoading] = useState(true)

  const methods = useFormContext<LabOrdersCreateFormInput>();
  const { setValue, control, watch } = methods
  const { testFieldValues } = watch()

  const {
    fields: testFieldValuesFields, append: appendTestFieldValuesFields, remove: removeTestFieldValuesFields
  } = useFieldArray({ control: control, name: 'testFieldValues' });

  const handleLabTests = (data: SelectorOption) => {
    const valueAlreadyExist = testFieldValuesFields.find((testDataValues) => testDataValues.testId === data.id)
    if (valueAlreadyExist) {
      return
    }

    setValue('testField', { id: '', name: '' })

    appendTestFieldValuesFields({
      testId: '',
      test: data,
      testDate: moment().toString(),
      testTime: moment().format('HH:mm:ss'),
      diagnosesIds: [],
      specimenTypeField: [],
      testNotes: '',
      newTest: true
    })

    testFieldValues && setValue('testFieldValues', [...testFieldValues, {
      testId: '',
      test: data,
      testDate: moment().toString(),
      testTime: moment().format('HH:mm:ss'),
      diagnosesIds: [],
      specimenTypeField: [],
      testNotes: '',
      newTest: true
    }])
  }

  const [getPatient] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      getPatient: {
        id: patientId
      }
    },

    onError() {
      setIsLoading(false)
    },

    onCompleted(data) {
      if (data) {
        const { getPatient } = data ?? {}
        const { patient } = getPatient ?? {}
        const { doctorPatients } = patient ?? {}

        const { doctor: primaryDoctor } = doctorPatients?.find((doctorPatient) => {
          return doctorPatient?.relation === DoctorPatientRelationType.PrimaryProvider
        }) || {}
        const { doctor: referringDoctor } = doctorPatients?.find((doctorPatient) => {
          return doctorPatient?.relation === DoctorPatientRelationType.ReferringProvider
        }) || {}

        primaryDoctor && setValue('primaryProviderId', setRecord(primaryDoctor.id, `${primaryDoctor.firstName} ${primaryDoctor.lastName}`))
        referringDoctor && setValue('referringProviderId', setRecord(referringDoctor.id, `${referringDoctor.firstName} ${referringDoctor.lastName}`))

        setIsLoading(false)
      }
    }
  });

  useEffect(() => {
    getPatient()
  }, [getPatient])

  const handleLabTestRemove = (id: string) => {
    const testFieldValue = testFieldValuesFields.find(value => value.test.id === id)
    const testIndex = testFieldValuesFields.findIndex(value => value.test.id === id)
    removeTestFieldValuesFields(testIndex)
    setValue('testFieldValues', testFieldValuesFields.filter((_, index) => testIndex !== index))
    setTestsToRemove && setTestsToRemove((prevValue: string[]) => [...prevValue, testFieldValue?.testId || ''])
  }

  if (isLoading) {
    return <Loader loaderText='Loading...' loading />
  }

  return (
    <Box px={3} py={2}>
      <Grid container spacing={1}>
        <Grid item md={12} sm={12} xs={12}>
          {
            appointmentInfo ? renderItem(APPOINTMENT_TEXT, appointmentInfo.name) :
              <AppointmentSelector
                label={APPOINTMENT_TEXT}
                name="appointment"
                addEmpty
                patientId={patientId}
              />
          }
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <DoctorSelector
            isRequired
            label={PRIMARY_PROVIDER}
            name="primaryProviderId"
            shouldOmitFacilityId
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <TestsSelector
            placeHolder='Add Test'
            label={TEST}
            name='testField'
            onSelect={(data: SelectorOption) => handleLabTests(data)}
            filteredOptions={(testFieldValuesFields)?.map((testFieldValuesField) => {
              return testFieldValuesField.test
            })}
            addEmpty
          />
        </Grid>
      </Grid>

      {!testFieldValuesFields.length ?
        <Box mb={2}>
          <Typography className='danger' variant="caption">{TESTS_FIELD_VALIDATION_MESSAGE}</Typography>
        </Box> :
        <Box mb={4}>
          {testFieldValuesFields.map(({ test }, index) => {
            const { id, name } = test
            return (
              <Box minWidth="100%" display="flex" alignItems="center" justifyContent="space-between">
                  <Box color={BLUE} textAlign="start">
                    <Typography variant="body2" color="inherit">{name}</Typography>
                  </Box>

                <IconButton size='small' onClick={() => handleLabTestRemove(id)} >
                  <CrossIcon />
                </IconButton>
              </Box>
            )
          })}
        </Box>
      }

      <Grid item md={12} sm={12} xs={12}>
        <InputController
          fieldType="text"
          controllerName="providerNotes"
          controllerLabel={NOTES}
          multiline
        />
      </Grid>
    </Box>
  )
}

export default LabOrderComponent;

