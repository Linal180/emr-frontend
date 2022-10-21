// packages block
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
// components block
// interfaces/types block, theme, svgs and constants
import { useParams } from "react-router";
import { CLOSE, PRINT_PATIENT_CHART } from "../../../../../constants";
import { PatientIllnessHistoryPayload, ReviewOfSystemPayload, useGetPatientChartingInfoLazyQuery, useLatestPatientIllnessHistoryLazyQuery, useLatestReviewOfSystemLazyQuery } from "../../../../../generated/graphql";
import { ChartPrintModalProps, ParamsType, PatientChartingInfo } from "../../../../../interfacesTypes";
import { Action as ChartAction, ActionType as ChartActionType, chartReducer, initialState as chartInitialState, State as ChartState } from '../../../../../reducers/chartReducer';
import Loader from "../../../../common/Loader";
import ChartPdf from "./ChartPdf";

const ChartPrintModal: FC<ChartPrintModalProps> = ({ isOpen, handleClose, modulesToPrint }): JSX.Element => {
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const [reviewOfSystem, setReviewOfSystem] = useState<ReviewOfSystemPayload['reviewOfSystem']>(null)
  const [patientIllnessHistory, setPatientIllnessHistory] = useState<PatientIllnessHistoryPayload['patientIllnessHistory']>(null)
  const [{ patientChartingInfo }, chartDispatch] =
    useReducer<Reducer<ChartState, ChartAction>>(chartReducer, chartInitialState)

  const [getPatientChartingInfo, { loading: getPatientChartingInfoLoading }] = useGetPatientChartingInfoLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      chartDispatch({ type: ChartActionType.SET_PATIENT_CHARTING_INFO, patientChartingInfo: null })
    },

    onCompleted(data) {
      if (data) {
        const { getPatientChartingInfo } = data;

        if (getPatientChartingInfo) {
          const { response, patientAllergies, patientInfo,
            patientMedications, patientProblems, patientVitals, surgicalHistories, triageNotes, familyHistories } = getPatientChartingInfo

          if (response) {
            const { status } = response

            if (status && status === 200) {
              chartDispatch({
                type: ChartActionType.SET_PATIENT_CHARTING_INFO, patientChartingInfo: {
                  patientAllergies, patientInfo, patientMedications,
                  patientProblems, patientVitals, surgicalHistories, triageNotes, familyHistories
                } as PatientChartingInfo
              })
            }
          }
        }
      }
    }
  });

  const findPatientChartingInfo = useCallback(async () => {
    try {
      patientId && getPatientChartingInfo({
        variables: {
          patientChartingInfoInput: { patientId }
        }
      })
    } catch (error) { }
  }, [getPatientChartingInfo, patientId])



  const [patientReviewOfSystem, { loading: patientReviewOfSystemLoading }] = useLatestReviewOfSystemLazyQuery({
    onCompleted: (data) => {
      const { latestReviewOfSystem: dataResponse } = data || {}
      const { response, reviewOfSystem } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        setReviewOfSystem(reviewOfSystem as ReviewOfSystemPayload['reviewOfSystem'])

      }
    },
    onError: () => { }
  })

  const fetchPatientReviewOfSystem = useCallback(async () => {
    patientId && await patientReviewOfSystem({
      variables: {
        reviewOfSystemInput: {
          appointmentId,
          patientId
        }
      }
    })

  }, [patientId, patientReviewOfSystem, appointmentId])

  const [getPatientIllnessHistory, { loading: getPatientIllnessHistoryLoading }] = useLatestPatientIllnessHistoryLazyQuery({
    onCompleted: (data) => {
      const { latestPatientIllnessHistory: dataResponse } = data || {}
      const { response, patientIllnessHistory } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        setPatientIllnessHistory(patientIllnessHistory as PatientIllnessHistoryPayload['patientIllnessHistory'])
      }
    },
    onError: () => { }
  })
  const fetchPatientIllnessHistory = useCallback(async () => {
    patientId && await getPatientIllnessHistory({
      variables: {
        patientIllnessHistoryInput: {
          appointmentId,
          patientId
        }
      }
    })

  }, [appointmentId, getPatientIllnessHistory, patientId])

  useEffect(() => {
    if (patientId) {
      findPatientChartingInfo()
      fetchPatientIllnessHistory()
      fetchPatientReviewOfSystem()
    }
  }, [fetchPatientIllnessHistory, fetchPatientReviewOfSystem, findPatientChartingInfo, patientId])

  if (getPatientChartingInfoLoading || patientReviewOfSystemLoading || getPatientIllnessHistoryLoading) {
    return <Loader loaderText='Loading Chart Info...' loading />
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
      <DialogTitle id="alert-dialog-title">{PRINT_PATIENT_CHART}</DialogTitle>

      <DialogContent>
        <Box className="dialogBg">
          <PDFViewer width={"100%"} height="500">
            <ChartPdf
              patientChartInfo={{
                ...patientChartingInfo,
                reviewOfSystem, patientIllnessHistory,
              } as PatientChartingInfo}
              modulesToPrint={modulesToPrint}
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

export default ChartPrintModal;
