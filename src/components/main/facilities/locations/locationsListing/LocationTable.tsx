// packages block
import { ChangeEvent, FC, Reducer, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableCell, TableHead, TextField, TableRow } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import LocationModal from "../locationModal";
import TableLoader from "../../../../common/TableLoader";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../../utils";
import { useTableStyles } from "../../../../../styles/tableStyles";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { LocationTableProps, ParamsType } from "../../../../../interfacesTypes";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../../assets/svgs";
import { locationReducer, Action, initialState, State, ActionType } from '../../../../../reducers/locationReducer';
import { ContactPayload, useFindAllContactsLazyQuery, useRemoveContactMutation } from "../../../../../generated/graphql";
import { ACTION, EMAIL, NAME, PAGE_LIMIT, PHONE, ZIP, CITY, FAX, STATE, CANT_DELETE_LOCATION, LOCATION, DELETE_LOCATION_DESCRIPTION, LOCATION_DELETED_SUCCESSFULLY } from "../../../../../constants";

const LocationTable: FC<LocationTableProps> = ({ locationDispatch, openModal }): JSX.Element => {
  const classes = useTableStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(locationReducer, initialState)
  const { page, totalPages, isEdit, openDelete, locationId, deleteLocationId, searchQuery, locations } = state;

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
          dispatch({ type: ActionType.SET_LOCATIONS, locations: contacts || [] });
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
  }, [page, findAllContacts, searchQuery, facilityId, locations]);

  const handleChange = (event: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page });

  const handleSearch = () => { }

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

  const handleEdit = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatch({ type: ActionType.SET_LOCATION_ID, locationId: id })
      locationDispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })
    }
  };

  const handleReload = () => {
    dispatch({ type: ActionType.SET_LOCATIONS, locations: [] });
    findAllContacts();
  }

  useEffect(() => {
    if (!openModal) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
    }
  }, [openModal])

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box className={classes.searchContainer}>
          <TextField
            value={searchQuery}
            className={classes.tablesSearchIcon}
            onChange={({ target: { value } }) => dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: value })}
            onKeyPress={({ key }) => key === "Enter" && handleSearch()}
            name="searchQuery"
            variant="outlined"
            placeholder="Search"
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
                      <TableCell scope="row">{fax}</TableCell>
                      <TableCell scope="row">{phone}</TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <IconButton size="small" onClick={() => handleEdit(id || '')}>
                            <EditIcon />
                          </IconButton>

                          <IconButton aria-label="delete" color="primary" size="small" onClick={() => onDeleteClick(id || '')}>
                            <TrashIcon />
                          </IconButton>
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
            setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
          />

          <LocationModal
            isEdit={isEdit}
            isOpen={openModal}
            reload={handleReload}
            locationId={locationId}
            setOpen={(open: boolean) => locationDispatch({ type: ActionType.SET_OPEN_MODAL, openModal: open })}
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
