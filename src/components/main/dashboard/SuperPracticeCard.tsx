// packages block
import { Link } from "react-router-dom";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
// components block
import PieChart from "../../common/charts/PieChart";
// constants, styles and svgs block
import { BLUE_SEVEN, GREEN_ONE } from "../../../theme";
import { useGetAllPracticeCountLazyQuery } from "../../../generated/graphql";
import { PracticeActiveIcon, PracticeInactiveIcon, RedirectIcon } from "../../../assets/svgs";
import { practiceReducer, Action, initialState, State, ActionType } from "../../../reducers/practiceReducer";
import { ACTIVE, INACTIVE, PRACTICES, PRACTICE_MANAGEMENT_ROUTE, TOTAL_TEXT } from "../../../constants";

const SuperPracticeCard: FC = (): JSX.Element => {

  const [state, dispatch] = useReducer<Reducer<State, Action>>(practiceReducer, initialState);
  const { totalPractices, activePractices, inactivePractices } = state

  const [getAllPracticeCount] = useGetAllPracticeCountLazyQuery({
    onCompleted: (data) => {
      const { getAllPractices } = data || {}
      const { response, practices } = getAllPractices || {}
      const { status } = response || {}
      const { total, active, inactive } = practices || {}
      if (status === 200 && total) {
        dispatch({ type: ActionType.SET_TOTAL_PRACTICES, totalPractices: total })
        dispatch({ type: ActionType.SET_ACTIVE_PRACTICES, activePractices: active ?? 0 })
        dispatch({ type: ActionType.SET_INACTIVE_PRACTICES, inactivePractices: inactive || 0 })
      }
      else {
        dispatch({ type: ActionType.SET_TOTAL_PRACTICES, totalPractices: 0 })
      }
    },
    onError: () => {
      dispatch({ type: ActionType.SET_TOTAL_PRACTICES, totalPractices: 0 })
    }
  })


  const fetchAllPracticeCount = useCallback(async () => {
    try {
      await getAllPracticeCount()
    } catch (error) { }
  }, [getAllPracticeCount])

  useEffect(() => {
    fetchAllPracticeCount()
  }, [fetchAllPracticeCount])


  return (
    <Card>
      <Box px={4} py={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Box>
          <Typography variant="h5">{PRACTICES}</Typography>

          <Box p={0.5} />

          <Typography variant="body2">{totalPractices} {TOTAL_TEXT}</Typography>
        </Box>

        <Link to={PRACTICE_MANAGEMENT_ROUTE}>
          <IconButton size='small'>
            <RedirectIcon />
          </IconButton>
        </Link>
      </Box>

      <PieChart activePractices={activePractices} inactivePractices={inactivePractices} />

      <Box px={4} pb={2} display='flex' alignItems='center'>
        <Grid container spacing={2}>
          <Grid item md={6} sm={12} xs={12}>
            <Box display='flex'>
              <PracticeActiveIcon />

              <Box ml={2}>
                <Typography variant="h5">{activePractices}</Typography>

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
                <Typography variant="h5">{inactivePractices}</Typography>

                <Box mt={0.5} color={BLUE_SEVEN}>
                  <Typography variant="inherit">{INACTIVE}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default SuperPracticeCard