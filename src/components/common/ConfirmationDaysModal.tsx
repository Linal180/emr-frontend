// packages block
import { useParams } from "react-router";
import { FC, useEffect } from "react";
import { useForm, useFieldArray } from 'react-hook-form'
import { Button, Dialog, DialogTitle, TextField, Box, Grid } from "@material-ui/core";
// components block
import Alert from "../common/Alert";
// interfaces, theme, utils and constants
import { useFacilityStyles } from '../../styles/facilityStyles'
import { AddTimeIcon, DeleteTimeIcon } from '../../assets/svgs'
import { ConfirmationDaysTypes, FacilityScheduleInputProps, ParamsType } from "../../interfacesTypes";
import { useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation } from "../../generated/graphql";
import {
  CANT_CREATE_SCHEDULE, CANT_UPDATE_SCHEDULE, SAVE_TEXT, SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_NOT_FOUND, SCHEDULE_UPDATED_SUCCESSFULLY, SERIAL_NO, TIME_FROM, TIME_TO
} from "../../constants";
type FormValues = {
  cart: {
    startAt: string;
    endAt: string;
  }[];
};

const ConfirmationModal: FC<ConfirmationDaysTypes> = ({ setOpen, isOpen, title, isEdit, id }): JSX.Element => {
  const { id: facilityId } = useParams<ParamsType>();
  const classes = useFacilityStyles()
  const methods = useForm<FormValues>({
    mode: "onBlur", defaultValues: {
      cart: []
    }
  });

  const { setValue, register, handleSubmit, control, watch } = methods;
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control
  });
  const watchFieldArray = watch("cart");

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

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
          // const { startAt, endAt } = schedule || {};
          // endAt && setValue('endAt', getISOTime(endAt))
          // startAt && setValue('startAt', getISOTime(startAt))
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

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const { cart } = data
    const facilitySchedule = cart.map(item => {
      const scheduleInput = {
        facilityId, servicesIds: [],
        startAt: item.startAt, endAt: item.endAt,
      };
      return (
        scheduleInput
      )
    })

    // if (facilityId) {
    //   if (isEdit) {
    //     id ?
    //       await updateSchedule({
    //         variables: {
    //           updateScheduleInput: { id, ...facilitySchedule }
    //         }
    //       }) : Alert.error(SCHEDULE_NOT_FOUND)
    //   } else {
    //     await createSchedule({
    //       variables: {
    //         createScheduleInput: { ...facilitySchedule }
    //       }
    //     })
    //   }
    // } else
    //   Alert.error(isEdit ? CANT_UPDATE_SCHEDULE : CANT_CREATE_SCHEDULE)
  };

  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  useEffect(() => {
    if (isEdit && id) {
      getSchedule({
        variables: { getSchedule: { id } }
      })
    }
  }, [getSchedule, id, isEdit])

  const disableSubmit = createScheduleLoading || updateScheduleLoading
  console.log('disableSubmit', disableSubmit);


  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth className={classes.disableBackdropStyle}>
      <DialogTitle id="alert-dialog-title"> {title}</DialogTitle>
      <Box pl={4} pr={2}>
        <Box className={classes.borderBottom}>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={1}>{SERIAL_NO}</Grid>
            <Grid item md={5}>{TIME_FROM}</Grid>
            <Grid item md={5}>{TIME_TO}</Grid>
          </Grid>
        </Box>

        <Box className={classes.borderBottom}>
          <Grid container spacing={3} alignItems="center">
            <Grid item md={1}>#</Grid>
            <Grid item md={5}>
              <TextField type='time' disabled name="startAt" />
            </Grid>

            <Grid item md={5}>
              <TextField type='time' disabled name="endAt" />
            </Grid>
            <Grid item md={1}>
              <Box onClick={() => append({ startAt: "", endAt: "" })} pt={3} className={classes.cursor}>
                <AddTimeIcon />
              </Box>

            </Grid>
          </Grid>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {controlledFields.map((field, index) => {
            return (
              <Box className={classes.borderBottom}>
                <Grid key={field.id} container spacing={3} alignItems="center">
                  <Grid item md={1}>{`${index + 1}`}</Grid>
                  <Grid item md={5}>
                    <input
                      type="time"
                      {...register(`cart.${index}.startAt` as const, {
                        required: true
                      })}
                      defaultValue={field.startAt}
                    />
                  </Grid>

                  <Grid item md={5}>
                    <input
                      placeholder="end date"
                      type="time"
                      {...register(`cart.${index}.endAt` as const, {
                        required: true
                      })}
                      defaultValue={field.endAt}
                    />
                  </Grid>

                  <Grid item md={1}>
                    <Box onClick={() => remove(index)} pt={3} pl={1} className={classes.cursor}>
                      <DeleteTimeIcon />
                    </Box>

                  </Grid>
                </Grid>
              </Box>
            )
          })}
          <Box pb={2} pt={2}>
            <Button type="submit" variant="contained" color="primary">
              {SAVE_TEXT}
            </Button>
          </Box>
        </form>
      </Box>
    </Dialog >
  );
};

export default ConfirmationModal;
