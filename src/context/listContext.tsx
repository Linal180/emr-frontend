// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, FacilitiesPayload, useFindAllFacilitiesLazyQuery, ContactsPayload, ServicesPayload, useFindAllServicesLazyQuery, useFindAllContactsLazyQuery,
} from "../generated/graphql";
import { Action, ActionType, initialState, listContextReducer, State as LocalState } from '../reducers/listContextReducer';

export const ListContext = createContext<ListContextInterface>({
  facilityList: [],
  setFacilityList: () => { },
  fetchAllFacilityList: () => { },
  doctorList: [],
  setDoctorList: () => { },
  fetchAllDoctorList: () => { },
  locationList: [],
  setLocationList: () => { },
  fetchAllLocationList: () => { },
  serviceList: [],
  setServicesList: () => { },
  fetchAllServicesList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const { doctorPages, doctorList, facilityPages, facilityList, servicePages, locationPages, serviceList, locationList } = state;

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

        !!facility && !!facilityList && setFacilityList([...facilityList, ...facility] as FacilitiesPayload['facility'])
      }
    }
  })

  const [findAllDoctor] = useFindAllDoctorLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllDoctor: { doctors, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;
          if (totalPages ? doctorPages !== totalPages : false) {
            setDoctorPages(doctorPages + 1)
          }
        }

        !!doctors && !!doctorList && setDoctorList([...doctorList, ...doctors] as AllDoctorPayload['doctors'])
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

        !!services && !!serviceList && setServicesList([...serviceList, ...services] as ServicesPayload['services'])
      }
    }
  })

  const [findAllContacts] = useFindAllContactsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllContacts: { contacts, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;
          if (totalPages ? locationPages !== totalPages : false) {
            setLocationPages(locationPages + 1)
          }
        }

        !!contacts && !!locationList && setLocationList([...locationList, ...contacts] as ContactsPayload['contacts'])
      }
    }
  })

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

  const fetchAllDoctorList = useCallback((page = 1) => {
    dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: [] })

    findAllDoctor({
      variables: {
        doctorInput: {
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllDoctor])

  const fetchAllServicesList = useCallback((facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: [] })

    findAllServices({
      variables: {
        serviceInput: {
          facilityId,
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllServices])

  const fetchAllLocationList = useCallback((facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_LOCATION_LIST, locationList: [] })

    findAllContacts({
      variables: {
        contactInput: {
          facilityId,
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllContacts])

  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])
  useEffect(() => { hasToken && fetchAllDoctorList(doctorPages) }, [fetchAllDoctorList, hasToken, doctorPages])

  const setFacilityList = (facilities: FacilitiesPayload['facility']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });
  const setDoctorList = (doctors: AllDoctorPayload['doctors']) => dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: doctors });
  const setLocationList = (locations: ContactsPayload['contacts']) => dispatch({ type: ActionType.SET_LOCATION_LIST, locationList: locations });
  const setServicesList = (services: ServicesPayload['services']) => dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: services });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setDoctorPages = (pageNumber: number) => dispatch({ type: ActionType.SET_DOCTOR_PAGES, doctorPages: pageNumber });
  const setLocationPages = (pageNumber: number) => dispatch({ type: ActionType.SET_LOCATION_PAGES, locationPages: pageNumber });
  const setServicePages = (pageNumber: number) => dispatch({ type: ActionType.SET_SERVICE_PAGES, servicePages: pageNumber });

  return (
    <ListContext.Provider
      value={{
        facilityList,
        setFacilityList,
        fetchAllFacilityList,
        doctorList,
        setDoctorList,
        fetchAllDoctorList,
        serviceList,
        setServicesList,
        fetchAllServicesList,
        locationList,
        setLocationList,
        fetchAllLocationList
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
