// packages block
import { createContext, FC, useCallback, useReducer, Reducer } from "react";
// graphql, interfaces/types, reducer and constants block
import { LIST_PAGE_LIMIT } from "../constants";
import { FacilityContextInterface } from "../interfacesTypes";
import {
  Action, ActionType, initialState, facilityContextReducer, State as LocalState
} from '../reducers/facilityContextReducer';
import {
  AllDoctorPayload, PatientsPayload, useFindAllServiceListLazyQuery, ServicesPayload,
  useFindAllDoctorListLazyQuery, useFindAllPatientListLazyQuery,
} from "../generated/graphql";

export const FacilityContext = createContext<FacilityContextInterface>({
  doctorList: [],
  setDoctorList: () => { },
  fetchAllDoctorList: () => { },
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
    doctorPages, doctorList, servicePages, serviceList, patientList, patientPages
  } = state;

  const [findAllDoctor] = useFindAllDoctorListLazyQuery({
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

  const [findAllPatient] = useFindAllPatientListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      try {
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
      } catch (error) { }
    }
  })

  const [findAllServices] = useFindAllServiceListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      try {
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
      } catch (error) { }
    }
  })

  const fetchAllDoctorList = useCallback(async (facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: [] })

    try {
      await findAllDoctor({
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
    } catch { }
  }, [findAllDoctor])

  const fetchAllPatientList = useCallback(async (facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: [] })

    try {
      await findAllPatient({
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

    } catch { }
  }, [findAllPatient])

  const fetchAllServicesList = useCallback(async (facilityId, page = 1) => {
    dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: [] })

    try {
      await findAllServices({
        variables: {
          serviceInput: {
            facilityId,
            isActive: true,
            paginationOptions: {
              page,
              limit: LIST_PAGE_LIMIT
            }
          }
        },
      });
    } catch { }
  }, [findAllServices])

  const setDoctorList = (doctors: AllDoctorPayload['doctors']) => dispatch({
    type: ActionType.SET_DOCTOR_LIST, doctorList: doctors
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
        patientList,
        setPatientList,
        fetchAllPatientList
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
};
