import { FC, Reducer, useState, useCallback, useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, CircularProgress, Button, Typography, Menu, Collapse, Card } from "@material-ui/core";
// components block
import TextLoader from "../../TextLoader";
import { PatientNoteModal } from './NoteModal'
import MediaCards from "../../AddMedia/MediaCards";
// interfaces, reducers, constants and styles block
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { ParamsType, PatientProfileHeroProps } from "../../../../interfacesTypes";
import { ATTACHMENT_TITLES, NOTES, MORE_INFO, LESS_INFO } from "../../../../constants";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  formatPhone, getFormattedDate, renderMissing, calculateAge, formatValue,
  getFormatDateString, getDateWithDay
} from "../../../../utils";
import {
  AppointmentPayload,
  AttachmentType, Contact, Patient, useGetAttachmentLazyQuery, useGetPatientLazyQuery, useGetPatientNearestAppointmentsLazyQuery
} from "../../../../generated/graphql";
import {
  ProfileUserIcon, HashIcon, AtIcon, LocationIcon, NotesCardIcon, RedCircleIcon, NotesOutlinedCardIcon
} from "../../../../assets/svgs";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import { BLACK_THREE } from "../../../../theme";

const PatientProfileHero: FC<PatientProfileHeroProps> = ({ setPatient, setAttachmentsData, isCheckIn, isChart }) => {
  const noteRef = useRef(null)
  const { id } = useParams<ParamsType>();
  const [open, setOpen] = useState<boolean>(false)
  const classes = useProfileDetailsStyles();
  const [patientState, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { patientData, isNoteOpen, patientNoteOpen, nextAppointment, lastAppointment } = patientState
  const [{ attachmentUrl, attachmentData, attachmentId }, mediaDispatch] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const [getAttachment, { loading: getAttachmentLoading }] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: { getMedia: { id } },

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

  const fetchAttachment = useCallback(async () => {
    try {
      await getAttachment({
        variables: {
          getMedia: { id: attachmentId }
        },
      })
    } catch (error) { }
  }, [attachmentId, getAttachment])

  const [getPatient, { loading: getPatientLoading }] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: null })
    },

    onCompleted(data) {
      if (data) {
        const { getPatient } = data;

        if (getPatient) {

          const { patient } = getPatient;
          const { attachments } = patient || {}
          const profilePicture = attachments && attachments.filter(attachment =>
            attachment.title === ATTACHMENT_TITLES.ProfilePicture)[0]
          const { id: attachmentId, } = profilePicture || {}

          attachmentId &&
            mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId })

          dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient as Patient })
          mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: profilePicture })

          if (attachments) {
            mediaDispatch({
              type: mediaActionType.SET_ATTACHMENTS_DATA,
              attachmentsData: attachments.filter(attachment => attachment?.title === ATTACHMENT_TITLES.ProviderUploads)
            })

            !isChart && setAttachmentsData(attachmentData)
          }

          patient && setPatient(patient)
        }
      }
    },
  });

  const [getNearestAppointments] = useGetPatientNearestAppointmentsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { getPatientPastUpcomingAppointment: { response, appointments } } = data;
      if (response) {
        const { status } = response

        if (appointments && status && status === 200) {
          const { pastAppointment, upcomingAppointment } = appointments

          pastAppointment &&
            dispatch({
              type: ActionType.SET_LAST_APPOINTMENT,
              lastAppointment: pastAppointment as AppointmentPayload['appointment']
            })

          upcomingAppointment &&
            dispatch({
              type: ActionType.SET_NEXT_APPOINTMENT,
              nextAppointment: upcomingAppointment as AppointmentPayload['appointment']
            })
        }
      }
    }
  });

  const fetchPatient = useCallback(async () => {
    try {
      await getPatient({ variables: { getPatient: { id } } })
      await getNearestAppointments({ variables: { getPatientAppointmentInput: { patientId: id } } })
    } catch (error) { }
  }, [getNearestAppointments, getPatient, id]);

  useEffect(() => {
    id && fetchPatient()
  }, [fetchPatient, id])

  useEffect(() => {
    attachmentId && fetchAttachment();
  }, [attachmentId, fetchAttachment, attachmentData])

  const {
    firstName, email: patientEmail, lastName, patientRecord, dob, sexAtBirth, contacts, doctorPatients, createdAt
  } = patientData || {}

  const selfContact = contacts?.filter((item: Contact) => item.primaryContact)
  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""

  if (selfContact && selfContact[0]) {
    const { phone, email, state, address, city, zipCode } = selfContact[0]
    selfPhoneNumber = formatPhone(phone || '') || ""
    selfEmail = patientEmail ? patientEmail : email || ""
    const selfAddress = `${address ? address : ''} ${city ? city + ',' : ''} ${state ? state : ''} ${zipCode ? zipCode : ''}`
    selfCurrentLocation = selfAddress.trim() ? selfAddress : ''
  }

  const ProfileDetails = [
    {
      icon: ProfileUserIcon(),
      description: calculateAge(dob || '')
    },
    {
      icon: HashIcon(),
      description: selfPhoneNumber
    },
    {
      icon: AtIcon(),
      description: selfEmail
    },
    {
      icon: LocationIcon(),
      description: selfCurrentLocation
    },
  ]

  let providerName = ""
  let providerDateAdded = createdAt ? getFormattedDate(createdAt || '') : '--'

  if (doctorPatients) {
    const currentDoctor = doctorPatients.map(doctorPatient => {
      if (doctorPatient.currentProvider) {
        return doctorPatient.doctor
      }

      return null
    })[0];

    if (currentDoctor) {
      const { firstName, lastName, } = currentDoctor || {};
      providerName = `${firstName} ${lastName}` || "--"
    }
  }

  let nextAppointmentDate = ''
  let lastAppointmentDate = ''

  if (nextAppointment) {
    const { scheduleStartDateTime } = nextAppointment
    nextAppointmentDate = getDateWithDay(scheduleStartDateTime || '')
  }

  if (lastAppointment) {
    const { scheduleStartDateTime } = lastAppointment
    lastAppointmentDate = getDateWithDay(scheduleStartDateTime || '')
  }

  const ProfileAdditionalDetails = [
    {
      title: "Primary Provider",
      description: providerName || '--'
    },
    {
      title: "Date Added",
      description: providerDateAdded
    },
    {
      title: "Last Scheduled Appointment",
      description: lastAppointmentDate || '--'
    },
    {
      title: "Next Scheduled Appointment",
      description: nextAppointmentDate || '--'
    },
  ]

  useEffect(() => {
    patientNoteOpen && dispatch({ type: ActionType.SET_NOTE_OPEN, isNoteOpen: noteRef.current })
  }, [patientNoteOpen, dispatch])

  const isLoading = getPatientLoading || getAttachmentLoading

  const regularComponent = () =>
    <>
      <Box className={` ${classes.profileCard} card-box-shadow`}>
        <Box key={attachmentId} display="flex" alignItems="center">
          <Box pl={1} pr={3.75} pb={0} mb={0} position="relative">
            {getAttachmentLoading ?
              <Avatar variant="square" className={classes.profileImage}>
                <CircularProgress size={20} color="inherit" />
              </Avatar>
              :
              <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
            }

            <MediaCards
              title={ATTACHMENT_TITLES.ProfilePicture}
              reload={() => fetchPatient()}
              notDescription={true}
              moduleType={AttachmentType.Patient}
              itemId={id}
              imageSide={attachmentUrl}
              attachmentData={attachmentData || undefined}
            />
          </Box>
        </Box>

        {isLoading ?
          <TextLoader rows={[{ column: 1, size: 3 }, { column: 4, size: 3 }]} />
          :
          <Box flex={1}>
            <Box display='flex'>
              <Box flex={1} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Box className={classes.userName} mr={1}>
                    {`${firstName} ${lastName}`}
                  </Box>

                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    <Typography variant="body2">
                      {`(${patientRecord}) | (${formatValue(sexAtBirth || '')}) | ${getFormatDateString(dob || '')}`}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" width="100%" pt={1} flexWrap="wrap">
                  {ProfileDetails.map((item, index) => {
                    const { icon, description } = item

                    return (
                      <Box display="flex" key={`${description}-${index}`}
                        className={classes.profileInfoItem}
                      >
                        <Box>{icon}</Box>
                        <Typography variant="body1">{description ? description : renderMissing()}</Typography>
                      </Box>
                    )
                  })}

                  <div ref={noteRef}
                    className={`${classes.profileNoteInfoItem} pointer-cursor`}
                    onClick={(event) => dispatch({
                      type: ActionType.SET_NOTE_OPEN, isNoteOpen: event.currentTarget
                    })}
                  >
                    <Box><NotesCardIcon /></Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body1">{NOTES}</Typography>
                      <RedCircleIcon />
                    </Box>
                  </div>

                  <Menu
                    getContentAnchorEl={null}
                    anchorEl={isNoteOpen}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    id={'patient-notes'}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    open={!!isNoteOpen}
                    onClose={() => dispatch({ type: ActionType.SET_NOTE_OPEN, isNoteOpen: null })}
                    className={classes.noteDropdown}
                  >
                    <PatientNoteModal
                      patientStates={patientState}
                      dispatcher={dispatch}
                    />
                  </Menu>
                </Box>
              </Box>

              <Box display='flex' alignItems='flex-end' flexWrap='wrap'>
                <Button onClick={() => setOpen(!open)} variant="text" className="btn-focus">
                  {open ? <Typography variant="body2">... {LESS_INFO}</Typography>
                    : <Typography variant="body2">... {MORE_INFO}</Typography>}
                </Button>

                {/* <Button color="secondary" variant="contained" onClick={() => history.push(`${APPOINTMENTS_ROUTE}/new?patientId=${id}&patientName=${patientName}`)}>
                  {SCHEDULE_APPOINTMENTS_TEXT}
                </Button> */
                }
              </Box>
            </Box>
          </Box>
        }
      </Box>

      <Collapse in={open} mountOnEnter unmountOnExit>
        <Box className="card-box-shadow" mt={3}>
          <Card>
            <Box display="flex" width="100%" py={3} px={4} flexWrap="wrap">
              {ProfileAdditionalDetails.map((item, index) => (
                <Box key={`${item.title}-${index}`} className={classes.profileAdditionalInfo}>
                  <Box className={classes.profileInfoHeading}>{item.title}</Box>

                  <Box className={classes.profileInfoItem}>
                    <Typography variant="body1">{item.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Box>
      </Collapse>
    </>

  const checkInComponent = () =>
    <Box display='flex' alignItems='center'>
      <Box key={attachmentId} display="flex" alignItems="center">
        <Box pl={1} pr={3.75} pb={0} mb={0} position="relative">
          {getAttachmentLoading ?
            <Avatar variant="square" className={classes.profileImage}>
              <CircularProgress size={20} color="inherit" />
            </Avatar>
            :
            <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
          }
        </Box>
      </Box>

      <Box ml={2}>
        <Typography variant="h4" color="textPrimary">{`${firstName} ${lastName}`}</Typography>

        <Box display='flex' alignItems='center'>
          <Box display='flex' alignItems='center'>
            <ProfileUserIcon />

            <Box ml={1} color={BLACK_THREE}>
              <Typography variant="body1">{dob ? calculateAge(dob || '') : renderMissing()}</Typography>
            </Box>
          </Box>

          <Box p={2} />

          <div
            ref={noteRef}
            className={`${classes.profileNoteInfoItem} pointer-cursor`}
            onClick={(event) => dispatch({
              type: ActionType.SET_NOTE_OPEN, isNoteOpen: event.currentTarget
            })}
          >
            <Box display='flex' alignItems='center'>
              <NotesOutlinedCardIcon />

              <Box ml={1} color={BLACK_THREE} display="flex" alignItems="center">
                <Typography variant="body1" color="inherit">{NOTES}</Typography>

                <Box className="mt-10px">
                  <RedCircleIcon />
                </Box>
              </Box>
            </Box>
          </div>

          <Menu
            getContentAnchorEl={null}
            anchorEl={isNoteOpen}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            id={'patient-notes'}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={!!isNoteOpen}
            onClose={() => dispatch({ type: ActionType.SET_NOTE_OPEN, isNoteOpen: null })}
            className={classes.noteDropdown}
          >
            <PatientNoteModal
              patientStates={patientState}
              dispatcher={dispatch}
            />
          </Menu>
        </Box>
      </Box>
    </Box >

  return isCheckIn ? checkInComponent() : regularComponent()
};

export default PatientProfileHero;
