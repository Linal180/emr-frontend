// packages block
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import { FC, useCallback, useEffect, useState } from "react";
// components block
import VisitModalPdf from "./VisitModalPdf";
// interfaces/types block, theme, svgs and constants
import { useParams } from "react-router";
import { CLOSE, EIGHT_PAGE_LIMIT, PRINT_MEDICATION_RECORD, VITAL_LIST_PAGE_LIMIT } from "../../../../../constants";
import { PatientIllnessHistoryPayload, ReviewOfSystemPayload, TriageNotesPayload, useFindAllPatientProblemsWithMedicationLazyQuery, useFindAllPatientTriageNotesLazyQuery, useGetPatientChartingReviewLazyQuery, usePatientIllnessHistoryLazyQuery, useReviewOfSystemLazyQuery } from "../../../../../generated/graphql";
import { AssessmentProblemType, ParamsType, PatientChartingReview, VisitModalProps } from "../../../../../interfacesTypes";
import Loader from "../../../../common/Loader";

const VisitModal: FC<VisitModalProps> = ({ isOpen, handleClose, appointmentInfo }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const [assessmentProblems, setAssessmentProblems] = useState<AssessmentProblemType[]>([])
  const [reviewOfSystem, setReviewOfSystem] = useState<ReviewOfSystemPayload['reviewOfSystem']>(null)
  const [patientIllnessHistory, setPatientIllnessHistory] = useState<PatientIllnessHistoryPayload['patientIllnessHistory']>(null)
  const [patientChartingReview, setPatientChartingReview] = useState<PatientChartingReview | null>(null)
  const [triageNotes, setTriageNotes] = useState<TriageNotesPayload['triageNotes']>(null)
  const { id: appointmentId } = appointmentInfo || {}
  const [findAllPatientProblems, { loading: findAllPatientProblemsLoading }] = useFindAllPatientProblemsWithMedicationLazyQuery({
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
                const { ICDCode, id: problemId, snowMedCode, patientMedications, forOrders, isSigned, labTests } = problem || {}
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
                    patientMedicationId,
                    isSigned: isSigned || false
                  }
                }) || []

                const transformedPatientTests = labTests?.map((patientTest, subIndex) => {
                  const { id: patientTestId, test } = patientTest || {}
                  const id = test?.id || ''
                  const component = test?.component
                  const testId = test?.id || ''

                  return {
                    id,
                    component,
                    testId,
                    patientTestId,
                    isSigned: isSigned || false
                  }
                }) || []

                return {
                  isSigned: isSigned || false,
                  icdCodes,
                  problemId: problemId || '',
                  medications: transformedPatientMedications,
                  forOrders: forOrders || false,
                  tests: transformedPatientTests
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

  const [patientReviewOfSystem, { loading: patientReviewOfSystemLoading }] = useReviewOfSystemLazyQuery({
    onCompleted: (data) => {
      const { reviewOfSystem: dataResponse } = data || {}
      const { response, reviewOfSystem } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        setReviewOfSystem(reviewOfSystem as ReviewOfSystemPayload['reviewOfSystem'])

      }
    },
    onError: () => { }
  })

  const fetchPatientReviewOfSystem = useCallback(async () => {
    appointmentId && await patientReviewOfSystem({
      variables: {
        reviewOfSystemInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [patientReviewOfSystem, appointmentId])

  useEffect(() => {
    fetchPatientReviewOfSystem()
  }, [fetchPatientReviewOfSystem])

  const [getPatientChartingReview, { loading: getPatientChartingReviewLoading }] = useGetPatientChartingReviewLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientChartingReview(null)
    },

    onCompleted(data) {
      if (data) {
        const { getPatientChartingReview } = data;

        if (getPatientChartingReview) {
          const { response, patientAllergies, patientMedications, patientProblems, patientVitals } = getPatientChartingReview

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              setPatientChartingReview({
                patientAllergies, patientMedications, patientProblems, patientVitals
              } as PatientChartingReview)
            }
          }
        }
      }
    }
  })

  const fetchPatientChartingView = useCallback(() => {
    try {
      getPatientChartingReview({
        variables: {
          patientChartingReviewInput: {
            appointmentId,
            patientId
          }
        }
      })
    } catch (error) { }
  }, [appointmentId, getPatientChartingReview, patientId])


  const [getPatientIllnessHistory, { loading: getPatientIllnessHistoryLoading }] = usePatientIllnessHistoryLazyQuery({
    onCompleted: (data) => {
      const { patientIllnessHistory: dataResponse } = data || {}
      const { response, patientIllnessHistory } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        setPatientIllnessHistory(patientIllnessHistory as PatientIllnessHistoryPayload['patientIllnessHistory'])
      }
    },
    onError: () => { }
  })

  const fetchPatientIllnessHistory = useCallback(async () => {
    appointmentId && await getPatientIllnessHistory({
      variables: {
        patientIllnessHistoryInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [getPatientIllnessHistory, appointmentId])

  const [getPatientTriageNotes, { loading: triageNotesLoading }] = useFindAllPatientTriageNotesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setTriageNotes([])
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientTriageNotes } = data;

        if (findAllPatientTriageNotes) {
          const { response, triageNotes } = findAllPatientTriageNotes

          if (response) {
            const { status } = response

            if (triageNotes && status && status === 200) {

              triageNotes?.length && setTriageNotes(triageNotes as TriageNotesPayload['triageNotes'])
            }
          }
        }
      }
    }
  })

  const fetchPatientAllTriageNotes = useCallback(async () => {
    try {
      await getPatientTriageNotes({
        variables: {
          patientTriageNoteInput: {
            patientId: patientId,
            appointmentId: appointmentId,
            paginationOptions: { page: 1, limit: VITAL_LIST_PAGE_LIMIT }
          }
        },
      })
    } catch (error) { }
  }, [appointmentId, getPatientTriageNotes, patientId])

  useEffect(() => {
    fetchPatientIllnessHistory()
    fetchPatientReviewOfSystem()
    fetchPatientChartingView()
    fetchProblems()
    fetchPatientAllTriageNotes()
  }, [fetchPatientAllTriageNotes, fetchPatientChartingView, fetchPatientIllnessHistory, fetchPatientReviewOfSystem, fetchProblems])

  const loading = getPatientIllnessHistoryLoading || getPatientChartingReviewLoading || patientReviewOfSystemLoading || findAllPatientProblemsLoading || triageNotesLoading

  if (loading) {
    return <Loader loaderText='Loading Medication record Info...' loading />
  }

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{PRINT_MEDICATION_RECORD}</DialogTitle>

      <DialogContent>
        <Box className="dialogBg">
          <PDFViewer width={"100%"} height="500">
            <VisitModalPdf
              assessmentProblems={assessmentProblems}
              patientChartingReview={patientChartingReview}
              patientIllnessHistory={patientIllnessHistory}
              reviewOfSystem={reviewOfSystem}
              triageNotes={triageNotes}
              appointmentInfo={appointmentInfo}
            />
          </PDFViewer>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={handleClose}>
          {CLOSE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VisitModal;
