// packages block
import { MouseEvent, ChangeEvent, Reducer, useReducer, useEffect, useCallback } from 'react';
import moment from "moment";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Avatar, Box, Button, CircularProgress, Grid, Menu, Tab, Typography } from "@material-ui/core";
//components block
import Selector from "../../../common/Selector";
import MediaCards from "../../../common/AddMedia/MediaCards";
import ConfirmationModal from "../../../common/ConfirmationModal";
import PortalTable from '../../../common/patientDetail/PortalTable';
import DocumentsTable from '../../../common/patientDetail/DocumentsTable';
// constants, history, styling block
import history from '../../../../history';
import { ParamsType } from "../../../../interfacesTypes";
import { BLACK, BLACK_TWO, WHITE } from "../../../../theme";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { formatPhone, getTimestamps, getFormattedDate } from "../../../../utils";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import {
  AttachmentType, Contact, Patient, useGetAttachmentLazyQuery, useGetPatientLazyQuery
} from "../../../../generated/graphql";
import {
  AddWidgetIcon, AtIcon, DeleteWidgetIcon, HashIcon, LocationIcon, ProfileUserIcon
} from "../../../../assets/svgs";
import {
  ADD_WIDGET_TEXT, ATTACHMENT_TITLES, DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, EDIT_PATIENT, EMPTY_OPTION,
  MAPPED_WIDGETS, PATIENTS_CHART, PATIENTS_ROUTE, PROFILE_DETAIL_DATA, PROFILE_TOP_TABS, SCHEDULE_APPOINTMENTS_TEXT,
  VIEW_CHART_TEXT,
} from "../../../../constants";
import Insurance from './Insurance';
import LabOrdersTable from '../../../common/patientDetail/LabOrdersTable';
import ViewDataLoader from '../../../common/ViewDataLoader';

const PatientDetailsComponent = (): JSX.Element => {
  const widgetId = "widget-menu";
  const { id } = useParams<ParamsType>();
  const classes = useProfileDetailsStyles();
  const [{ anchorEl, openDelete, patientData, tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [{ attachmentUrl, attachmentData, attachmentId, attachmentsData }, mediaDispatch] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const isMenuOpen = Boolean(anchorEl);
  const methods = useForm<any>({ mode: "all", });
  const { handleSubmit } = methods;

  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });

  const handleWidgetMenuOpen = (event: MouseEvent<HTMLElement>) =>
    dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget })

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

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
      console.log("Getting Profile")
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

          if (attachmentId) {
            console.log("ID >>", attachmentId)
            mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId })
          }

          dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient as Patient })
          mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_DATA, attachmentData: profilePicture })
          attachments && mediaDispatch({
            type: mediaActionType.SET_ATTACHMENTS_DATA,
            attachmentsData: attachments.filter(attachment => attachment?.title === ATTACHMENT_TITLES.ProviderUploads)
          })
        }
      }
    },
  });

  const fetchPatient = useCallback(async () => {
    try {
      await getPatient({
        variables: { getPatient: { id } }
      })
    } catch (error) { }
  }, [getPatient, id]);

  useEffect(() => {
    id && fetchPatient()
  }, [fetchPatient, id])

  useEffect(() => {
    attachmentId && fetchAttachment();
  }, [attachmentId, fetchAttachment])

  const { firstName, email: patientEmail, lastName, dob, inviteAccepted, contacts, doctorPatients, createdAt } = patientData || {}
  const selfContact = contacts?.filter((item: Contact) => item.primaryContact)

  const PATIENT_AGE = moment().diff(getTimestamps(dob || ''), 'years');
  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""

  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = formatPhone(phone || '') || "--"
    selfEmail = patientEmail ? patientEmail : email || "--"
    selfCurrentLocation = `${country} ${state}` || "--"
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

  const onDeleteClick = () =>
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })

  const handleDeleteWidget = () => { };
  const onSubmit: SubmitHandler<any> = async (inputs) => { }
  const isLoading = getPatientLoading || getAttachmentLoading

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box display="flex" justifyContent="space-between">
          <TabList onChange={handleChange} aria-label="Profile top tabs">
            {PROFILE_TOP_TABS.map(item => (
              <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
            ))}
          </TabList>

          <Box pr={2}>
            <Link to={`${PATIENTS_ROUTE}/${id}/details${PATIENTS_CHART}`}>
              <Button color="primary" variant="contained">{VIEW_CHART_TEXT}</Button>
            </Link>
          </Box>
        </Box>

        <Box className={classes.profileDetailsContainer}>
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
                      reload={() => fetchAttachment()}
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

                  <Box pr={1}>
                    <Button color="primary" variant="contained" onClick={() => history.push(`${PATIENTS_ROUTE}/${id}`)}>
                      {EDIT_PATIENT}
                    </Button>
                  </Box>

                  <Button color="primary" variant="contained" className="blue-button">
                    {SCHEDULE_APPOINTMENTS_TEXT}
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          <TabPanel value="1">
            <Grid container spacing={3}>
              {PROFILE_DETAIL_DATA.map((item, index) => (
                <Grid item md={4} sm={12} xs={12} key={`${item.title}-${index}`}>
                  {item && item.title === "Allergies" && <>
                    <Box
                      my={2}
                      aria-haspopup="true"
                      aria-controls={widgetId}
                      className={classes.addSlot}
                      aria-label="widget's patient"
                      onClick={handleWidgetMenuOpen}
                    >
                      <AddWidgetIcon />
                      <Typography component='h1' variant="h4">
                        {ADD_WIDGET_TEXT}
                      </Typography>
                    </Box>

                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Menu
                          getContentAnchorEl={null}
                          anchorEl={anchorEl}
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                          id={widgetId}
                          keepMounted
                          transformOrigin={{ vertical: "top", horizontal: "right" }}
                          open={isMenuOpen}
                          onClose={handleMenuClose}
                          className={classes.dropdown}
                        >
                          <Selector
                            isRequired
                            value={EMPTY_OPTION}
                            label={ADD_WIDGET_TEXT}
                            name="addWidget"
                            options={MAPPED_WIDGETS}
                            isMultiple
                          />
                        </Menu>
                      </form>
                    </FormProvider>
                  </>
                  }

                  {isLoading ? (<ViewDataLoader rows={6} columns={12} />) : (
                    <Box bgcolor={WHITE} p={4}>
                      <Box display="flex" justifyContent="space-between" borderBottom={`2px solid ${BLACK}`} pb={2}>
                        <Box className={classes.profileInfoHeading}>
                          {item.title}
                        </Box>

                        <Box onClick={onDeleteClick} className={classes.deleteWidget}>
                          <DeleteWidgetIcon />
                        </Box>
                      </Box>

                      <Box fontSize={16} color={BLACK_TWO} pb={3.75} pt={2}>
                        <Typography color="inherit">{item.description}</Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value="2">
            <Insurance />
          </TabPanel>

          <TabPanel value="8">
            <DocumentsTable dispatcher={mediaDispatch} attachments={attachmentsData} />
          </TabPanel>

          <TabPanel value="9">
            <PortalTable inviteAccepted={Boolean(inviteAccepted)} />
          </TabPanel>

          <TabPanel value="10">
            <LabOrdersTable />
          </TabPanel>
        </Box>
      </TabContext>

      <ConfirmationModal
        title={DELETE_WIDGET_TEXT}
        isOpen={openDelete}
        description={DELETE_WIDGET_DESCRIPTION}
        handleDelete={handleDeleteWidget}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
    </Box>
  )
}

export default PatientDetailsComponent;
