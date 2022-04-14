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
  PracticesPayload, RolesPayload, useFindAllRoleListLazyQuery, useFindAllPracticeListLazyQuery,
  FacilitiesPayload, useFindAllFacilityListLazyQuery, RolePayload, PracticePayload, FacilityPayload,
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
  deletePracticeList: () => { },
  deleteRoleList: () => { },
  deleteFacilityList: () => { },
  addPracticeList: () => { },
  addRoleList: () => { },
  addFacilityList: () => { },
  updatePracticeList: () => { },
  updateRoleList: () => { },
  updateFacilityList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles, facility } = user || {};
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const {
    facilityPages, facilityList, practiceId, practicePages, practiceList, rolePages, roleList, isSuper
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

      isSuper && await findAllPractices({
        variables: { practiceInput: pageInputs }
      });
    } catch (error) { }
  }, [findAllPractices, isSuper])

  const fetchAllFacilityList = useCallback(async (page = 1) => {
    try {
      const pageInputs = { paginationOptions: { page, limit: LIST_PAGE_LIMIT } };
      const facilityInputs = isSuper ? { ...pageInputs } : practiceId ? { practiceId, ...pageInputs } : undefined;

      facilityInputs && await findAllFacility({
        variables: {
          facilityInput: { ...facilityInputs }
        },
      });
    } catch (error) { }
  }, [findAllFacility, isSuper, practiceId])

  useEffect(() => { }, [user]);
  useEffect(() => { }, [facility]);
  useEffect(() => { dispatch({ type: ActionType.SET_IS_SUPER, isSuper: isSuperAdmin(roles) }) }, [roles]);
  useEffect(() => {
    if (facility) {
      const { practiceId } = facility

      isSuper ?
        dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: '' })
        :
        practiceId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId })
    }
  }, [roles, hasToken, facility, isSuper]);

  useEffect(() => { hasToken && fetchAllRoleList(rolePages) }, [fetchAllRoleList, hasToken, rolePages])
  useEffect(() => { hasToken && fetchAllPracticeList(practicePages) }, [fetchAllPracticeList, hasToken, practicePages])
  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])

  const setRolePages = (pageNumber: number) => dispatch({ type: ActionType.SET_ROLE_PAGES, rolePages: pageNumber });
  const setRoleList = (roles: RolesPayload['roles']) => dispatch({ type: ActionType.SET_ROLE_LIST, roleList: roles });
  const setPracticePages = (pageNumber: number) => dispatch({ type: ActionType.SET_PRACTICE_PAGES, practicePages: pageNumber });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setPracticeList = (practices: PracticesPayload['practices']) => dispatch({ type: ActionType.SET_PRACTICE_LIST, practiceList: practices });
  const setFacilityList = (facilities: FacilitiesPayload['facilities']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });

  const deleteRoleList = (id: string) => id && dispatch({ type: ActionType.SET_ROLE_LIST, roleList: roleList?.filter(role => role?.id !== id) })
  const deletePracticeList = (id: string) => id && dispatch({ type: ActionType.SET_PRACTICE_LIST, practiceList: practiceList?.filter(practice => practice?.id !== id) })
  const deleteFacilityList = (id: string) => id && dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilityList?.filter(facility => facility?.id !== id) })

  const addRoleList = (newRecord: RolePayload['role']) => !!roleList && dispatch({ type: ActionType.SET_ROLE_LIST, roleList: [newRecord, ...roleList] as RolesPayload['roles'] })
  const addPracticeList = (newRecord: PracticePayload['practice']) => !!practiceList && dispatch({ type: ActionType.SET_PRACTICE_LIST, practiceList: [newRecord, ...practiceList] as PracticesPayload['practices'] })
  const addFacilityList = (newRecord: FacilityPayload['facility']) => !!facilityList && dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [newRecord, ...facilityList] as FacilitiesPayload['facilities'] })

  const updateRoleList = (newRecord: RolePayload['role']) => {
    const { id } = newRecord || {}

    id && deleteRoleList(id)
    addRoleList(newRecord)
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
        deletePracticeList,
        deleteRoleList,
        deleteFacilityList,
        addPracticeList,
        addRoleList,
        addFacilityList,
        updatePracticeList,
        updateRoleList,
        updateFacilityList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
