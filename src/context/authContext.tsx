// packages block
import { createContext, FC, useEffect, useState } from "react";
import { pluck } from "underscore";
// graphql, interfaces/types and constants block
import { TOKEN } from "../constants";
import { getUserRole, isSuperAdmin } from "../utils";
import { AuthContextProps } from "../interfacesTypes";
import {
  User, useGetLoggedInUserLazyQuery, Doctor, Staff, useGetDoctorUserLazyQuery, useGetStaffUserLazyQuery,
  RolesPayload
} from "../generated/graphql";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userRoles: [],
  practiceName: '',
  currentUser: null,
  isLoggedIn: false,
  userPermissions: [],
  setIsLoggedIn: () => { },
  setUser: (user: User | null) => { },
  setPracticeName: (name: string) => { },
  setCurrentUser: (user: Doctor | Staff | null) => { },
});

export const AuthContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [practiceName, setPracticeName] = useState<string>('');
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

  const [fetchUser] = useGetLoggedInUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      setUser(null);
      setCurrentUser(null)
    },

    onCompleted(data) {
      if (data) {
        const { me } = data

        if (me) {
          const { user: userResponse } = me;

          if (userResponse) {
            const { roles, userId, facility } = userResponse;
            const isAdmin = isSuperAdmin(roles as RolesPayload['roles'])

            if (!isAdmin) {
              const roleName = getUserRole(roles as RolesPayload['roles'])

              if (roleName === 'doctor') {
                getDoctor({
                  variables: { getDoctor: { id: userId } }
                })
              } else {
                getStaff({
                  variables: { getStaff: { id: userId } }
                })
              }

              if (facility) {
                const { practice } = facility;
                const { name } = practice || {}

                name && setPracticeName(name)
              }
            }
            
            if(!!roles){
              setUserRoles(pluck(roles, 'role'));

              roles?.map(role => {
                const { rolePermissions } = role || {};
                let permissionsList = rolePermissions?.map(rolePermission => rolePermission.permission?.name)
                const allPermissions = permissionsList?.length === 0 ? [''] : permissionsList
                
                return permissionsList && setUserPermissions(allPermissions as string[])
              })
            }
              
            setUser(userResponse as User);
          }
        }
      }
    }
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => _setIsLoggedIn(isLoggedIn);

  useEffect(() => {
    hasToken && setIsLoggedIn(true);
    isLoggedIn && hasToken && fetchUser();
  }, [isLoggedIn, hasToken, fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userRoles,
        isLoggedIn,
        currentUser,
        practiceName,
        setIsLoggedIn,
        setCurrentUser,
        userPermissions,
        setPracticeName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
