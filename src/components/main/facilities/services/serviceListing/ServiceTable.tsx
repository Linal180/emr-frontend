// packages block
import { FC, useEffect, ChangeEvent, Reducer, useReducer } from "react";
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
import { BLUE_FIVE, BLUE_FOUR, RED, RED_ONE } from "../../../../../theme";
import { EditIcon, TrashIcon } from "../../../../../assets/svgs";
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
        facilityId,
        paginationOptions: {
          page,
          limit: PAGE_LIMIT
        }
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
        dispatch({ type: ActionType.SET_SERVICES, services: services as ServicesPayload['services'] || [] });
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
  }, [findAllServices, searchQuery, facilityId]);

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

  const handleChange = (event: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page });

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
                  const ActiveStatus = isActive ? ACTIVE : INACTIVE;
                  const StatusBackground = isActive ? BLUE_FIVE : RED_ONE
                  const StatusColor = isActive ? BLUE_FOUR : RED

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{duration}</TableCell>
                      <TableCell scope="row">{price}</TableCell>
                      <TableCell scope="row">
                        <Box className={classes.status} component='span' bgcolor={StatusBackground} color={StatusColor}>
                          {ActiveStatus}
                        </Box>
                      </TableCell>

                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Box className={classes.iconsBackground}>
                            <Link to={`${FACILITIES_ROUTE}/${facilityId}${FACILITY_SERVICES_ROUTE}/${id}`}>
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
        </Box>
      </Box>

      {
        totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" pt={2.25}>
            <Pagination
              count={totalPages}
              shape="rounded"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )
      }
    </>
  );
};

export default ServicesTable;
