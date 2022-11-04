import { FC } from 'react';
import { Box, Typography } from '@material-ui/core'
//components
import RoomSelector from '../../common/Selector/roomSelector';
//constants, interfaces
import { PATIENT_LOCATION_TEXT } from '../../../constants';
import { AppointmentRoomProps, SelectorOption } from '../../../interfacesTypes';
import { useAssociateRoomToAppointmentMutation } from '../../../generated/graphql';

const AppointmentRoom: FC<AppointmentRoomProps> = ({ appointmentId }): JSX.Element => {
  const [associateRoom] = useAssociateRoomToAppointmentMutation()

  const onRoomSelect = (option: SelectorOption) => {
    const { id: roomId } = option || {}
    associateRoom({ variables: { associateRoomToAppointmentInput: { appointmentId: appointmentId || '', roomId: roomId || '' } } })
  }
  return (
    <Box display='flex' alignItems='center'>
      <Typography variant="h6" color="textPrimary">{PATIENT_LOCATION_TEXT}</Typography>
      <Box width={200} ml={2}>
        <RoomSelector addEmpty label='' name='room' onSelect={onRoomSelect} />
      </Box>
    </Box>
  )
}

export default AppointmentRoom