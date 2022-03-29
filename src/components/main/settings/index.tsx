// packages block
import { Link } from "react-router-dom";
// components block
import { Box, Grid, MenuItem, Typography } from "@material-ui/core";
import PageHeader from "../../common/PageHeader";
import CardComponent from "../../common/CardComponent";
// constants block
import Search from '../../common/Search';
import {
  APPOINTMENT_SETTINGS, APPOINTMENT_SETTINGS_ITEMS, INVENTORY, INVENTORY_ITEMS, MISCELLANEOUS_SETTINGS, MISCELLANEOUS_SETTINGS_ITEMS,
  PRACTICE_SETTINGS, PRACTICE_SETTINGS_ITEMS, SERVICES, SERVICES_ITEMS, SETTINGS_TEXT, USERS_MANAGEMENT, USER_MENU_ITEMS
} from "../../../constants";

const search = (query: string) => { }

export const SettingsComponent = () => (
  <>

    <Grid container justifyContent='center'>
      <Grid item md={7} sm={12} xs={12}>
        <PageHeader title={SETTINGS_TEXT} />
        <Box mb={3} bgcolor="WHITE">
          <Search search={search} />
        </Box>

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
              return (
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Link key={`${item.link}-${item.name}`} to={item.link}>
                    <MenuItem>{item.name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{item.desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>

        <Box p={2} />

        <CardComponent cardTitle={INVENTORY}>
          <Box pb={3}>
            {INVENTORY_ITEMS.map((item) => {
              return (
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Link key={`${item.link}-${item.name}`} to={item.link}>
                    <MenuItem>{item.name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{item.desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>

        <Box p={2} />

        <CardComponent cardTitle={SERVICES}>
          <Box pb={3}>
            {SERVICES_ITEMS.map((item) => {
              return (
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Link key={`${item.link}-${item.name}`} to={item.link}>
                    <MenuItem>{item.name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{item.desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>

        <Box p={2} />

        <CardComponent cardTitle={APPOINTMENT_SETTINGS}>
          <Box pb={3}>
            {APPOINTMENT_SETTINGS_ITEMS.map((item) => {
              return (
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Link key={`${item.link}-${item.name}`} to={item.link}>
                    <MenuItem>{item.name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{item.desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>

        <Box p={2} />

        <CardComponent cardTitle={MISCELLANEOUS_SETTINGS}>
          <Box pb={3}>
            {MISCELLANEOUS_SETTINGS_ITEMS.map((item) => {
              return (
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  <Link key={`${item.link}-${item.name}`} to={item.link}>
                    <MenuItem>{item.name}</MenuItem>
                  </Link>

                  <Box pr={2}>-</Box>

                  <Typography variant="body1">{item.desc}</Typography>
                </Box>
              )
            })}
          </Box>
        </CardComponent>
      </Grid>
    </Grid>
  </>
);
