// packages block
import { createContext, FC, useEffect, useCallback, useReducer, Reducer, useContext } from "react";
// graphql, interfaces/types, reducer and constants block
import { AuthContext } from "./authContext";
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { ListContextInterface } from "../interfacesTypes";
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin } from "../utils";
import {
  Action, ActionType, initialState, listContextReducer, State as LocalState
} from '../reducers/listContextReducer';
import {
  RolesPayload, useFindAllRoleListLazyQuery, FacilityPayload, FacilitiesPayload,
  useFindAllFacilityListLazyQuery, RolePayload,
} from "../generated/graphql";

export const ListContext = createContext<ListContextInterface>({
  roleList: [],
  setRoleList: () => { },
  fetchAllRoleList: () => { },
  facilityList: [],
  setFacilityList: () => { },
  fetchAllFacilityList: () => { },
  deleteRoleList: () => { },
  deleteFacilityList: () => { },
  addRoleList: () => { },
  addFacilityList: () => { },
  updateRoleList: () => { },
  updateFacilityList: () => { },
});

export const ListContextProvider: FC = ({ children }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { roles, facility } = user || {};
  const { id: facilityId } = facility || {};
  const isSuper = isSuperAdmin(roles);
  const isPracAdmin = isPracticeAdmin(roles);
  const isFacAdmin = isFacilityAdmin(roles);
  const hasToken = localStorage.getItem(TOKEN);
  const [state, dispatch] = useReducer<Reducer<LocalState, Action>>(listContextReducer, initialState)
  const {
    facilityPages, facilityList, practiceId, rolePages, roleList
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

  const fetchAllFacilityList = useCallback(async (page = 1) => {
    try {
      const inputs = { paginationOptions: { page, limit: LIST_PAGE_LIMIT } }
      const payload =
        isSuper ? { ...inputs } : isPracAdmin ? { ...inputs, practiceId } :
          isFacAdmin ? { ...inputs, singleFacilityId: facilityId } : undefined

      payload && await findAllFacility({
        variables: {
          facilityInput: { ...payload }
        },
      });
    } catch (error) { }
  }, [facilityId, findAllFacility, isFacAdmin, isPracAdmin, isSuper, practiceId])

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
  useEffect(() => { hasToken && fetchAllFacilityList(facilityPages) }, [fetchAllFacilityList, hasToken, facilityPages])

  const setRolePages = (pageNumber: number) => dispatch({ type: ActionType.SET_ROLE_PAGES, rolePages: pageNumber });
  const setRoleList = (roles: RolesPayload['roles']) => dispatch({ type: ActionType.SET_ROLE_LIST, roleList: roles });
  const setFacilityPages = (pageNumber: number) => dispatch({ type: ActionType.SET_FACILITY_PAGES, facilityPages: pageNumber });
  const setFacilityList = (facilities: FacilitiesPayload['facilities']) => dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilities });

  const deleteRoleList = (id: string) => id && dispatch({ type: ActionType.SET_ROLE_LIST, roleList: roleList?.filter(role => role?.id !== id) })
  const deleteFacilityList = (id: string) => id && dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: facilityList?.filter(facility => facility?.id !== id) })

  const addRoleList = (newRecord: RolePayload['role']) => !!roleList && dispatch({ type: ActionType.SET_ROLE_LIST, roleList: [newRecord, ...roleList] as RolesPayload['roles'] })
  const addFacilityList = (newRecord: FacilityPayload['facility']) => !!facilityList && dispatch({ type: ActionType.SET_FACILITY_LIST, facilityList: [newRecord, ...facilityList] as FacilitiesPayload['facilities'] })

  const updateRoleList = (newRecord: RolePayload['role']) => {
    const { id } = newRecord || {}

    id && deleteRoleList(id)
    addRoleList(newRecord)
  }

  const updateFacilityList = (newRecord: FacilityPayload['facility']) => {
    const { id } = newRecord || {}

    id && deleteFacilityList(id)
    addFacilityList(newRecord)
  }

  return (
    <ListContext.Provider
      value={{
        roleList,
        setRoleList,
        fetchAllRoleList,
        facilityList,
        setFacilityList,
        fetchAllFacilityList,
        deleteRoleList,
        deleteFacilityList,
        addRoleList,
        addFacilityList,
        updateRoleList,
        updateFacilityList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
