// packages block
import { Reducer, useCallback, useEffect, useReducer } from "react";
import { Box, Typography } from "@material-ui/core";
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent
} from "@material-ui/lab";
// component block
import ViewDataLoader from "./ViewDataLoader";
// styles block
import { BLUE } from "../../theme";
import { timeDifference } from "../../utils";
import { useFindAllUserLogsLazyQuery, UserLogs, UserLogsPayload } from "../../generated/graphql";
import {
  Action, State, initialState, userLogsReducer, ActionType
} from "../../reducers/userLogsReducer";

const RecentActivities = () => {
  const [{ userLogs }, dispatch] = useReducer<Reducer<State, Action>>(userLogsReducer, initialState)

  const [findAllUserLogs, { loading }] = useFindAllUserLogsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError: () => {
      dispatch({ type: ActionType.SET_USER_LOGS, userLogs: [] })
    },

    onCompleted: (data) => {
      const { findAllUserLogs: { response, userLogs } } = data || {}
      const { status } = response || {}

      if (status === 200) {
        console.log(userLogs, "USER Logs")
        userLogs && dispatch({
          type: ActionType.SET_USER_LOGS,
          userLogs: userLogs as UserLogsPayload['userLogs']
        })
      }
    }
  })

  const fetchAllUserLogs = useCallback(async () => {
    try {
      await findAllUserLogs({
        variables: {
          userLogsInput: {
            paginationOptions: { page: 1, limit: 5 }
          },
        }
      })
    } catch (error) { }
  }, [findAllUserLogs])

  useEffect(() => {
    fetchAllUserLogs()
  }, [fetchAllUserLogs])

  const activity = (log: UserLogs) => {
    const { createdAt, moduleType, user, operationType } = log || {}
    const { email } = user || {}

    return (
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outlined" color="secondary" />
          <TimelineConnector />
        </TimelineSeparator>

        <TimelineContent className="pt-0">
          <Typography variant="body1">
            {!!email && <strong> ”{email}" </strong>}
            {operationType} {moduleType}
          </Typography>

          <Typography variant="body2" style={{ color: BLUE }}>
            {timeDifference(createdAt)}
          </Typography>
        </TimelineContent>
      </TimelineItem>
    )
  };

  return (
    <Box className="recent-activity-timeline">
      {loading ? <ViewDataLoader rows={5} columns={12} hasMedia={false} />
        : <Timeline>
          {userLogs?.map(log => activity(log as UserLogs))}
        </Timeline>
      }
    </Box>
  )
}

export default RecentActivities;
