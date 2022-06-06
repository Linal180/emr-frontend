// package block
import { Box, Grid, List, ListItem, Typography } from '@material-ui/core';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import React, { FC, useState } from 'react';
import { CONTACT_INFORMATION, CONTACT_INFORMATION_ROUTE, DEMOGRAPHICS, DEMOGRAPHICS_ROUTE, EMERGENCY_CONTACT, EMERGENCY_CONTACT_ROUTE, EMPLOYMENT, EMPLOYMENT_ROUTE, GUARANTOR, GUARANTOR_ROUTE, IDENTIFICATION, IDENTIFICATION_ROUTE, PRIVACY, PRIVACY__ROUTE, PROVIDER_REGISTRATION_DATES, PROVIDER_REGISTRATION__ROUTE, RegisterPatientMenuNav } from '../../../../constants';
import { PatientCardsProps } from '../../../../interfacesTypes';
import { useFacilityStyles } from '../../../../styles/facilityStyles';
import ContactInfoCard from './ContactInfoCard';
import PatientDemographicsCard from "./DemographicsCard";
import EmergencyContactCard from './EmergencyContactCard';
import EmploymentCard from './EmploymentCard';
// component block
import GuarantorCard from './GuarantorCard';
import IdentificationCard from './IdentificationCard';
import PatientGuardianCard from './PatientGuardianCard';
import PatientNextKinCard from './PatientNextKinCard';
import PatientPrivacyCard from './PatientPrivacyCard';
import RegistrationDatesCard from './RegistrationDatesCard';

const RegisterFormComponent: FC<PatientCardsProps> = ({ getPatientLoading, dispatch, isEdit, state, shouldDisableEdit }) => {
  const classes = useFacilityStyles()
  const [activeBlock, setActiveBlock] = useState<string>(RegisterPatientMenuNav[0].title)

  const patientCardBoxProps = { maxHeight: "calc(100vh - 210px)", className: "overflowY-auto" }

  const identificationRef = React.createRef<HTMLDivElement>()
  const contactRef = React.createRef<HTMLDivElement>()
  const providerRegisterationRef = React.createRef<HTMLDivElement>()
  const privacyRef = React.createRef<HTMLDivElement>()
  const emergencyContactRef = React.createRef<HTMLDivElement>()
  const guarrenterRef = React.createRef<HTMLDivElement>()
  const employmentRef = React.createRef<HTMLDivElement>()
  const demographicsRef = React.createRef<HTMLDivElement>()

  const handleScroll = (moduleName: string) => {
    setActiveBlock(moduleName)
    switch (moduleName) {
      case IDENTIFICATION:
        return identificationRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case CONTACT_INFORMATION:
        return contactRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case PROVIDER_REGISTRATION_DATES:
        return providerRegisterationRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case PRIVACY:
        return privacyRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case EMERGENCY_CONTACT:
        return emergencyContactRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case GUARANTOR:
        return guarrenterRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case EMPLOYMENT:
        return employmentRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case DEMOGRAPHICS:
        return demographicsRef?.current?.scrollIntoView({ behavior: 'smooth' });
      default:
        break;
    }
  }

  return (
    <Box display='flex' position='relative'>
      <Box mr={2} ml={2} p={1} display='flex'>
        <List>
          {RegisterPatientMenuNav.map((item,index) => {
            return (
              <Box display='flex' className={classes.patientTimeline} onClick={() => handleScroll(item.title)}>
                <Timeline>
                  <TimelineItem>
                    <TimelineSeparator >
                      <TimelineDot className={item.title === activeBlock ? 'facilityActive' : ''} />

                      {(index+1) !== RegisterPatientMenuNav.length && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent />
                  </TimelineItem>
                </Timeline>

                <ListItem button className={item.title === activeBlock ? 'active' : ''} style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant='h5' className={item.title === activeBlock ? 'active' : ''}>
                    {item.title}
                  </Typography>
                </ListItem>
              </Box>
            )
          })}
        </List>
      </Box>

      <Box width='100%'>
        <Box {...patientCardBoxProps}>
          <Grid spacing={3}>
            <Grid md={12} id={IDENTIFICATION_ROUTE} ref={identificationRef}>
              <IdentificationCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
            </Grid>


            <Box pb={3} />
            <Grid md={12} id={CONTACT_INFORMATION_ROUTE} ref={contactRef}>
              <ContactInfoCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} shouldDisableEdit={shouldDisableEdit} />
            </Grid>


            <Box pb={3} />
            <Grid md={12} id={PROVIDER_REGISTRATION__ROUTE} ref={providerRegisterationRef}>
              <RegistrationDatesCard getPatientLoading={getPatientLoading} isEdit={isEdit} state={state} shouldDisableEdit={shouldDisableEdit} />
            </Grid>


            <Box pb={3} />
            <Grid md={12} id={PRIVACY__ROUTE} ref={privacyRef}>
              <PatientPrivacyCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} shouldDisableEdit={shouldDisableEdit} />
            </Grid>

            <Box pb={3} />
            <Grid md={12} id={EMERGENCY_CONTACT_ROUTE} ref={emergencyContactRef}>
              <EmergencyContactCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />

              <Box pb={3} />

              <PatientNextKinCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />

              <Box pb={3} />

              <PatientGuardianCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
            </Grid>

            <Box pb={3} />
            <Grid md={12} id={GUARANTOR_ROUTE} ref={guarrenterRef}>
              <GuarantorCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} shouldDisableEdit={shouldDisableEdit} />
            </Grid>

            <Box pb={3} />
            <Grid md={12} id={EMPLOYMENT_ROUTE} ref={employmentRef}>
              <EmploymentCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
            </Grid>

            <Box pb={3} />
            <Grid md={12} id={DEMOGRAPHICS_ROUTE} ref={demographicsRef}>
              <PatientDemographicsCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} shouldDisableEdit={shouldDisableEdit} />
            </Grid>

            <Box pb={25} />
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default RegisterFormComponent;