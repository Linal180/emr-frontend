import { FC, Reducer, useCallback, useEffect, useReducer } from "react";

import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import {
  AttachmentType, Contact, Patient, useGetAttachmentLazyQuery, useGetPatientLazyQuery
} from "../../../../generated/graphql";
import { Box, Avatar, CircularProgress, Button } from "@material-ui/core";
import moment from "moment";
import { ProfileUserIcon, HashIcon, AtIcon, LocationIcon } from "../../../../assets/svgs";
import { ATTACHMENT_TITLES, PATIENTS_ROUTE, EDIT_PATIENT, SCHEDULE_APPOINTMENTS_TEXT, N_A } from "../../../../constants";
import { getTimestamps, formatPhone, getFormattedDate } from "../../../../utils";
import MediaCards from "../../AddMedia/MediaCards";
import ViewDataLoader from "../../ViewDataLoader";
import history from "../../../../history";
import { ParamsType } from "../../../../interfacesTypes";
import { useParams } from "react-router-dom";

interface PatientProfileHeroProps {
  isChart?: boolean;
  setPatient: Function;
  setAttachmentsData: Function;
}

const PatientProfileHero: FC<PatientProfileHeroProps> = ({ setPatient, setAttachmentsData, isChart }) => {
  const classes = useProfileDetailsStyles();
  const { id } = useParams<ParamsType>();
  const [{ patientData }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const [{ attachmentUrl, attachmentData, attachmentId }, mediaDispatch] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const [getAttachment, { loading: getAttachmentLoading }] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      getMedia: { id }
    },

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

  const { firstName, email: patientEmail, lastName, patientRecord, dob, contacts, doctorPatients, createdAt } = patientData || {}
  const selfContact = contacts?.filter((item: Contact) => item.primaryContact)

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
      description: patientRecord
    },
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

  const isLoading = getPatientLoading || getAttachmentLoading

  return (
    <>
      {isLoading ? (<ViewDataLoader rows={3} columns={6} />) : (
        <Box className={classes.profileCard}>
          <Box key={attachmentId} display="flex" alignItems="center">
            <Box pl={1}>
              <Box pr={3.75} position="relative">
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
          </Box>

          <Box flex={1}>
            <Box display="flex">
              <Box flex={1}>
                <Box display="flex" alignItems="center" className={classes.userName}>
                  {`${firstName} ${lastName}`}
                </Box>

                <Box display="flex" width="100%" pt={1} flexWrap="wrap">
                  {ProfileDetails.map((item, index) => (
                    <Box display="flex" key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                      <Box>{item.icon}</Box>
                      <Box>{item.description}</Box>
                    </Box>
                  ))}
                </Box>

                <Box display="flex" pt={3}>
                  {ProfileAdditionalDetails.map((item, index) => (
                    <Box key={`${item.title}-${index}`} className={classes.profileAdditionalInfo}>
                      <Box className={classes.profileInfoHeading}>{item.title}</Box>
                      <Box>{item.description}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {!isChart && <Box pr={1}>
                <Button color="primary" variant="contained" onClick={() => history.push(`${PATIENTS_ROUTE}/${id}`)}>
                  {EDIT_PATIENT}
                </Button>
              </Box>}

              <Button color="primary" variant="contained" className="blue-button">
                {SCHEDULE_APPOINTMENTS_TEXT}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
};

export default PatientProfileHero;
