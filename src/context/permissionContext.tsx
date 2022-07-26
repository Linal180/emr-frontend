// packages block
import { createContext, FC, useCallback, useEffect, Reducer, useReducer, useContext } from "react";
// graphql, interfaces/types, reducer and constants block
import { AuthContext } from "./authContext";
import { LIST_PAGE_LIMIT, TOKEN } from "../constants";
import { PermissionContextInterface } from "../interfacesTypes";
import { PermissionsPayload, useFindAllPermissionsLazyQuery } from "../generated/graphql";
import {
  Action, ActionType, initialState, permissionContextReducer, State
} from '../reducers/permissionContextReducer';

export const PermissionContext = createContext<PermissionContextInterface>({
  permissions: [],
  permissionLoading: false
});

export const PermissionContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const { user } = useContext(AuthContext)
  const [{ permissions, page }, dispatch] = useReducer<Reducer<State, Action>>(permissionContextReducer, initialState)

  const [findAllPermissions, { loading: permissionLoading }] = useFindAllPermissionsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      return null;
    },

    async onCompleted(data) {
      if (data) {
        const { findAllPermissions: { permissions: fetchedPermissions, pagination } } = data

        if (pagination) {
          const { totalPages } = pagination

          if (totalPages ? page !== totalPages : false) {
            dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
          }
        }

        !!permissions && !!fetchedPermissions &&
          dispatch({
            type: ActionType.SET_PERMISSIONS,
            permissions: [...permissions, ...fetchedPermissions] as PermissionsPayload['permissions']
          })
      }
    }
  })

  const fetchAllPermissionList = useCallback(async (page = 1) => {
    try {
      await findAllPermissions({
        variables: { permissionInput: { paginationOptions: { page, limit: LIST_PAGE_LIMIT } } }
      });
    } catch { }
  }, [findAllPermissions])

  useEffect(() => { }, [user])
  useEffect(() => {
    hasToken && fetchAllPermissionList(page)
  }, [fetchAllPermissionList, hasToken, page])

  return (
    <PermissionContext.Provider
      value={{ permissions, permissionLoading }}
    >
      {children}
    </PermissionContext.Provider>
  );
};
