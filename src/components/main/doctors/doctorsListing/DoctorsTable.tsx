// packages block
import { FC, useEffect, ChangeEvent, useContext, useReducer, Reducer } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {
  Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { ListContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { formatPhone, renderTh, upperToNormal } from "../../../../utils";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../assets/svgs";
import { doctorReducer, Action, initialState, State, ActionType } from "../../../../reducers/doctorReducer";
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, useRemoveDoctorMutation, DoctorPayload
} from "../../../../generated/graphql";
import {
  ACTION, EMAIL, PHONE, PAGE_LIMIT, DELETE_DOCTOR_DESCRIPTION, FACILITY, DOCTORS_ROUTE,
  CANT_DELETE_DOCTOR, DOCTOR, NAME, SPECIALITY
} from "../../../../constants";

const DoctorsTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { fetchAllDoctorList } = useContext(ListContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { page, totalPages, searchQuery, openDelete, deleteDoctorId, doctors } = state;

  const [findAllDoctor, { loading, error }] = useFindAllDoctorLazyQuery({
    variables: {
      doctorInput: {
        paginationOptions: {
          page,
          limit: PAGE_LIMIT,
        }
      }
    },

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

  const [removeDoctor, { loading: deleteDoctorLoading }] = useRemoveDoctorMutation({
    onError() {
      Alert.error(CANT_DELETE_DOCTOR)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removeDoctor: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          findAllDoctor()
          fetchAllDoctorList();
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery) {
      findAllDoctor()
    }
  }, [page, findAllDoctor, searchQuery]);

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

  return (
    <Box className={classes.mainTableContainer}>
      <Box className={classes.searchContainer}>
        <TextField
          name="searchQuery"
          className={classes.tablesSearchIcon}
          value={searchQuery}
          onChange={({ target: { value } }) => dispatch(
            { type: ActionType.SET_SEARCH_QUERY, searchQuery: value })}
          onKeyPress={({ key }) => key === "Enter"}
          placeholder="Search"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment:
              <IconButton color="default">
                <TablesSearchIcon />
              </IconButton>
          }}
        />
      </Box>

      <Box className="table-overflow">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(NAME)}
              {renderTh(EMAIL)}
              {renderTh(PHONE)}
              {renderTh(SPECIALITY)}
              {renderTh(FACILITY)}
              {renderTh(ACTION, "center")}
            </TableRow >
          </TableHead >

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
                    <TableCell scope="row">{upperToNormal(speciality as string)}</TableCell>
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
        </Table >

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
      </Box >
    </Box >
  );
};

export default DoctorsTable;
