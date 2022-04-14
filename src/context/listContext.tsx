// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer, useContext } from "react";
// graphql, interfaces/types, reducer and constants block
import { isSuperAdmin } from "../utils";
import { AuthContext } from "./authContext";
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import {
  Action, ActionType, initialState, listContextReducer, State as LocalState
} from '../reducers/listContextReducer';
import {
  AllDoctorPayload, FacilitiesPayload, ServicesPayload, PatientsPayload, useFindAllServiceListLazyQuery,
  PracticesPayload, RolesPayload, useFindAllRoleListLazyQuery, useFindAllPracticeListLazyQuery,
  useFindAllFacilityListLazyQuery, useFindAllDoctorListLazyQuery, useFindAllPatientListLazyQuery, RolePayload, DoctorPayload, ServicePayload, PatientPayload, PracticePayload, FacilityPayload,
} from "../generated/graphql";

export const ListContext = createContext<ListContextInterface>({
  roleList: [],
  setRoleList: () => { },
  fetchAllRoleList: () => { },
  practiceList: [],
  setPracticeList: () => { },
  fetchAllPracticeList: () => { },
  facilityList: [],
  setFacilityList: () => { },
  fetchAllFacilityList: () => { },
  doctorList: [],
  setDoctorList: () => { },
  fetchAllDoctorList: () => { },
  serviceList: [],
  setServicesList: () => { },
  fetchAllServicesList: () => { },
  patientList: [],
  setPatientList: () => { },
  fetchAllPatientList: () => { },
  deletePracticeList: () => { },
  deleteRoleList: () => { },
  deleteFacilityList: () => { },
  deleteDoctorList: () => { },
  deleteServiceList: () => { },
  deletePatientList: () => { },
  addPracticeList: () => { },
  addRoleList: () => { },
  addFacilityList: () => { },
  addDoctorList: () => { },
  addServiceList: () => { },
  addPatientList: () => { },
  updatePracticeList: () => { },
  updateRoleList: () => { },
  updateFacilityList: () => { },
  updateDoctorList: () => { },
  updateServiceList: () => { },
  updatePatientList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles, facility } = user || {};
  const { practiceId: parentId } = facility || {};
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const {
    doctorPages, doctorList, facilityPages, facilityList, servicePages, serviceList, patientList,
    patientPages, practiceId, practicePages, practiceList, rolePages, roleList
  } = state;

  const [getAllRoles] = useFindAllRoleListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { getAllRoles } = data

        if (getAllRoles) {
          const { pagination, roles } = getAllRoles

          if (pagination) {
            const { totalPages } = pagination;

            if (totalPages ? rolePages !== totalPages : false) {
              setRolePages(rolePages + 1)
            }
          }

          !!roles && !!roleList &&
            setRoleList([...roleList, ...roles] as RolesPayload['roles'])
        }
      }
    }
  })

  const [findAllPractices] = useFindAllPracticeListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllPractices } = data

        if (findAllPractices) {
          const { practices, pagination } = findAllPractices

          if (pagination) {
            const { totalPages } = pagination;

            if (totalPages ? practicePages !== totalPages : false) {
              setPracticePages(practicePages + 1)
            }
          }

          !!practices && !!practiceList &&
            setPracticeList([...practiceList, ...practices] as PracticesPayload['practices'])
        }
      }
    }
  })

  const [findAllFacility] = useFindAllFacilityListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllFacility } = data

        if (findAllFacility) {
          const { facilities, pagination } = findAllFacility

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
    }
  })

  const [findAllDoctor] = useFindAllDoctorListLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { findAllDoctor } = data

        if (findAllDoctor) {
          const { doctors, pagination } = findAllDoctor;

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
    }
  })

  const [findAllPatient] = useFindAllPatientListLazyQuery({
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

  const [findAllServices] = useFindAllServiceListLazyQuery({
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

  const fetchAllRoleList = useCallback(async (page = 1) => {
    try {
      const pageInputs = { paginationOptions: { page, limit: LIST_PAGE_LIMIT } };

      await getAllRoles({
        variables: { roleInput: pageInputs },
      });
    } catch (error) { }
  }, [getAllRoles])

  const fetchAllPracticeList = useCallback(async (page = 1) => {
    try {
      const pageInputs = { paginationOptions: { page, limit: LIST_PAGE_LIMIT } };
      const isSuper = isSuperAdmin(roles)

      isSuper && await findAllPractices({
        variables: {
          practiceInput: pageInputs
        },
      });
    } catch (error) { }
  }, [findAllPractices, roles])

  const fetchAllFacilityList = useCallback(async (page = 1) => {
    try {
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

  useEffect(() => { }, [user]);
  useEffect(() => {
    const isSuper = isSuperAdmin(roles)

    !isSuper ?
      parentId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: parentId })
      :
      dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: '' })
  }, [parentId, roles, hasToken]);

  useEffect(() => { hasToken && fetchAllRoleList(rolePages) }, [fetchAllRoleList, hasToken, rolePages])
  useEffect(() => { hasToken && fetchAllPracticeList(practicePages) }, [fetchAllPracticeList, hasToken, practicePages])
  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])
  useEffect(() => { hasToken && fetchAllDoctorList(doctorPages) }, [fetchAllDoctorList, hasToken, doctorPages])
  useEffect(() => { hasToken && fetchAllPatientList(patientPages) }, [fetchAllPatientList, hasToken, patientPages])
  useEffect(() => { hasToken && fetchAllServicesList(servicePages) }, [fetchAllServicesList, hasToken, servicePages])

  const setRoleList = (roles: RolesPayload['roles']) => dispatch({ type: ActionType.SET_ROLE_LIST, roleList: roles });
  const setPracticeList = (practices: PracticesPayload['practices']) => dispatch({ type: ActionType.SET_PRACTICE_LIST, practiceList: practices });
  const setFacilityList = (facilities: FacilitiesPayload['facilities']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });
  const setDoctorList = (doctors: AllDoctorPayload['doctors']) => dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: doctors });
  const setServicesList = (services: ServicesPayload['services']) => dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: services });
  const setPatientList = (patients: PatientsPayload['patients']) => dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: patients });
  const setRolePages = (pageNumber: number) => dispatch({ type: ActionType.SET_ROLE_PAGES, rolePages: pageNumber });
  const setPracticePages = (pageNumber: number) => dispatch({ type: ActionType.SET_PRACTICE_PAGES, practicePages: pageNumber });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setDoctorPages = (pageNumber: number) => dispatch({ type: ActionType.SET_DOCTOR_PAGES, doctorPages: pageNumber });
  const setServicePages = (pageNumber: number) => dispatch({ type: ActionType.SET_SERVICE_PAGES, servicePages: pageNumber });
  const setPatientPages = (pageNumber: number) => dispatch({ type: ActionType.SET_PATIENT_PAGES, patientPages: pageNumber });

  const deleteRoleList = (id: string) => id && dispatch({ type: ActionType.SET_ROLE_LIST, roleList: roleList?.filter(role => role?.id !== id) })
  const deleteDoctorList = (id: string) => id && dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: doctorList?.filter(doctor => doctor?.id !== id) })
  const deleteServiceList = (id: string) => id && dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: serviceList?.filter(service => service?.id !== id) })
  const deletePatientList = (id: string) => id && dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: patientList?.filter(patient => patient?.id !== id) })
  const deletePracticeList = (id: string) => id && dispatch({ type: ActionType.SET_PRACTICE_LIST, practiceList: practiceList?.filter(practice => practice?.id !== id) })
  const deleteFacilityList = (id: string) => id && dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilityList?.filter(facility => facility?.id !== id) })

  const addRoleList = (newRecord: RolePayload['role']) => !!roleList && dispatch({ type: ActionType.SET_ROLE_LIST, roleList: [newRecord, ...roleList] as RolesPayload['roles'] })
  const addDoctorList = (newRecord: DoctorPayload['doctor']) => !!doctorList && dispatch({ type: ActionType.SET_DOCTOR_LIST, doctorList: [newRecord, ...doctorList] as AllDoctorPayload['doctors'] })
  const addServiceList = (newRecord: ServicePayload['service']) => !!serviceList && dispatch({ type: ActionType.SET_SERVICE_LIST, serviceList: [newRecord, ...serviceList] as ServicesPayload['services'] })
  const addPatientList = (newRecord: PatientPayload['patient']) => !!patientList && dispatch({ type: ActionType.SET_PATIENT_LIST, patientList: [newRecord, ...patientList] as PatientsPayload['patients'] })
  const addPracticeList = (newRecord: PracticePayload['practice']) => !!practiceList && dispatch({ type: ActionType.SET_PRACTICE_LIST, practiceList: [newRecord, ...practiceList] as PracticesPayload['practices'] })
  const addFacilityList = (newRecord: FacilityPayload['facility']) => !!facilityList && dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [newRecord, ...facilityList] as FacilitiesPayload['facilities'] })

  const updateRoleList = (newRecord: RolePayload['role']) => {
    const { id } = newRecord || {}

    id && deleteRoleList(id)
    addRoleList(newRecord)
  }

  const updateDoctorList = (newRecord: DoctorPayload['doctor']) => {
    const { id } = newRecord || {}

    id && deleteDoctorList(id)
    addDoctorList(newRecord)
  }

  const updateServiceList = (newRecord: ServicePayload['service']) => {
    const { id } = newRecord || {}

    id && deleteServiceList(id)
    addServiceList(newRecord)
  }

  const updatePatientList = (newRecord: PatientPayload['patient']) => {
    const { id } = newRecord || {}

    id && deletePatientList(id)
    addPatientList(newRecord)
  }

  const updatePracticeList = (newRecord: PracticePayload['practice']) => {
    const { id } = newRecord || {}

    id && deletePracticeList(id)
    addPracticeList(newRecord)
  }

  const updateFacilityList = (newRecord: FacilityPayload['facility']) => {
    const { id } = newRecord || {}

    id && deleteFacilityList(id)
    addFacilityList(newRecord)
  }


  return (
    <ListContext.Provider
      value={{
        practiceList,
        setPracticeList,
        fetchAllPracticeList,
        roleList,
        setRoleList,
        fetchAllRoleList,
        facilityList,
        setFacilityList,
        fetchAllFacilityList,
        doctorList,
        setDoctorList,
        fetchAllDoctorList,
        serviceList,
        setServicesList,
        fetchAllServicesList,
        patientList,
        setPatientList,
        fetchAllPatientList,
        deletePracticeList,
        deleteRoleList,
        deleteFacilityList,
        deleteDoctorList,
        deleteServiceList,
        deletePatientList,
        addPracticeList,
        addRoleList,
        addFacilityList,
        addDoctorList,
        addServiceList,
        addPatientList,
        updatePracticeList,
        updateRoleList,
        updateFacilityList,
        updateDoctorList,
        updateServiceList,
        updatePatientList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
