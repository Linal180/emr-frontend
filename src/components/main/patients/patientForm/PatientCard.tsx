//package import
import { Box, Grid } from "@material-ui/core";
import { FC } from "react";
//component props
import PatientContactInfoCard from "./PatientContactInfoCard";
import PatientDemographicsCard from "./PatientDemographicsCard";
import PatientEmergencyContactCard from "./PatientEmergencyContactCard";
import PatientEmploymentCard from "./PatientEmploymentCard";
import PatientGuarantorCard from "./PatientGuarantorCard";
import PatientGuardianCard from "./PatientGuardianCard";
import PatientIdentificationCard from "./PatientIdentificationCard";
import PatientNextKinCard from "./PatientNextKinCard";
import PatientPrivacyCard from "./PatientPrivacyCard";
import PatientRegistrationDatesCard from "./PatientRegistrationDatesCard";
//constants, interfaces imports
import { PatientCardsProps } from "../../../../interfacesTypes";

const PatientCard: FC<PatientCardsProps> = ({ getPatientLoading, dispatch, isEdit, state, shouldShowBread=true }) => {
  const patientCardBoxProps = shouldShowBread ? { maxHeight: "calc(100vh - 210px)", className: "overflowY-auto" } : {}
  return (
    <Box {...patientCardBoxProps}>
      <Grid container spacing={3}>
        <Grid md={6} item>
          <PatientIdentificationCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />

          <PatientContactInfoCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />

          <Box pb={3} />

          <PatientEmergencyContactCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />

          <PatientNextKinCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />

          <PatientGuardianCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />

          <PatientDemographicsCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
        </Grid>

        <Grid md={6} item>
          <PatientRegistrationDatesCard getPatientLoading={getPatientLoading} isEdit={isEdit} state={state} />

          <Box pb={3} />

          <PatientPrivacyCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />

          <Box pb={3} />

          <PatientEmploymentCard getPatientLoading={getPatientLoading} />

          <Box pb={3} />

          <PatientGuarantorCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PatientCard