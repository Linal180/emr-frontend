//packages block
import moment from 'moment'
import { useCallback, useEffect, useState, Fragment } from 'react'
import { useFormContext } from 'react-hook-form'
import { Box, colors, FormControl, FormHelperText, Typography } from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
//components
import ViewDataLoader from '../ViewDataLoader'
import AppointmentDatePicker from '../../main/publicAppointments/appointmentForm/AppointmentDatePicker'
//constants, graphql, utils, styles, interfaces
import { getCurrentTimestamps, getStandardTime, requiredMessage } from '../../../utils'
import { AVAILABLE_SLOTS, DAYS, NO_SLOT_AVAILABLE, SLOTS_TEXT } from '../../../constants'
import { Slots, SlotsPayload, useGetSlotsLazyQuery } from '../../../generated/graphql'
import { usePublicAppointmentStyles } from '../../../styles/publicAppointmentStyles'
import { SlotsComponentProps } from '../../../interfacesTypes'

const SlotsComponent = ({ facilityId, state }: SlotsComponentProps) => {
  const [availableSlots, setAvailableSlots] = useState<SlotsPayload['slots']>([])
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const [appointmentTypeId, setAppointmentTypeId] = useState('')

  const { serviceId, provider } = state || {}
  const { id: providerId } = provider || {}

  const classes = usePublicAppointmentStyles()
  const { setValue, getValues, watch } = useFormContext()
  const values = getValues()
  const { scheduleStartDateTime } = watch()

  const [getSlots, { loading: getSlotsLoading }] = useGetSlotsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      setAvailableSlots([])
    },

    onCompleted(data) {
      const { getSlots } = data || {}

      if (getSlots) {
        const { slots } = getSlots;

        slots ? setAvailableSlots(slots) : setAvailableSlots([])
      }
    }
  });

  const handleSlot = (slot: Slots) => {
    if (slot) {
      const { startTime, endTime } = slot;
      const startDateTime = getCurrentTimestamps(startTime || '', date)
      const endDateTime = getCurrentTimestamps(endTime || '', date)
      startTime && setValue('scheduleStartDateTime', startDateTime)
      endTime && setValue('scheduleEndDateTime', endDateTime)
    }
  };

  const getSlotsHandler = useCallback(async () => {
    if (date && serviceId) {
      setValue('scheduleEndDateTime', '')
      setValue('scheduleStartDateTime', '')
      const days = [DAYS.Sunday, DAYS.Monday, DAYS.Tuesday, DAYS.Wednesday, DAYS.Thursday, DAYS.Friday, DAYS.Saturday];
      const currentDay = new Date(date).getDay()
      const inputData = {
        offset: moment.tz().utcOffset(), currentDate: date.toString(), serviceId: appointmentTypeId,
        day: days[currentDay],
      }
      const inputs = providerId ? { ...inputData, providerId } : { ...inputData, facilityId }

      await getSlots({
        variables: {
          getSlots: inputs
        }
      })
    }
  }, [date, getSlots, facilityId, setValue, serviceId, appointmentTypeId, providerId])

  useEffect(() => {
    appointmentTypeId && serviceId && date && getSlotsHandler()
  }, [date, serviceId, getSlotsHandler, appointmentTypeId])

  useEffect(() => {
    if (serviceId && values[serviceId]) {
      const id = values[serviceId]
      setAppointmentTypeId(id)
    }
  }, [values, serviceId, setAppointmentTypeId])


  return (
    <Fragment>
      <Box display="flex" justifyContent="center">
        <AppointmentDatePicker date={date} setDate={setDate} />
      </Box>
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
            <Fragment>
              <FormControl component="fieldset" margin="normal" error={Boolean(!scheduleStartDateTime)}>
                <FormHelperText>{!scheduleStartDateTime && requiredMessage(SLOTS_TEXT)}</FormHelperText>
              </FormControl>

              <Typography>{NO_SLOT_AVAILABLE}</Typography>
            </Fragment>
          )}
        </ul>
      )}

    </Fragment>
  )
}

export default SlotsComponent
