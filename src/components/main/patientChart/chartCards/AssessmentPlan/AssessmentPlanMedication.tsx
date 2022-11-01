import { useParams } from 'react-router';
import { Box, IconButton, Typography } from '@material-ui/core';
import { FC, Reducer, useEffect, useReducer, useState } from 'react';
import { AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
//components
import Alert from '../../../../common/Alert';
import DiagnosesModal from './DiagnosesModal';
import MacroView from '../../../../common/Macro/MacroView';
//svgs, constants, 
import { generateString } from '../../../../../utils';
import { CrossIcon } from '../../../../../assets/svgs';
import { IMAGING_TEST_TEXT, LAB_TESTS, MEDICATIONS_TEXT, TemplateType } from '../../../../../constants';
import { AddDiagnoseType, AssessmentPlanMedicationProps, ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, chartReducer, initialState, State } from '../../../../../reducers/chartReducer';
import {
  LabTestStatus, Medications, useAddPatientMedicationMutation, useCreateLabTestMutation,
  useRemoveLabTestMutation, useRemovePatientMedicationMutation, useRemovePatientProblemMutation,
  useUpdatePatientProblemNotesMutation, ImagingTest, LoincCodes, useCreateImagingOrderMutation, useRemoveImagingOrderMutation,
} from '../../../../../generated/graphql'

const AssessmentPlanMedication: FC<AssessmentPlanMedicationProps> = ({ index, problem, setAssessmentProblems, assessmentProblems, shouldDisableEdit, isSigned }): JSX.Element => {
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const { medications, problemId, icdCodes, tests, notes, imagingOrders } = problem || {}
  const { code, description } = icdCodes
  const [state, dispatch] = useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const [apNotes, setApNotes] = useState('')
  const { medicationIndex, isSubModalOpen, testIndex, imagingOrderIndex } = state

  useEffect(() => {
    setApNotes(notes || '')
  }, [notes])

  const handleChildModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const [addPatientMedication] = useAddPatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientMedication: { response, patientMedication } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          const { id } = patientMedication || {}

          const transformedMedications = medications?.map((medication, subIndex) => {
            let transformedMedicationId
            if (medicationIndex === subIndex) {
              transformedMedicationId = id
            } else {
              transformedMedicationId = medication.patientMedicationId
            }

            return {
              ...medication,
              patientMedicationId: transformedMedicationId
            }
          })

          const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
            if (problemIndex === index) {
              return {
                ...problem,
                medications: transformedMedications
              }
            }

            return problem
          })

          setAssessmentProblems(transformedProblems)
        }
      }
    }
  });

  const [createLabTest] = useCreateLabTestMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { createLabTest } = data
        const { labTest } = createLabTest || {}
        const { id } = labTest || {}

        const transformedTests = tests?.map((test, subIndex) => {
          let transformedTestId
          if (testIndex === subIndex) {
            transformedTestId = id
          } else {
            transformedTestId = test.patientTestId
          }

          return {
            ...test,
            patientTestId: transformedTestId
          }
        })

        const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
          if (problemIndex === index) {
            return {
              ...problem,
              tests: transformedTests
            }
          }

          return problem
        })

        setAssessmentProblems(transformedProblems)
      }
    }
  });

  const [addImagingOrder] = useCreateImagingOrderMutation({

    onCompleted(data) {
      if (data) {
        const { createImagingOrder } = data
        const { imagingOrder } = createImagingOrder || {}
        const { id } = imagingOrder || {}

        const transformedTests = imagingOrders?.map((test, subIndex) => {
          let transformedTestId
          if (imagingOrderIndex === subIndex) {
            transformedTestId = id
          } else {
            transformedTestId = test.patientTestId
          }

          return {
            ...test,
            patientTestId: transformedTestId
          }
        })

        const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
          if (problemIndex === index) {
            return {
              ...problem,
              imagingOrders: transformedTests
            }
          }

          return problem
        })

        setAssessmentProblems(transformedProblems)
      }
    },

    onError({ message }) {
      Alert.error(message)
    },
  })

  const [removePatientMedication] = useRemovePatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientMedication: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  });

  const [removePatientLabTest] = useRemoveLabTestMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removeLabTest } = data || {};
      const { response } = removeLabTest || {}

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  });

  const [removeImagingOrder] = useRemoveImagingOrderMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removeImagingOrder } = data || {};
      const { response } = removeImagingOrder || {}

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  })

  const addPatientMedicationHandler = async (item: Medications) => {
    dispatch({ type: ActionType.SET_MEDICATION_INDEX, medicationIndex: Number(medications?.length || 0) })

    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          medications: [...(medications || []), { ...item, medicationId: item?.id, isSigned: false }]
        }
      }

      return problem
    })

    setAssessmentProblems(transformedProblems)

    await addPatientMedication({
      variables: {
        createPatientMedicationInput: {
          appointmentId,
          patientId,
          medicationId: (item as Medications).id,
          patientProblemId: problemId,
          status: 'ACTIVE'
        }
      }
    })
  }

  const addLabTestHandler = async (item: LoincCodes) => {
    dispatch({ type: ActionType.SET_TEST_INDEX, testIndex: Number(tests?.length || 0) })
    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          tests: [...(tests || []), { ...item, testId: item?.id, isSigned: false }]
        }
      }

      return problem
    })

    setAssessmentProblems(transformedProblems)

    await createLabTest({
      variables: {
        createLabTestInput: {
          createLabTestItemInput: {
            patientId,
            appointmentId,
            problemId,
            accessionNumber: generateString(6),
            orderNumber: generateString(),
            status: LabTestStatus.OrderEntered,
          },
          test: item?.id
        }
      }
    })
  }

  const addImagingOrderHandler = async (item: ImagingTest) => {

    dispatch({ type: ActionType.SET_IMAGING_ORDER_INDEX, imagingOrderIndex: Number(imagingOrders?.length || 0) })
    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          imagingOrders: [...(imagingOrders || []), { testId: item?.id, isSigned: false, labTests: [item] }]
        }
      }

      return problem
    })

    setAssessmentProblems(transformedProblems)

    await addImagingOrder({
      variables: {
        createImagingOrderInput: {
          patientId,
          appointmentId,
          problemId,
          accessionNumber: generateString(6),
          orderNumber: generateString(),
          labTestStatus: LabTestStatus.OrderEntered,
          imagingTests: [item?.id]
        }
      }
    })
  }

  const handleAddOrder = async (item: ImagingTest | Medications | LoincCodes, type: AddDiagnoseType) => {
    switch (type) {
      case 'imaging':
        await addImagingOrderHandler(item as ImagingTest)
        break;

      case 'medication':
        await addPatientMedicationHandler(item as Medications)
        break;

      case 'test':
        await addLabTestHandler(item as LoincCodes)
        break;

      default:
        break;
    }

    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const removeImagingOrderHandler = (subIndex: number) => {
    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          imagingOrders: imagingOrders?.filter((_, indexToRemove) => indexToRemove !== subIndex)
        }
      }

      return problem
    })
    setAssessmentProblems(transformedProblems)
    const imagingOrder = imagingOrders?.[subIndex]
    removeImagingOrder({
      variables: {
        removeImagingOrderInput: {
          id: imagingOrder?.patientTestId || ''
        }
      }
    })
  }

  const removeLabTestHandler = (subIndex: number) => {
    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          tests: tests?.filter((_, indexToRemove) => indexToRemove !== subIndex)
        }
      }

      return problem
    })
    setAssessmentProblems(transformedProblems)
    const test = tests?.[subIndex]
    removePatientLabTest({
      variables: {
        removeLabTest: {
          id: test?.patientTestId
        }
      }
    })
  }

  const removeMedicationHandler = (subIndex: number) => {
    const transformedProblems = assessmentProblems.map((problem, problemIndex) => {
      if (problemIndex === index) {
        return {
          ...problem,
          medications: medications?.filter((_, indexToRemove) => indexToRemove !== subIndex)
        }
      }

      return problem
    })
    setAssessmentProblems(transformedProblems)

    const medication = medications?.[subIndex]

    removePatientMedication({
      variables: {
        removePatientMedication: {
          id: medication?.patientMedicationId || ''
        }
      }
    })
  }

  const handleRemoveOrder = async (subIndex: number, type: AddDiagnoseType) => {
    switch (type) {
      case 'imaging':
        removeImagingOrderHandler(subIndex)
        break;

      case 'medication':
        removeMedicationHandler(subIndex)
        break;

      case 'test':
        removeLabTestHandler(subIndex)
        break;

      default:
        break;
    }
  }

  const [removePatientProblem] = useRemovePatientProblemMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removePatientProblem: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) { }
      }
    }
  });

  const [updatePatientProblemNotes] = useUpdatePatientProblemNotesMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientProblemNotes: { response } } = data;

      if (response) { }
    }
  });

  const handleProblemRemove = async (problemIndex: number) => {
    setAssessmentProblems(assessmentProblems.filter((_, indexToRemove) => indexToRemove !== problemIndex))
    const problem = assessmentProblems[problemIndex]

    await removePatientProblem({
      variables: {
        removeProblem: {
          id: problem.problemId
        }
      }
    })
  }

  const handleNotesUpdate = async (apNotes: string) => {
    await updatePatientProblemNotes({
      variables: {
        updateProblemNotesInput: {
          id: problemId,
          notes: apNotes
        }
      }
    })
  }

  return <>
    <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
      <Box>
        <Typography variant='h4'>{`${description} | ${code} `}</Typography>
      </Box>

      {!(shouldDisableEdit || isSigned) && <Box display='flex' alignItems='center'>
        <IconButton size='small' onClick={() => {
          dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
        }}>
          <AddCircleOutline color='secondary' />
        </IconButton>

        <IconButton size='small' onClick={() => handleProblemRemove(index)}>
          <RemoveCircleOutline color='error' />
        </IconButton>
      </Box>}
    </Box>

    <Box m={2} />

    <MacroView
      notes={apNotes || ''}
      itemId=''
      setItemId={() => { }}
      type={TemplateType.ASSESSMENT_PLAN}
      handleNotesUpdate={handleNotesUpdate}
    />

    {!!medications?.length && <>
      <Typography>{MEDICATIONS_TEXT}</Typography>
      <>
        {medications?.map((medication, subIndex) => {
          const { fullName } = medication
          return (
            <Box px={2}>
              <ul>
                <li className='li-hover'>
                  <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>{fullName}</Typography>
                    {!(shouldDisableEdit || isSigned) && <IconButton size='small' onClick={() => handleRemoveOrder(subIndex, 'medication')}>
                      <CrossIcon />
                    </IconButton>}
                  </Box>
                </li>
              </ul>
            </Box>
          )
        })
        }
      </>
    </>}

    {!!tests?.length &&
      <>
        <Typography>{LAB_TESTS}</Typography>
        <>
          {tests?.map((test, subIndex) => {
            const { component } = test || {}
            return (
              <Box px={2}>
                <ul>
                  <li className='li-hover'>
                    <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography>{component}</Typography>
                      {!(shouldDisableEdit || isSigned) && <IconButton size='small' onClick={() => handleRemoveOrder(subIndex, 'test')}>
                        <CrossIcon />
                      </IconButton>}
                    </Box>
                  </li>
                </ul>
              </Box>
            )
          })}
        </>
      </>
    }

    {!!imagingOrders?.length &&
      <>
        <Typography>{IMAGING_TEST_TEXT}</Typography>
        <>{imagingOrders?.map((imagingOrder, subIndex) => {
          const { imagingTests } = imagingOrder || {}
          const imagingTestsArr = imagingTests ?? []
          const { name } = imagingTestsArr[0] || {}
          return (
            <Box px={2}>
              <ul>
                <li className='li-hover'>
                  <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography>{name}</Typography>
                    {!(shouldDisableEdit || isSigned) && <IconButton size='small' onClick={() => handleRemoveOrder(subIndex, 'imaging')}>
                      <CrossIcon />
                    </IconButton>}
                  </Box>
                </li>
              </ul>
            </Box>
          )
        })}
        </>
      </>
    }

    {isSubModalOpen &&
      <DiagnosesModal
        isOpen={isSubModalOpen}
        handleModalClose={handleChildModalClose}
        alreadyAddedMedications={medications?.map(medication => medication.medicationId)}
        fetch={() => { }}
        handleAdd={handleAddOrder}
      />}
  </>
}

export default AssessmentPlanMedication