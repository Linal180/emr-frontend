// package block
import { FC } from "react";
import { Box, Grid } from "@material-ui/core";
// component block
import GuarantorCard from "./GuarantorCard";
import EmploymentCard from "./EmploymentCard";
import ContactInfoCard from "./ContactInfoCard";
import IdentificationCard from "./IdentificationCard";
import PatientNextKinCard from "./PatientNextKinCard";
import PatientPrivacyCard from "./PatientPrivacyCard";
import PatientGuardianCard from "./PatientGuardianCard";
import PatientDemographicsCard from "./DemographicsCard";
import EmergencyContactCard from "./EmergencyContactCard";
import RegistrationDatesCard from "./RegistrationDatesCard";
// constants, interfaces block
import { PatientCardsProps } from "../../../../interfacesTypes";

const FormCard: FC<PatientCardsProps> = ({ getPatientLoading, dispatch, isEdit, state, shouldShowBread = true }) => {
  const patientCardBoxProps = shouldShowBread
    ? { maxHeight: "calc(100vh - 210px)", className: "overflowY-auto" } : {}

  return (
    <Box {...patientCardBoxProps}>
      <Grid container spacing={3}>
        <Grid md={6} item>
          <IdentificationCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />
          <ContactInfoCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />

          <Box pb={3} />
          <EmergencyContactCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />
          <PatientNextKinCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />
          <PatientGuardianCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />
          <PatientDemographicsCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
        </Grid>

        <Grid md={6} item>
          <RegistrationDatesCard getPatientLoading={getPatientLoading} isEdit={isEdit} state={state} />

          <Box pb={3} />
          <PatientPrivacyCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />

          <Box pb={3} />
          <EmploymentCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />
          <GuarantorCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default FormCard;
