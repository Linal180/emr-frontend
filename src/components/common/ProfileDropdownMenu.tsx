// packages block
import { useState, MouseEvent, useContext, useEffect, useCallback, useReducer, Reducer } from "react";
import { Link } from "react-router-dom";
import { Typography, Grid, Box, Button, MenuItem, Menu, Fade, IconButton, colors, Avatar, } from '@material-ui/core';
// utils and header styles block
import { AuthContext, ListContext } from "../../context";
import { BLACK_TWO, WHITE_FOUR } from "../../theme";
import { useHeaderStyles } from "../../styles/headerStyles";
import { handleLogout, isSuperAdmin, isUserAdmin, onIdle } from "../../utils";
import { MenuSettingIcon, MenuShieldIcon, NewAvatarIcon, } from "../../assets/svgs";

import {
  ATTACHMENT_TITLES,
  EMAIL, FACILITY, GENERAL, LOCK_SCREEN, LOGOUT_TEXT, PRACTICE, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS,
  SECURITY, SUPER_ADMIN, SYSTEM_ROLES
} from "../../constants";
import {
  Action as MediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer,
  State as MediaState
} from '../../reducers/mediaReducer';
import { useGetAttachmentLazyQuery, useGetCurrentUserLazyQuery, useGetDoctorUserLazyQuery, useGetStaffUserLazyQuery } from "../../generated/graphql";

