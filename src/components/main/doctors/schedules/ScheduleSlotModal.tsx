// packages block
import { Dispatch, FC, useContext, useEffect } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router";
import { Button, Dialog, DialogActions, Box, Grid } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import Alert from "../../../common/Alert";
// interfaces/types block, theme, svgs and constants
import { CANCEL, EMPTY_OPTION, PICK_DAY_TEXT, WEEK_DAYS, ADD_TEXT, APPOINTMENT_TYPE, LOCATIONS_TEXT, DOCTOR_CREATED, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, START_DATE, END_DATE } from "../../../../constants";
import { FacilityContext } from '../../../../context';
import { getTimestamps, renderLocations, renderServices } from "../../../../utils";
import { Action } from '../../../../reducers/doctorReducer';
import { ActionType } from "../../../../reducers/doctorReducer";
import { ScheduleInputProps, ParamsType } from "../../../../interfacesTypes";
import { useCreateScheduleMutation } from "../../../../generated/graphql";
import InputController from "../../../../controller";

interface DoctorScheduleModalProps {
  isOpen: boolean;
  doctorDispatcher: Dispatch<Action>;
  doctorFacilityId: string | undefined;
}

const DoctorScheduleModal: FC<DoctorScheduleModalProps> = ({ doctorDispatcher, isOpen, doctorFacilityId }): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { serviceList, locationList, fetchAllServicesList, fetchAllLocationList } = useContext(FacilityContext)
  const methods = useForm<ScheduleInputProps>({
    mode: "all",
  });
  const { reset, handleSubmit } = methods;

  const [createSchedule,] = useCreateScheduleMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createSchedule: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_CREATED);
          reset()
        }
      }
    }
  });



  const handleClose = () => {
    reset();
    doctorDispatcher({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: false })
  }

  useEffect(() => {
    fetchAllServicesList(doctorFacilityId)
    fetchAllLocationList(doctorFacilityId)
  }, [doctorFacilityId, fetchAllLocationList, fetchAllServicesList])

  const onSubmit: SubmitHandler<ScheduleInputProps> = async ({ endAt, locationId, servicesIds, startAt }) => {
    const { id: selectedLocation } = locationId || {}
    const { id: selectedService } = servicesIds || {}
    await createSchedule({
      variables: {
        createScheduleInput: {
          doctorId: id || "",
          locationId: selectedLocation || '',
          startAt: getTimestamps(startAt || ''),
          endAt: getTimestamps(endAt || ''),
          servicesIds: [selectedService] || ''
        }
      }
    })
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box ml={3} mr={3} pt={3}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  value={EMPTY_OPTION}
                  label={PICK_DAY_TEXT}
                  name="pickDay"
                  options={WEEK_DAYS}
                />

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      isRequired
                      fieldType="time"
                      controllerName="startAt"
                      controllerLabel={START_DATE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      isRequired
                      fieldType="time"
                      controllerName="endAt"
                      controllerLabel={END_DATE}
                    />
                  </Grid>
                </Grid>

                <Selector
                  isRequired
                  value={{ id: "", name: "" }}
                  label={LOCATIONS_TEXT}
                  name="locationId"
                  options={renderLocations(locationList)}
                />

                <Selector
                  isRequired
                  value={{ id: "", name: "" }}
                  label={APPOINTMENT_TYPE}
                  name="servicesIds"
                  options={renderServices(serviceList)}
                />

                <DialogActions>
                  <Box pr={1}>
                    <Button onClick={handleClose} color="default">
                      {CANCEL}
                    </Button>
                  </Box>

                  <Button color="primary" type="submit" variant="contained">
                    {ADD_TEXT}
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </Box>
        </form >
      </FormProvider>
    </Dialog>
  );
};

export default DoctorScheduleModal;