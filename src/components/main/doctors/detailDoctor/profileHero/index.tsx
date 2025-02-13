// packages
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
// components block
import TextLoader from "../../../../common/TextLoader";
import MediaCards from "../../../../common/AddMedia/MediaCards";
// interfaces, reducers, constants and styles block
import history from "../../../../../history";
import { useProfileDetailsStyles } from "../../../../../styles/profileDetails";
import { formatPhone, getFormattedDate, getTimestamps, renderMissing } from "../../../../../utils";
import { ATTACHMENT_TITLES, DOCTORS_ROUTE, LESS_INFO, MORE_INFO, N_A } from "../../../../../constants";
import { AtIcon, EditNewIcon, HashIcon, LocationIcon, ProfileUserIcon } from "../../../../../assets/svgs";
import { Avatar, Box, Button, Card, CircularProgress, Collapse, IconButton, Typography } from "@material-ui/core";
import {
  AttachmentType, Contact, Doctor, useGetDoctorLazyQuery
} from "../../../../../generated/graphql";
import { DoctorProfileHeroProps, ParamsType } from "../../../../../interfacesTypes";
import {
  Action, ActionType, doctorReducer, initialState, State
} from "../../../../../reducers/doctorReducer";
import {
  Action as mediaAction, ActionType as mediaActionType, initialState as mediaInitialState,
  mediaReducer, State as mediaState
} from "../../../../../reducers/mediaReducer";

const DoctorProfileHero: FC<DoctorProfileHeroProps> = ({ setDoctor, setAttachmentsData }) => {
  const classes = useProfileDetailsStyles();
  const { id } = useParams<ParamsType>();
  const [{ doctor, openMoreInfo }, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const [{ attachmentUrl, attachmentData, attachmentId, }, mediaDispatch] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

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
          const { id: attachmentId, preSignedUrl } = profilePicture || {}

          preSignedUrl && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_URL, attachmentUrl: preSignedUrl })

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

  const isLoading = getDoctorLoading

  return (
    <>
      <Box display="flex" className={` ${classes.profileCard} card-box-shadow`}>
        <Box key={attachmentId} display="flex" alignItems="center">
          <Box pl={1} pr={3.75} pb={0} mb={0} position="relative" className={classes.profileAvatar}>
            {isLoading ?
              <Avatar variant="square">
                <CircularProgress size={20} color="inherit" />
              </Avatar>
              :
              <Avatar variant="square" src={attachmentUrl || ""} />
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
          <TextLoader rows={[{ column: 1, size: 3 }, { column: 3, size: 3 }]} />
          :
          <Box flex={1}>
            <Box display="flex" flexWrap="wrap">
              <Box flex={1} flexWrap="wrap">
                <Box display="flex" alignItems="baseline" >
                  <Box className={classes.userName} mr={1}>
                    {`${firstName} ${lastName}`}
                  </Box>

                  <IconButton size="small" onClick={() => history.push(`${DOCTORS_ROUTE}/${id}`)}>
                    <EditNewIcon />
                  </IconButton>
                </Box>

                <Box display="flex" width="100%" pt={1} flexWrap="wrap" alignItems='center'>
                  {ProfileDetails.map((item, index) => (
                    <Box display="flex"
                      key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                      <Box>{item.icon}</Box>
                      <Typography variant="body1">
                        {!!item.description ? item.description : renderMissing()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box display='flex' alignItems='flex-end' flexWrap='wrap'>
                <Button onClick={() => dispatch({ type: ActionType.SET_OPEN_MORE_INFO, openMoreInfo: !openMoreInfo })} variant="text" className="btn-focus">
                  {openMoreInfo ? <Typography variant="body2">... {LESS_INFO}</Typography>
                    : <Typography variant="body2">... {MORE_INFO}</Typography>}
                </Button>
              </Box>
            </Box>
          </Box>
        }
      </Box>

      <Collapse in={openMoreInfo} mountOnEnter unmountOnExit>
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
  )
};

export default DoctorProfileHero;
