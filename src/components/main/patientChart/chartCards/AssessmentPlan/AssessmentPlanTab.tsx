import { Box } from '@material-ui/core'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { EIGHT_PAGE_LIMIT } from '../../../../../constants'
import { useFindAllPatientProblemsWithMedicationLazyQuery } from '../../../../../generated/graphql'
import { AssessmentProblemType, ParamsType } from '../../../../../interfacesTypes'
import AssessmentPlanProblems from './AssessmentPlanProblems'

function AssessmentPlanTab({ shouldDisableEdit }: { shouldDisableEdit?: boolean }) {
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const [assessmentProblems, setAssessmentProblems] = useState<AssessmentProblemType[]>([])
  const [isSigned, setIsSigned] = useState(false)
  const [notes, setNotes] = useState('')

  const [findAllPatientProblems] = useFindAllPatientProblemsWithMedicationLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {

    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientProblem } = data;

        if (findAllPatientProblem) {
          const { response, patientProblems } = findAllPatientProblem

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              const transformedPatientProblems = patientProblems.map((problem, index) => {
                const { ICDCode, id: problemId, snowMedCode, patientMedications, forOrders, isSigned, labTests, apNotes } = problem || {}
                setNotes(apNotes || '')
                const { id: snoMedCodeId } = snowMedCode || {}

                const icdCodes = {
                  id: ICDCode?.id || '',
                  code: ICDCode?.code || '',
                  description: ICDCode?.description || '',
                  snoMedCodeId: snoMedCodeId || ''
                }

                const transformedPatientMedications = patientMedications?.map((patientMedication, subIndex) => {
                  const { id: patientMedicationId, medication, isSigned: medicationSigned } = patientMedication || {}
                  const id = medication?.id || ''
                  const fullName = medication?.fullName
                  const medicationId = medication?.id || ''
                  const rxNumber = medication?.rxNumber
                  const termType = medication?.termType
                  const updatedAt = medication?.updatedAt

                  setIsSigned(medicationSigned || false)

                  return {
                    id,
                    fullName,
                    medicationId,
                    rxNumber,
                    termType,
                    updatedAt,
                    patientMedicationId,
                    isSigned: medicationSigned || false
                  }
                }) || []

                const transformedPatientTests = labTests?.map((patientTest, subIndex) => {
                  const { id: patientTestId, test, isSigned: labSigned } = patientTest || {}
                  const id = test?.id || ''
                  const component = test?.component
                  const testId = test?.id || ''

                  return {
                    id,
                    component,
                    testId,
                    patientTestId,
                    isSigned: labSigned || false
                  }
                }) || []

                return {
                  isSigned: isSigned || false,
                  icdCodes,
                  problemId: problemId || '',
                  medications: transformedPatientMedications,
                  tests: transformedPatientTests,
                  forOrders: forOrders || false
                }
              })

              setAssessmentProblems(transformedPatientProblems)
            }
          }
        }
      }
    }
  });

  const fetchProblems = useCallback(async () => {
    try {
      await findAllPatientProblems({
        variables: {
          patientProblemInput: { patientId, appointmentId, paginationOptions: { page: 1, limit: EIGHT_PAGE_LIMIT }, forOrders: true }
        },
      })
    } catch (error) { }
  }, [appointmentId, findAllPatientProblems, patientId]);

  useEffect(() => {
    patientId && fetchProblems()
  }, [fetchProblems, patientId])

  return (
    <>
      <AssessmentPlanProblems
        fetchProblems={fetchProblems}
        assessmentProblems={assessmentProblems}
        setAssessmentProblems={setAssessmentProblems}
        shouldDisableEdit={shouldDisableEdit}
        isSigned={isSigned}
        notes={notes}
        setNotes={setNotes}
      />
      <Box m={2} />
    </>
  )
}

export default AssessmentPlanTab