// packages block
import { FC, Reducer, useReducer } from "react";
import { Box, Button, Menu, Typography } from "@material-ui/core";
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@material-ui/icons';
// components block
import GraphModal from "./graphModal";
import PatientProfileHero from "../../../common/patient/profileHero";
import VitalsListing from './listing'
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AttachmentsPayload, PatientPayload } from "../../../../generated/graphql";
import { CalendarChart } from "../../../../interfacesTypes";
import {
  patientReducer, State, initialState, Action, ActionType
} from "../../../../reducers/patientReducer";
import {
  FEVER_TEXT, FEVER_UNITS, GROWTH_CHART, HEAD_CIRCUMFERENCE, HEAD_CIRCUMFERENCE_UNITS, HEIGHT_TEXT,
  PATIENT_HEIGHT_UNITS, PATIENT_WEIGHT_UNITS, PDF_TEXT, UNITS, WEIGHT_TEXT
} from "../../../../constants";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import { GRAY_SIX } from "../../../../theme";

const VitalsChartingTable: FC<CalendarChart> = ({ isCalendar }): JSX.Element => {
  const [patientStates, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const { openGraph, openUnits, heightUnit: { id: heightUnitId }, weightUnit: { id: weightUnitId },
    headCircumferenceUnit: { id: headCircumferenceUnitId }, feverUnit: { id: feverUnitId } } = patientStates
 
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
          <Button color="default" id='patient-height-units' variant="outlined"
            onClick={({ currentTarget }) => dispatch({ type: ActionType.SET_OPEN_UNITS, openUnits: currentTarget })}
            endIcon={<KeyboardArrowDownIcon />}
          >
            {UNITS}
          </Button>
          <Menu open={Boolean(openUnits)} getContentAnchorEl={null}
            anchorEl={openUnits}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            id={'patient-height-units'}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            onClose={() => dispatch({ type: ActionType.SET_OPEN_UNITS, openUnits: null })}>
            <Box p={2} width={300}>
              <Box display={'flex'} justifyContent="space-between" alignItems="center" mb={1}>

                <Box>
                  <Typography variant="h5">{HEIGHT_TEXT}</Typography>
                </Box>

                <Box p={1} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {PATIENT_HEIGHT_UNITS?.map((height, index) => {
                    const { id, name } = height || {}
                    return (<Box key={`${index}-${name}-${id}`}
                      className={id === heightUnitId ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => dispatch({ type: ActionType.SET_HEIGHT_UNIT, heightUnit: height })}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box display={'flex'} justifyContent="space-between" alignItems="center" mb={1}>

                <Box>
                  <Typography variant="h5">{WEIGHT_TEXT}</Typography>
                </Box>

                <Box p={1} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {PATIENT_WEIGHT_UNITS?.map((weight, index) => {
                    const { id, name } = weight || {}
                    return (<Box key={`${index}-${name}-${id}`}
                      className={id === weightUnitId ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => dispatch({ type: ActionType.SET_WEIGHT_UNIT, weightUnit: weight })}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box display={'flex'} justifyContent="space-between" alignItems="center" mb={1}>

                <Box>
                  <Typography variant="h5">{HEAD_CIRCUMFERENCE}</Typography>
                </Box>

                <Box p={1} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {HEAD_CIRCUMFERENCE_UNITS?.map((head, index) => {
                    const { id, name } = head || {}
                    return (<Box key={`${index}-${name}-${id}`}
                      className={id === headCircumferenceUnitId ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => dispatch({ type: ActionType.SET_HEAD_CIRCUMFERENCE_UNIT, headCircumferenceUnit: head })}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box display={'flex'} justifyContent="space-between" alignItems="center">

                <Box>
                  <Typography variant="h5">{FEVER_TEXT}</Typography>
                </Box>

                <Box p={1} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {FEVER_UNITS?.map((temp, index) => {
                    const { id, name } = temp || {}
                    return (<Box key={`${index}-${name}-${id}`}
                      className={id === feverUnitId ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => dispatch({ type: ActionType.SET_FEVER_UNIT, feverUnit: temp })}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </Menu>
        </Box>
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
          <VitalsListing patientStates={patientStates} dispatcher={dispatch} />
        </Box>
      </Box>

      <GraphModal isOpen={openGraph} dispatcher={dispatch} />
    </>
  );
};

export default VitalsChartingTable;
