// packages block
import { createContext, FC, useEffect, useState } from "react";
import { pluck } from "underscore";
import { useCallback } from "react";
// graphql, interfaces/types and constants block
import { ATTACHMENT_TITLES, TOKEN } from "../constants";
import { getUserRole, isSuperAdmin } from "../utils";
import { AuthContextProps } from "../interfacesTypes";
import {
  User, useGetLoggedInUserLazyQuery, Doctor, Staff, useGetDoctorUserLazyQuery, useGetStaffUserLazyQuery,
  RolesPayload,
  useGetAttachmentLazyQuery,
  Attachment
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
  setProfileUrl: (url: string) => { },
  profileUrl: '',
  fetchUser: () => { },
  fetchAttachment: () => { },
  profileAttachment: null
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
  const [profileUrl, setProfileUrl] = useState('')
  const [profileAttachment, setProfileAttachment] = useState<null | Attachment>(null)

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
            const { attachments } = doctor || {}
            const doctorAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.ProfilePicture);
            doctorAttachment && setProfileAttachment(doctorAttachment)
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
            const { attachments } = staff || {}
            const staffAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.ProfilePicture);
            staffAttachment && setProfileAttachment(staffAttachment)
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
            const { roles, userId, facility, attachments } = userResponse;
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
            const userAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.ProfilePicture);
            userAttachment && setProfileAttachment(userAttachment)
          }
        }
      }
    }
  });

  const [getAttachment] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachment } = data || {};

      if (getAttachment) {
        const { preSignedUrl } = getAttachment
        preSignedUrl && setProfileUrl(preSignedUrl)
      }
    },
  });

  const setIsLoggedIn = (isLoggedIn: boolean) => _setIsLoggedIn(isLoggedIn);

  const getUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  useEffect(() => {
    hasToken && setIsLoggedIn(true);
    isLoggedIn && hasToken && getUser();
  }, [isLoggedIn, hasToken, getUser]);

  const fetchAttachment = useCallback(async () => {
    try {
      const { id } = profileAttachment || {}
      id && await getAttachment({ variables: { getMedia: { id } }, })
    } catch (error) { }
  }, [profileAttachment, getAttachment])

  useEffect(() => {
    profileAttachment && fetchAttachment()
  }, [profileAttachment, fetchAttachment])


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
        currentStaff,
        currentDoctor,
        setUserPermissions,
        setUserRoles,
        setProfileUrl,
        profileUrl,
        fetchUser,
        fetchAttachment,
        profileAttachment
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
