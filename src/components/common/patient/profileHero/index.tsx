import { FC, Reducer, useState, useCallback, useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box, Avatar, CircularProgress, Button, Typography, Menu, Collapse, Card, Link } from "@material-ui/core";
// components block
import TextLoader from "../../TextLoader";
import { PatientNoteModal } from './NoteModal'
import MediaCards from "../../AddMedia/MediaCards";
// interfaces, reducers, constants and styles block
import { BLACK_THREE } from "../../../../theme";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { ParamsType, PatientProfileHeroProps } from "../../../../interfacesTypes";
import { ATTACHMENT_TITLES, NOTES, MORE_INFO, LESS_INFO, NEXT_SCHEDULED_APPOINTMENT } from "../../../../constants";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  formatPhone, getFormattedDate, renderMissing, formatValue, getFormatDateString, getDateWithDay, dateDifference
} from "../../../../utils";
import {
  AttachmentType, Contact, Patient, useGetAttachmentLazyQuery, useGetPatientLazyQuery, AppointmentPayload,
  useGetPatientNearestAppointmentsLazyQuery
} from "../../../../generated/graphql";
import {
  ProfileUserIcon, HashIcon, AtIcon, LocationIcon, RedCircleIcon, NotesOutlinedCardIcon
} from "../../../../assets/svgs";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";

const PatientProfileHero: FC<PatientProfileHeroProps> = ({
  setPatient, setAttachmentsData, isCheckIn, isChart
}) => {
  const noteRef = useRef(null)
  const { id } = useParams<ParamsType>();
  const [open, setOpen] = useState<boolean>(false)
  const [appointmentId, setAppointmentId] = useState<string>('')
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
        variables: { getMedia: { id: attachmentId } }
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

          if (upcomingAppointment) {
            const { id: appointmentId } = upcomingAppointment
            appointmentId && setAppointmentId(appointmentId)
          }
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
    firstName, email: patientEmail, lastName, patientRecord, sexAtBirth, dob, contacts, doctorPatients, createdAt
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
  ]

  useEffect(() => {
    patientNoteOpen && dispatch({ type: ActionType.SET_NOTE_OPEN, isNoteOpen: noteRef.current })
  }, [patientNoteOpen, dispatch])

  const isLoading = getPatientLoading || getAttachmentLoading

  const patientAvatar = () => <Box key={attachmentId} display="flex" alignItems="center">
    <Box pl={1} pr={3.75} pb={0} mb={0} position="relative">
      {getAttachmentLoading ?
        <Avatar variant="square" className={classes.profileImage}>
          <CircularProgress size={20} color="inherit" />
        </Avatar>
        :
        <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
      }

      {!isCheckIn &&
        <MediaCards
          title={ATTACHMENT_TITLES.ProfilePicture}
          reload={() => fetchPatient()}
          notDescription={true}
          moduleType={AttachmentType.Patient}
          itemId={id}
          imageSide={attachmentUrl}
          attachmentData={attachmentData || undefined}
        />
      }
    </Box>
  </Box>

  const renderName = () => <>
    <Box display="flex" alignItems="center">
      <Box className={classes.userName} mr={1}>
        {`${firstName} ${lastName}`}
      </Box>

      <Box display="flex" flexWrap="wrap" alignItems="center">
        {!isCheckIn &&
          <Typography variant="body2">
            {`(${patientRecord}) | (${formatValue(sexAtBirth || '')}) | ${getFormatDateString(dob || '')}`}
          </Typography>
        }
      </Box>
    </Box>
  </>

  const renderAge = () =>
    <Box display="flex" className={classes.profileInfoItem}>
      <Box display='flex' alignItems='center'>
        <ProfileUserIcon />

        <Box color={BLACK_THREE}>
          <Typography variant="body1">{dob ? dateDifference(dob || '') : renderMissing()}</Typography>
        </Box>
      </Box>
    </Box>

  const renderNotes = () => <>
    <div ref={noteRef}
      className={`${classes.profileNoteInfoItem} pointer-cursor`}
      onClick={(event) => dispatch({
        type: ActionType.SET_NOTE_OPEN, isNoteOpen: event.currentTarget
      })}
    >
      <NotesOutlinedCardIcon />

      <Box display="flex" alignItems="center">
        <Typography variant="body1">{NOTES}</Typography>

        <Box className="mt-10px">
          <RedCircleIcon />
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
  </>

  const regularComponent = () =>
    <>
      <Box className={` ${classes.profileCard} card-box-shadow`}>
        {patientAvatar()}

        {isLoading ?
          <TextLoader rows={[{ column: 1, size: 3 }, { column: 4, size: 3 }]} />
          :
          <Box flex={1}>
            <Box display='flex'>
              <Box flex={1} flexWrap="wrap">
                {renderName()}

                <Box display="flex" width="100%" pt={1} flexWrap="wrap" alignItems='center'>
                  {renderAge()}

                  <Box display="flex" className={classes.profileInfoItem}>
                    <Box><HashIcon /></Box>

                    <Typography variant="body1">
                      {selfPhoneNumber ?
                        <Link href={`tell:${selfPhoneNumber}`}>{selfPhoneNumber}</Link>
                        : renderMissing()
                      }
                    </Typography>
                  </Box>

                  <Box display="flex" className={classes.profileInfoItem}>
                    <Box><AtIcon /></Box>

                    <Typography variant="body1">
                      {selfEmail ?
                        <Link href={`mailto:${selfEmail}`}>{selfEmail}</Link>
                        : renderMissing()
                      }
                    </Typography>
                  </Box>

                  <Box display="flex" className={classes.profileInfoItem}>
                    <Box><LocationIcon /></Box>
                    <Typography variant="body1">{selfCurrentLocation ? selfCurrentLocation : renderMissing()}</Typography>
                  </Box>

                  {renderNotes()}
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
              <>
                {ProfileAdditionalDetails.map((item, index) => (
                  <Box key={`${item.title}-${index}`} className={classes.profileAdditionalInfo}>
                    <Box className={classes.profileInfoHeading}>{item.title}</Box>

                    <Box className={classes.profileInfoItem}>
                      <Typography variant="body1">{item.description}</Typography>
                    </Box>
                  </Box>
                ))}
                <Box className={classes.profileAdditionalInfo}>
                  <Box className={classes.profileInfoHeading}>{NEXT_SCHEDULED_APPOINTMENT}</Box>

                  {nextAppointmentDate ? <Box className={classes.profileInfoItem}>
                    <Typography variant="body1">
                      <Link href={`${process.env.REACT_APP_URL}/appointments/${appointmentId}`}>
                        {nextAppointmentDate}
                      </Link>
                    </Typography>
                  </Box>
                    :
                    <Box className={classes.profileInfoItem}>
                      <Typography variant="body1">{'--'}</Typography>
                    </Box>}
                </Box>
              </>
            </Box>
          </Card>
        </Box>
      </Collapse>
    </>

  const checkInComponent = () =>
    <Box display='flex' alignItems='center'>
      {patientAvatar()}

      <Box>
        {renderName()}

        <Box display="flex" alignItems="baseline">
          {renderAge()}

          <Box p={1} />

          {renderNotes()}
        </Box>
      </Box>
    </Box>

  return isCheckIn ? checkInComponent() : regularComponent()
};

export default PatientProfileHero;
