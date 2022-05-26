//packages block
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Box, colors, Typography } from '@material-ui/core'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
//components
import CardComponent from '../CardComponent'
import ViewDataLoader from '../ViewDataLoader'
import AppointmentDatePicker from '../../main/publicAppointments/scheduleAppointments/AppointmentDatePicker'
//constants, graphql, utils, styles, interfaces
import { getStandardTime } from '../../../utils'
import { AVAILABLE_SLOTS, DAYS, NO_SLOT_AVAILABLE } from '../../../constants'
import { Slots, SlotsPayload, useGetSlotsLazyQuery } from '../../../generated/graphql'
import { usePublicAppointmentStyles } from '../../../styles/publicAppointmentStyles'
import { SlotsComponentProps } from '../../../interfacesTypes'

const SlotsComponent = ({ facilityId, state }: SlotsComponentProps) => {
	const [availableSlots, setAvailableSlots] = useState<SlotsPayload['slots']>([])
	const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
	const [appointmentTypeId, setAppointmentTypeId] = useState('')

	const { serviceId } = state || {}

	const classes = usePublicAppointmentStyles()
	const { setValue, getValues } = useFormContext()
	const values = getValues()

	console.log('serviceId', serviceId)
	console.log('appointmentType => ', serviceId && values[serviceId])

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
			startTime && setValue('scheduleStartDateTime', startTime)
			endTime && setValue('scheduleEndDateTime', endTime)
		}
	};

	const getSlotsHandler = useCallback(async () => {
		if (date && serviceId) {
			setValue('scheduleEndDateTime', '')
			setValue('scheduleStartDateTime', '')
			const days = [DAYS.Sunday, DAYS.Monday, DAYS.Tuesday, DAYS.Wednesday, DAYS.Thursday, DAYS.Friday, DAYS.Saturday];
			const currentDay = new Date(date).getDay()

			await getSlots({
				variables: {
					getSlots: {
						offset: moment.tz().utcOffset(), currentDate: date.toString(), serviceId: appointmentTypeId, facilityId,
						day: days[currentDay]
					}
				}
			})
		}
	}, [date, getSlots, facilityId, setValue, serviceId, appointmentTypeId])

	useEffect(() => {
		appointmentTypeId && serviceId && date && getSlotsHandler()
	}, [date, serviceId, getSlotsHandler, appointmentTypeId])

	useEffect(() => {
		if (serviceId && values[serviceId]) {
			const { id } = values[serviceId]
			setAppointmentTypeId(id)
		}
	}, [values, serviceId, setAppointmentTypeId])


	return (
		<div><CardComponent cardTitle="Available Slots">
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
		</CardComponent></div>
	)
}

export default SlotsComponent