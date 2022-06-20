// package block
import { createRef, FC, useState } from 'react';
import { Box, Grid, List, ListItem, Typography } from '@material-ui/core';
import {
  Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator
} from '@material-ui/lab';
// component block
import FacilityInfoCard from './FacilityInfoCard';
import BusinessHoursCard from './BusinessHoursCard';
import BillingProfileCard from './BillingProfileCard';
import FacilityLocationCard from './FacilityLocationCard';
// utils. interfaces, constants
import { FacilityCardsProps } from '../../../../interfacesTypes';
import { useFacilityStyles } from '../../../../styles/facilityStyles';
import {
  FACILITY_LOCATION_ROUTE, FACILITY_SCHEDULE_ROUTE, FacilityMenuNav, FACILITY_LOCATION,
  BILLING_PROFILE, BILLING_PROFILE_ROUTE, BUSINESS_HOURS, FACILITY_INFO, FACILITY_INFO_ROUTE
} from '../../../../constants';

const RegisterFormComponent: FC<FacilityCardsProps> = ({ getFacilityLoading, dispatch, state, isSuper }) => {
  const classes = useFacilityStyles()
  const [activeBlock, setActiveBlock] = useState<string>(FacilityMenuNav[0].title)
  const patientCardBoxProps = { maxHeight: "calc(100vh - 210px)", className: "overflowY-auto" }

  const facilityInfoRef = createRef<HTMLDivElement>()
  const billingProfileRef = createRef<HTMLDivElement>()
  const facilityLocationRef = createRef<HTMLDivElement>()
  const businessHoursRef = createRef<HTMLDivElement>()

  const handleScroll = (moduleName: string) => {
    setActiveBlock(moduleName)
    switch (moduleName) {
      case FACILITY_INFO:
        return facilityInfoRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case BILLING_PROFILE:
        return billingProfileRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case FACILITY_LOCATION:
        return facilityLocationRef?.current?.scrollIntoView({ behavior: 'smooth' });
      case BUSINESS_HOURS:
        return businessHoursRef?.current?.scrollIntoView({ behavior: 'smooth' });
      default:
        break;
    }
  }

  return (
    <Box display='flex' position='relative'>
      <Box mr={2} ml={2} p={1} display='flex'>
        <List>
          {FacilityMenuNav.map((item, index) => {
            return (
              <Box display='flex' className={classes.patientTimeline} onClick={() => handleScroll(item.title)}>
                <Timeline>
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot className={item.title === activeBlock ? 'facilityActive' : ''} />

                      {(index + 1) !== FacilityMenuNav.length && <TimelineConnector />}
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
            <Grid md={12} id={FACILITY_INFO_ROUTE} ref={facilityInfoRef}>
              <FacilityInfoCard getFacilityLoading={getFacilityLoading} isSuper={isSuper} />
            </Grid>

            <Box pb={3} />

            <Grid md={12} id={BILLING_PROFILE_ROUTE} ref={billingProfileRef}>
              <BillingProfileCard getFacilityLoading={getFacilityLoading} state={state} dispatch={dispatch} />
            </Grid>

            <Box pb={3} />

            <Grid md={12} id={FACILITY_LOCATION_ROUTE} ref={facilityLocationRef}>
              <FacilityLocationCard getFacilityLoading={getFacilityLoading} state={state} dispatch={dispatch} />
            </Grid>

            <Box pb={3} />

            <Grid md={12} id={FACILITY_SCHEDULE_ROUTE} ref={businessHoursRef}>
              <BusinessHoursCard getFacilityLoading={getFacilityLoading} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default RegisterFormComponent;
