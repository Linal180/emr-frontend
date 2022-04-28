// packages block
import { createContext, FC, useEffect, useState } from "react";
import { pluck } from "underscore";
import { useCallback } from "react";
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
  currentStaff: null,
  currentDoctor: null,
  isLoggedIn: false,
  userPermissions: [],
  setIsLoggedIn: () => { },
  setUser: (user: User | null) => { },
  setPracticeName: (name: string) => { },
  setCurrentUser: (user: Doctor | Staff | null) => { },
  setCurrentDoctor: (doctor: Doctor | null) => { },
  setCurrentStaff: (staff: Staff | null) => { },
  setUserRoles: (roles: string[]) => { },
  setUserPermissions: (permissions: string[]) => { },
  setGetCall: (call: boolean) => { }
});

export const AuthContextProvider: FC = ({ children }): JSX.Element => {
  const hasToken = localStorage.getItem(TOKEN);
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [practiceName, setPracticeName] = useState<string>('');
  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(false);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<Doctor | Staff | null>(null);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [getCall, setGetCall] = useState<boolean>(true)

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
            setCurrentDoctor(doctor as Doctor)
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
            setCurrentStaff(staff as Staff)
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

            if (!!roles) {
              setUserRoles(pluck(roles, 'role'));

              const transformedUserPermissions = roles?.reduce<string[]>((acc, role) => {
                const { rolePermissions } = role || {};
                const permissions = rolePermissions?.map(rolePermission => rolePermission.permission?.name ?? '') ?? []

                acc.push(...Array.from(new Set(permissions)))
                return acc
              }, []) ?? []

              setUserPermissions(transformedUserPermissions)
            }

            setUser(userResponse as User);
          }
        }
      }
    }
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => _setIsLoggedIn(isLoggedIn);

  const getUser = useCallback(async () => {
    setGetCall(false)
    await fetchUser()
  }, [fetchUser])

  useEffect(() => {
    hasToken && setIsLoggedIn(true);
    getCall && isLoggedIn && hasToken && getUser();
  }, [getCall, isLoggedIn, hasToken, getUser]);

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
        setCurrentDoctor,
        setCurrentStaff,
        setGetCall,
        currentStaff,
        currentDoctor,
        setUserPermissions,
        setUserRoles
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
