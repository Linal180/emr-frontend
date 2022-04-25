// packages block
import { useParams } from "react-router";
import { FC, useCallback, useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, Box, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import CardComponent from "../../../common/CardComponent";
// import ViewDataLoader from "../../../common/ViewDataLoader";
// interfaces/types block, theme, svgs and constants
import { AuthContext, FacilityContext } from '../../../../context';
import { doctorScheduleSchema } from "../../../../validationSchemas";
import { ScheduleInputProps, ParamsType, AddPatientModalProps } from "../../../../interfacesTypes";
import { checkPermission } from "../../../../utils";
import { useCreatePatientMutation } from "../../../../generated/graphql";
import {
  EMPTY_OPTION, PERMISSION_DENIED, USER_PERMISSIONS, CREATE_PATIENT, FIRST_NAME, LAST_NAME, EMAIL, SEX, MAPPED_GENDER_IDENTITY, DOB_TEXT, ADD_PATIENT, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_CREATED,
} from "../../../../constants";
import InputController from "../../../../controller";
import DatePicker from "../../../common/DatePicker";

const AddPatientModal: FC<AddPatientModalProps> = ({ isOpen, setIsOpen }): JSX.Element => {
  const { id: doctorId } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)
  const { serviceList } = useContext(FacilityContext)
  const methods = useForm<ScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(doctorScheduleSchema)
  });
  const { reset, handleSubmit } = methods;

  const handleClose = useCallback(() => {
    reset();
    setIsOpen(false)
  }, [setIsOpen, reset])

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createAppointment)) {
      Alert.error(PERMISSION_DENIED)
      handleClose();
    }
  }, [handleClose, userPermissions]);


  const [createPatient, { loading: createPatientLoading }] = useCreatePatientMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createPatient: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(PATIENT_CREATED);
          setIsOpen(false)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<any> = async () => {

    // const patientInput = {

    // };
    // await createPatient({
    //   variables: {
    //     createPatientInput: [{ ...patientInput }]
    //   }
    // })
  }


  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={ADD_PATIENT}>
            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="firstName"
                  controllerLabel={FIRST_NAME}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="lastName"
                  controllerLabel={LAST_NAME}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="email"
                  controllerLabel={EMAIL}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <Selector
                  name="sexAtBirth"
                  label={SEX}
                  value={EMPTY_OPTION}
                  options={MAPPED_GENDER_IDENTITY}
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <DatePicker
                  isRequired
                  name="dob"
                  label={DOB_TEXT}
                />
              </Grid>
            </Grid>
          </CardComponent>

          <Box mb={3} display="flex" justifyContent="flex-end" pr={4}>

            <Button variant="contained" type="submit" color="primary" disabled={createPatientLoading}>{CREATE_PATIENT}</Button>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default AddPatientModal;
