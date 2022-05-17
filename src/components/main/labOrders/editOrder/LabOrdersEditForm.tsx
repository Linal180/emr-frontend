// packages block
import { FC, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { Box, Card, colors, Grid, Typography, Button, CircularProgress } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// interfaces, graphql, constants block
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import { GeneralFormProps, LabOrdersCreateFormInput, multiOptionType, ParamsType } from "../../../../interfacesTypes";
import {
  ADD_ANOTHER_TEST, APPOINTMENT_TEXT, DELETE, DIAGNOSES, EDIT_LAB_ORDER,  
  EMPTY_OPTION, LAB_TEST_STATUSES, NOT_FOUND_EXCEPTION, ORDER_DELETION_MESSAGE, REMOVE_TEST, SAVE_TEXT, STATUS, TEST, TEST_DATE, TEST_FIELD_INITIAL_VALUES, TEST_NOTES, TEST_TIME, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';
import AppointmentSelector from '../../../common/Selector/AppointmentSelector';
import DiagnosesSelector from '../../../common/Selector/DiagnosesSelector';
import TestsSelector from '../../../common/Selector/TestSelector';
import DatePicker from '../../../common/DatePicker';
import LabOrdersSpecimenTypeForm from '../addOrder/LabOrdersSpecimenTypeForm';
import { createLabOrdersSchema } from '../../../../validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import TimePicker from '../../../common/TimePicker';
import { LabTestStatus, useCreateLabTestMutation, useFindLabTestsByOrderNumLazyQuery, useRemoveLabTestMutation, useUpdateLabTestMutation } from '../../../../generated/graphql';
import { useParams } from 'react-router';
import history from '../../../../history';
import Alert from '../../../common/Alert';
import { convertDateFromUnix, formatValue, getFormatDateString } from '../../../../utils';

const LabOrdersEditForm: FC<GeneralFormProps> = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>();
  const [testsToRemove,setTestsToRemove] = useState<string[]>([])
  const [diagnosesIds, setDiagnosesIds] = useState<multiOptionType[]>([])
  const [testIds,setTestIds] = useState<string[]>([])

  const methods = useForm<LabOrdersCreateFormInput>({
    mode: "all",
    resolver: yupResolver(createLabOrdersSchema)
  });
  const { control, handleSubmit, setValue } = methods
  
  const [findLabTestsByOrderNum, { loading, error }] = useFindLabTestsByOrderNumLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`/patients/${patientId}/details/10`)
    },

    onCompleted(data) {
      const { findLabTestsByOrderNum } = data || {};

      if (findLabTestsByOrderNum) {
        const { labTests } = findLabTestsByOrderNum
        
        const { labTestStatus, diagnoses, appointment } = labTests?.[0] ?? {}
        const transformedDiagnoses= diagnoses?.map((diagnose)=>{
          return {
             value: diagnose?.id ?? '',
             label: diagnose?.code ?? ''
          }
        }) ?? []
        
        labTestStatus && setValue('labTestStatus', {
          id: labTestStatus,
          name: formatValue(labTestStatus)
        })
        diagnoses && setDiagnosesIds(transformedDiagnoses)
        appointment && setValue('appointment', {
          id: appointment.id,
          name: `${appointment.appointmentType?.name} ${convertDateFromUnix(appointment.scheduleStartDateTime,'MM-DD-YYYY hh:mm:ss')}`
        })

        const transformedLabTests= labTests?.map((labTest)=>{
          const { test, testNotes, testTime, testDate, testSpecimens, id: testId} = labTest ?? {}
          const { id, loincNum, component } = test ?? {}

          const transformedTestSpecimens = testSpecimens?.map((testSpecimen)=>{
            const { collectionDate, collectionTime, specimenTypes, specimenNotes, id: specimenId } = testSpecimen ?? {}
            const {id, name} =specimenTypes ?? {}

            return {
              id: specimenId,
              specimenType: {
                id: id ?? '',
                name
              },
              collectionDate: collectionDate ?? '',
              collectionTime: collectionTime ?? '',
              specimenNotes: specimenNotes ?? '' 
            }
          }) ?? []

          return {
            testId: testId,
            test: {
              id: id ?? '',
              name: `${loincNum} | ${component}`
            },
            testDate: testDate ?? '',
            testTime: testTime ?? '',
            testNotes: testNotes ?? '',
            specimenTypeField: transformedTestSpecimens
          }
        }) ?? []

        setTestIds(transformedLabTests.map((labTest)=>labTest?.testId ?? ''))

        setValue('testField', transformedLabTests)
      }
    }
  });

  const fetchlabTests = useCallback(async () => {
    try {
      await findLabTestsByOrderNum({
        variables: {
         labTestByOrderNumInput: {
          orderNumber: orderNum ?? ''
         }
        }
      });
    } catch (error) { }
  }, [findLabTestsByOrderNum, orderNum])

  useEffect(() => {
    fetchlabTests()
  }, [fetchlabTests])

  const [createLabTest, { loading: createLoading }] = useCreateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },
  });

  const [removeLabTest, { loading: removeLoading }] = useRemoveLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },
  });

  const [updateLabTest, { loading: updateLoading }] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      history.push(`/patients/${patientId}/details/10`)
    }
  });



  const { fields: testFields, remove: removeTestField, append: appendTestField } = useFieldArray({ control: control, name: "testField" });

  const handleTestCreation = (values: LabOrdersCreateFormInput) => {
    const { appointment, labTestStatus, diagnosesIds, testField } = values
    const { id: appointmentId } = appointment ?? {}
    const { id: testStatus } = labTestStatus ?? {}

    testField.forEach(async(testFieldValues) => {
      const { test, testDate, testNotes, testTime, specimenTypeField } = testFieldValues

      const createLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus,
        testNotes,
        testDate: getFormatDateString(testDate,'MM-DD-YYYY'),
        testTime,
        orderNumber: orderNum
      }

      const diagnoses = diagnosesIds.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
      let createSpecimenItemInput

      if (specimenTypeField?.length) {
        createSpecimenItemInput= specimenTypeField.reduce((acc, specimenTypeFieldValues) => {
          const { collectionDate, collectionTime, specimenNotes, specimenType } = specimenTypeFieldValues
          const { id: testSpecimen } = specimenType
          acc.push({
            testSpecimen,
            specimenNotes,
            collectionDate: getFormatDateString(collectionDate,'MM-DD-YYYY'),
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
            ...(createSpecimenItemInput && {createSpecimenItemInput}),
            ...(diagnoses && {diagnoses}),
            test: test.id
          }
        },
      });
    })
  }

  const handleOrderDeletion = () =>{
    testIds.forEach(async(testToRemove)=>{
      await removeLabTest({
        variables:{
          removeLabTest:{
            id: testToRemove
          }
        }
      })
    })

    Alert.success(ORDER_DELETION_MESSAGE)

    history.push(`/patients/${patientId}/details/10`)
  }

  const onSubmit: SubmitHandler<LabOrdersCreateFormInput> = async(values) => { 
    if(testsToRemove.length){
      testsToRemove.forEach(async(testToRemove)=>{
        await removeLabTest({
          variables:{
            removeLabTest:{
              id: testToRemove
            }
          }
        })
      })
    }

    const { appointment, labTestStatus, diagnosesIds, testField } = values
    const { id: appointmentId } = appointment ?? {}
    const { id: testStatus } = labTestStatus ?? {}

    const newTests =  testField.filter((testFieldValues)=>!!testFieldValues?.newTest)
    const oldTests =  testField.filter((testFieldValues)=>!testFieldValues?.newTest)

    if(newTests.length){
       handleTestCreation({...values, testField: newTests})
    }



    oldTests.forEach(async(testFieldValues) => {
      const { test, testDate, testNotes, testTime, specimenTypeField, testId } = testFieldValues

      const updateLabTestItemInput = {
        patientId: patientId ?? '',
        ...(appointmentId && { appointmentId }),
        status: testStatus as LabTestStatus,
        testNotes,
        testDate: getFormatDateString(testDate,'MM-DD-YYYY'),
        testTime,
        id: testId ?? ''
      }

      const diagnoses = diagnosesIds.length ? diagnosesIds.map((diagnose) => diagnose.value) : undefined
      let updateSpecimenItemInput

      if (specimenTypeField?.length) {
        updateSpecimenItemInput= specimenTypeField.reduce((acc, specimenTypeFieldValues) => {
          const { collectionDate, collectionTime, specimenNotes, specimenType, id: specimenId } = specimenTypeFieldValues
          const { id: testSpecimen } = specimenType
          acc.push({
            id: specimenId ?? '',
            testSpecimen,
            specimenNotes,
            collectionDate: getFormatDateString(collectionDate,'MM-DD-YYYY'),
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
            ...(updateSpecimenItemInput && {updateSpecimenItemInput}),
            ...(diagnoses && {diagnoses}),
            test: test.id
          }
        },
      });
    })
  }

  return (
    <Box p={2}>
    {(!loading  || error) && (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h4'>{EDIT_LAB_ORDER}</Typography>
        </Box>
        <Card>
          <Box p={2}>
            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <AppointmentSelector
                  label={APPOINTMENT_TEXT}
                  name="appointment"
                  patientId= {patientId}
                  addEmpty
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="labTestStatus"
                  label={STATUS}
                  value={EMPTY_OPTION}
                  options={LAB_TEST_STATUSES}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <DiagnosesSelector
                  isEdit={true}
                  label={DIAGNOSES}
                  name="diagnosesIds"
                  defaultValues={diagnosesIds}
                  // defaultValues={[]}
                />
              </Grid>
            </Grid>
          </Box>
        </Card>

        {testFields.map((testField, index) => {
          console.log("testField",testField)
          return (
            <Card>
              <Box p={2}>
                <Grid container item spacing={3}>
                  <Grid item md={3} sm={12} xs={12}>
                    <TestsSelector
                      label={TEST}
                      name={`testField.${index}.test`}
                      addEmpty
                    />
                  </Grid>

                  <Grid item md={2} sm={12} xs={12}>
                    <DatePicker name={`testField.${index}.testDate`} label={TEST_DATE} />
                  </Grid>

                  <Grid item md={2} sm={12} xs={12}>
                    <TimePicker
                      isRequired
                      label={TEST_TIME}
                      name={`testField.${index}.testTime`}
                    />
                  </Grid>

                  <Grid item md={3} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName={`testField.${index}.testNotes`}
                      controllerLabel={TEST_NOTES}
                    />
                  </Grid>

                  <Grid container item>
                    <LabOrdersSpecimenTypeForm index={index} />
                  </Grid>


                  {!!(testFields.length > 1 && index !== 0) && <Grid item md={2} sm={12} xs={12}>
                    <Box marginTop={3}
                      onClick={() => {
                        setTestsToRemove([...testsToRemove, testField?.testId ?? ''])
                        removeTestField(index)
                      }}
                      className="remove-box" display="flex" alignItems="center"
                    >
                      <RemoveCircleOutline color='inherit' />

                      <Typography>{REMOVE_TEST}</Typography>
                    </Box>
                  </Grid>}
                </Grid>
              </Box>
            </Card>
          )
        })}

        <Grid item md={12} sm={12} xs={12}>
          <Grid container spacing={3} justifyContent="flex-end">
            <Grid item md={2} sm={12} xs={12}>
              <Box pb={3}
                onClick={() => appendTestField({...TEST_FIELD_INITIAL_VALUES, newTest: true})}
                className="billing-box" display="flex" alignItems="center"
              >
                <AddCircleOutline color='inherit' />

                <Typography>{ADD_ANOTHER_TEST}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Box mb={3} display="flex">
              <Button variant="outlined" color="inherit" className='danger' disabled={createLoading || updateLoading || removeLoading} onClick={()=>handleOrderDeletion()}>{DELETE}</Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary" disabled={createLoading || updateLoading || removeLoading}>
                {SAVE_TEXT} {(createLoading || updateLoading) && <CircularProgress size={20} color="inherit" />}
                </Button>
            </Box>
      </form>
    </FormProvider>)}
  </Box>
  );
};

export default LabOrdersEditForm;
