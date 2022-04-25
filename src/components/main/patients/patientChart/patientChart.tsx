// packages block
import moment from "moment";
import { useState } from "react";
import { Avatar, Box, Button, Card, Grid, } from "@material-ui/core";
// components block
import Search from "../../../common/Search";
import PatientChartCards from "./patientChartCards";
// constants, history, styling block
// import { Search } from "@material-ui/icons";
import { getDate } from "../../../../utils";
import { GRAY, } from "../../../../theme";
import { Patient } from "../../../../generated/graphql";
import { ProfileUserIcon } from "../../../../assets/svgs";
import { SEARCH_PLACEHOLDER } from "../../../../constants";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";

const PatientDetailsComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const [patientData] = useState<Patient | null>();
  const { firstName, lastName, dob, doctorPatients } = patientData || {}
  const PATIENT_AGE = moment().diff(getDate(dob || ''), 'years');

  const ProfileDetails = [
    {
      icon: ProfileUserIcon(),
      description: `${PATIENT_AGE} Yrs Old`
    },
  ]

  let providerName = "hello world"

  if (doctorPatients) {
    const currentDoctor = doctorPatients.map(doctorPatient => {
      if (doctorPatient.currentProvider) {
        return doctorPatient.doctor
      }

      return null
    })[0];

    if (currentDoctor) {
      const { firstName, lastName } = currentDoctor || {};
      providerName = `${firstName} ${lastName}` || "--"
    }
  }

  const ProfileAdditionalDetails = [
    {
      title: "Primary Provider",
      description: providerName
    },
  ]
  const search = (query: string) => { }

  return (
    <Box className={classes.profileDetailsContainer}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box className={classes.profileCard}>
            <Box display="flex" alignItems="center">
              <Box pl={1}>
                <Box pr={3.75}>
                  <Avatar variant="square" src='' className={classes.profileImage} />
                </Box>
              </Box>
            </Box>

            <Box flex={1}>
              <Box display="flex">
                <Box flex={1}>
                  <Box display="flex" alignItems="center" className={classes.userName}>
                    {`${firstName} ${lastName}`}
                  </Box>

                  <Box display="flex" width="100%" pt={1} flexWrap="wrap">
                    {ProfileDetails.map((item, index) => (
                      <Box display="flex" key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                        <Box>{item.icon}</Box>
                        <Box>{item.description}</Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Box display="flex" pr={3}>
                  {ProfileAdditionalDetails.map((item, index) => (
                    <Box textAlign="right" key={`${item.title}-${index}`}>
                      <Box className={classes.profileInfoHeading}>{item.title}</Box>
                      <Box>{item.description}</Box>
                    </Box>
                  ))}
                </Box>

                <Button color="secondary" variant="contained">Schedule Appointment</Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item md={8} sm={12} xs={12}>
          <Box mr={1}>
            <Card>
              <Box px={3} py={2} boxShadow={`${GRAY}`} borderRadius={6} display="flex" justifyContent="space-between" alignItems="center">
                <Box maxWidth={450}>
                  <Search search={search} />
                </Box>

                <Button variant="contained" color="inherit" className="muted">{SEARCH_PLACEHOLDER}</Button>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <PatientChartCards />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PatientDetailsComponent;
