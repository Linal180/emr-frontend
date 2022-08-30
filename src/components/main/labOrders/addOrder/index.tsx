// packages block
import { Box, Button, Step, StepIconProps, StepLabel, Stepper, Typography } from '@material-ui/core';
import { Check, ChevronRight } from '@material-ui/icons';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import {
  BACK_TEXT, EDIT_LAB_ORDER, LAB_ORDER_SIDEDRAWER_STEPS, NEW_LAB_ORDER, NEXT, NOT_FOUND_EXCEPTION,
  SUBMIT, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';
import { CheckInConnector, useCheckInStepIconStyles } from '../../../../styles/checkInStyles';
import { useLabOrderStyles } from '../../../../styles/labOrderStyles';
import { GREY_SIXTEEN } from '../../../../theme';
import LabOrderComponent from './LabOrder';
import PaymentsComponent from './Payments';
import { LabOrderCreateProps, LabOrdersCreateFormInput, ParamsType } from '../../../../interfacesTypes';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import TestsComponent from './Tests';
import { yupResolver } from '@hookform/resolvers/yup';
import { createLabOrdersSchema } from '../../../../validationSchemas';
import { convertDateFromUnix, generateString, getFormatDateString, setRecord } from '../../../../utils';
import { useParams } from 'react-router';
import { LabTestStatus, useCreateLabTestMutation, useRemoveLabTestMutation, useUpdateLabTestMutation } from '../../../../generated/graphql';
import Alert from '../../../common/Alert';
import Loader from '../../../common/Loader';

const CheckInStepIcon = (props: StepIconProps) => {
  const classes = useCheckInStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

export const AddLabOrdersComponent: FC<LabOrderCreateProps> = ({ appointmentInfo, toggleSideDrawer, isEdit, labTestsToEdit, orderNumber }): JSX.Element => {
  const labOrderClasses = useLabOrderStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [currentTest, setCurrentTest] = useState(0)
  const [testsToRemove, setTestsToRemove] = useState<string[]>([])
  const [accessionNumber, setAccessionNumber] = useState('')
  const [isLoading, setIsLoading] = useState(isEdit)

  const { id: patientId } = useParams<ParamsType>()

  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    resolver: yupResolver(createLabOrdersSchema())
  });
  const { watch, trigger, handleSubmit, setValue } = methods
  const { testFieldValues } = watch()

  const handleStep = async (step: number) => {
    const isValid = await trigger()
    if (isValid) {
      const stepArray = Array(LAB_ORDER_SIDEDRAWER_STEPS.length).fill(null).map((_, i) => i)
      const testFieldValuesArray = Array(testFieldValues.length).fill(null).map((_, i) => i)

      if (activeStep === 1 && currentTest === 0) {
        step > activeStep ? testFieldValuesArray.includes(currentTest + 1) ? setCurrentTest(currentTest + 1) : setActiveStep(step) : setActiveStep(step)
        return
      }

      if (activeStep === 1 && currentTest > 0) {
        step < activeStep ? setCurrentTest(currentTest - 1) : testFieldValuesArray.includes(currentTest + 1) ? setCurrentTest(currentTest + 1) : setActiveStep(step)
        return
      }


      stepArray.includes(step) && setActiveStep(step)
    }

  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <LabOrderComponent
          setTestsToRemove={setTestsToRemove}
          appointmentInfo={appointmentInfo}
          handleStep={handleStep}
          setCurrentTest={setCurrentTest}
        />
      case 1:
        return <TestsComponent currentTest={currentTest} />
      case 2:
        return <PaymentsComponent />
      default:
        return 'Unknown step';
    }
  }

  const [createLabTest, { loading: createLabTestLoading }] = useCreateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        Alert.success('Lab Order Created Successfully');
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
      toggleSideDrawer && toggleSideDrawer()
    }
  });

  useEffect(() => {
    if (isEdit) {
      const { appointment, labTestStatus, primaryProvider, referringProvider, accessionNumber } = labTestsToEdit?.[0] || {}
      accessionNumber && setAccessionNumber(accessionNumber)
      appointment?.id && setValue('appointment', {
        id: appointment?.id,
        name: `${appointment?.appointmentType?.name.trim() ?? ''} ${convertDateFromUnix(appointment?.scheduleStartDateTime, 'MM-DD-YYYY hh:mm A')}`
      })
      labTestStatus && setValue('labTestStatus', setRecord(labTestStatus, labTestStatus))
      primaryProvider?.id && setValue('primaryProviderId', setRecord(primaryProvider?.id, `${primaryProvider?.firstName} ${primaryProvider?.lastName}`))
      referringProvider?.id && setValue('referringProviderId', setRecord(referringProvider?.id, `${referringProvider?.firstName} ${referringProvider?.lastName}`))
      
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
        test?.id && setValue(`testFieldValues.${index}.test`, setRecord(test.id, `${test.loincNum} | ${test.component}`))
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
    }
  }, [isEdit, labTestsToEdit, setValue])

  useEffect(() => {
    return () => {
      toggleSideDrawer && toggleSideDrawer()
    }
  }, [toggleSideDrawer])

  const handleTestCreation = (values: LabOrdersCreateFormInput) => {
    const { appointment, labTestStatus, testFieldValues, orderNum, accessionNumber, primaryProviderId, referringProviderId } = values
    const { id: testStatus } = labTestStatus ?? {}

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
        status: testStatus as LabTestStatus, testNotes, testTime,
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
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

    const { appointment, labTestStatus, testFieldValues, primaryProviderId, referringProviderId } = values

    const newTests = testFieldValues.filter((testFieldValue) => !!testFieldValue?.newTest)
    const oldTests = testFieldValues.filter((testFieldValue) => !testFieldValue?.newTest)

    if (newTests.length) {
      handleTestCreation({ ...values, testFieldValues: newTests, orderNum, accessionNumber: accessionNum })
    }

    let appointmentId = ''
    if (appointmentInfo) {
      appointmentId = appointmentInfo.id
    } else {
      appointmentId = appointment?.id ?? ''
    }

    const { id: testStatus } = labTestStatus ?? {}

    oldTests.forEach(async (testFieldValue) => {
      const { test, testDate, testNotes, testTime, specimenTypeField, diagnosesIds, testId } = testFieldValue

      const updateLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus,
        testNotes,
        testDate: getFormatDateString(testDate, 'MM-DD-YYYY'),
        testTime,
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

  const isFinalStep = LAB_ORDER_SIDEDRAWER_STEPS.length === activeStep + 1 && currentTest + 1 === testFieldValues.length

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
    <Box maxWidth={480}>
      <FormProvider {...methods}>
        <form>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{isEdit ? EDIT_LAB_ORDER : NEW_LAB_ORDER}</Typography>

            <Box display='flex' alignItems='center'>
              {activeStep > 0 && <Button variant="outlined" color="secondary" onClick={() => handleStep(activeStep - 1)}>{BACK_TEXT}</Button>}
              <Box p={1} />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => isFinalStep ? handleSubmit(onSubmit)() : handleStep(activeStep + 1)}
              >
                {isFinalStep ? SUBMIT : NEXT}
              </Button>
            </Box>
          </Box>

          <Box className={labOrderClasses.labOrderBox}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
              {LAB_ORDER_SIDEDRAWER_STEPS.map((label, index) => (
                <Step key={label}>
                  <StepLabel onClick={testFieldValues?.length ? () => { setActiveStep(index); setCurrentTest(0) } : () => { }} StepIconComponent={CheckInStepIcon}>
                    <Box ml={0} display='flex' alignItems='center' className='pointer-cursor'>
                      {label}
                      <Box p={0.5} />
                      {!(LAB_ORDER_SIDEDRAWER_STEPS.length - 1 === index) ? <ChevronRight /> : ''}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box p={1} />

          <Box maxHeight="calc(100vh - 170px)" className="overflowY-auto">
            <Typography>{getStepContent(activeStep)}</Typography>
          </Box>
        </form>
      </FormProvider>
    </Box >
  )
}