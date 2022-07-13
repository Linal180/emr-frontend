// packages
import { CSVLink } from "react-csv";
import { Link } from 'react-router-dom'
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { ChangeEvent, Fragment, Reducer, useCallback, useReducer, useEffect, useMemo } from "react";
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
// components block
import Selector from "../../common/Selector";
import DatePicker from "../../common/DatePicker";
import TableLoader from "../../common/TableLoader";
import { DownloadIconWhite } from '../../../assets/svgs';
import UserSelector from "../../common/userLogs/UserSelector";
import NoDataFoundComponent from "../../common/NoDataFoundComponent";
import LogsPatientSelector from "../../common/userLogs/PatientSelector";
//constants bock
import { GRAY_SIX, } from "../../../theme";
import { AuditLogsInputs } from "../../../interfacesTypes";
import { useTableStyles } from "../../../styles/tableStyles";
import { useChartingStyles } from '../../../styles/chartingStyles';
import { useFindAllUserLogsLazyQuery, UserLogsPayload } from "../../../generated/graphql";
import { formatModuleTypes, getFormatLogsDate, getFormatLogsTime, renderTh } from "../../../utils";
import { Action, State, initialState, userLogsReducer, ActionType } from '../../../reducers/userLogsReducer'
import {
  ACTION, ALL_LOG_TYPES, DATE, DETAIL, FROM_DATE, IP_TEXT, AUDIT_LOG_REPORT, EXPORT_TO_FILE,
  PATIENT, PATIENT_NAME, TIME, TO_DATE, TYPE, UPDATE_FILTER, USER_NAME, USER_TEXT,
  AUDIT_TIME_ENUMS, USER_LOG_PAGE_LIMIT, MODULE_LOGS_TYPES, PAGE_LIMIT, PATIENTS_ROUTE
} from "../../../constants";
import moment from "moment";

const headers = [
  { label: "Date", key: "date" },
  { label: "Time", key: "time" },
  { label: "Patient", key: "patient" },
  { label: "User", key: "user" },
  { label: "Type", key: "moduleType" },
  { label: "Action", key: "operationType" }
];

