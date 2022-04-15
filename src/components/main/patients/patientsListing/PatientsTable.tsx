// packages block
import { FC, ChangeEvent, useEffect, useContext, useCallback, Reducer, useReducer } from "react";
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
import { AuthContext } from "../../../../context";
import { EditIcon, TrashIcon } from '../../../../assets/svgs'
import { useTableStyles } from "../../../../styles/tableStyles";
import { formatPhone, isSuperAdmin, renderTh } from "../../../../utils";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  useFindAllPatientLazyQuery, PatientsPayload, PatientPayload, useRemovePatientMutation
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, PHONE, PAGE_LIMIT, CANT_DELETE_PATIENT, DELETE_PATIENT_DESCRIPTION,
  PATIENTS_ROUTE, NAME, CITY, PATIENT, CHART_ID
} from "../../../../constants";

const PatientsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { roles, facility } = user || {};
  const { practiceId } = facility || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deletePatientId, patients } = state;

  const [findAllPatient, { loading, error }] = useFindAllPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENTS, patients: [] })
    },

    onCompleted(data) {
      const { findAllPatient } = data || {};

      if (findAllPatient) {
        const { pagination, patients } = findAllPatient
        patients && dispatch({ type: ActionType.SET_PATIENTS, patients: patients as PatientsPayload['patients'] })

        if (!searchQuery && pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        }
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const isSuper = isSuperAdmin(roles);
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const patientsInputs = isSuper ? { ...pageInputs } : { practiceId, ...pageInputs }

      await findAllPatient({
        variables: { patientInput: { ...patientsInputs, searchString: searchQuery } }
      })
    } catch (error) { }
  }, [roles, page, practiceId, findAllPatient, searchQuery])

  const [removePatient, { loading: deletePatientLoading }] = useRemovePatientMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_PATIENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removePatient: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          fetchAllPatients();
        }
      }
    }
  });

  useEffect(() => { }, [user]);
  useEffect(() => {
    fetchAllPatients()
  }, [page, searchQuery, fetchAllPatients]);

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_PATIENT_ID, deletePatientId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeletePatient = async () => {
    deletePatientId && await removePatient({
      variables: { removePatient: { id: deletePatientId } }
    })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <Box className={classes.mainTableContainer}>
      <Search search={search} />

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(CHART_ID)}
              {renderTh(NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(CITY)}
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
              patients?.map((record: PatientPayload['patient']) => {
                const { id, patientRecord, firstName, lastName, email, contacts } = record || {};

                const patientContact = contacts && contacts.filter(contact => contact.primaryContact)[0];
                const { phone, city } = patientContact || {};

                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{patientRecord}</TableCell>
                    <TableCell scope="row">
                      <Link to={`${PATIENTS_ROUTE}/${id}/details`}>
                        {`${firstName} ${lastName}`}
                      </Link>
                    </TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                    <TableCell scope="row">{city}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Link to={`${PATIENTS_ROUTE}/${id}`}>
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
                );
              })
            )}
          </TableBody>
        </Table>

        {((!loading && !patients?.length) || error) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" pt={3}>
            <Pagination
              count={totalPages}
              shape="rounded"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )}

        <ConfirmationModal
          title={PATIENT}
          isOpen={openDelete}
          isLoading={deletePatientLoading}
          description={DELETE_PATIENT_DESCRIPTION}
          handleDelete={handleDeletePatient}
          setOpen={(openDelete: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete })}
        />
      </Box>
    </Box>
  );
};

export default PatientsTable;
