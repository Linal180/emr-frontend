// packages block
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Grid, Box, colors, Typography } from "@material-ui/core";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
// components block
import CardComponent from "./CardComponent";
import ViewDataLoader from "./ViewDataLoader";
import AppointmentDatePicker from "../main/publicAppointments/scheduleAppointments/AppointmentDatePicker";
// constants, graphql and utils block
import { filterSlots, getStandardTime } from "../../utils";
import { DAYS, AVAILABLE_SLOTS, NO_SLOT_AVAILABLE } from "../../constants";
import { usePublicAppointmentStyles } from "../../styles/publicAppointmentStyles";
import { useGetSlotsLazyQuery, SlotsPayload, Slots } from "../../generated/graphql";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../reducers/appointmentReducer";

export interface AppointmentSlotsProps {
  facilityId?: string;
  providerId?: string;
}

const AppointmentSlots: FC<AppointmentSlotsProps> = ({ facilityId, providerId }) => {
  const classes = usePublicAppointmentStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { availableSlots, offset } = state;
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const { watch, setValue } = useFormContext()
  const { serviceId } = watch()
  const {id: selectedService } = serviceId || {}

  const [getSlots, { loading: getSlotsLoading }] = useGetSlotsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] })
    },

    onCompleted(data) {
      const { getSlots } = data || {}

      if (getSlots) {
        const { slots } = getSlots;

        slots ?
          dispatch({
            type: ActionType.SET_AVAILABLE_SLOTS,
            availableSlots: filterSlots(slots, date) as SlotsPayload['slots']
          })
          :
          dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] });
      }
    }
  });

  const handleSlot = (slot: Slots) => {
    if (slot) {
      const { startTime, endTime } = slot;
      startTime && setValue('scheduleStartDateTime', startTime)
      endTime && setValue('scheduleEndDateTime', endTime)
    }
  };

  const fetchSlots = useCallback(async () => {
    if (selectedService && date) {
      setValue('scheduleEndDateTime', '')
      setValue('scheduleStartDateTime', '')

      const days = [DAYS.Sunday, DAYS.Monday, DAYS.Tuesday, DAYS.Wednesday, DAYS.Thursday, DAYS.Friday, DAYS.Saturday];
      const currentDay = new Date(date).getDay()
      const inputs = providerId ? { providerId } : { facilityId }
      
      await getSlots({
        variables: {
          getSlots: {
            offset, currentDate: date.toString(), serviceId: selectedService,
            day: days[currentDay], ...inputs
          }
        }
      })
    }
  }, [date, facilityId, getSlots, offset, providerId, selectedService, setValue])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  return (
    <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
      <CardComponent cardTitle="Available Slots">
        <AppointmentDatePicker date={date} setDate={setDate} />

        <Box pb={2} mb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{AVAILABLE_SLOTS}</Typography>
        </Box>

        {getSlotsLoading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> : (
          <ul className={classes.timeSlots}>
            {!!availableSlots?.length ? availableSlots.map((slot: Slots, index: number) => {
              const { startTime, endTime } = slot || {}

              return (
                <li key={index} onClick={() => handleSlot(slot)}>
                  <input type="radio" name="scheduleStartDateTime" id={`timeSlot-${index}`} />

                  <label htmlFor={`timeSlot-${index}`}>
                    {getStandardTime(new Date(startTime || '').getTime().toString())} -
                    {getStandardTime(new Date(endTime || '').getTime().toString())}
                  </label>
                </li>
              )
            }) : (
              <Typography>{NO_SLOT_AVAILABLE}</Typography>
            )}
          </ul>
        )}
      </CardComponent>
    </Grid>
  )
}

export default AppointmentSlots;
