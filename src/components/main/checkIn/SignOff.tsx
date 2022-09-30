import { Box, Card, colors, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ASSESSMENT_PLAN, EIGHT_PAGE_LIMIT, FOLLOWUP } from '../../../constants'
import { useFindAllPatientProblemsWithMedicationLazyQuery } from '../../../generated/graphql'
import { AssessmentProblemType, ParamsType } from '../../../interfacesTypes'
import { useChartingStyles } from '../../../styles/chartingStyles'
import ReviewTab from '../patientChart/chartCards/tabs/ReviewTab'

function SignOff() {
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const [assessmentProblems, setAssessmentProblems] = useState<AssessmentProblemType[]>([])

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
                const { ICDCode, id: problemId, snowMedCode, patientMedications, forOrders, isSigned } = problem || {}
                const { id: snoMedCodeId } = snowMedCode || {}

                const icdCodes = {
                  id: ICDCode?.id || '',
                  code: ICDCode?.code || '',
                  description: ICDCode?.description || '',
                  snoMedCodeId: snoMedCodeId || ''
                }

                const transformedPatientMedications = patientMedications?.map((patientMedication, subIndex) => {
                  const { id: patientMedicationId, medication } = patientMedication || {}
                  const id = medication?.id || ''
                  const fullName = medication?.fullName
                  const medicationId = medication?.id || ''
                  const rxNumber = medication?.rxNumber
                  const termType = medication?.termType
                  const updatedAt = medication?.updatedAt

                  return {
                    id,
                    fullName,
                    medicationId,
                    rxNumber,
                    termType,
                    updatedAt,
                    patientMedicationId
                  }
                }) || []

                return {
                  isSigned: isSigned || false,
                  icdCodes,
                  problemId: problemId || '',
                  medications: transformedPatientMedications,
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

  const classes = useChartingStyles()
  return (
    <div>
      <ReviewTab shouldShowAdd={false} />
      <Box m={3} />
      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{ASSESSMENT_PLAN}</Typography>
          </Box>



          <Box p={2}>
            {assessmentProblems.map(problem => {
              const { icdCodes, medications } = problem || {}
              const { code, description } = icdCodes || {}

              return <>
                <Box display='flex' justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                  <Box>
                    <Typography variant='h4'>{`${description} | ${code} `}</Typography>
                  </Box>
                </Box>
                {medications?.map((medication => {
                  const { fullName } = medication || {}
                  return (
                    <Box px={2}>
                      <ul>
                        <li>
                          <Box py={1} display='flex' justifyContent='space-between' alignItems='center'>
                            <Typography>{fullName}</Typography>
                          </Box>
                        </li>
                      </ul>
                    </Box>
                  )
                }))}
              </>
            })}
          </Box>
        </Box>
      </Card>
      <Box m={3} />
      <Card>
        <Box pb={2} className={classes.cardBox}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant='h3'>{FOLLOWUP}</Typography>
          </Box>



          <Box p={2}>
            <Typography>Patient will return to the office as needed.</Typography>
          </Box>
        </Box>
      </Card>
    </div>
  )
}

export default SignOff