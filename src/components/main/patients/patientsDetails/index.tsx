// packages block
import moment from "moment";
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { ChangeEvent, useState, MouseEvent } from "react";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { Avatar, Box, Button, Grid, Menu, Tab, Typography } from "@material-ui/core";
// constants, history, styling block
import history from "../../../../history";
import { BLACK, BLACK_TWO, WHITE } from "../../../../theme";
import { formatPhone, getTimestamps, getFormattedDate } from "../../../../utils";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { Patient, useGetPatientQuery } from "../../../../generated/graphql";
import { ADD_WIDGET_TEXT, DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, EMPTY_OPTION, MAPPED_WIDGETS, PATIENTS_CHART, PATIENTS_ROUTE, PROFILE_TOP_TABS, SCHEDULE_APPOINTMENTS_TEXT, VIEW_CHART_TEXT } from "../../../../constants";
import { AddWidgetIcon, AtIcon, DeleteWidgetIcon, HashIcon, LocationIcon, ProfileUserIcon } from "../../../../assets/svgs";
import { ParamsType } from "../../../../interfacesTypes";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Selector from "../../../common/Selector";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const PatientDetailsComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const { id } = useParams<ParamsType>();
  const [value, setValue] = useState('1');
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<Patient | null>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const widgetId = "widget-menu";
  const handleMenuClose = () => setAnchorEl(null);
  const handleWidgetMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const { location: { pathname } } = history
  const getPatientIdArray = pathname.split("/")
  const getPatientId = getPatientIdArray[getPatientIdArray.length - 2]
  const methods = useForm<any>({
    mode: "all",
  });

  const { handleSubmit } = methods;

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const { loading } = useGetPatientQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      getPatient: {
        id: getPatientId,
      }
    },

    onError() {
      setPatientData(null);
    },

    onCompleted(data) {
      if (data) {
        const { getPatient: { patient } } = data

        if (patient && !loading) {
          setPatientData(patient as Patient)
        }
      }
    },
  });

  if (!patientData || loading) {
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
      const { firstName, lastName } = currentDoctor || {};
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

  const onDeleteClick = () => {
    setOpenDelete(true)
  };

  const handleDeleteWidget = () => {
    console.log("=====")
  };

  const onSubmit: SubmitHandler<any> = async (inputs) => { }

  return (
    <Box>
      <TabContext value={value}>
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
            <Box display="flex" alignItems="center">
              <Box pl={1}>
                <Box pr={3.75}>
                  <Avatar variant="square" src='' className={classes.profileImage} />
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
            <Grid container item spacing={2} md={4}>
              <Box className={classes.addSlot} my={2} aria-label="widget's patient" aria-controls={widgetId} aria-haspopup="true" onClick={handleWidgetMenuOpen}>
                <AddWidgetIcon />

                <Typography component='h1' variant="h4">
                  {ADD_WIDGET_TEXT}
                </Typography>
              </Box>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box p={8}>
                    <Menu
                      getContentAnchorEl={null}
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                      id={widgetId}
                      keepMounted
                      transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
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
                  </Box>
                </form>
              </FormProvider>
            </Grid>

            <Grid container spacing={3}>
              {ProfileDetailedData.map((item, index) => (
                <Grid item md={4} sm={12} xs={12} key={`${item.title}-${index}`}>
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
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>
      <ConfirmationModal
        title={DELETE_WIDGET_TEXT}
        isOpen={openDelete}
        description={DELETE_WIDGET_DESCRIPTION}
        handleDelete={handleDeleteWidget}
        setOpen={(open: boolean) => setOpenDelete(open)}
      />
    </Box>
  )
}

export default PatientDetailsComponent;
