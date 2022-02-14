// packages block
import { ChangeEvent, useEffect, Reducer, useReducer } from "react";
import moment from "moment";
import { useParams } from "react-router";
import { Avatar, Box, Grid, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
// components block
import Alert from "../../../common/Alert";
import DoctorScheduleForm from "../schedules";
// constants, history, styling block
import history from "../../../../history";
import { ParamsType } from "../../../../interfacesTypes";
import { formatPhone, getDate, getFormattedDate } from "../../../../utils";
import { useGetDoctorLazyQuery } from "../../../../generated/graphql";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { DOCTORS_ROUTE, DOCTOR_NOT_FOUND, DOCTOR_TOP_TABS } from "../../../../constants";
import { AtIcon, HashIcon, LocationIcon, ProfileUserIcon } from "../../../../assets/svgs";
import {
  doctorReducer, Action, initialState, State, ActionType
} from '../../../../reducers/doctorReducer';
import AppointmentsTable from "../../../common/AppointmentsTable";

const DoctorDetailComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { doctorFacilityId, currentTab, doctor } = state;

  const handleChange = (_: ChangeEvent<{}>, value: string) => dispatch({
    type: ActionType.SET_CURRENT_TAB, currentTab: value
  })

  const [getDoctor] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
      history.push(DOCTORS_ROUTE)
    },

    onCompleted(data) {
      const { getDoctor: { doctor } } = data;

      if (doctor) {
        const { facilityId } = doctor;
        dispatch({ type: ActionType.SET_DOCTOR, doctor })
        facilityId && dispatch({ type: ActionType.SET_DOCTOR_FACILITY_ID, doctorFacilityId: facilityId })
      }
    }
  });

  useEffect(() => {
    if (id) {
      getDoctor({
        variables: {
          getDoctor: { id }
        }
      })
    } else
      Alert.error(DOCTOR_NOT_FOUND)
  }, [getDoctor, id])

  const { firstName, lastName, dob, contacts, createdAt } = doctor || {}
  const selfContact = contacts?.filter(item => item.primaryContact)
  const DOCTOR_AGE = moment().diff(getDate(dob || ''), 'years');

  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""
  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = formatPhone(phone || '') || "--"
    selfEmail = email || "--"
    selfCurrentLocation = `${country} ${state}` || "--"
  }

  const ProfileDetails = [
    {
      icon: ProfileUserIcon(),
      description: `${DOCTOR_AGE} Yrs Old`
    },
    {
      icon: HashIcon(),
      description: selfPhoneNumber
    },
    {
      icon: AtIcon(),
      description: selfEmail
    },
    {
      icon: LocationIcon(),
      description: selfCurrentLocation
    },
  ]

  let providerDateAdded = createdAt ? getFormattedDate(createdAt || '') : '--'

  const ProfileAdditionalDetails = [
    {
      title: "Date Added",
      description: providerDateAdded
    },
    {
      title: "Last Scheduled Appointment",
      description: "Wed Jul 25, 2018"
    },
    {
      title: "Next Scheduled Appointment",
      description: "Thu Nov 18, 2021"
    },
  ]

  return (
    <Box>
      <TabContext value={currentTab}>
        <TabList onChange={handleChange} aria-label="Profile top tabs">
          {DOCTOR_TOP_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>

        <Box className={`${classes.profileDetailsContainer} overflowY-auto`} maxHeight="calc(100vh - 248px)">
          <Box className={classes.profileCard}>
            <Box pr={3.75}>
              <Avatar variant="square" src="" className={classes.profileImage}></Avatar>
            </Box>

            <Box flex={1}>
              <Box display="flex">
                <Box flex={1}>
                  <Box display="flex" alignItems="center" className={classes.userName}>
                    {`${firstName} ${lastName}`}
                  </Box>

                  <Box display="flex" width="100%" maxWidth={650} pt={1} flexWrap="wrap">
                    {ProfileDetails.map((item, index) => (
                      <Box display="flex" key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                        <Box>{item.icon}</Box>
                        <Box>{item.description}</Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box display="flex" pt={3}>
                {ProfileAdditionalDetails.map((item, index) => (
                  <Box key={`${item.title}-${index}`} className={classes.profileAdditionalInfo}>
                    <Box className={classes.profileInfoHeading}>{item.title}</Box>
                    <Box>{item.description}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <TabPanel value="1">
            <Grid container spacing={3}>

            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Grid spacing={3}>
              <DoctorScheduleForm doctorFacilityId={doctorFacilityId} />
            </Grid>
          </TabPanel>

          <TabPanel value="3">
            <Grid>
              <AppointmentsTable doctorId={id} />
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  )
}

export default DoctorDetailComponent;
