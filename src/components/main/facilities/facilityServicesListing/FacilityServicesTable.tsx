// packages block
import { FC, useEffect, ChangeEvent, Reducer, useReducer } from "react";
import { useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, IconButton, Table, TableBody, TableHead, TextField, TableRow, TableCell } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import Alert from "../../../common/Alert";
import ConfirmationModal from "../../../common/ConfirmationModal";
import TableLoader from "../../../common/TableLoader";
import ServiceModal from "../services/serviceModal";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { useFindAllServicesLazyQuery, useRemoveServiceMutation, ServicePayload } from "../../../../generated/graphql";
import { renderTh } from "../../../../utils";
import { useTableStyles } from "../../../../styles/tableStyles";
import { EditIcon, TablesSearchIcon, TrashIcon } from "../../../../assets/svgs";
import { ACTION, NAME, DURATION, STATUS, PRICE, PAGE_LIMIT, CANT_DELETE_SERVICE, SERVICE, DELETE_SERVICE_DESCRIPTION, ACTIVE, INACTIVE } from "../../../../constants";
import { ServiceTableProps, ParamsType } from "../../../../interfacesTypes";
import { serviceReducer, serviceAction, initialState, State, ActionType } from '../../../../reducers/serviceReducer';

const FacilityServicesTable: FC<ServiceTableProps> = ({ serviceDispatch, openModal }): JSX.Element => {
  const classes = useTableStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, serviceAction>>(serviceReducer, initialState)
  const { page, totalPages, isEdit, openDelete, serviceId, deleteServiceId, searchQuery, services } = state;

  const [findAllServices, { loading, error }] = useFindAllServicesLazyQuery({
    variables: {
      serviceInput: {
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
      dispatch({
        type: ActionType.SET_SERVICES, services: []
      });
    },

    onCompleted(data) {
      const { findAllServices } = data || {};

      if (findAllServices) {
        const { services, pagination } = findAllServices
        dispatch({ type: ActionType.SET_SERVICES, services: services || [] });

        if (!searchQuery && pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }
      }
    }
  });

  const [removeService, { loading: deleteServiceLoading }] = useRemoveServiceMutation({
    onError() {
      Alert.error(CANT_DELETE_SERVICE)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removeService: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
          findAllServices();
        }
      }
    }
  });

  useEffect(() => {
    if (!searchQuery && facilityId) {
      findAllServices()
    }
  }, [page, findAllServices, searchQuery, facilityId, services]);

  useEffect(() => {
    if (!openModal) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
    }
  }, [openModal]);

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_SERVICE_ID, deleteServiceId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeleteService = async () => {
    if (deleteServiceId) {
      await removeService({
        variables: {
          removeService: {
            id: deleteServiceId
          }
        }
      })
    }
  };

  const handleEdit = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_SERVICE_ID, serviceId: id })
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      serviceDispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })
    }
  };

  const handleReload = () => {
    dispatch({ type: ActionType.SET_SERVICES, services: [] })
    findAllServices();
  }

  const handleChange = (event: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page });

  const handleSearch = () => { }

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
                {renderTh(DURATION)}
                {renderTh(PRICE)}
                {renderTh(STATUS)}
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
                services?.map((service: ServicePayload['service'], index: number) => {
                  const { id, name, duration, price, isActive } = service || {};
                  const ActiveStatus = isActive === true ? `${ACTIVE}` : `${INACTIVE}`

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{duration}</TableCell>
                      <TableCell scope="row">{price}</TableCell>
                      <TableCell className={classes.status} scope="row">{ActiveStatus}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center" onClick={() => handleEdit(id || '')}>
                          <IconButton size="small">
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

          {((!loading && services?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={SERVICE}
            isOpen={openDelete}
            isLoading={deleteServiceLoading}
            description={DELETE_SERVICE_DESCRIPTION}
            handleDelete={handleDeleteService}
            setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
          />

          <ServiceModal
            isEdit={isEdit}
            isOpen={openModal}
            reload={handleReload}
            serviceId={serviceId}
            setOpen={(open: boolean) => serviceDispatch({ type: ActionType.SET_OPEN_MODAL, openModal: open })}
          />
        </Box>
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" pt={2.25}>
          <Pagination
            count={totalPages}
            shape="rounded"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default FacilityServicesTable;