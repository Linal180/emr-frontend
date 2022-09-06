// packages block
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
// components block
import PageHeader from "../../common/PageHeader";
import CardComponent from "../../common/CardComponent";
// constants block
import { AuthContext } from "../../../context";
import { isBiller, isFacilityAdmin, isOnlyDoctor, isSuperAdmin } from "../../../utils";
import {
  PRACTICE_MANAGEMENT_DESCRIPTION, PRACTICE_DETAILS, PROVIDER_DETAILS, PROVIDER_DETAILS_DESCRIPTION,
  CALENDAR_SETTINGS_TEXT, FACILITY_SERVICES_DESCRIPTION, FACILITY_SERVICES_TEXT, PROVIDER_MANAGEMENT,
  PRACTICE_MANAGEMENT_TEXT, PRACTICE_MANAGEMENT_ROUTE, MISCELLANEOUS_SETTINGS_ITEMS, PRACTICE_SETTINGS,
  PRACTICE_SETTINGS_ITEMS, SERVICES, USERS_MANAGEMENT, USER_MENU_ITEMS, FACILITIES_ROUTE, SETTINGS_TEXT,
  FACILITY_DETAILS_TEXT, FACILITY_DETAILS_DESCRIPTION, PROVIDER_PROFILE_DESCRIPTION, CLINICAL_TEXT,
  DOCTORS_ROUTE, FACILITY_MANAGEMENT, FACILITY_SERVICES_ROUTE, FACILITY_SCHEDULE, FACILITY_SCHEDULE_DESCRIPTION,
  DOCTOR_PROFILE_TEXT, CLINICAL_ITEMS, MISCELLANEOUS_SETTINGS, FFE_SCHEDULE, CLAIM_STATUSES,

} from "../../../constants";
import { useSettingStyles } from "../../../styles/settingStyles";

