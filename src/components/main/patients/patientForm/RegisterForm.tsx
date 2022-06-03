// package block
import { FC } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { Box, Typography, List, ListItem, Grid, } from '@material-ui/core';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';

// component block
import GuarantorCard from './GuarantorCard';
import EmploymentCard from './EmploymentCard';
import ContactInfoCard from './ContactInfoCard';
import IdentificationCard from './IdentificationCard';
import PatientPrivacyCard from './PatientPrivacyCard';
import PatientNextKinCard from './PatientNextKinCard';
import PatientGuardianCard from './PatientGuardianCard';
import PatientDemographicsCard from "./DemographicsCard";
import EmergencyContactCard from './EmergencyContactCard';
import RegistrationDatesCard from './RegistrationDatesCard';

// constants, interfaces block, styles
import history from '../../../../history';
import { PatientCardsProps } from '../../../../interfacesTypes';
import { useFacilityStyles } from '../../../../styles/facilityStyles';
import {
  BUSINESS_HOURS, RegisterPatientMenuNav, EMPLOYMENT_ROUTE, IDENTIFICATION_ROUTE, CONTACT_INFORMATION_ROUTE, DEMOGRAPHICS_ROUTE,
  PROVIDER_REGISTRATION__ROUTE, PRIVACY__ROUTE, EMERGENCY_CONTACT_ROUTE, GUARANTOR_ROUTE,
} from '../../../../constants';

const RegisterFormComponent: FC<PatientCardsProps> = ({ getPatientLoading, dispatch, isEdit, state, shouldShowBread = true }) => {
  const classes = useFacilityStyles()
  const methods = useForm({
    mode: "all",
  });
  const path = history.location?.hash;

  return (
    <FormProvider {...methods}>
      <form>
        <Box display='flex' position='relative'>
          <Box mr={2} ml={2} p={1} display='flex'>
            <List>
              {RegisterPatientMenuNav.map((item) => {
                return (
                  <a href={`#${item.linkTo}`} className={`#${item.linkTo}` === path ? 'active' : ''}>
                    <Box display='flex' className={classes.patientTimeline}>
                      <Timeline>
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot className={`#${item.linkTo}` === path ? 'facilityActive' : ''} />

                            {item.title !== BUSINESS_HOURS && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent />
                        </TimelineItem>
                      </Timeline>

                      <ListItem button className={`#${item.linkTo}` === path ? 'active' : ''} style={{ display: 'flex', alignItems: 'baseline' }}>
                        <Typography variant='h5'>
                          {item.title}
                        </Typography>
                      </ListItem>
                    </Box>
                  </a>
                )
              })}
            </List>
          </Box>

          <Box width='100%'>
            <Box maxHeight="calc(100vh - 190px)" className="overflowY-auto">
              <Grid spacing={3}>
                <Grid md={12} id={IDENTIFICATION_ROUTE}>
                  <IdentificationCard getPatientLoading={getPatientLoading} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={CONTACT_INFORMATION_ROUTE}>
                  <ContactInfoCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={PROVIDER_REGISTRATION__ROUTE}>
                  <RegistrationDatesCard getPatientLoading={getPatientLoading} isEdit={isEdit} state={state} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={PRIVACY__ROUTE}>
                  <PatientPrivacyCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={EMERGENCY_CONTACT_ROUTE}>
                  <EmergencyContactCard getPatientLoading={getPatientLoading} />

                  <Box pb={3} />

                  <PatientNextKinCard getPatientLoading={getPatientLoading} />

                  <Box pb={3} />

                  <PatientGuardianCard getPatientLoading={getPatientLoading} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={GUARANTOR_ROUTE}>
                  <GuarantorCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={EMPLOYMENT_ROUTE}>
                  <EmploymentCard getPatientLoading={getPatientLoading} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={DEMOGRAPHICS_ROUTE}>
                  <PatientDemographicsCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} />
                </Grid>

                <Box pb={25} />
              </Grid>
            </Box>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default RegisterFormComponent;