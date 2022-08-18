// packages block
import { FC, Reducer, useReducer } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import PieChart from "../../common/charts/PieChart";
import PracticesTableComponent from "./tables/practicesTable";
import PracticeUsers from "../../common/charts/PracticeUsers";
import PracticeFacilities from "../../common/charts/PracticeFacilities";
// constants, styles and svgs block
import history from "../../../history";
import { BLUE_SEVEN, BLUE_TEN, GREEN_ONE, PURPLE_TWO, WHITE } from "../../../theme";
import { useDashboardStyles } from "../../../styles/dashboardStyles";
import {
  practiceReducer, Action, initialState, State
} from "../../../reducers/practiceReducer";
import {
  MessageIcon, PlusRoundIcon, PracticeActiveIcon, PracticeInactiveIcon, RedirectIcon
} from "../../../assets/svgs";
import {
  ACTIVE, CREATE_PRACTICE, INACTIVE, PRACTICES, PRACTICE_MANAGEMENT_ROUTE, QUICK_ACTIONS, SEND_SMS, 
  TOTAL_FACILITIES_PER_PRACTICE, TOTAL_TEXT, TOTAL_USERS_PER_PRACTICE, RECENT_PRACTICES, SEND_SMS_ROUTE,
} from "../../../constants";
import { Link } from "react-router-dom";

const SuperAdminDashboardComponent: FC = (): JSX.Element => {
  const classes = useDashboardStyles();
  // const methods = useForm<dashboardInputsProps>({
  //   mode: "all",
  //   defaultValues: { year: { id: "2022", name: "2022" } }
  // });
  // const { watch } = methods;
  // const { year } = watch()
  const [{ practices }, dispatch] = useReducer<Reducer<State, Action>>(practiceReducer, initialState)

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box px={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant="h5">{RECENT_PRACTICES}</Typography>

              <Link to={PRACTICE_MANAGEMENT_ROUTE}>
                <IconButton>
                  <RedirectIcon />
                </IconButton>
              </Link>
            </Box>

            <Box>
              <PracticesTableComponent dispatch={dispatch} />
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

          <Card>
            <Box px={4} py={2} display='flex' justifyContent='space-between' alignItems='center'>
              <Box>
                <Typography variant="h5">{PRACTICES}</Typography>

                <Box p={0.5} />

                <Typography variant="body2">{practices?.length} {TOTAL_TEXT}</Typography>
              </Box>

              <Link to={PRACTICE_MANAGEMENT_ROUTE}>
                <IconButton>
                  <RedirectIcon />
                </IconButton>
              </Link>
            </Box>

            <PieChart practices={practices?.length} />

            <Box px={4} pb={2} display='flex' alignItems='center'>
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <PracticeActiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">{practices?.length}</Typography>

                      <Box mt={0.5} color={GREEN_ONE}>
                        <Typography variant="inherit">{ACTIVE}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Box display='flex'>
                    <PracticeInactiveIcon />

                    <Box ml={2}>
                      <Typography variant="h5">0</Typography>

                      <Box mt={0.5} color={BLUE_SEVEN}>
                        <Typography variant="inherit">{INACTIVE}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* <Box p={1} /> */}

      {/* <Grid container spacing={0}>
        <Grid item md={6} sm={12} xs={12}>
          <Card>
            <Box px={2} py={1}>
              <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h4">{PRACTICE_REGISTRATIONS}</Typography>

                <Box className={classes.yearDropdown}>
                  <FormProvider {...methods}>
                    <Selector label="" name="year" options={renderArrayAsSelectorOptions(YEARS)} />
                  </FormProvider>
                </Box>
              </Box>

              <PracticesByYear year={year} />
            </Box>
          </Card>
        </Grid>
      </Grid> */}
    </>
  )
};

export default SuperAdminDashboardComponent;
