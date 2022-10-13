import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { ChangeEvent, Reducer, useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import { EyeIcon } from '../../../../../assets/svgs';
import { ACTION, DATE, FACILITY, PAGE_LIMIT, TYPE } from '../../../../../constants';
import { AppointmentPayload, AppointmentsPayload, useFindAllAppointmentsLazyQuery } from '../../../../../generated/graphql';
import { ParamsType } from '../../../../../interfacesTypes';
import { Action, ActionType, appointmentReducer, initialState, State } from '../../../../../reducers/appointmentReducer';
import { useTableStyles } from '../../../../../styles/tableStyles';
import { getAppointmentDateWithDay, getStandardTime, renderTh } from '../../../../../utils';
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent';
import TableLoader from '../../../../common/TableLoader';
import VisitModal from './VisitModal';

function VisitsTab() {
  const classes = useTableStyles();
  const { id: patientId } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { page, totalPages, appointments, openPatientModal, appointmentId } = state

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const [findAllAppointments, { loading, error }] = useFindAllAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
    },

    onCompleted(data) {
      const { findAllAppointments } = data || {};

      if (findAllAppointments) {
        const { appointments, pagination } = findAllAppointments

        if (pagination) {
          const { totalPages } = pagination

          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }

        if (!!appointments?.length) {
          dispatch({
            type: ActionType.SET_APPOINTMENTS,
            appointments: appointments as AppointmentsPayload['appointments'],
          });
        } else {
          dispatch({ type: ActionType.SET_APPOINTMENTS, appointments: [] });
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
        }
      }
    }
  });

  const fetchAppointments = useCallback(async () => {
    try {
      await findAllAppointments({
        variables: {
          appointmentInput: {
            paginationOptions: { page: page, limit: PAGE_LIMIT },
            patientId: patientId,
            // isCheckedIn: true
          }
        }
      })
    } catch (error) { }
  }, [findAllAppointments, page, patientId])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleVisitModalOpen = (appointmentId: string) => {
    dispatch({ type: ActionType.SET_APPOINTMENT_ID, appointmentId })
    dispatch({ type: ActionType.SET_OPEN_PATIENT_MODAL, openPatientModal: true })
  }

  return (
    <div>
      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow appointment-view-list">
          <Table aria-label="customized table" className={classes.table}>
            <TableHead>
              <TableRow>
                {renderTh(TYPE)}
                {renderTh(DATE)}
                {renderTh(FACILITY)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {(loading) ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={8} />
                  </TableCell>
                </TableRow>
              ) : (
                appointments?.map((appointment: AppointmentPayload['appointment']) => {
                  const {
                    id, scheduleStartDateTime, facility, appointmentType, appointmentDate
                  } = appointment || {};

                  const { name } = facility || {};
                  const { name: type } = appointmentType || {};


                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{type}</TableCell>
                      <TableCell scope="row">
                        <Box display='flex' flexDirection='column'>
                          {getAppointmentDateWithDay(appointmentDate || '', 'YYYY-MM-DD')}  {getStandardTime(scheduleStartDateTime || '')}
                        </Box>
                      </TableCell>

                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Box>
                            <IconButton size='small' onClick={() => id && handleVisitModalOpen(id)}>
                              <EyeIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {((!loading && appointments?.length === 0) || error) &&
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          }
        </Box>
      </Box>

      {
        openPatientModal && <VisitModal
          appointmentId={appointmentId}
          handleClose={() => dispatch({ type: ActionType.SET_OPEN_PATIENT_MODAL, openPatientModal: false })}
          isOpen={openPatientModal}
        />
      }

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}
    </div>
  )
}

export default VisitsTab