// packages block
import { useContext } from "react";
import { pluck } from "underscore";
import { Link } from "react-router-dom";
import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
// components block
import PageHeader from "../../common/PageHeader";
import CardComponent from "../../common/CardComponent";
// constants block
import { AuthContext } from "../../../context";
import {
  APPOINTMENT_SETTINGS, APPOINTMENT_SETTINGS_ITEMS, CALENDAR_SETTINGS_ITEMS, CALENDAR_SETTINGS_TEXT,
  CLINICAL_ITEMS, CLINICAL_TEXT, INVENTORY, INVENTORY_ITEMS, MISCELLANEOUS_SETTINGS, SETTINGS_TEXT,
  MISCELLANEOUS_SETTINGS_ITEMS, PRACTICE_SETTINGS, PRACTICE_SETTINGS_ITEMS, SERVICES, SERVICES_ITEMS,
  USERS_MANAGEMENT, USER_MENU_ITEMS, SYSTEM_ROLES, FACILITIES_ROUTE,
} from "../../../constants";
import { visibleToUser } from "../../../utils";

export const SettingsComponent = () => {
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {}
  const userRoles = pluck(roles || [], 'role')
  const { id: facilityId } = facility || {}
  const isFacilityAdmin = userRoles.includes(SYSTEM_ROLES.FacilityAdmin)

  return (
    <>
      <Grid container justifyContent='center'>
        <Grid item md={7} sm={12} xs={12}>
          <PageHeader title={SETTINGS_TEXT} />

          <CardComponent cardTitle={USERS_MANAGEMENT}>
            <Box pb={3}>
              {USER_MENU_ITEMS.map((item) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${item.link}-${item.name}`} to={item.link}>
                      <MenuItem>{item.name}</MenuItem>
                    </Link>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={PRACTICE_SETTINGS}>
            <Box pb={3}>
              {PRACTICE_SETTINGS_ITEMS.map((item) => {
                const { name, link, desc, visible } = item || {}

                return visibleToUser(userRoles, visible) && (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={isFacilityAdmin ? `${FACILITIES_ROUTE}/${facilityId}` : link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={INVENTORY}>
            <Box pb={3}>
              {INVENTORY_ITEMS.map(({ name, link, desc }) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={SERVICES}>
            <Box pb={3}>
              {SERVICES_ITEMS.map(({ name, link, desc }) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={APPOINTMENT_SETTINGS}>
            <Box pb={3}>
              {APPOINTMENT_SETTINGS_ITEMS.map(({ name, link, desc }) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={CALENDAR_SETTINGS_TEXT}>
            <Box pb={3}>
              {CALENDAR_SETTINGS_ITEMS.map(({ name, link, desc }) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={CLINICAL_TEXT}>
            <Box pb={3}>
              {CLINICAL_ITEMS.map(({ name, link, desc }) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>

          <Box p={2} />

          <CardComponent cardTitle={MISCELLANEOUS_SETTINGS}>
            <Box pb={3}>
              {MISCELLANEOUS_SETTINGS_ITEMS.map(({ name, link, desc }) => {
                return (
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    <Link key={`${link}-${name}`} to={link}>
                      <MenuItem>{name}</MenuItem>
                    </Link>

                    <Box pr={2}>-</Box>

                    <Typography variant="body1">{desc}</Typography>
                  </Box>
                )
              })}
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </>
  )
};