const AuditLogTable = (): JSX.Element => {
  const moduleOptions = formatModuleTypes(MODULE_LOGS_TYPES)
  const classes = useTableStyles();
  const methods = useForm<AuditLogsInputs>({
    mode: "all", defaultValues: {
      endDate: new Date().toString(),
      startDate: new Date().toString()
    }
  });
  const chartingClasses = useChartingStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(userLogsReducer, initialState)

  const { timeDuration, page, totalPages, userLogs, csvData } = state
  const { handleSubmit, getValues, setValue } = methods
  const { patient, module, user, startDate, endDate } = getValues()

  const [findAllUserLogs, { loading, error }] = useFindAllUserLogsLazyQuery({
    onCompleted: (data) => {
      const { findAllUserLogs } = data || {}
      const { response, pagination, userLogs } = findAllUserLogs || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages ?? 0 })
        userLogs && dispatch({ type: ActionType.SET_USER_LOGS, userLogs: userLogs as UserLogsPayload['userLogs'] })
      }
    },
    onError: () => {
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
      dispatch({ type: ActionType.SET_USER_LOGS, userLogs: [] })
    }
  })

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({ type: ActionType.SET_PAGE, page: value })

  const fetchAllUserLogs = useCallback(async () => {
    const { id: userId } = user || {}
    const { id: moduleType } = module || {}
    const { id: patientId } = patient || {}

    try {
      const pageInputs = {
        paginationOptions: { page, limit: USER_LOG_PAGE_LIMIT }, userId: userId ? userId : null, moduleType: moduleType ? moduleType : null,
        patientId: patientId ? patientId : null, startDate: startDate ? startDate : null, endDate: endDate ? endDate : null
      }
      await findAllUserLogs({ variables: { userLogsInput: { ...pageInputs } } })
    } catch (error) { }
  }, [page, findAllUserLogs, user, module, patient, startDate, endDate])

  useEffect(() => {
    fetchAllUserLogs()
  }, [fetchAllUserLogs])

  const onSubmit = async (data: AuditLogsInputs) => {
    const { module, patient, user, startDate, endDate } = data
    const { id: userId } = user
    const { id: moduleType } = module
    const { id: patientId } = patient

    try {
      const pageInputs = { paginationOptions: { page, limit: USER_LOG_PAGE_LIMIT } }
      await findAllUserLogs({
        variables: {
          userLogsInput: {
            ...pageInputs, userId: userId ? userId : null, moduleType: moduleType ? moduleType : null,
            patientId: patientId ? patientId : null, startDate: startDate ? startDate : null, endDate: endDate ? endDate : null
          }
        }
      })
    } catch (error) { }
  }

  const dateHandler = (timeKey: string) => {
    switch (timeKey) {
      case 'Day':
        setValue('endDate', new Date()?.toString())
        setValue('startDate', new Date(new Date()?.setDate(new Date().getDate() - 1))?.toString())
        break;

      case 'Week':
        setValue('endDate', new Date()?.toString())
        setValue('startDate', new Date(new Date().setDate(new Date().getDate() - 7))?.toString())
        break;

      case 'Month':

        setValue('endDate', new Date()?.toString())
        setValue('startDate', new Date(new Date().setMonth(new Date().getMonth() - 1))?.toString())
        break;

      case 'Year':
        setValue('endDate', new Date()?.toString())
        setValue('startDate', new Date(new Date().setFullYear(new Date().getFullYear() - 1))?.toString())
        break;


      default:
        setValue('endDate', new Date()?.toString())
        setValue('startDate', new Date(new Date()?.setDate(new Date().getDate() - 1))?.toString())
        break;
    }
  }

  useMemo(() => {
    if (!!userLogs?.length) {
      const arr = userLogs?.map((item) => {
        const { createdAt, moduleType, user, patient, operationType } = item || {}
        const { email } = user || {}
        const { firstName, lastName } = patient || {}
        return {
          user: email || '',
          moduleType: moduleType || "",
          operationType: operationType || '',
          date: getFormatLogsDate(createdAt),
          time: getFormatLogsTime(createdAt),
          patient: `${firstName || ''} ${lastName || ''}`
        }
      })
      arr?.length && dispatch({ type: ActionType.SET_CSV_DATA, csvData: arr })
    }
  }, [userLogs])

  return (
    <Fragment>

      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{AUDIT_LOG_REPORT}</Typography>
        <CSVLink data={csvData as object[]} headers={headers} className="csvLink"
          filename={`audit_log_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}`}>
          <Button variant="contained" startIcon={<DownloadIconWhite />} color="primary">
            {EXPORT_TO_FILE}
          </Button>
        </CSVLink>
      </Box>

      <Box mt={3} mb={1}>
        <FormProvider {...methods}>
          <Grid container spacing={3} direction='row'>
            <Grid item md={10} sm={12} xs={12}>
              <Grid container spacing={3} direction='row'>
                <Grid item md={2} sm={12} xs={12}>
                  <LogsPatientSelector
                    addEmpty
                    label={PATIENT_NAME}
                    name="patient"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <UserSelector
                    addEmpty
                    label={USER_NAME}
                    name="user"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={ALL_LOG_TYPES}
                    options={moduleOptions}
                    name="module"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <DatePicker name="startDate" label={FROM_DATE} />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <DatePicker name="endDate" label={TO_DATE} />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Box mt={2.5}>
                    <Button variant="contained" color="secondary" onClick={handleSubmit(onSubmit)}>{UPDATE_FILTER}</Button>
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
                      onClick={() => {
                        dispatch({ type: ActionType.SET_TIME_DURATION, timeDuration: timeKey })
                        dateHandler(timeKey)
                      }}
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
                    const { id, createdAt, ipAddress, moduleType, activityPayload, user, patient, operationType } = item || {}
                    const { email } = user || {}
                    const { firstName, lastName, patientRecord, id: patientId } = patient || {}
                    return (
                      <TableRow key={id}>
                        <TableCell scope="row">{getFormatLogsDate(createdAt)}</TableCell>
                        <TableCell scope="row">{getFormatLogsTime(createdAt)}</TableCell>
                        <TableCell scope="row">{patientId && (<>
                          <Link to={`${PATIENTS_ROUTE}/${patientId}`} >{`${firstName ?? ''} ${lastName ?? ''}`}</Link> {patientRecord ?? ''}
                        </>)}
                        </TableCell>
                        <TableCell scope="row">{email}</TableCell>
                        <TableCell scope="row">{moduleType}</TableCell>
                        <TableCell scope="row">{operationType}</TableCell>
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
