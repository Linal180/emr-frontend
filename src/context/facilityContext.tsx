// packages block
import { createContext, FC, useCallback, useReducer, Reducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT } from "../constants";
import { FacilityContextInterface } from "../interfacesTypes";
import {
  Action, ActionType, initialState, facilityContextReducer, State as LocalState
} from '../reducers/facilityContextReducer';
import {
  AllDoctorPayload, useFindAllDoctorLazyQuery, useFindAllPatientLazyQuery, PatientsPayload,
  ContactsPayload, ServicesPayload, useFindAllServicesLazyQuery, useFindAllContactsLazyQuery,
} from "../generated/graphql";

export const FacilityContext = createContext<FacilityContextInterface>({
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

export const FacilityContextProvider: FC = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(facilityContextReducer, initialState)
  const {
    doctorPages, doctorList, servicePages, locationPages, serviceList, locationList,
    patientList, patientPages
  } = state;

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

  const fetchAllDoctorList = useCallback((facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: [] })

    findAllDoctor({
      variables: {
        doctorInput: {
          facilityId,
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllDoctor])

  const fetchAllPatientList = useCallback((facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: [] })

    findAllPatient({
      variables: {
        patientInput: {
          facilityId,
          paginationOptions: {
            page,
            limit: LIST_PAGE_LIMIT
          }
        }
      },
    });
  }, [findAllPatient])

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

  const setDoctorList = (doctors: AllDoctorPayload['doctors']) => dispatch({
    type: ActionType.SET_DOCTOR_LIST, doctorList: doctors
  });

  const setLocationList = (locations: ContactsPayload['contacts']) => dispatch({
    type: ActionType.SET_LOCATION_LIST, locationList: locations
  });

  const setServicesList = (services: ServicesPayload['services']) => dispatch({
    type: ActionType.SET_SERVICE_LIST, serviceList: services
  });

  const setPatientList = (patients: PatientsPayload['patients']) => dispatch({
    type: ActionType.SET_PATIENT_LIST, patientList: patients
  });

  const setDoctorPages = (pageNumber: number) => dispatch({
    type: ActionType.SET_DOCTOR_PAGES, doctorPages: pageNumber
  });

  const setLocationPages = (pageNumber: number) => dispatch({
    type: ActionType.SET_LOCATION_PAGES, locationPages: pageNumber
  });

  const setServicePages = (pageNumber: number) => dispatch({
    type: ActionType.SET_SERVICE_PAGES, servicePages: pageNumber
  });

  const setPatientPages = (pageNumber: number) => dispatch({
    type: ActionType.SET_PATIENT_PAGES, patientPages: pageNumber
  });


  return (
    <FacilityContext.Provider
      value={{
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
    </FacilityContext.Provider>
  );
};