const ProfileDropdownMenu = (): JSX.Element => {
  const classes = useHeaderStyles();
  const { user, currentUser, setUser, setIsLoggedIn, setCurrentUser, practiceName, } = useContext(AuthContext);
  const { setFacilityList, setRoleList, setPracticeList } = useContext(ListContext)
  const { email, roles, facility, userId, userType } = user || {};
  const { firstName, lastName } = currentUser || {}
  const { name: facilityName } = facility || {}
  const [isSuper, setIsSuper] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const FacilityAdmin = isUserAdmin(roles)
  const superAdmin = isSuperAdmin(roles)

  const [mediaState, mediaDispatch] = useReducer<Reducer<MediaState, MediaAction>>(mediaReducer, mediaInitialState)
  const { attachmentUrl, attachmentId, attachmentData } = mediaState

  const [getAttachment, { loading: getAttachmentLoading }] = useGetAttachmentLazyQuery({
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
        preSignedUrl && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_URL, attachmentUrl: preSignedUrl })
      }
    },
  });

  const [getDoctor, { loading: getDoctorLoading }] = useGetDoctorUserLazyQuery({
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
            const { doctor } = getDoctor || {}
            const { attachments } = doctor || {}
            const doctorAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.ProfilePicture);
            mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: doctorAttachment })
            const { id: doctorAttachmentId } = doctorAttachment || {}
            doctorAttachmentId && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId: doctorAttachmentId })

          }
        }
      }
    }
  });

  const [getStaff, { loading: getStaffLoading }] = useGetStaffUserLazyQuery({
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
            const { attachments } = staff || {}
            const staffAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.ProfilePicture);
            mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: staffAttachment })
            const { id: staffAttachmentId } = staffAttachment || {}
            staffAttachmentId && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId: staffAttachmentId })
          }
        }
      }
    }
  });

  const [fetchUser] = useGetCurrentUserLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { me } = data

        if (me) {
          const { user: userResponse } = me;

          if (userResponse) {
            const { userType, attachments } = userResponse;

            if (userType === SYSTEM_ROLES.SuperAdmin) {
              const userAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.ProfilePicture);
              mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: userAttachment })
              const { id: userAttachmentId } = userAttachment || {}
              userAttachmentId && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId: userAttachmentId })
            }
          }
        }
      }
    }
  });


  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleIdle = () => {
    email && localStorage.setItem(EMAIL, email)
    onIdle();
    setUser(null)
    setCurrentUser(null)
    setIsLoggedIn(false)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setCurrentUser(null)
    handleLogout();
    setFacilityList([]);
    setRoleList([])
    setPracticeList([])
  };

  useEffect(() => {
    setIsSuper(isSuperAdmin(roles))
  }, [isSuper, roles, user]);

  const fetchAttachment = useCallback(async () => {
    try {
      await getAttachment({
        variables: {
          getMedia: { id: attachmentId }
        },
      })
    } catch (error) { }
  }, [attachmentId, getAttachment])

  const fetchCurrentUser = useCallback(async () => {
    if (!superAdmin) {
      if (userType === SYSTEM_ROLES.Doctor) {
        try {
          userId && await getDoctor({ variables: { getDoctor: { id: userId } } })
        } catch (error) {

        }
      }
      else {
        try {
          userId && await getStaff({ variables: { getStaff: { id: userId } } })
        } catch (error) {

        }
      }
    }
    else {
      try {
        userId && await fetchUser()
      } catch (error) {

      }
    }
  }, [userId, superAdmin, userType, getStaff, getDoctor, fetchUser])

  useEffect(() => {
    userId && userType && fetchCurrentUser()
  }, [userType, userId, fetchCurrentUser])

  useEffect(() => {
    attachmentId && fetchAttachment();
  }, [attachmentId, fetchAttachment, attachmentData])

  return (
    <>
      <IconButton
        aria-label="dropdown menu" aria-controls="menu-appBar" aria-haspopup="true" color="inherit"
        onClick={(event) => handleClick(event)}
      >
        {(getAttachmentLoading || getStaffLoading || getDoctorLoading) ?
          <NewAvatarIcon /> :
          <Avatar alt={`${firstName}-${lastName}`} src={attachmentUrl}  ></Avatar>
        }
      </IconButton>

      <Menu
        id="menu-appBar"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box px={2} pt={1} minWidth={350}>
          <Box p={1} mb={2} display="flex" justifyContent="space-between"
            alignItems="center" className={classes.dropdownMenuBar}
          >
            <Box display="flex" alignItems="center">
              {(getAttachmentLoading || getStaffLoading || getDoctorLoading) ?
                <NewAvatarIcon /> :
                <Avatar alt={`${firstName}-${lastName}`} src={attachmentUrl}  ></Avatar>
              }

              <Box ml={2}>
                {isSuper ?
                  <Typography variant="h6">{SUPER_ADMIN}</Typography>
                  :
                  <Typography variant="h6">{firstName} {lastName}</Typography>
                }
              </Box>
            </Box>
          </Box>

          {practiceName && <Box display='flex' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`} mb={2} pt={1} pb={2}>
            <Box pr={1} color={BLACK_TWO}>
              <Typography variant="body1">{PRACTICE} :</Typography>
            </Box>

            <Typography variant="body1">{practiceName}</Typography>
          </Box>}

          {!FacilityAdmin && <Box display='flex' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`} mb={2} pt={1} pb={2}>
            <Box pr={1} color={BLACK_TWO}>
              <Typography variant="body1">{FACILITY} :</Typography>
            </Box>

            <Typography variant="body1">{facilityName}</Typography>
          </Box>}

          <Grid container spacing={3}>
            <Grid item md={6}>
              <Box display="flex" alignItems="center">
                <MenuSettingIcon />

                <Box ml={1}>
                  <Typography variant="h5">{GENERAL}</Typography>
                </Box>
              </Box>

              <Box mt={1}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem onClick={handleClose}>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </Grid>

            <Grid item md={6}>
              <Box display="flex" alignItems="center">
                <MenuShieldIcon />

                <Box ml={1}>
                  <Typography variant="h5">{SECURITY}</Typography>
                </Box>
              </Box>

              <Box mt={1}>
                {PROFILE_SECURITY_MENU_ITEMS.map(({ name, link }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem onClick={handleClose}>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box mt={2} py={2} borderTop={`1px solid ${WHITE_FOUR}`}>
            <Grid container spacing={3}>
              <Grid item md={8}>
                <Button onClick={() => handleIdle()} variant="contained" color="secondary" size="small" fullWidth>
                  {LOCK_SCREEN}
                </Button>
              </Grid>

              <Grid item md={4}>
                <Button onClick={() => logout()} variant="outlined" color="inherit" size="small" className="danger">
                  {LOGOUT_TEXT}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Menu>
    </>
  )
}

export default ProfileDropdownMenu;
