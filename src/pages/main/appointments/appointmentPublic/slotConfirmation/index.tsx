// packages block
import { FC, MouseEvent, Reducer, useEffect, useReducer, useState } from "react";
import { ArrowDropDown } from "@material-ui/icons";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Card, Menu, Typography } from '@material-ui/core';
// components block
import Alert from "../../../../../components/common/Alert";
// utils, styles  block, constants
import { WHITE_TWO } from '../../../../../theme';
import { ParamsType } from "../../../../../interfacesTypes";
import { useGetAppointmentLazyQuery } from "../../../../../generated/graphql";
import { slotConfirmationStyles } from "../../../../../styles/publicAppointment/slotConfirmation";
import { appointmentReducer, Action, initialState, State, ActionType } from "../../../../../reducers/appointmentReducer";
import {
  APPOINTMENT_NOT_FOUND, SLOT_CONFIRMATION_SUB_HEADING_TWO,
  PATIENT_INFORMATION, SLOT_CONFIRMATION_HEADING_TWO, SLOT_CONFIRMATION_SUB_HEADING, PATIENT_APPOINTMENT_FAIL,
} from '../../../../../constants';
import history from "../../../../../history";
import Backdrop from "../../../../../components/common/Backdrop";
import { getFormattedDate, getStandardTime } from "../../../../../utils";

const SlotConfirmation: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = slotConfirmationStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "slot-menu";
  const handleMenuClose = () => setAnchorEl(null);
  const [{ appointment }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const handleSlotMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const [getAppointment, { loading: getAppointmentLoading }] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      Alert.error(APPOINTMENT_NOT_FOUND)
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {
          dispatch({ type: ActionType.SET_APPOINTMENT, appointment })
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      getAppointment({
        variables: { getAppointment: { id } }
      })
    } else Alert.error(APPOINTMENT_NOT_FOUND)
  }, [getAppointment, id])

  const renderMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box display="flex" flexDirection="column" pl={2} pr={2}>
        <Button>
          Yes, Confirm it!
        </Button>
        <Link to={PATIENT_INFORMATION}>
          <Button>
            Not now, Maybe Later!
          </Button>
        </Link>

      </Box>

    </Menu>
  );

  const { scheduleStartDateTime } = appointment || {}

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {getAppointmentLoading ? <Backdrop loading={true} /> : (
        <Card>
          <Box minHeight="580px" className={classes.container}>
            <Box maxWidth="700px">
              <Typography component="h3" variant="h3" >Thank you! Your visit at {getStandardTime(scheduleStartDateTime || '')} on {getFormattedDate(scheduleStartDateTime || '')} has been confirmed.</Typography>
              <Typography component="h3" variant="h3" >{SLOT_CONFIRMATION_HEADING_TWO}</Typography>
            </Box>

            <Box pt={3}>
              <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING}</Typography>
              <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING_TWO}</Typography>
            </Box>

            <Box display="flex" gridGap={20} mt={3}>
              <Button type="submit" variant="contained">
                Cancel Booking
              </Button>
              <Button type="submit" variant="contained" className='blue-button' onClick={handleSlotMenuOpen}>
                <Typography>
                  Continue
                </Typography>  <ArrowDropDown />
              </Button>
            </Box>
            {renderMenu}
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default SlotConfirmation;
