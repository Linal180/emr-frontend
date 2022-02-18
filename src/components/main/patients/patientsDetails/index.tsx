// packages block
import { MouseEvent, ChangeEvent, Reducer, useReducer, useEffect } from 'react';
import moment from "moment";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Avatar, Box, Button, Menu, Tab, Typography } from "@material-ui/core";
// components block
import Selector from "../../../common/Selector";
import MediaCards from "../../../common/AddMedia/MediaCards";
import ConfirmationModal from "../../../common/ConfirmationModal";
// constants, history, styling block
import { ParamsType } from "../../../../interfacesTypes";
import { BLACK, BLACK_TWO, WHITE } from "../../../../theme";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { formatPhone, getTimestamps, getFormattedDate } from "../../../../utils";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";
import {
  Attachment, AttachmentType, Patient, useGetAttachmentQuery, useGetPatientLazyQuery
} from "../../../../generated/graphql";
import {
  AddWidgetIcon, AtIcon, DeleteWidgetIcon, HashIcon, LocationIcon, ProfileUserIcon
} from "../../../../assets/svgs";
import {
  ADD_WIDGET_TEXT, DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, EMPTY_OPTION, MAPPED_WIDGETS, PATIENTS_CHART,
  PATIENTS_ROUTE, PROFILE_TOP_TABS, SCHEDULE_APPOINTMENTS_TEXT, VIEW_CHART_TEXT
} from "../../../../constants";

const PatientDetailsComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const { id } = useParams<ParamsType>();
  const [{
    anchorEl, attachmentUrl, attachmentsData, openDelete, patientData, tabValue, attachmentId
  }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const isMenuOpen = Boolean(anchorEl);
  const widgetId = "widget-menu";
  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });
  const handleWidgetMenuOpen = (event: MouseEvent<HTMLElement>) =>
    dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget })

  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const [getPatient,] = useGetPatientLazyQuery({
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
          const { url, id: attachmentId } = (attachments && attachments[0]) || {}
          dispatch({ type: ActionType.SET_ATTACHMENT_URL, attachmentUrl: url || '' })
          dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId: attachmentId || '' })
          dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient as Patient })

        }
      }
    },
  });

  const { loading } = useGetAttachmentQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      getMedia: {
        id: attachmentId
      }
    },

    onError() {
    },

    onCompleted(data) {

      const { getAttachment } = data || {};

      if (getAttachment) {
        const { preSignedUrl } = getAttachment
        dispatch({ type: ActionType.SET_ATTACHMENT_URL, attachmentUrl: preSignedUrl || '' })
        dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId: attachmentId })
      }
    },
  });

  useEffect(() => {

    if (id) {
      getPatient({
        variables: {
          getPatient: { id }
        },
      })
    }
  }, [getPatient, id])

  if (!patientData && loading) {
    return (
      <Box>Loading...</Box>
    )
  }

  const { firstName, lastName, dob, contacts, doctorPatients, createdAt } = patientData || {}
  const selfContact = contacts?.filter(item => item.primaryContact)

  const PATIENT_AGE = moment().diff(getTimestamps(dob || ''), 'years');
  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""

  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = formatPhone(phone || '') || "--"
    selfEmail = email || "--"
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
    {
      title: "Last Scheduled Appointment",
      description: "Wed Jul 25, 2018"
    },
    {
      title: "Next Scheduled Appointment",
      description: "Thu Nov 18, 2021"
    },
  ]

  const ProfileDetailedData = [
    {
      title: "Allergies",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio viverra proin tortor pellentesque turpis pellentesque diam. Tellus turpis gravida amet, sit eget maecenas. Diam quisque facilisi nunc morbi vitae nec quis viverra."
    },
    {
      title: "Past Medical History",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio viverra proin tortor pellentesque turpis pellentesque diam. Tellus turpis gravida amet, sit eget maecenas. Diam quisque facilisi nunc morbi vitae nec quis viverra."
    },
    {
      title: "Problems",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio viverra proin tortor pellentesque turpis pellentesque diam. Tellus turpis gravida amet, sit eget maecenas. Diam quisque facilisi nunc morbi vitae nec quis viverra."
    },
    {
      title: "Medications",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio viverra proin tortor pellentesque turpis pellentesque diam. Tellus turpis gravida amet, sit eget maecenas. Diam quisque facilisi nunc morbi vitae nec quis viverra."
    },
    {
      title: "Family History",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Odio viverra proin tortor pellentesque turpis pellentesque diam. Tellus turpis gravida amet, sit eget maecenas. Diam quisque facilisi nunc morbi vitae nec quis viverra."
    },
  ]

  const onDeleteClick = () =>
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })

  const handleDeleteWidget = () => { };

  const onSubmit: SubmitHandler<any> = async (inputs) => { }

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
          <Box className={classes.profileCard}>
            <Box key={attachmentId} display="flex" alignItems="center">
              <Box pl={1}>
                <Box pr={3.75} position="relative">
                  <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />
                  {attachmentsData &&
                    <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide="" attachmentsData={attachmentsData as Attachment[]} notDescription={true} />
                  }
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

                <Button color="primary" variant="contained" className="blue-button">
                  {SCHEDULE_APPOINTMENTS_TEXT}
                </Button>
              </Box>
            </Box>
          </Box>

          <TabPanel value="1">
            <Box className={classes.profileCardMasonry}>
              {ProfileDetailedData.map((item, index) => (
                <Box className={classes.profileCardItemMasonry} key={`${item.title}-${index}`}>
                    {item && item.title === "Allergies" && <>
                      <Box className={classes.addSlot} my={2} aria-label="widget's patient" aria-controls={widgetId} aria-haspopup="true" onClick={handleWidgetMenuOpen}>
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
                </Box>
              ))}
            </Box>
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
