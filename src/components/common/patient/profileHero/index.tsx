import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Box, Avatar, CircularProgress, Button, Typography, Menu } from "@material-ui/core";
// components block
import TextLoader from "../../TextLoader";
import { PatientNoteModal } from './NoteModal'
import MediaCards from "../../AddMedia/MediaCards";
// interfaces, reducers, constants and styles block
import history from "../../../../history";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { getTimestamps, formatPhone, getFormattedDate } from "../../../../utils";
import { ParamsType, PatientProfileHeroProps } from "../../../../interfacesTypes";
import { ATTACHMENT_TITLES, PATIENTS_ROUTE, EDIT_PATIENT, N_A, NOTES } from "../../../../constants";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  AttachmentType, Contact, Patient, useGetAttachmentLazyQuery, useGetPatientLazyQuery
} from "../../../../generated/graphql";
import {
  ProfileUserIcon, HashIcon, AtIcon, LocationIcon, NotesCardIcon, RedCircleIcon
} from "../../../../assets/svgs";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";

const PatientProfileHero: FC<PatientProfileHeroProps> = ({ setPatient, setAttachmentsData, isChart }) => {
  const noteRef = useRef(null)
  const { id } = useParams<ParamsType>();
  const classes = useProfileDetailsStyles();
  const [patientState, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { patientData, isNoteOpen, patientNoteOpen } = patientState
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

  const fetchPatient = useCallback(async () => {
    try {
      await getPatient({ variables: { getPatient: { id } } })
    } catch (error) { }
  }, [getPatient, id]);

  useEffect(() => {
    id && fetchPatient()
  }, [fetchPatient, id])

  useEffect(() => {
    attachmentId && fetchAttachment();
  }, [attachmentId, fetchAttachment, attachmentData])

  const {
    firstName, email: patientEmail, lastName, patientRecord, dob, contacts, doctorPatients, createdAt
  } = patientData || {}

  const selfContact = contacts?.filter((item: Contact) => item.primaryContact)
  // const patientName = `${firstName} ${lastName}`;
  const PATIENT_AGE = moment().diff(getTimestamps(dob || ''), 'years');
  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""

  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = formatPhone(phone || '') || "--"
    selfEmail = patientEmail ? patientEmail : email || "--"
    selfCurrentLocation = `${country ? country : N_A} ${state ? state : ''}`
  }

  const ProfileDetails = [
    {
      icon: ProfileUserIcon(),
      description: `${PATIENT_AGE} Yrs Old`
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

  const ProfileAdditionalDetails = [
    {
      title: "Primary Provider",
      description: providerName
    },
    {
      title: "Date Added",
      description: providerDateAdded
    },
    // {
    //   title: "Last Scheduled Appointment",
    //   description: "Wed Jul 25, 2018"
    // },
    // {
    //   title: "Next Scheduled Appointment",
    //   description: "Thu Nov 18, 2021"
    // },
  ]

  useEffect(() => {
    patientNoteOpen && dispatch({ type: ActionType.SET_NOTE_OPEN, isNoteOpen: noteRef.current })
  }, [patientNoteOpen, dispatch])

  const isLoading = getPatientLoading || getAttachmentLoading

  return (
    <Box className={classes.profileCard}>
      <Box key={attachmentId} display="flex" alignItems="center">
        <Box pl={1} pr={3.75} position="relative">
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
        <TextLoader rows={[{ column: 1, size: 3 }, { column: 4, size: 3 }, { column: 2, size: 3 }]} />
        :
        <Box flex={1}>
          <Box display='flex'>
            <Box flex={1} flexWrap="wrap">
              <Box display="flex" alignItems="center">
                <Box className={classes.userName} mr={1}>
                  {`${firstName} ${lastName}`}
                </Box>

                <Typography variant="body2">({patientRecord})</Typography>
              </Box>

              <Box display="flex" width="100%" pt={1} flexWrap="wrap">
                {ProfileDetails.map((item, index) => (
                  <Box display="flex" flexWrap="wrap" key={`${item.description}-${index}`}
                    className={classes.profileInfoItem}
                  >
                    <Box>{item.icon}</Box>
                    <Typography variant="body1">{item.description}</Typography>
                  </Box>
                ))}

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

              <Box display="flex" pt={1}>
                {ProfileAdditionalDetails.map((item, index) => (
                  <Box key={`${item.title}-${index}`} className={classes.profileAdditionalInfo}>
                    <Box className={classes.profileInfoHeading}>{item.title}</Box>

                    <Box className={classes.profileInfoItem}>
                      <Typography variant="body1">{item.description}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box display='flex' alignItems='baseline' flexWrap='wrap'>
              {!isChart && <Box pr={1}>
                <Button color="secondary" variant="outlined" onClick={() => history.push(`${PATIENTS_ROUTE}/${id}`)}>
                  {EDIT_PATIENT}
                </Button>
              </Box>}

              {/* <Button color="secondary" variant="contained" onClick={() => history.push(`${APPOINTMENTS_ROUTE}/new?patientId=${id}&patientName=${patientName}`)}>
                  {SCHEDULE_APPOINTMENTS_TEXT}
                </Button> */}
            </Box>
          </Box>
        </Box>
      }
    </Box>
  )
};

export default PatientProfileHero;
