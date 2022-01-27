// packages block
import { ChangeEvent, useEffect, useState } from "react";
import moment from "moment";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Avatar, Box, Grid, Tab } from "@material-ui/core";
// components block
// constants, history, styling block
import history from "../../../../history";
import { DOCTORS_ROUTE, DOCTOR_TOP_TABS } from "../../../../constants";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { Doctor, useGetDoctorLazyQuery } from "../../../../generated/graphql";
import { AtIcon, HashIcon, LocationIcon, ProfileUserIcon } from "../../../../assets/svgs";
import { useParams } from "react-router";
import { ParamsType } from "../../../../interfacesTypes";
import Alert from "../../../common/Alert";
import { getDate, getFormattedDate } from "../../../../utils";
import DoctorScheduleForm from "../schedules/ScheduleForm";

const DoctorDetailComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const { id } = useParams<ParamsType>();
  const [value, setValue] = useState('1');
  const [doctor, setDoctor] = useState<Doctor | null>();

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const [getDoctor] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
      history.push(DOCTORS_ROUTE)
    },

    onCompleted(data) {
      const { getDoctor: { response, doctor } } = data;

      if (response) {
        const { status } = response

        if (doctor && status && status === 200) {
          setDoctor(doctor)
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      getDoctor({
        variables: {
          getDoctor: {
            id
          }
        }
      })
    } else {
      Alert.error('Doctor not found!')
    }
  }, [getDoctor, id])

  const { firstName, lastName, dob, contacts, createdAt } = doctor || {}
  const selfContact = contacts?.filter(item => item.primaryContact)

  const DOCTOR_AGE = moment().diff(getDate(dob || ''), 'years');

  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""
  console.log(contacts && contacts)
  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = phone || "--"
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
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="Profile top tabs">
          {DOCTOR_TOP_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>

        <Box className={classes.profileDetailsContainer}>
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
              {/* APPOINTMENT LIST FOR CURRENT DOCTOR */}
            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Grid container spacing={3}>
              <DoctorScheduleForm />
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  )
}

export default DoctorDetailComponent;
