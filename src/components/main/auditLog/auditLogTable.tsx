// packages
import moment from "moment";
import { CSVLink } from "react-csv";
import { Link } from 'react-router-dom'
import { Pagination } from "@material-ui/lab";
import { FormProvider, useForm } from "react-hook-form";
import { ChangeEvent, Fragment, Reducer, useCallback, useReducer, useEffect, useMemo } from "react";
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, } from "@material-ui/core";
// components block
import Selector from "../../common/Selector";
import DatePicker from "../../common/DatePicker";
import TableLoader from "../../common/TableLoader";
import { DownloadIconWhite } from '../../../assets/svgs';
import UserSelector from "../../common/userLogs/UserSelector";
import NoDataFoundComponent from "../../common/NoDataFoundComponent";
import LogsPatientSelector from "../../common/userLogs/PatientSelector";
//constants bock
import { AuditLogsInputs } from "../../../interfacesTypes";
import { useTableStyles } from "../../../styles/tableStyles";
import { useFindAllUserLogsLazyQuery, UserLogsPayload } from "../../../generated/graphql";
import { Action, State, initialState, userLogsReducer, ActionType } from '../../../reducers/userLogsReducer';
import { formatModuleTypes, getFormatLogsDate, getFormatLogsTime, renderTh, setRecord } from "../../../utils";
import {
  ACTION, ALL_LOG_TYPES, DATE, DETAIL, FROM_DATE, IP_TEXT, AUDIT_LOG_REPORT, EXPORT_TO_FILE,
  PATIENT, PATIENT_NAME, TIME, TO_DATE, TYPE, UPDATE_FILTER, USER_NAME, USER_TEXT, USER_LOG_PAGE_LIMIT,
  MODULE_LOGS_TYPES, PAGE_LIMIT, PATIENTS_ROUTE, CLEAR_TEXT, SETTINGS_ROUTE, AUDIT_LOG_BREAD,
} from "../../../constants";
import BackButton from "../../common/BackButton";
import PageHeader from "../../common/PageHeader";
import { WHITE } from "../../../theme";

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
      startDate: moment().subtract(1,'hour').toString()
    }
  });

  const [state, dispatch] = useReducer<Reducer<State, Action>>(userLogsReducer, initialState)
  const { page, totalPages, userLogs, csvData } = state
  const { handleSubmit, watch, setValue } = methods
  const { patient, module, user, startDate, endDate } = watch()

  const [findAllUserLogs, { loading, error }] = useFindAllUserLogsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

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
    try {
      const { id: userId } = user || {}
      const { id: moduleType } = module || {}
      const { id: patientId } = patient || {}
      const pageInputs = {
        paginationOptions: { page, limit: USER_LOG_PAGE_LIMIT }, userId: userId ? userId : null,
        moduleType: moduleType ? moduleType : null, patientId: patientId ? patientId : null,
        startDate: startDate ? startDate : null, endDate: endDate ? endDate : null
      }

      await findAllUserLogs({ variables: { userLogsInput: { ...pageInputs } } })
    } catch (error) { }
  }, [page, findAllUserLogs, user, module, patient, startDate, endDate])

  useEffect(() => {
    fetchAllUserLogs()
  }, [fetchAllUserLogs, startDate])

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

  const resetHandler = async () => {
    setValue('patient', setRecord('', '--'));
    setValue('user', setRecord('', '--'));
    setValue('module', setRecord('', '--'));
    setValue('startDate', new Date().toString());
    setValue('endDate', new Date().toString());
    await fetchAllUserLogs()
  }

  return (
    <Fragment>
      <Box display='flex' flexWrap='wrap' justifyContent='space-between' alignItems='center'>
        <Box display='flex'>
          <BackButton to={SETTINGS_ROUTE} />

          <Box ml={2}>
            <PageHeader title={AUDIT_LOG_REPORT}
              path={[AUDIT_LOG_BREAD]}
            />
          </Box>
        </Box>

        <CSVLink data={csvData as object[]} headers={headers} className="csvLink"
          filename={`audit_log_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}`}>
          <Button variant="contained" startIcon={<DownloadIconWhite />} color="primary">
            {EXPORT_TO_FILE}
          </Button>
        </CSVLink>
      </Box>

      <Box mt={3} mb={1}>
        <FormProvider {...methods}>
          <Grid container spacing={2} direction='row'>
            <Grid item lg={9} md={12} sm={12} xs={12}>
              <Grid container spacing={3} direction='row'>
                <Grid item lg={2} md={3} sm={6} xs={12}>
                  <LogsPatientSelector
                    addEmpty
                    label={PATIENT_NAME}
                    name="patient"
                  />
                </Grid>

                <Grid item lg={2} md={3} sm={6} xs={12}>
                  <UserSelector
                    addEmpty
                    label={USER_NAME}
                    name="user"
                  />
                </Grid>

                <Grid item lg={2} md={3} sm={6} xs={12}>
                  <Selector
                    addEmpty
                    label={ALL_LOG_TYPES}
                    options={moduleOptions}
                    name="module"
                  />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                  <DatePicker name="startDate" label={FROM_DATE} />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                  <DatePicker name="endDate" label={TO_DATE} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item lg={3} md={12} sm={12} xs={12}>
              <Box display='flex' alignItems='flex-baseline' flexWrap='wrap'>
                <Box mx={0.7} mt={2}>
                  <Button variant="contained" color="secondary" onClick={handleSubmit(onSubmit)}>{UPDATE_FILTER}</Button>
                </Box>

                <Box mx={0.7} mt={2}>
                  <Button variant="outlined" color="default" onClick={resetHandler}>{CLEAR_TEXT}</Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>

      <Box mt={1} p={2} borderRadius={12} bgcolor={WHITE} maxHeight="calc(100vh - 400px)" className="overflowY-auto">
        <Box className="table-overflow">
          <Table aria-label="customized table" className={classes.table}>
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
                    const {
                      id, createdAt, ipAddress, moduleType, activityPayload, user, patient, operationType
                    } = item || {}
                    const { email } = user || {}
                    const { firstName, lastName, patientRecord, id: patientId } = patient || {}

                    return (
                      <TableRow key={id}>
                        <TableCell scope="row">{getFormatLogsDate(createdAt)}</TableCell>
                        <TableCell scope="row">{getFormatLogsTime(createdAt)}</TableCell>
                        <TableCell scope="row">{patientId && (<>
                          <Link to={`${PATIENTS_ROUTE}/${patientId}/details`} >{`${firstName ?? ''} ${lastName ?? ''}`}</Link> {(patientRecord) ?? ''}
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
        <Box display="flex" justifyContent="flex-end" pt={3}>
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
