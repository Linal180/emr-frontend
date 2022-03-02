// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer, useContext } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import {
  Action, ActionType, initialState, listContextReducer, State as LocalState
} from '../reducers/listContextReducer';
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, FacilitiesPayload, useFindAllFacilitiesLazyQuery,
  ContactsPayload, ServicesPayload, useFindAllServicesLazyQuery, useFindAllContactsLazyQuery, useFindAllPatientLazyQuery, PatientsPayload,
} from "../generated/graphql";
import { AuthContext } from "./authContext";
import { isSuperAdmin } from "../utils";

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
  patientList: [],
  setPatientList: () => { },
  fetchAllPatientList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles, facility } = user || {};
  const { practiceId: parentId } = facility || {};
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const {
    doctorPages, doctorList, facilityPages, facilityList, servicePages, locationPages,
    serviceList, locationList, patientList, patientPages, practiceId
  } = state;

  const [findAllFacility] = useFindAllFacilitiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllFacility: { facilities, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;

          if (totalPages ? facilityPages !== totalPages : false) {
            setFacilityPages(facilityPages + 1)
          }
        }

        !!facilities && !!facilityList &&
          setFacilityList([...facilityList, ...facilities] as FacilitiesPayload['facilities'])
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

        !!doctors && !!doctorList &&
          setDoctorList([...doctorList, ...doctors] as AllDoctorPayload['doctors'])
      }
    }
  })

  const [findAllPatient] = useFindAllPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatient: { patients, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination;

          if (totalPages ? patientPages !== totalPages : false) {
            setPatientPages(patientPages + 1)
          }
        }

        !!patients && !!patientList &&
          setPatientList([...patientList, ...patients] as PatientsPayload['patients'])
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

        !!services && !!serviceList &&
          setServicesList([...serviceList, ...services] as ServicesPayload['services'])
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

        !!contacts && !!locationList &&
          setLocationList([...locationList, ...contacts] as ContactsPayload['contacts'])
      }
    }
  })

  const fetchAllFacilityList = useCallback(async (page = 1) => {
    try {
      dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [] })
      const pageInputs = { paginationOptions: { page, limit: LIST_PAGE_LIMIT } };
      const facilityInputs = practiceId ? { practiceId, ...pageInputs } : { ...pageInputs };

      await findAllFacility({
        variables: {
          facilityInput: { ...facilityInputs }
        },
      });
    } catch (error) { }
  }, [findAllFacility, practiceId])

  const fetchAllDoctorList = useCallback(async (page = 1) => {
    try {
      dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: [] })

      await findAllDoctor({
        variables: {
          doctorInput: {
            paginationOptions: {
              page,
              limit: LIST_PAGE_LIMIT
            }
          }
        },
      });
    } catch (error) { }
  }, [findAllDoctor])

  const fetchAllPatientList = useCallback(async (page = 1) => {
    try {
      dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: [] })

      await findAllPatient({
        variables: {
          patientInput: {
            paginationOptions: {
              page,
              limit: LIST_PAGE_LIMIT
            }
          }
        },
      });
    } catch (error) { }
  }, [findAllPatient])

  const fetchAllServicesList = useCallback(async (page = 1) => {
    try {
      dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: [] })

      await findAllServices({
        variables: {
          serviceInput: {
            isActive: true,
            paginationOptions: {
              page,
              limit: LIST_PAGE_LIMIT
            }
          }
        },
      });
    } catch (error) { }
  }, [findAllServices])

  const fetchAllLocationList = useCallback(async (facilityId, page = 1) => {
    try {
      dispatch({ type: ActionType.SET_LOCATION_LIST, locationList: [] })

      await findAllContacts({
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
    } catch (error) { }
  }, [findAllContacts])

  useEffect(() => { }, [user]);
  useEffect(() => {
    const isSuper = isSuperAdmin(roles)

    !isSuper && parentId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: parentId })
  }, [parentId, roles, hasToken]);

  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])
  useEffect(() => { hasToken && fetchAllDoctorList(doctorPages) }, [fetchAllDoctorList, hasToken, doctorPages])
  useEffect(() => { hasToken && fetchAllPatientList(patientPages) }, [fetchAllPatientList, hasToken, patientPages])
  useEffect(() => { hasToken && fetchAllServicesList(servicePages) }, [fetchAllServicesList, hasToken, servicePages])

  const setFacilityList = (facilities: FacilitiesPayload['facilities']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });
  const setDoctorList = (doctors: AllDoctorPayload['doctors']) => dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: doctors });
  const setLocationList = (locations: ContactsPayload['contacts']) => dispatch({ type: ActionType.SET_LOCATION_LIST, locationList: locations });
  const setServicesList = (services: ServicesPayload['services']) => dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: services });
  const setPatientList = (patients: PatientsPayload['patients']) => dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: patients });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setDoctorPages = (pageNumber: number) => dispatch({ type: ActionType.SET_DOCTOR_PAGES, doctorPages: pageNumber });
  const setLocationPages = (pageNumber: number) => dispatch({ type: ActionType.SET_LOCATION_PAGES, locationPages: pageNumber });
  const setServicePages = (pageNumber: number) => dispatch({ type: ActionType.SET_SERVICE_PAGES, servicePages: pageNumber });
  const setPatientPages = (pageNumber: number) => dispatch({ type: ActionType.SET_PATIENT_PAGES, patientPages: pageNumber });


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
        fetchAllLocationList,
        patientList,
        setPatientList,
        fetchAllPatientList
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
