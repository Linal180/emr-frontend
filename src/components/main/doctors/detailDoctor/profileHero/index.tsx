import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
// components block
import TextLoader from "../../../../common/TextLoader";
import MediaCards from "../../../../common/AddMedia/MediaCards";
// interfaces, reducers, constants and styles block
import history from "../../../../../history";
import { useProfileDetailsStyles } from "../../../../../styles/profileDetails";
import { getTimestamps, formatPhone, getFormattedDate } from "../../../../../utils";
import { ParamsType, DoctorProfileHeroProps } from "../../../../../interfacesTypes";
import { Box, Avatar, CircularProgress, Button, Typography } from "@material-ui/core";
import { ATTACHMENT_TITLES, N_A, EDIT_DOCTOR, DOCTORS_ROUTE } from "../../../../../constants";
import { doctorReducer, Action, initialState, State, ActionType } from "../../../../../reducers/doctorReducer";
import {
  AttachmentType, Contact, Doctor, useGetAttachmentLazyQuery, useGetDoctorLazyQuery
} from "../../../../../generated/graphql";
import { ProfileUserIcon, HashIcon, AtIcon, LocationIcon } from "../../../../../assets/svgs";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../../reducers/mediaReducer";

const DoctorProfileHero: FC<DoctorProfileHeroProps> = ({ setDoctor, setAttachmentsData }) => {
  const classes = useProfileDetailsStyles();
  const { id } = useParams<ParamsType>();
  const [{ doctor }, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
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

  const [getDoctor, { loading: getDoctorLoading }] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_DOCTOR, doctor: null })
    },

    onCompleted(data) {
      if (data) {
        const { getDoctor } = data;

        if (getDoctor) {
          const { doctor } = getDoctor;
          const { attachments } = doctor || {}
          const profilePicture = attachments && attachments.filter(attachment =>
            attachment.title === ATTACHMENT_TITLES.ProfilePicture)[0]
          const { id: attachmentId, } = profilePicture || {}

          attachmentId &&
            mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId })

          dispatch({ type: ActionType.SET_DOCTOR, doctor: doctor as Doctor })
          mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: profilePicture })

          if (attachments) {
            mediaDispatch({
              type: mediaActionType.SET_ATTACHMENTS_DATA,
              attachmentsData: attachments.filter(attachment => attachment?.title === ATTACHMENT_TITLES.ProviderUploads)
            })

            setAttachmentsData(attachmentData)
          }

          doctor && setDoctor(doctor)
        }
      }
    },
  });

  const fetchDoctor = useCallback(async () => {
    try {
      await getDoctor({ variables: { getDoctor: { id } } })
    } catch (error) { }
  }, [getDoctor, id]);

  useEffect(() => {
    id && fetchDoctor()
  }, [fetchDoctor, id])

  useEffect(() => {
    attachmentId && fetchAttachment();
  }, [attachmentId, fetchAttachment, attachmentData])

  const {
    firstName, email: doctorEmail, lastName, dob, contacts, createdAt
  } = doctor || {}

  const selfContact = contacts?.filter((item: Contact) => item.primaryContact)
  const DOCTOR_AGE = moment().diff(getTimestamps(dob || ''), 'years');
  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""

  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = formatPhone(phone || '') || "--"
    selfEmail = doctorEmail ? doctorEmail : email || "--"
    selfCurrentLocation = `${country ? country : N_A} ${state ? state : ''}`
  }

  const ProfileDetails = [
    {
      icon: ProfileUserIcon(),
      description: `${DOCTOR_AGE} Yrs Old`
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

  let providerDateAdded = createdAt ? getFormattedDate(createdAt || '') : '--'

  const ProfileAdditionalDetails = [
    {
      title: "Date Added",
      description: providerDateAdded
    }
  ]

  const isLoading = getDoctorLoading || getAttachmentLoading

  return (
    <>
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
              reload={() => fetchDoctor()}
              notDescription={true}
              moduleType={AttachmentType.Doctor}
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
            <Box display="flex">
              <Box flex={1} flexWrap="wrap">
                <Box display="flex" alignItems="center">
                  <Box className={classes.userName} mr={1}>
                    {`${firstName} ${lastName}`}
                  </Box>
                </Box>

                <Box display="flex" width="100%" pt={1} flexWrap="wrap">
                  {ProfileDetails.map((item, index) => (
                    <Box display="flex" flexWrap="wrap" key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                      <Box>{item.icon}</Box>
                      <Typography variant="body1">{item.description}</Typography>
                    </Box>
                  ))}
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
                <Box pr={1}>
                  <Button color="secondary" variant="outlined" onClick={() => history.push(`${DOCTORS_ROUTE}/${id}`)}>
                    {EDIT_DOCTOR}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        }
      </Box>
    </>
  )
};

export default DoctorProfileHero;
