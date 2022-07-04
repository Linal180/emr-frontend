// packages
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { ChangeEvent, Fragment, Reducer, useCallback, useReducer, useEffect } from "react";
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
// components block
import Selector from "../../common/Selector";
import DatePicker from "../../common/DatePicker";
import TableLoader from "../../common/TableLoader";
import NoDataFoundComponent from "../../common/NoDataFoundComponent";
//constants bock
import { renderTh } from "../../../utils";
import { GRAY_SIX, } from "../../../theme";
import { useTableStyles } from "../../../styles/tableStyles";
import { useChartingStyles } from '../../../styles/chartingStyles';
import { Action, State, initialState, userLogsReducer, ActionType } from '../../../reducers/userLogsReducer'
import {
  ACTION, ALL_LOG_TYPES, DATE, DETAIL, FROM_DATE, IP_TEXT,
  PATIENT, PATIENT_NAME, TIME, TO_DATE, TYPE, UPDATE_FILTER, USER_NAME, USER_TEXT,
  AUDIT_TIME_ENUMS, PAGE_LIMIT,
} from "../../../constants";
import { useFindAllUserLogsLazyQuery, UserLogsPayload } from "../../../generated/graphql";

const AuditLogTable = (): JSX.Element => {

  const classes = useTableStyles();
  const methods = useForm({ mode: "all" });
  const chartingClasses = useChartingStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(userLogsReducer, initialState)

  const { timeDuration, page, totalPages, userLogs } = state

  const [findAllUserLogs, { loading, error }] = useFindAllUserLogsLazyQuery({
    onCompleted: (data) => {
      const { findAllUserLogs } = data || {}
      const { response, pagination, userLogs } = findAllUserLogs || {}
      const { status } = response || {}
      if (status === 200) {
        const { page, totalPages } = pagination || {}
        page && dispatch({ type: ActionType.SET_PAGE, page })
        totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        userLogs && dispatch({ type: ActionType.SET_USER_LOGS, userLogs: userLogs as UserLogsPayload['userLogs'] })
      }

    },
    onError: () => { }
  })

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({ type: ActionType.SET_PAGE, page: value })

  const fetchAllUserLogs = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      await findAllUserLogs({ variables: { userLogsInput: { ...pageInputs } } })

    } catch (error) { }
  }, [page, findAllUserLogs])

  useEffect(() => {
    fetchAllUserLogs()
  }, [fetchAllUserLogs])


  return (
    <Fragment>
      <Box mt={3} mb={1}>
        <FormProvider {...methods}>
          <Grid container spacing={3} direction='row'>
            <Grid item md={10} sm={12} xs={12}>
              <Grid container spacing={3} direction='row'>
                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={PATIENT_NAME}
                    name="patientName"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={USER_NAME}
                    name="userName"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={ALL_LOG_TYPES}
                    name="allLog"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <DatePicker name="date" label={FROM_DATE} />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <DatePicker name="date" label={TO_DATE} />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Box mt={2.5}>
                    <Button variant="contained" color="secondary">{UPDATE_FILTER}</Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleBox}`}>
                <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6} mt={2}>
                  {AUDIT_TIME_ENUMS?.map((timeKey, index) => {
                    return (<Box key={`${timeKey}-${index}`}
                      className={timeKey === timeDuration ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => dispatch({ type: ActionType.SET_TIME_DURATION, timeDuration: timeKey })}
                    >
                      <Typography variant='h6'>{timeKey}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>

      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(DATE)}
                {renderTh(TIME)}
                {renderTh(PATIENT)}
                {renderTh(USER_TEXT)}
                {renderTh(TYPE)}
                {renderTh(ACTION)}
                {renderTh(DETAIL)}
                {renderTh(IP_TEXT)}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ?
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={8} />
                  </TableCell>
                </TableRow> :
                <Fragment>
                  {userLogs?.map((item) => {
                    const { id, createdAt, ipAddress, operationName, moduleType, patientId, userId, activityPayload } = item || {}
                    return (
                      <TableRow key={id}>
                        <TableCell scope="row">{createdAt}</TableCell>
                        <TableCell scope="row">{createdAt}</TableCell>
                        <TableCell scope="row">{patientId}</TableCell>
                        <TableCell scope="row">{userId}</TableCell>
                        <TableCell scope="row">{moduleType}</TableCell>
                        <TableCell scope="row">{operationName}</TableCell>
                        <TableCell scope="row">{activityPayload}</TableCell>
                        <TableCell scope="row">{ipAddress}</TableCell>
                      </TableRow>
                    );
                  }
                  )}
                </Fragment>
              }
            </TableBody>
          </Table>
          {((!loading && !userLogs?.length) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>)}
        </Box>
      </Box>

      {!loading && totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </Fragment>
  )
}

export default AuditLogTable;
