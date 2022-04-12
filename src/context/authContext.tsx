// packages block
import { createContext, FC, useCallback, useEffect, useState } from "react";
// graphql, interfaces/types and constants block
import { TOKEN } from "../constants";
import { getUserRole, isUserAdmin } from "../utils";
import { AuthContextProps } from "../interfacesTypes";
import {
  User, useGetLoggedInUserLazyQuery, Doctor, Staff, useGetDoctorUserLazyQuery, useGetStaffUserLazyQuery,
  RolesPayload
} from "../generated/graphql";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  currentUser: null,
  isLoggedIn: false,
  userPermissions: [],
  setIsLoggedIn: () => { },
  setUser: (user: User | null) => { },
});

export const AuthContextProvider: FC = ({ children }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<RolesPayload['roles']>([]);
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<Doctor | Staff | null>(null);

  const [getDoctor] = useGetDoctorUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { getDoctor } = data || {};

      if (getDoctor) {
        const { response, doctor } = getDoctor

        if (response) {
          const { status } = response

          if (doctor && status && status === 200) {
            setCurrentUser(doctor as Doctor)
          }
        }
      }
    }
  });

  const [getStaff] = useGetStaffUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { getStaff } = data || {}

      if (getStaff) {
        const { response, staff } = getStaff;

        if (response) {
          const { status } = response

          if (staff && status && status === 200) {
            setCurrentUser(staff as Staff)
          }
        }
      }
    }
  });

  const handleRolesAndPermissions = useCallback(async () => {
    try {
      const { userId } = user || {}

      if (!isUserAdmin(roles as RolesPayload['roles'])) {
        if (getUserRole(roles as RolesPayload['roles']) === 'doctor') {
          userId && await getDoctor({
            variables: { getDoctor: { id: userId } }
          })
        } else {
          userId && await getStaff({
            variables: { getStaff: { id: userId } }
          })
        }
      }

      roles?.map(role => {
        const { rolePermissions } = role || {};
        let permissionsList = rolePermissions?.map(rolePermission => rolePermission.permission?.name)

        return permissionsList && setUserPermissions(permissionsList as string[])
      })
    } catch (error) { }
  }, [getDoctor, getStaff, roles, user])

  const [fetchUser] = useGetLoggedInUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      setUser(null);
    },

    async onCompleted(data) {
      if (data) {
        const { me } = data
        console.log(user, "STATE")
        if (me) {
          const { user } = me;

          if (user) {
            const { roles } = user;
            console.log(user, "RESPONSE")
            setUser(user as User);
            roles && setRoles(roles as RolesPayload['roles'])

            await handleRolesAndPermissions();
          }
        }
      }
    }
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => _setIsLoggedIn(isLoggedIn);
  const hasToken = localStorage.getItem(TOKEN);

  const getUser = useCallback(async () => {
    try {
      await fetchUser();
    } catch (error) { }
  }, [fetchUser]);

  useEffect(() => {
    hasToken && setIsLoggedIn(true);
    isLoggedIn && hasToken && getUser();
  }, [isLoggedIn, hasToken, getUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        currentUser,
        setIsLoggedIn,
        userPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
