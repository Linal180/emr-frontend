// packages block
import { useParams } from "react-router";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'
import { Button, Dialog, DialogTitle, TextField, Box, Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core";
// components block
import Alert from "../common/Alert";
// interfaces, theme, utils and constants
import { renderTh, getISOTime } from '../../utils'
import { useFacilityStyles } from '../../styles/facilityStyles'
import { AddTimeIcon, DeleteTimeIcon } from '../../assets/svgs'
import { ConfirmationDaysTypes, WeekTimeItem, FacilityScheduleInputProps, ParamsType } from "../../interfacesTypes";
import { useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation } from "../../generated/graphql";
import {
  CANT_CREATE_SCHEDULE, CANT_UPDATE_SCHEDULE, SAVE_TEXT, SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_NOT_FOUND, SCHEDULE_UPDATED_SUCCESSFULLY, SERIAL_NO, TIME_FROM, TIME_TO
} from "../../constants";

const ConfirmationModal: FC<ConfirmationDaysTypes> = ({ setOpen, isOpen, title, isEdit, id }): JSX.Element => {
  const { facilityId } = useParams<ParamsType>();
  const [list, setList] = useState<WeekTimeItem[]>([])
  const classes = useFacilityStyles()
  const methods = useForm<FacilityScheduleInputProps>({ mode: "all" });
  const { setValue } = methods;
  let count = 0

  const [getSchedule] = useGetScheduleLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getSchedule: { response, schedule } } = data;

      if (response) {
        const { status } = response

        if (schedule && status && status === 200) {

          const { startAt, endAt } = schedule || {};

          endAt && setValue('endAt', getISOTime(endAt))
          startAt && setValue('startAt', getISOTime(startAt))
        }
      }
    }
  });

  const [createSchedule, { loading: createScheduleLoading }] = useCreateScheduleMutation({
    onError({ message }) {
      Alert.error(message)
      handleClose()
    },

    onCompleted(data) {
      const { createSchedule: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(SCHEDULE_CREATED_SUCCESSFULLY);
          handleClose()
        }
      }
    }
  });

  const [updateSchedule, { loading: updateScheduleLoading }] = useUpdateScheduleMutation({
    onError({ message }) {
      Alert.error(message)
      handleClose()
    },

    onCompleted(data) {
      const { updateSchedule: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(SCHEDULE_UPDATED_SUCCESSFULLY);
          handleClose()
        }
      }
    }
  });

  const onSubmit: SubmitHandler<FacilityScheduleInputProps> = async ({ endAt, serviceId, startAt }) => {
    const scheduleInput = {
      facilityId, servicesIds: [],
      startAt: getISOTime(startAt), endAt: getISOTime(endAt),
    };
    if (facilityId) {
      if (isEdit) {
        id ?
          await updateSchedule({
            variables: {
              updateScheduleInput: { id, ...scheduleInput }
            }
          }) : Alert.error(SCHEDULE_NOT_FOUND)
      } else {
        await createSchedule({
          variables: {
            createScheduleInput: { ...scheduleInput }
          }
        })
      }
    } else
      Alert.error(isEdit ? CANT_UPDATE_SCHEDULE : CANT_CREATE_SCHEDULE)
  };

  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  const handleChange = (value: string, id: WeekTimeItem['id']) => {
    setList(prev => prev.map(item => item.id === id ? { ...item, value } : item))
  }

  const handleDelete = (id: WeekTimeItem['id']) => {
    setList(prev => prev.filter(item => item.id !== id))
  }

  const handleAdd = (index: number) => {
    const newItem = { id: count++, value: '' }
    setList(prev => [...prev.slice(0, index + 1), newItem, ...prev.slice(index + 1)])
  }

  useEffect(() => {
    if (isEdit && id) {
      getSchedule({
        variables: { getSchedule: { id } }
      })
    }
  }, [getSchedule, id, isEdit])

  const disableSubmit = createScheduleLoading || updateScheduleLoading

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth className={classes.disableBackdropStyle}>
      <DialogTitle id="alert-dialog-title"> {title}</DialogTitle>
      <Box>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(SERIAL_NO)}
              {renderTh(TIME_FROM)}
              {renderTh(TIME_TO)}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <TextField type='time' disabled />
              </TableCell>

              <TableCell>
                <TextField type='time' disabled />
              </TableCell>

              <Box onClick={() => handleAdd(0)} pt={3} className={classes.cursor}>
                <AddTimeIcon />
              </Box>

            </TableRow>
            {list.map((item, index) => (
              <TableRow key={index}>
                <TableCell scope="row">{`${item.id + 1}`}</TableCell>
                <TableCell scope="row">
                  <TextField type='time' value={item.value} onChange={e => handleChange(e.currentTarget.value, item.id)} />
                </TableCell>

                <TableCell scope="row">
                  <TextField type='time' value={item.value} onChange={e => handleChange(e.currentTarget.value, item.id)} />
                </TableCell>

                <Box onClick={() => handleDelete(item.id)} pt={3} pl={1} className={classes.cursor}>
                  <DeleteTimeIcon />
                </Box>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box pl={2} pt={4} pb={2}>
        <Button type="submit" variant="contained" color="primary" disabled={disableSubmit}>
          {SAVE_TEXT}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
