// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import SuperPracticeCard from "./SuperPracticeCard";
import PracticesTableComponent from "./tables/practicesTable";
import PracticeUsers from "../../common/charts/PracticeUsers";
import PracticeFacilities from "../../common/charts/PracticeFacilities";
// constants, styles and svgs block
import history from "../../../history";
import { BLUE_TEN, PURPLE_TWO, WHITE } from "../../../theme";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import { MessageIcon, PlusRoundIcon, RedirectIcon } from "../../../assets/svgs";
import {
  CREATE_PRACTICE, PRACTICE_MANAGEMENT_ROUTE, QUICK_ACTIONS, SEND_SMS, TOTAL_FACILITIES_PER_PRACTICE,
  TOTAL_USERS_PER_PRACTICE, RECENT_PRACTICES, SEND_SMS_ROUTE,
} from "../../../constants";

const SuperAdminDashboardComponent: FC = (): JSX.Element => {

  const classes = useDashboardStyles();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box px={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h5">{RECENT_PRACTICES}</Typography>

              <Link to={PRACTICE_MANAGEMENT_ROUTE}>
                <IconButton size='small'>
                  <RedirectIcon />
                </IconButton>
              </Link>
            </Box>

            <Box>
              <PracticesTableComponent />
            </Box>
          </Card>

          <Box p={1} />

          <Card>
            <Box borderRadius={8} bgcolor={BLUE_TEN}>
              <Box px={2} pt={2} color={WHITE}>
                <Typography variant="h4">{TOTAL_USERS_PER_PRACTICE}</Typography>
              </Box>

              <PracticeUsers />
            </Box>
          </Card>

          <Box p={1} />

          <Card>
            <Box borderRadius={8} bgcolor={PURPLE_TWO}>
              <Box px={2} pt={2} color={WHITE}>
                <Typography variant="h4">{TOTAL_FACILITIES_PER_PRACTICE}</Typography>
              </Box>

              <PracticeFacilities />
            </Box>
          </Card>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <Card>
            <Box className={classes.blueCard}>
              <Box color={WHITE}>
                <Typography variant="h5">{QUICK_ACTIONS}</Typography>
              </Box>
            </Box>

            <Box pb={3} className={classes.cardContainer} display='flex' justifyContent='center' alignItems='center'>
              <Box className={classes.cardBox} onClick={() => history.push(`${PRACTICE_MANAGEMENT_ROUTE}/new`)}>
                <PlusRoundIcon />
                <Box p={0.7} />
                <Typography variant="h6">{CREATE_PRACTICE}</Typography>
              </Box>

              <Box p={1} />

              <Box className={classes.cardBox} onClick={() => history.push(SEND_SMS_ROUTE)}>
                <MessageIcon />
                <Box p={0.7} />
                <Typography variant="h6">{SEND_SMS}</Typography>
              </Box>
            </Box>
          </Card>

          <SuperPracticeCard />
        </Grid>
      </Grid>
    </>
  )
};

export default SuperAdminDashboardComponent;
