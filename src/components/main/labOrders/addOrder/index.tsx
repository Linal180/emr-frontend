// packages block
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Typography } from '@material-ui/core';
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//components block
import Alert from '../../../common/Alert';
import LabOrderComponent from './LabOrder';
import Loader from '../../../common/Loader';
// utils, constants, interfaces block
import { GREY_SIXTEEN } from '../../../../theme';
import { createLabOrdersSchema } from '../../../../validationSchemas';
import { convertDateFromUnix, generateString, getFormatDateString, setRecord } from '../../../../utils';
import { LabOrderCreateProps, LabOrdersCreateFormInput, ParamsType } from '../../../../interfacesTypes';
import {
  CREATE, EDIT_LAB_ORDER, LAB_ORDER_CREATE_SUCCESS, NEW_LAB_ORDER, NOT_FOUND_EXCEPTION, UPDATE,
  USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';
import { LabTestStatus, useCreateLabTestMutation, useRemoveLabTestMutation, useUpdateLabTestMutation } from '../../../../generated/graphql';

export const AddLabOrdersComponent: FC<LabOrderCreateProps> = ({ appointmentInfo, toggleSideDrawer, isEdit, labTestsToEdit, orderNumber, fetchData }): JSX.Element => {

  const [testsToRemove, setTestsToRemove] = useState<string[]>([])
  const [accessionNumber, setAccessionNumber] = useState('')
  const [isLoading, setIsLoading] = useState(isEdit)

  const { id: patientId } = useParams<ParamsType>()

  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    resolver: yupResolver(createLabOrdersSchema())
  });
  const { watch, handleSubmit, setValue } = methods
  const { testFieldValues } = watch()

  const [createLabTest, { loading: createLabTestLoading }] = useCreateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        !isEdit && Alert.success(LAB_ORDER_CREATE_SUCCESS);
        fetchData && fetchData()
        toggleSideDrawer && toggleSideDrawer()
      }
    }
  });

  const [removeLabTest] = useRemoveLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },
  });

  const [updateLabTest, { loading: updateLoading }] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },

    onCompleted() {
      Alert.success('Lab Order Updated Successfully');
      fetchData && fetchData()
      toggleSideDrawer && toggleSideDrawer()
    }
  });

  const valueSetter = useCallback(() => {
    const { appointment, labTestStatus, primaryProvider, referringProvider, accessionNumber, providerNotes } = labTestsToEdit?.[0] || {}
    accessionNumber && setAccessionNumber(accessionNumber)
    appointment?.id && setValue('appointment', {
      id: appointment?.id,
      name: `${appointment?.appointmentType?.name.trim() ?? ''} ${convertDateFromUnix(appointment?.scheduleStartDateTime, 'MM-DD-YYYY hh:mm A')}`
    })
    labTestStatus && setValue('labTestStatus', setRecord(labTestStatus, labTestStatus))
    primaryProvider?.id && setValue('primaryProviderId', setRecord(primaryProvider?.id, `${primaryProvider?.firstName} ${primaryProvider?.lastName}`))
    referringProvider?.id && setValue('referringProviderId', setRecord(referringProvider?.id, `${referringProvider?.firstName} ${referringProvider?.lastName}`))
    providerNotes && setValue('providerNotes', providerNotes)

    labTestsToEdit?.forEach((labTest, index) => {
      const { test, testDate, testNotes, testSpecimens, testTime, diagnoses, id } = labTest || {}
      const diagnosesIds = diagnoses?.map((value) => {
        return {
          label: `${value?.code} | ${value?.description}`,
          value: value?.id || ''
        }
      }) ?? []

      testDate && setValue(`testFieldValues.${index}.testDate`, testDate)
      testTime && setValue(`testFieldValues.${index}.testTime`, testTime)
      testNotes && setValue(`testFieldValues.${index}.testNotes`, testNotes)
      testNotes && setValue(`testFieldValues.${index}.testNotes`, testNotes)
      diagnosesIds && setValue(`testFieldValues.${index}.diagnosesIds`, diagnosesIds)
      test?.id && setValue(`testFieldValues.${index}.test`, setRecord(test.id, test.loincNum ? `${test.loincNum} | ${test.component}` : `${test.component}`))
      id && setValue(`testFieldValues.${index}.testId`, id)

      testSpecimens?.forEach((testSpecimen, subIndex) => {
        const { collectionDate, collectionTime, specimenNotes, specimenTypes } = testSpecimen || {}
        collectionDate && setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionDate`, collectionDate)
        collectionTime && setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.collectionTime`, collectionTime)
        specimenNotes && setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenNotes`, specimenNotes)
        specimenTypes?.id && setValue(`testFieldValues.${index}.specimenTypeField.${subIndex}.specimenType`, setRecord(specimenTypes?.id, specimenTypes?.name || ''))
      })
    })
    setIsLoading(false)
  }, [labTestsToEdit, setValue])

  useEffect(() => {
    isEdit && valueSetter()
  }, [isEdit, valueSetter])

  const handleTestCreation = (values: LabOrdersCreateFormInput) => {
    const { appointment, testFieldValues, orderNum, accessionNumber, primaryProviderId, referringProviderId, providerNotes } = values

    let appointmentId = ''
    if (appointmentInfo) {
      appointmentId = appointmentInfo.id
    } else {
      appointmentId = appointment?.id ?? ''
    }

    testFieldValues.forEach(async (testFieldValue) => {
      const { test, testDate, testNotes, testTime, specimenTypeField, diagnosesIds } = testFieldValue

      const createLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: LabTestStatus.OrderEntered, testNotes, testTime,
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
        providerNotes,
        orderNumber: orderNum, accessionNumber: accessionNumber,
        ...(primaryProviderId?.id && { primaryProviderId: primaryProviderId?.id }),
        ...(referringProviderId?.id && { referringProviderId: referringProviderId?.id }),
      }

      const diagnoses = diagnosesIds.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
      let createSpecimenItemInput

      if (specimenTypeField?.length) {
        createSpecimenItemInput = specimenTypeField.reduce((acc, specimenTypeFieldValues) => {
          const { collectionDate, collectionTime, specimenNotes, specimenType } = specimenTypeFieldValues
          const { id: testSpecimen } = specimenType

          acc.push({
            testSpecimen,
            specimenNotes,
            collectionDate: getFormatDateString(collectionDate, 'MM-DD-YYYY'),
            collectionTime
          })

          return acc
        }, [] as {
          testSpecimen: string,
          specimenNotes: string,
          collectionDate: string,
          collectionTime: string
        }[])
      }

      await createLabTest({
        variables: {
          createLabTestInput: {
            createLabTestItemInput,
            ...(createSpecimenItemInput && { createSpecimenItemInput }),
            ...(diagnoses && { diagnoses }),
            test: test.id
          }
        },
      });
    })
  }

  const onSubmit: SubmitHandler<LabOrdersCreateFormInput> = async (values) => {
    if (testsToRemove.length) {
      testsToRemove.forEach(async (testToRemove) => {
        testToRemove && await removeLabTest({
          variables: {
            removeLabTest: {
              id: testToRemove
            }
          }
        })
      })
    }

    let orderNum = ''
    let accessionNum = ''

    if (isEdit) {
      orderNum = orderNumber || ''
      accessionNum = accessionNumber
    } else {
      orderNum = generateString()
      accessionNum = generateString(6)
    }

    const { appointment, labTestStatus, testFieldValues, primaryProviderId, referringProviderId, providerNotes } = values

    const newTests = testFieldValues.filter((testFieldValue) => !!testFieldValue?.newTest)
    const oldTests = testFieldValues.filter((testFieldValue) => !testFieldValue?.newTest)

    if (newTests.length) {
      handleTestCreation({ ...values, testFieldValues: newTests, orderNum, accessionNumber: accessionNum })
    }

    let appointmentId: string | undefined = ''
    if (appointmentInfo) {
      appointmentId = appointmentInfo.id
    } else {
      appointmentId = appointment?.id
    }

    const { id: testStatus } = labTestStatus ?? {}

    oldTests.forEach(async (testFieldValue) => {
      const { test, testDate, testNotes, testTime, specimenTypeField, diagnosesIds, testId } = testFieldValue

      const updateLabTestItemInput = {
        patientId: patientId ?? '',
        appointmentId: appointmentId === "" ? null : appointmentId,
        status: testStatus as LabTestStatus,
        testNotes,
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
        testTime,
        providerNotes,
        orderNumber: orderNum,
        id: testId ?? '',
        accessionNumber: accessionNum,
        ...(primaryProviderId?.id && { primaryProviderId: primaryProviderId?.id }),
        ...(referringProviderId?.id && { referringProviderId: referringProviderId?.id }),
      }

      const diagnoses = diagnosesIds.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
      let updateSpecimenItemInput

      if (specimenTypeField?.length) {
        updateSpecimenItemInput = specimenTypeField.reduce((acc, specimenTypeFieldValues) => {
          const { collectionDate, collectionTime, specimenNotes, specimenType, id: specimenId } = specimenTypeFieldValues
          const { id: testSpecimen } = specimenType
          acc.push({
            id: specimenId || '',
            testSpecimen,
            specimenNotes,
            collectionDate: getFormatDateString(collectionDate, 'MM-DD-YYYY'),
            collectionTime
          })

          return acc
        }, [] as {
          id: string,
          testSpecimen: string,
          specimenNotes: string,
          collectionDate: string,
          collectionTime: string
        }[])
      }

      await updateLabTest({
        variables: {
          updateLabTestInput: {
            updateLabTestItemInput,
            ...(updateSpecimenItemInput && { updateSpecimenItemInput }),
            ...(diagnoses && { diagnoses }),
            test: test.id
          }
        },
      });
    })
  }

  if (createLabTestLoading) {
    return <Loader loading loaderText='Creating Lab Order' />
  }

  if (updateLoading) {
    return <Loader loading loaderText='Updating Lab Order' />
  }

  if (isLoading) {
    return <Loader loading loaderText='Fetching Lab Order Details' />
  }

  return (
    <Box minWidth={480}>
      <FormProvider {...methods}>
        <form>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{isEdit ? EDIT_LAB_ORDER : NEW_LAB_ORDER}</Typography>

          </Box>

          <Box p={1} />

          <Box maxHeight="calc(100vh - 170px)" className="overflowY-auto">

            <LabOrderComponent
              setTestsToRemove={setTestsToRemove}
              appointmentInfo={appointmentInfo}
            />
          </Box>

          <Box display="flex" justifyContent="center" py={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!testFieldValues?.length}
              onClick={() => handleSubmit(onSubmit)()}
            >
              {isEdit ? UPDATE : CREATE}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box >
  )
}