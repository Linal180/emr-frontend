// packages block
import { FC, useEffect, ChangeEvent, useContext, useReducer, Reducer, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { AuthContext, ListContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { formatPhone, formatValue, isSuperAdmin, renderTh } from "../../../../utils";
import { EditIcon, TrashIcon } from "../../../../assets/svgs";
import { doctorReducer, Action, initialState, State, ActionType } from "../../../../reducers/doctorReducer";
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, useRemoveDoctorMutation, DoctorPayload
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, PHONE, PAGE_LIMIT, DELETE_DOCTOR_DESCRIPTION, FACILITY, DOCTORS_ROUTE,
  CANT_DELETE_DOCTOR, DOCTOR, NAME, SPECIALTY
} from "../../../../constants";

const DoctorsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { facility, roles } = user || {}
  const { id: facilityId } = facility || {}
  const { fetchAllDoctorList } = useContext(ListContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deleteDoctorId, doctors } = state;

  const [findAllDoctor, { loading, error }] = useFindAllDoctorLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_DOCTORS, doctors: [] })
    },

    onCompleted(data) {
      const { findAllDoctor } = data || {};

      if (findAllDoctor) {
        const { doctors, pagination } = findAllDoctor

        if (!searchQuery) {
          if (pagination) {
            const { totalPages } = pagination
            totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
          }

          doctors && dispatch({ type: ActionType.SET_DOCTORS, doctors: doctors as AllDoctorPayload['doctors'] })
        }
      }
    }
  });

  const fetchAllDoctors = useCallback(() => {
    const isSuper = isSuperAdmin(roles);
    const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
    const doctorInputs = isSuper ? { ...pageInputs } : { facilityId, ...pageInputs }

    findAllDoctor({
      variables: {
        doctorInput: { ...doctorInputs }
      },
    })
  }, [facilityId, findAllDoctor, page, roles])

  const [removeDoctor, { loading: deleteDoctorLoading }] = useRemoveDoctorMutation({
    onError() {
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
      Alert.error(CANT_DELETE_DOCTOR)
    },

    onCompleted(data) {
      if (data) {
        const { removeDoctor: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          fetchAllDoctors()
          fetchAllDoctorList();
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
        }
      }
    }
  });

  useEffect(() => {
    !searchQuery && fetchAllDoctors()
  }, [page, searchQuery, facilityId, roles, fetchAllDoctors]);

  useEffect(() => { }, [user]);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_DOCTOR_ID, deleteDoctorId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeleteDoctor = async () => {
    if (deleteDoctorId) {
      await removeDoctor({
        variables: {
          removeDoctor: {
            id: deleteDoctorId
          }
        }
      })
    }
  };

  const search = (query: string) => { }

  return (
    <Box className={classes.mainTableContainer}>
      <Search search={search} />

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(SPECIALTY)}
              {renderTh(FACILITY)}
              {renderTh(ACTION, "center")}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <TableLoader numberOfRows={10} numberOfColumns={5} />
                </TableCell>
              </TableRow>
            ) : (
              doctors?.map((doctor: DoctorPayload['doctor']) => {
                const { id, firstName, lastName, speciality, contacts, facility } = doctor || {};
                const doctorContact = contacts && contacts[0];
                const { email, phone } = doctorContact || {};
                const { name } = facility || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">
                      <Link to={`${DOCTORS_ROUTE}/${id}/details`}>
                        {`${firstName} ${lastName}`}
                      </Link>
                    </TableCell>

                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                    <TableCell scope="row">{formatValue(speciality as string)}</TableCell>
                    <TableCell scope="row">{name}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${DOCTORS_ROUTE}/${id}`}>
                          <Box className={classes.iconsBackground}>
                            <EditIcon />
                          </Box>
                        </Link>

                        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                          <TrashIcon />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {((!loading && doctors?.length === 0) || error) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

        {
          totalPages > 1 && (
            <Box display="flex" justifyContent="flex-end" pt={3}>
              <Pagination
                shape="rounded"
                page={page}
                count={totalPages}
                onChange={handleChange}
              />
            </Box>
          )
        }

        <ConfirmationModal
          title={DOCTOR}
          isOpen={openDelete}
          isLoading={deleteDoctorLoading}
          handleDelete={handleDeleteDoctor}
          description={DELETE_DOCTOR_DESCRIPTION}
          setOpen={(open: boolean) => dispatch({
            type: ActionType.SET_OPEN_DELETE, openDelete: open
          })}
        />
      </Box>
    </Box>
  );
};

export default DoctorsTable;
