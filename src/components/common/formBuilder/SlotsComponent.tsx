//packages block
import moment from 'moment'
import { useFormContext } from 'react-hook-form'
import { useCallback, useEffect, useState, } from 'react'
import { Box, colors, Typography } from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
//components
import TableLoader from '../TableLoader';
import NoSlotsComponent from '../NoSlotsComponent'
import AppointmentDatePicker from '../../main/publicAppointments/appointmentForm/AppointmentDatePicker'
//constants, graphql, utils, styles, interfaces
import { AVAILABLE_SLOTS, DAYS, } from '../../../constants'
import { SlotsComponentProps } from '../../../interfacesTypes'
import { getCurrentTimesFormbuilder, getStandardTime, } from '../../../utils'
import { usePublicAppointmentStyles } from '../../../styles/publicAppointmentStyles'
import { Slots, SlotsPayload, useGetSlotsLazyQuery } from '../../../generated/graphql'

const SlotsComponent = ({ facilityId, state }: SlotsComponentProps) => {
  const [availableSlots, setAvailableSlots] = useState<SlotsPayload['slots']>([])
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const [appointmentTypeId, setAppointmentTypeId] = useState('')

  const { serviceId, provider } = state || {}
  const { id: providerId } = provider || {}

  const classes = usePublicAppointmentStyles()
  const { setValue, getValues } = useFormContext()
  const values = getValues()

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
      const startDateTime = getCurrentTimesFormbuilder(startTime || '', date)
      const endDateTime = getCurrentTimesFormbuilder(endTime || '', date)
      startTime && setValue('scheduleStartDateTime', startDateTime)
      endTime && setValue('scheduleEndDateTime', endDateTime)
      setValue('timeZone', moment.tz.guess())
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

  const dateHandler = (muiDate: Date | null) => {
    muiDate ? setDate(muiDate) : setDate(new Date() as MaterialUiPickersDate);
    setValue('appointmentDate', muiDate)
  }

  return (
    <>
      <Box display='flex' justifyContent='space-between' flexWrap='wrap'>
        <Box flex={1}>
          <AppointmentDatePicker date={date} setDate={dateHandler} />
        </Box>

        <Box flex={1}>
          <Box pb={2} mx={3} mb={2} textAlign='center' borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h4">{AVAILABLE_SLOTS}</Typography>
          </Box>

          {getSlotsLoading ? <TableLoader numberOfColumns={2} numberOfRows={4} /> : (
            <ul className={classes.timeSlots}>
              {!!availableSlots?.length ? availableSlots?.map((slot: Slots, index: number) => {
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
                <NoSlotsComponent />
              )}
            </ul>
          )}
        </Box>
      </Box>
    </>
  )
}

export default SlotsComponent
