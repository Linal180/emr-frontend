// packages block
import { useParams } from 'react-router';
import { FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Grid, IconButton, Typography } from '@material-ui/core';

// components block
import moment from 'moment';
import Selector from '../../../common/Selector';
import TestsSelector from '../../../common/Selector/TestSelector';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import AppointmentSelector from '../../../common/Selector/AppointmentSelector';
// interfaces, graphql, constants block
import { BLUE, GREY_THREE } from '../../../../theme';
import { CrossIcon } from '../../../../assets/svgs';
import { renderItem, setRecord } from '../../../../utils';
import { ContactType, DoctorPatientRelationType, useGetPatientLazyQuery } from '../../../../generated/graphql';
import {
  LabOrderInitialScreenProps, LabOrdersCreateFormInput, ParamsType, SelectorOption
} from "../../../../interfacesTypes";
import {
  APPOINTMENT_TEXT, EMPTY_OPTION, GUARANTOR, LAB_TEST_STATUSES, N_A, PRIMARY_PROVIDER, REFERRING_PROVIDER,
  STATUS, TEST, TESTS_FIELD_VALIDATION_MESSAGE
} from '../../../../constants';
import Loader from '../../../common/Loader';

const LabOrderComponent: FC<LabOrderInitialScreenProps> = ({ appointmentInfo, setTestsToRemove, handleStep, setCurrentTest }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const [guarantorName, setGuarantorName] = useState<string>('')
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
        const { contacts, doctorPatients } = patient ?? {}

        const { doctor: primaryDoctor } = doctorPatients?.find((doctorPatient) => {
          return doctorPatient?.relation === DoctorPatientRelationType.PrimaryProvider
        }) || {}
        const { doctor: referringDoctor } = doctorPatients?.find((doctorPatient) => {
          return doctorPatient?.relation === DoctorPatientRelationType.ReferringProvider
        }) || {}

        const guarantorInfo = contacts?.find((contact) => contact.contactType === ContactType.Guarandor)
        const { firstName, lastName } = guarantorInfo ?? {}
        const guarantorName = firstName ? `${firstName} ${lastName}` : ''
        setGuarantorName(guarantorName)
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
          <Selector
            addEmpty
            isRequired
            name="labTestStatus"
            label={STATUS}
            value={EMPTY_OPTION}
            options={LAB_TEST_STATUSES}
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Typography variant='h6'>{GUARANTOR}</Typography>

          <Box py={0.6} mb={2} color={GREY_THREE}>
            <Typography variant='body1'>{guarantorName || N_A}</Typography>
          </Box>
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
          <DoctorSelector
            isRequired
            label={REFERRING_PROVIDER}
            name="referringProviderId"
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
        <Typography className='danger' variant="caption">{TESTS_FIELD_VALIDATION_MESSAGE}</Typography> :
        testFieldValuesFields.map(({ test }, index) => {
          const { id, name } = test
          return (
            <Box minWidth="100%" display="flex" alignItems="center" justifyContent="space-between">
              <Button
                variant="text"
                color="secondary"
                onClick={() => {
                  setCurrentTest && setCurrentTest(index);
                  handleStep && handleStep(1)
                }}
              >
                <Box color={BLUE} textAlign="start">
                  <Typography variant="body2" color="inherit">{name}</Typography>
                </Box>
              </Button>


              <IconButton onClick={() => handleLabTestRemove(id)} >
                <CrossIcon />
              </IconButton>
            </Box>
          )
        })}
    </Box>
  )
}

export default LabOrderComponent;