export const SettingsComponent = () => {
  const { user, currentDoctor, userPermissions } = useContext(AuthContext)
  const classes = useSettingStyles()
  const { roles, facility, } = user || {}
  const { id: facilityId } = facility || {}
  const isSuper = isSuperAdmin(roles)
  const isBillerUser = isBiller(roles)

  const isFacility = isFacilityAdmin(roles)
  const isDoctor = isOnlyDoctor(roles)
  const { id: doctorId } = currentDoctor || {}

  const PRACTICE_SETTINGS_ITEMS_FILTERED = isBillerUser ? PRACTICE_SETTINGS_ITEMS.filter((item) => item.name === FFE_SCHEDULE) : PRACTICE_SETTINGS_ITEMS
  const MISCELLANEOUS_SETTINGS_ITEMS_FILTERED = isBillerUser ? MISCELLANEOUS_SETTINGS_ITEMS.filter((item) => item.name === CLAIM_STATUSES) : MISCELLANEOUS_SETTINGS_ITEMS

  return (
    <Grid container justifyContent='center'>
      <Grid item lg={7} md={10} sm={12} xs={12}>
        <PageHeader title={SETTINGS_TEXT} />

        {!isBillerUser && <CardComponent cardTitle={USERS_MANAGEMENT}>
          {isDoctor && <Box>
            <Box className={classes.settingContainer}>
              <Link key={DOCTOR_PROFILE_TEXT} to={`${DOCTORS_ROUTE}/${doctorId}`}>
                <MenuItem>{DOCTOR_PROFILE_TEXT}</MenuItem>
              </Link>

              <Box pr={2} className={classes.inlineDashes}>-</Box>

              <Typography variant="body1">{PROVIDER_PROFILE_DESCRIPTION} </Typography>
            </Box>
          </Box>}

          <Box pb={3}>
            {USER_MENU_ITEMS.map((item) => {
              const { link, name, permission, desc } = item || {}
              const doctorAdminRoute = isDoctor && name === PROVIDER_MANAGEMENT;
              const doctorDetailRoute = `${DOCTORS_ROUTE}/${doctorId}/details`

              return userPermissions.includes(permission) && (
                <Box className={classes.settingContainer}>
                  <Link key={`${link}-${name}`} to={(doctorAdminRoute) ? doctorDetailRoute : link}>
                    <MenuItem>{(doctorAdminRoute) ? PROVIDER_DETAILS : name}</MenuItem>
                  </Link>

                  <Box pr={2} className={classes.inlineDashes}>-</Box>

                  <Typography variant="body1">{(doctorAdminRoute) ? PROVIDER_DETAILS_DESCRIPTION : desc} </Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>}

        <Box p={2} />

        <CardComponent cardTitle={PRACTICE_SETTINGS}>
          <Box pb={3}>
            {PRACTICE_SETTINGS_ITEMS_FILTERED.map((item) => {
              const { name, link, desc, permission } = item || {}
              const practiceAdminRoute = isSuper && name === PRACTICE_DETAILS;
              const facilityAdminRoute = isFacility && name === FACILITY_MANAGEMENT;

              const doctorAdminRoute = isDoctor && name === PROVIDER_MANAGEMENT;
              const facilityDetailRoute = `${FACILITIES_ROUTE}/${facilityId}`
              const doctorDetailRoute = `${DOCTORS_ROUTE}/${doctorId}/details`

              return userPermissions.includes(permission) && (
                <Box className={classes.settingContainer}>
                  <Link
                    key={`${link}-${name}`}
                    to={(facilityAdminRoute) ? facilityDetailRoute
                      : (doctorAdminRoute) ? doctorDetailRoute
                        : (practiceAdminRoute) ? `${PRACTICE_MANAGEMENT_ROUTE}` : link}
                  >
                    <MenuItem>
                      {(practiceAdminRoute) ? PRACTICE_MANAGEMENT_TEXT
                        : (doctorAdminRoute) ? PROVIDER_DETAILS
                          : (facilityAdminRoute) ? FACILITY_DETAILS_TEXT : name}
                    </MenuItem>
                  </Link>

                  <Box pr={2} className={classes.inlineDashes}>-</Box>

                  <Typography variant="body1">
                    {(practiceAdminRoute)
                      ? PRACTICE_MANAGEMENT_DESCRIPTION
                      : (doctorAdminRoute)
                        ? PROVIDER_DETAILS_DESCRIPTION
                        : (facilityAdminRoute)
                          ? FACILITY_DETAILS_DESCRIPTION : desc}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>

        <Box p={2} />

        {/* <CardComponent cardTitle={INVENTORY}>
          <Box pb={3}>
            {INVENTORY_ITEMS.map(({ name, link, desc }) => {
              return (
                <Box className={classes.settingContainer}>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent> */}

        {isFacility &&
          <Box pb={2}>
            <CardComponent cardTitle={SERVICES}>
              <Box pb={3}>
                <Box className={classes.settingContainer}>
                  <Link key={FACILITY_SERVICES_TEXT}
                    to={`${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}`}
                  >
                    <MenuItem>{FACILITY_SERVICES_TEXT}</MenuItem>
                  </Link>

                  <Box pr={2} className={classes.inlineDashes}>-</Box>

                  <Typography variant="body1">{FACILITY_SERVICES_DESCRIPTION}</Typography>
                </Box>
              </Box>
            </CardComponent>
          </Box>
        }

        {/* <CardComponent cardTitle={APPOINTMENT_SETTINGS}>
          <Box pb={3}>
            {APPOINTMENT_SETTINGS_ITEMS.map(({ name, link, desc }) => {
              return (
                <Box className={classes.settingContainer}>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent> */}

        {isFacility &&
          <Box pb={2}>
            <CardComponent cardTitle={CALENDAR_SETTINGS_TEXT}>
              <Box pb={3}>
                <Box className={classes.settingContainer}>
                  <Link key={FACILITY_SCHEDULE} to={`${FACILITIES_ROUTE}/${facilityId}/2`}>
                    <MenuItem>{FACILITY_SCHEDULE}</MenuItem>
                  </Link>

                  <Box pr={2} className={classes.inlineDashes}>-</Box>

                  <Typography variant="body1">{FACILITY_SCHEDULE_DESCRIPTION}</Typography>
                </Box>
              </Box>
            </CardComponent>
          </Box>
        }

        {!isBillerUser && <CardComponent cardTitle={CLINICAL_TEXT}>
          <Box pb={3}>
            {CLINICAL_ITEMS.map(({ name, link, desc }) => {
              return (
                <Box className={classes.settingContainer}>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>

                  <Box pr={2} className={classes.inlineDashes}>-</Box>

                  <Typography variant="body1">{desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>}

        <Box p={2} />

        <CardComponent cardTitle={MISCELLANEOUS_SETTINGS}>
          <Box pb={3}>
            {MISCELLANEOUS_SETTINGS_ITEMS_FILTERED.map(({ name, link, desc, permission }) => {
              return (
                permission ? userPermissions.includes(permission) && (
                  <Box className={classes.settingContainer}>
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2} className={classes.inlineDashes}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                ) :
                  (
                    <Box className={classes.settingContainer}>
                      <Link key={`${link}-${name}`} to={link}>
                        <MenuItem>{name}</MenuItem>
                      </Link>

                      <Box pr={2} className={classes.inlineDashes}>-</Box>

                      <Typography variant="body1">{desc}</Typography>
                    </Box>
                  )
              )
            })}
          </Box>
        </CardComponent>
      </Grid>
    </Grid>
  )
};
