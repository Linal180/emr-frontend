// packages block
import { createContext, FC, useCallback, useEffect, useState } from "react";
// graphql, interfaces/types and constants block
import { TOKEN } from "../constants";
import { getUserRole } from "../utils";
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
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<Doctor | Staff | null>(null);

  const [getDoctor] = useGetDoctorUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
    },

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


  const [fetchUser, { loading }] = useGetLoggedInUserLazyQuery({
    nextFetchPolicy: "network-only",

    onError() {
      setUser(null);
    },

    async onCompleted(data) {
      if (data) {
        const { me } = data

        if (me) {
          const { user } = me;

          if (user) {
            const { roles, userId } = user;

            if (roles && userId) {
              if (getUserRole(roles as RolesPayload['roles']) === 'doctor') {
                await getDoctor({
                  variables: { getDoctor: { id: userId } }
                })
              } else {
                await getStaff({
                  variables: { getStaff: { id: userId } }
                })
              }

              roles.map(role => {
                const { rolePermissions } = role || {};

                let permissionsList = rolePermissions?.map(rolePermission => rolePermission.permission?.name)

                return permissionsList && setUserPermissions(permissionsList as string[])
              })
            }

            setUser(user as User);
          }
        }
      }
    },
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
  }, [isLoggedIn, hasToken, loading, getUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser,
        userPermissions,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
