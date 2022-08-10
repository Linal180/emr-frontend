// packages block
import { FC, useEffect, ChangeEvent, Reducer, useReducer, useCallback, useContext } from "react";
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
import { AuthContext } from "../../../../../context";
import { BLUE_FOUR, RED, } from "../../../../../theme";
import { ParamsType } from "../../../../../interfacesTypes";
import { useTableStyles } from "../../../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon } from "../../../../../assets/svgs";
import { getPageNumber, isSuperAdmin, renderTh } from "../../../../../utils";
import {
  serviceReducer, serviceAction, initialState, State, ActionType
} from '../../../../../reducers/serviceReducer';
import {
  useFindAllServicesLazyQuery, ServicePayload, ServicesPayload, useRemoveServiceMutation
} from "../../../../../generated/graphql";
import {
  ACTION, NAME, DURATION, STATUS, PAGE_LIMIT, ACTIVE, INACTIVE, FACILITIES_ROUTE,
  FACILITY_SERVICES_ROUTE, SERVICE, DELETE_SERVICE_DESCRIPTION, CANT_DELETE_SERVICE
} from "../../../../../constants";

const ServicesTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const { user } = useContext(AuthContext)
  const { roles } = user || {}

  const isSuper = isSuperAdmin(roles)
  const { id: facilityId } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, serviceAction>>(serviceReducer, initialState)
  const { page, openDelete, deleteServiceId, totalPages, searchQuery, services } = state;

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

        const sortedServices = services?.sort((a, b) => {
          if (a?.updatedAt && b?.updatedAt) {
            return (a?.updatedAt < b?.updatedAt) ? 1 : ((b?.updatedAt < a?.updatedAt) ? -1 : 0)
          }

          return 0
        })

        !!sortedServices && dispatch({
          type: ActionType.SET_SERVICES,
          services: services as ServicesPayload['services']
        })

      } else {
        dispatch({ type: ActionType.SET_SERVICES, services: [] });
      }
    }
  });

  const [removeService, { loading: removeServiceLoading }] = useRemoveServiceMutation({
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

          if (!!services && services.length > 1) {
            fetchServices();
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, services?.length || 0) })
          }
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
    deleteServiceId && await removeService({
      variables: {
        removeService: { id: deleteServiceId }
      }
    })
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
        <Box mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table" className={classes.table}>
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(DURATION)}
                {renderTh(STATUS)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
                  </TableCell>
                </TableRow>
              ) : (
                services?.map((service: ServicePayload['service']) => {
                  const { id, name, duration, isActive } = service || {};
                  const ActiveStatus = isActive ? ACTIVE : INACTIVE;
                  const StatusColor = isActive ? BLUE_FOUR : RED

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{duration}</TableCell>
                      <TableCell scope="row">
                        <Box className={classes.status} component='span' color={StatusColor}>
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

                          {isSuper &&
                            <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
                              <TrashNewIcon />
                            </Box>
                          }
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
            isLoading={removeServiceLoading}
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
