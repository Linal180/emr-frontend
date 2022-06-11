// package block
import { createRef, FC, useState } from 'react';
import { Box, Grid, List, ListItem, Typography } from '@material-ui/core';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
// component block
import GuarantorCard from './GuarantorCard';
import EmploymentCard from './EmploymentCard';
import ContactInfoCard from './ContactInfoCard';
import IdentificationCard from './IdentificationCard';
import PatientNextKinCard from './PatientNextKinCard';
import PatientPrivacyCard from './PatientPrivacyCard';
import PatientDemographicsCard from "./DemographicsCard";
import PatientGuardianCard from './PatientGuardianCard';
import EmergencyContactCard from './EmergencyContactCard';
import RegistrationDatesCard from './RegistrationDatesCard';
// utils. interfaces, constants
import { PatientCardsProps } from '../../../../interfacesTypes';
import { useFacilityStyles } from '../../../../styles/facilityStyles';
import {
  CONTACT_INFORMATION, CONTACT_INFORMATION_ROUTE, DEMOGRAPHICS, DEMOGRAPHICS_ROUTE, EMERGENCY_CONTACT, EMERGENCY_CONTACT_ROUTE,
  EMPLOYMENT, GUARANTOR, IDENTIFICATION, IDENTIFICATION_ROUTE, PRIVACY, PRIVACY__ROUTE, PROVIDER_REGISTRATION_DATES,
  PROVIDER_REGISTRATION__ROUTE, RegisterPatientMenuNav
} from '../../../../constants';

const RegisterFormComponent: FC<PatientCardsProps> = ({ getPatientLoading, dispatch, isEdit, state, shouldDisableEdit }) => {
  const classes = useFacilityStyles()
  const [activeBlock, setActiveBlock] = useState<string>(RegisterPatientMenuNav[0].title)

  const patientCardBoxProps = { maxHeight: "calc(100vh - 210px)", className: "overflowY-auto" }

  const identificationRef = createRef<HTMLDivElement>()
  const contactRef = createRef<HTMLDivElement>()
  const providerRegisterationRef = createRef<HTMLDivElement>()
  const privacyRef = createRef<HTMLDivElement>()
  const emergencyContactRef = createRef<HTMLDivElement>()
  const guarrenterRef = createRef<HTMLDivElement>()
  const employmentRef = createRef<HTMLDivElement>()
  const demographicsRef = createRef<HTMLDivElement>()

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
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Box mr={2} ml={2} p={1} width="100%" display='flex'>
            <List>
              {RegisterPatientMenuNav.map((item, index) => {
                return (
                  <Box display='flex' className={classes.patientTimeline} onClick={() => handleScroll(item.title)}>
                    <Timeline>
                      <TimelineItem>
                        <TimelineSeparator>
                          <TimelineDot className={item.title === activeBlock ? 'facilityActive' : ''} />

                          {(index + 1) !== RegisterPatientMenuNav.length && <TimelineConnector />}
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
        </Grid>

        <Grid item xs={12} sm={12} md={8} lg={9}>
          <Box   className='patient-add-form'>
            <Box {...patientCardBoxProps}>
              <Grid spacing={3}>
                <Grid md={12} id={IDENTIFICATION_ROUTE} ref={identificationRef}>
                  <IdentificationCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={DEMOGRAPHICS_ROUTE} ref={demographicsRef}>
                  <PatientDemographicsCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} shouldDisableEdit={shouldDisableEdit} />
                </Grid>

                <Box pb={3} />

                <Grid md={12} id={CONTACT_INFORMATION_ROUTE} ref={contactRef} onTouchMove={() => setActiveBlock(CONTACT_INFORMATION)} >
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

                  <Box pb={3} />

                  <GuarantorCard getPatientLoading={getPatientLoading} state={state} dispatch={dispatch} shouldDisableEdit={shouldDisableEdit} />

                  <Box pb={3} />

                  <EmploymentCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* <Box position='relative'>


        
      </Box> */}
    </>
  )
}

export default RegisterFormComponent;
