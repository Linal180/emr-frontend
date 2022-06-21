// packages block
import { FC, useCallback, useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, Box, Grid, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import DatePicker from "../../../common/DatePicker";
import PhoneField from "../../../common/PhoneInput";
import InputController from "../../../../controller";
import CardComponent from "../../../common/CardComponent";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
// interfaces/types block, theme, svgs and constants
import history from "../../../../history";
import { AuthContext, ListContext } from '../../../../context';
import { AddPatientModalProps, PatientInputProps } from "../../../../interfacesTypes";
import { checkPermission, getTimestampsForDob, isPracticeAdmin, isSuperAdmin } from "../../../../utils";
import {
  extendedPatientAppointmentSchema, extendedPatientAppointmentWithNonAdminSchema
} from "../../../../validationSchemas";
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, Pronouns, Race,
  RelationshipType, Sexualorientation, useCreatePatientMutation
} from "../../../../generated/graphql";
import {
  EMPTY_OPTION, PERMISSION_DENIED, USER_PERMISSIONS, CREATE_PATIENT, FIRST_NAME, LAST_NAME, EMAIL, SEX,
  MAPPED_GENDER_IDENTITY, DOB_TEXT, ADD_PATIENT, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  PATIENT_CREATED, HOME_PHONE, MOBILE_PHONE, CANCEL, SSN_FORMAT, APPOINTMENTS_ROUTE, FACILITY,
} from "../../../../constants";

const AddPatientModal: FC<AddPatientModalProps> = ({ isOpen, setIsOpen }): JSX.Element => {
  const { userPermissions, user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const { roles, facility } = user || {};

  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);
  const methods = useForm<PatientInputProps>({
    mode: "all",
    resolver: yupResolver((isSuper || isPracAdmin) ?
      extendedPatientAppointmentWithNonAdminSchema : extendedPatientAppointmentSchema)
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
          history.push(`${APPOINTMENTS_ROUTE}/new`)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<PatientInputProps> = async (inputs) => {
    const { firstName, lastName, dob, basicEmail, basicPhone, basicMobile, sexAtBirth, facilityId: userFacilityId } = inputs;

    if (user) {
      const { id: userId } = user;
      const { id: selectedSexAtBirth } = sexAtBirth;

      let practiceId = '';
      let facilityId = '';

      if (isSuper || isPracAdmin) {
        const { practiceId: pId } = facilityList?.find(f => f?.id === userFacilityId.id) || {};
        practiceId = pId || ''
        facilityId = userFacilityId.id || ''
      } else {
        const { id, practiceId: pId } = facility || {}
        practiceId = pId || ''
        facilityId = id || ''
      }

      const patientItemInput = {
        deceasedDate: '', registrationDate: '', statementNoteDateTo: '', statementNoteDateFrom: '',
        suffix: '', firstName, middleName: '', lastName, firstNameUsed: '', prefferedName: '', previousFirstName: '',
        facilityId: facilityId || '', callToConsent: false, privacyNotice: false, releaseOfInfoBill: false, practiceId,
        medicationHistoryAuthority: false, ethnicity: Ethnicity.None, homeBound: Homebound.No, 
        previouslastName: '', motherMaidenName: '', ssn: SSN_FORMAT, statementNote: '', language: '', patientNote: '',
        email: basicEmail, pronouns: Pronouns.None, race: Race.White, gender: Genderidentity.Male, 
        sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.Male, genderIdentity: Genderidentity.Male,
        maritialStatus: Maritialstatus.Single, sexualOrientation: Sexualorientation.None, 
        statementDelivereOnline: false, dob: dob ? getTimestampsForDob(dob) : '', holdStatement: Holdstatement.None,
      };

      const contactInput = {
        email: basicEmail, city: '', zipCode: '', state: '', facilityId, phone: basicPhone, 
        mobile: basicMobile, address2: '', address: '', contactType: ContactType.Self, 
        country: '', primaryContact: true,
      };

      const emergencyContactInput = {
        contactType: ContactType.Emergency, name: '', phone: '', mobile: '', primaryContact: false, 
        relationship: RelationshipType.Other,
      };

      const guarantorContactInput = {
        firstName: '', middleName: '', lastName: '', email: '', contactType: ContactType.Guarandor,
        relationship: RelationshipType.Other, employerName: '', address2: '', zipCode: '', city: '',
         state: '', phone: '', suffix: '', country: '', userId: userId, ssn: SSN_FORMAT, address: '',
         primaryContact: false, 
      };

      const guardianContactInput = {
        firstName: '', middleName: '', userId: userId, primaryContact: false, lastName: '', 
        contactType: ContactType.Guardian, suffix: '',
      };

      const nextOfKinContactInput = {
        contactType: ContactType.NextOfKin, name: '', phone: '', relationship: RelationshipType.Other, 
        mobile: '', primaryContact: false,
      };

      const employerInput = { name: '', email: '', phone: '', usualOccupation: '', industry: '' };

      await createPatient({
        variables: {
          createPatientInput: {
            createPatientItemInput: { ...patientItemInput },
            createContactInput: { ...contactInput },
            createEmployerInput: { ...employerInput },
            createGuardianContactInput: { ...guardianContactInput },
            createEmergencyContactInput: { ...emergencyContactInput },
            createGuarantorContactInput: { ...guarantorContactInput },
            createNextOfKinContactInput: { ...nextOfKinContactInput },
          }
        }
      })
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={ADD_PATIENT}>
            <Grid container spacing={3}>
              {(isSuper || isPracAdmin) && <Grid item md={6} sm={12} xs={12}>
                <FacilitySelector
                  isRequired
                  label={FACILITY}
                  name="facilityId"
                />
              </Grid>}

              <Grid item md={(isSuper || isPracAdmin) ? 6 : 12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="basicEmail"
                  controllerLabel={EMAIL}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="firstName"
                  controllerLabel={FIRST_NAME}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="lastName"
                  controllerLabel={LAST_NAME}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <DatePicker
                  isRequired
                  name="dob"
                  label={DOB_TEXT}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  name="sexAtBirth"
                  label={SEX}
                  value={EMPTY_OPTION}
                  options={MAPPED_GENDER_IDENTITY}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <PhoneField isRequired name="basicPhone" label={HOME_PHONE} />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <PhoneField name="basicMobile" label={MOBILE_PHONE} />
              </Grid>
            </Grid>
          </CardComponent>

          <Box pb={2} display='flex' justifyContent='flex-end' alignItems='center' pr={4}>
            <Button onClick={handleClose} color="default">
              {CANCEL}
            </Button>

            <Box p={1} />

            <Button type="submit" variant="contained" color="primary"
              disabled={createPatientLoading}
            >
              {CREATE_PATIENT}

              {createPatientLoading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default AddPatientModal;
