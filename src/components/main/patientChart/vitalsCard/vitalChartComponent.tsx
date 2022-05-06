// packages block
import { FC, Reducer, useReducer } from "react";
import { Box, Button } from "@material-ui/core";
// components block
import GraphModal from "./graphModal";
import PatientProfileHero from "../../../common/patient/profileHero";
import VitalsListing from './listing'
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AttachmentsPayload, PatientPayload } from "../../../../generated/graphql";
import { CalendarChart } from "../../../../interfacesTypes";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import {
  patientReducer, State, initialState, Action, ActionType
} from "../../../../reducers/patientReducer";
import { GROWTH_CHART, PDF_TEXT } from "../../../../constants";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";

const VitalsChartingTable: FC<CalendarChart> = ({ isCalendar }): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const [{ openGraph }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [{}, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  return (
    <>
      {isCalendar === true
        && <PatientProfileHero
          setPatient={(patient: PatientPayload['patient']) =>
            dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient })
          }
          setAttachmentsData={(attachments: AttachmentsPayload['attachments']) =>
            mediaDispatcher({ type: mediaActionType.SET_ATTACHMENTS_DATA, attachmentsData: attachments })
          }
        />}

      <Box pt={3} pb={2} pl={3} display='flex'>
        <Box pr={1}>
          <Button color="secondary" variant="contained" onClick={() => dispatch({ type: ActionType.SET_OPEN_GRAPH, openGraph: true })}>
            {GROWTH_CHART}
          </Button>
        </Box>

        <Box>
          <Button color="secondary" variant="contained">
            {PDF_TEXT}
          </Button>
        </Box>
      </Box>

      <Box>
        <Box className="table-overflow">
          <VitalsListing />
        </Box>
      </Box>

      <GraphModal isOpen={openGraph} dispatcher={dispatch} />
    </>
  );
};

export default VitalsChartingTable;
