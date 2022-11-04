import { FC } from 'react';
import { Box, Typography } from '@material-ui/core'
import { FormProvider, useForm } from 'react-hook-form'
//components
import RoomSelector from '../../common/Selector/roomSelector';
//constants, interfaces
import { EMPTY_OPTION, PATIENT_LOCATION_TEXT } from '../../../constants';
import { AppointmentRoomProps, SelectorOption } from '../../../interfacesTypes';
import { useAssociateRoomToAppointmentMutation } from '../../../generated/graphql';

const AppointmentRoom: FC<AppointmentRoomProps> = ({ appointmentId }): JSX.Element => {
  const methods = useForm({
    defaultValues: { room: EMPTY_OPTION }
  })

  const [associateRoom] = useAssociateRoomToAppointmentMutation()

  const onRoomSelect = (option: SelectorOption) => {
    const { id: roomId } = option || {}
    associateRoom({ variables: { associateRoomToAppointmentInput: { appointmentId: appointmentId || '', roomId: roomId || '' } } })
  }
  return (
    <FormProvider {...methods}>
      <Box display='flex' alignItems='center'>
        <Typography variant="h6" color="textPrimary">{PATIENT_LOCATION_TEXT}</Typography>
        <Box width={200} ml={2}>
          <RoomSelector addEmpty label='' name='room' onSelect={onRoomSelect} />
        </Box>
      </Box>
    </FormProvider>
  )
}

export default AppointmentRoom