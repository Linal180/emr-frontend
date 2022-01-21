// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import { FacilitiesPayload, ServicesPayload, useFindAllFacilitiesLazyQuery, useFindAllServicesLazyQuery } from "../generated/graphql";
import { Action, ActionType, initialState, listContextReducer, State as LocalState } from '../reducers/listContextReducer';

export const ListContext = createContext<ListContextInterface>({
  facilityList: [],
  setFacilityList: () => { },
  fetchAllFacilityList: () => { },
  serviceList: [],
  setServiceList: () => { },
  fetchAllServiceList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const { facilityPages, facilityList, serviceList, servicePages } = state;

  const [findAllFacility] = useFindAllFacilitiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllFacility: { facility, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;
          if (totalPages ? facilityPages !== totalPages : false) {
            setFacilityPages(facilityPages + 1)
          }
        }

        !!facility && !!facilityList && setFacilityList([...facilityList, ...facility])
      }
    }
  })

  const [findAllServices] = useFindAllServicesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllServices: { services, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;
          if (totalPages ? servicePages !== totalPages : false) {
            setServicePages(servicePages + 1)
          }
        }

        !!services && !!serviceList && setServiceList([...serviceList, ...services])
      }
    }
  })

  const fetchAllServiceList = useCallback((page = 1) => {
    dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [] })

    findAllServices({
      variables: {
        serviceInput: {
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllServices])

  const fetchAllFacilityList = useCallback((page = 1) => {
    dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [] })

    findAllFacility({
      variables: {
        facilityInput: {
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllFacility])


  useEffect(() => { hasToken && fetchAllServiceList(servicePages) }, [fetchAllServiceList, hasToken, servicePages])

  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])

  const setFacilityList = (facilities: FacilitiesPayload['facility']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setServiceList = (services: ServicesPayload['services']) => dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: services });
  const setServicePages = (pageNumber: number) => dispatch({ type: ActionType.SET_SERVICE_PAGES, servicePages: pageNumber });

  return (
    <ListContext.Provider
      value={{
        facilityList,
        setFacilityList,
        fetchAllFacilityList,
        serviceList,
        setServiceList,
        fetchAllServiceList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
