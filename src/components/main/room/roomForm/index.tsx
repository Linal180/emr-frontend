import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import InputController from '../../../../controller';
import TableLoader from '../../../common/TableLoader';
import FacilitySelector from '../../../common/Selector/FacilitySelector';
//interfaces, constants, schema, graphql
import { RoomSchema } from '../../../../validationSchemas';
import { ActionType } from '../../../../reducers/roomReducer';
import { RoomFormProps, RoomFormType, SideDrawerCloseReason } from '../../../../interfacesTypes';
import { useCreateRoomMutation, useGetRoomLazyQuery, useUpdateRoomMutation } from '../../../../generated/graphql';
import {
  ADD, CANCEL, EDIT, EMPTY_OPTION, ROOM_TEXT, NAME, SOMETHING_WENT_WRONG, SUBMIT, NUMBER_TEXT, FACILITY
} from '../../../../constants';

const RoomForm: FC<RoomFormProps> = ({ open, fetch, isEdit, id, handleClose, dispatcher }): JSX.Element => {
  const methods = useForm<RoomFormType>({ resolver: yupResolver(RoomSchema) });
  const { handleSubmit, setValue, } = methods;

  const resetForm = () => {
    setValue('name', '')
    setValue('number', '')
    setValue('facility', EMPTY_OPTION)
  }

  const [createRoom, { loading: createLoading }] = useCreateRoomMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { createRoom } = data;
      const { room, response } = createRoom || {}
      const { status, message } = response || {}
      const { id } = room || {}
      if (id && status === 200) {
        resetForm()
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    }
  })

  const [getRoom, { loading: getLoading }] = useGetRoomLazyQuery({
    onCompleted: (data) => {
      const { getRoom } = data || {}
      const { room, response } = getRoom || {}
      const { status } = response || {}
      if (status === 200 && room) {
        const { name, facility, number } = room;
        const { id: facilityId, name: facilityName } = facility || {}
        name && setValue('name', name)
        number && setValue('number', number)
        facilityId && setValue('facility', { id: facilityId, name: facilityName })
      } else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: () => {
      Alert.error(SOMETHING_WENT_WRONG)
    }
  })

  const [updateRoom, { loading: updateLoading }] = useUpdateRoomMutation({
    onCompleted: (data) => {
      const { updateRoom } = data;
      const { room, response } = updateRoom || {}
      const { status, message } = response || {}
      const { id } = room || {}
      if (id && status === 200) {
        dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
        resetForm()
        message && Alert.success(message)
        fetch && fetch()
        handleClose(false)
      }
      else {
        Alert.error(SOMETHING_WENT_WRONG)
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const onSubmit: SubmitHandler<RoomFormType> = async (values) => {
    const { facility, name, number } = values;
    const { id: facilityId } = facility || {}
    try {
      if (isEdit && id) {
        await updateRoom({ variables: { updateRoomInput: { id, name, number, facilityId } } })
      } else {
        await createRoom({ variables: { createRoomInput: { name, number, facilityId } } })
      }
    } catch (error) { }
  }

  const fetchRoom = useCallback(async () => {
    try {
      id && await getRoom({ variables: { getRoomInput: { id } } })
    } catch (error) { }
  }, [id, getRoom])

  useEffect(() => {
    isEdit && id && fetchRoom()
  }, [isEdit, id, fetchRoom])

  const onClose = (_: object, reason: SideDrawerCloseReason) => {
    if (reason === 'escapeKeyDown') {
      handleClose(false)
    }
  }

  const cancelHandler = () => {
    isEdit && dispatcher && dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' })
    resetForm()
    handleClose(false)
  }

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{`${isEdit ? EDIT : ADD} ${ROOM_TEXT}`}</DialogTitle>
      {loading ? <TableLoader numberOfColumns={1} numberOfRows={2} /> :
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p={3}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <InputController controllerName='number' fieldType='number' disabled={loading} controllerLabel={NUMBER_TEXT} isRequired toUpperCase />
                </Grid>

                <Grid item xs={12}>
                  <InputController controllerName='name'  disabled={loading} controllerLabel={NAME} isRequired />
                </Grid>

                <Grid item xs={12}>
                  <FacilitySelector addEmpty label={FACILITY} name="facility"  disabled={loading} isRequired />
                </Grid>

              </Grid>
            </Box>

            <DialogActions>
              <Box display="flex" justifyContent="flex-end">
                <Box mr={2}>
                  <Button variant='outlined' disabled={loading} onClick={cancelHandler}>{CANCEL}</Button>
                </Box>
                <Box>
                  <Button type='submit' variant='contained' color='primary' disabled={loading}>{SUBMIT}</Button>
                </Box>
              </Box>
            </DialogActions>
          </form>
        </FormProvider>}
    </Dialog>
  )
}

export default RoomForm