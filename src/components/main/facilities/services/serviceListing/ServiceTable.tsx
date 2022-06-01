// packages block
import { FC, useEffect, ChangeEvent, Reducer, useReducer, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Search from "../../../../common/Search";
import TableLoader from "../../../../common/TableLoader";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../../utils";
import { ParamsType } from "../../../../../interfacesTypes";
import { useTableStyles } from "../../../../../styles/tableStyles";
import { BLUE_FOUR, RED, } from "../../../../../theme";
import { EditNewIcon, TrashNewIcon } from "../../../../../assets/svgs";
import {
  serviceReducer, serviceAction, initialState, State, ActionType
} from '../../../../../reducers/serviceReducer';
import {
  useFindAllServicesLazyQuery, useRemoveServiceMutation, ServicePayload, ServicesPayload
} from "../../../../../generated/graphql";
import {
  ACTION, NAME, DURATION, STATUS, PRICE, PAGE_LIMIT, CANT_DELETE_SERVICE, SERVICE,
  DELETE_SERVICE_DESCRIPTION, ACTIVE, INACTIVE, FACILITIES_ROUTE, FACILITY_SERVICES_ROUTE
} from "../../../../../constants";

const ServicesTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, serviceAction>>(serviceReducer, initialState)
  const { page, totalPages, openDelete, deleteServiceId, searchQuery, services } = state;

  const [findAllServices, { loading, error }] = useFindAllServicesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      serviceInput: {
        facilityId, serviceName: searchQuery,
        paginationOptions: { page, limit: PAGE_LIMIT }
      }
    },

    onError() {
      dispatch({
        type: ActionType.SET_SERVICES, services: []
      });
    },

    onCompleted(data) {
      const { findAllServices } = data || {};

      if (findAllServices) {
        const { services, pagination } = findAllServices

        if (pagination) {
          const { totalPages } = pagination
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        }

        !!services && dispatch({
          type: ActionType.SET_SERVICES, services: services as ServicesPayload['services']
        });
      } else {
        dispatch({ type: ActionType.SET_SERVICES, services: [] });
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
          fetchServices();
        }
      }
    }
  });

  const fetchServices = useCallback(async () => {
    try {
      await findAllServices();
    } catch (error) { }
  }, [findAllServices])

  useEffect(() => {
    facilityId && fetchServices();
  }, [fetchServices, searchQuery, facilityId]);

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

  const handleChange = (_: ChangeEvent<unknown>, page: number) =>
    dispatch({ type: ActionType.SET_PAGE, page });

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box py={2} mb={2} maxWidth={450}>
          <Search search={search} />
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
                services?.map((service: ServicePayload['service']) => {
                  const { id, name, duration, price, isActive } = service || {};
                  const ActiveStatus = isActive ? ACTIVE : INACTIVE;
                  const StatusColor = isActive ? BLUE_FOUR : RED

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{duration}</TableCell>
                      <TableCell scope="row">{price}</TableCell>
                      <TableCell scope="row">
                        <Box className={classes.status} component='span' color={StatusColor} border={`1px solid ${StatusColor}`}>
                          {ActiveStatus}
                        </Box>
                      </TableCell>

                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Box className={classes.iconsBackground}>
                            <Link to={`${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}/${id}`}>
                              <EditNewIcon />
                            </Link>
                          </Box>

                          <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                            <TrashNewIcon />
                          </Box>
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
            handleDelete={handleDeleteService}
            description={DELETE_SERVICE_DESCRIPTION}
            setOpen={(openDelete: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete })}
          />
        </Box>
      </Box>

      {totalPages > 1 && (
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
    </>
  );
};

export default ServicesTable;
