// packages block
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { PDFViewer } from "@react-pdf/renderer";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
// components block
// interfaces/types block, theme, svgs and constants
import { useParams } from "react-router";
import { CLOSE, PRINT_PATIENT_CHART } from "../../../../../constants";
import { useGetPatientChartingInfoLazyQuery } from "../../../../../generated/graphql";
import { ChartPrintModalProps, ParamsType, PatientChartingInfo } from "../../../../../interfacesTypes";
import { Action as ChartAction, ActionType as ChartActionType, chartReducer, initialState as chartInitialState, State as ChartState } from '../../../../../reducers/chartReducer';
import Loader from "../../../../common/Loader";
import ChartPdf from "./ChartPdf";

const ChartPrintModal: FC<ChartPrintModalProps> = ({ isOpen, handleClose, modulesToPrint }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
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

  useEffect(() => {
    patientId && findPatientChartingInfo()
  }, [findPatientChartingInfo, patientId])

  if (getPatientChartingInfoLoading) {
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
              patientChartInfo={patientChartingInfo}
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
