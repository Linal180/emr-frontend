// packages block
import { ChangeEvent, FC, Reducer, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Search from "../../../../common/Search";
import TableLoader from "../../../../common/TableLoader";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { formatPhone, renderTh } from "../../../../../utils";
import { ParamsType } from "../../../../../interfacesTypes";
import { useTableStyles } from "../../../../../styles/tableStyles";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { EditIcon, TrashIcon } from "../../../../../assets/svgs";
import {
  locationReducer, Action, initialState, State, ActionType
} from '../../../../../reducers/locationReducer';
import {
  ContactPayload, ContactsPayload, useFindAllContactsLazyQuery,
  useRemoveContactMutation
} from "../../../../../generated/graphql";
import {
  ACTION, EMAIL, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, FAX, STATE, CANT_DELETE_LOCATION,
  LOCATION, DELETE_LOCATION_DESCRIPTION, LOCATION_DELETED_SUCCESSFULLY, FACILITIES_ROUTE, FACILITY_LOCATIONS_ROUTE
} from "../../../../../constants";

const LocationTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(locationReducer, initialState)
  const { page, totalPages, openDelete, deleteLocationId, searchQuery, locations } = state;

  const [findAllContacts, { loading, error }] = useFindAllContactsLazyQuery({
    variables: {
      contactInput: {
        facilityId,
        paginationOptions: {
          page,
          limit: PAGE_LIMIT
        }
      }
    },

    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_LOCATIONS, locations: [] });
    },

    onCompleted(data) {
      const { findAllContacts } = data || {};

      if (findAllContacts) {
        const { contacts, pagination } = findAllContacts

        if (!searchQuery && pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
          dispatch({ type: ActionType.SET_LOCATIONS, locations: contacts as ContactsPayload['contacts'] || undefined });
        }
      }
    }
  });

  const [removeContact, { loading: deleteLocationLoading }] = useRemoveContactMutation({
    onError() {
      Alert.error(CANT_DELETE_LOCATION)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removeContact: { response } } = data

        if (response) {
          Alert.success(LOCATION_DELETED_SUCCESSFULLY);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          findAllContacts();
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery && facilityId) {
      findAllContacts()
    }
  }, [findAllContacts, searchQuery, facilityId]);

  const handleChange = (event: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_LOCATION_ID, deleteLocationId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeleteLocation = async () => {
    if (deleteLocationId) {
      await removeContact({
        variables: {
          removeContact: {
            id: deleteLocationId
          }
        }
      })
    }
  };

  const search = (query: string) => { }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Search search={search} />

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(CITY)}
                {renderTh(STATE)}
                {renderTh(ZIP)}
                {renderTh(FAX)}
                {renderTh(PHONE)}
                {renderTh(EMAIL)}
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
                locations?.map((location: ContactPayload['contact']) => {
                  const { id, name, city, state, zipCode, fax, phone, email } = location || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{city}</TableCell>
                      <TableCell scope="row">{state}</TableCell>
                      <TableCell scope="row">{zipCode}</TableCell>
                      <TableCell scope="row">{formatPhone(fax || '')}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Box className={classes.iconsBackground}>
                            <Link to={`${FACILITIES_ROUTE}/${facilityId}${FACILITY_LOCATIONS_ROUTE}/${id}`}>
                              <EditIcon />
                            </Link>
                          </Box>

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

          {((!loading && locations?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={LOCATION}
            isOpen={openDelete}
            isLoading={deleteLocationLoading}
            description={DELETE_LOCATION_DESCRIPTION}
            handleDelete={handleDeleteLocation}
            setOpen={(open: boolean) => dispatch({
              type: ActionType.SET_OPEN_DELETE, openDelete: open
            })}
          />
        </Box>
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" pt={2.25}>
          <Pagination
            page={page}
            shape="rounded"
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default LocationTable;
