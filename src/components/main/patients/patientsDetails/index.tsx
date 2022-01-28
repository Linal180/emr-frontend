// packages block
import { ChangeEvent, useState } from "react";
import { Avatar, Box, Button, Grid, Tab, Typography } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import moment from "moment";
// components block
import CardComponent from "../../../common/CardComponent";
import history from "../../../../history";
// constants, history, styling block
import { DELETE_REQUEST, DELETE_REQUEST_DESCRIPTION, PATIENTS_ROUTE, PROFILE_TOP_TABS } from "../../../../constants";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { AtIcon, HashIcon, LocationIcon, ProfileUserIcon } from "../../../../assets/svgs";
import { BLACK_TWO } from "../../../../theme";
import { AttachmentsPayload, Patient, useGetAttachmentLazyQuery, useGetPatientQuery, useRemoveAttachmentDataMutation } from "../../../../generated/graphql";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Alert from "../../../common/Alert";

const PatientDetailsComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const [value, setValue] = useState('1');
  const [patientData, setPatientData] = useState<Patient | null>();
  const [deletedAttachment,] = useState<string>('');
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<AttachmentsPayload["attachments"]>();


  const { location: { pathname } } = history
  const getPatientIdArray = pathname.split("/")
  const getPatientId = getPatientIdArray[getPatientIdArray.length - 2]

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
          const { attachments } = patient
          setAttachments(attachments)
          setPatientData(patient as Patient)
        }
      }
    },
  });

  const [removeAttachmentData, { loading: deleteAttachmentLoading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message)
      setOpenDeleteModal(false)
    },

    onCompleted(data) {
      if (data) {
        const { removeAttachmentData: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          setOpenDeleteModal(false)
          history.push(PATIENTS_ROUTE)
        }
      }
    }
  });

  const [getAttachmentUrl,] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { getAttachment: { preSignedUrl } } = data
      preSignedUrl && window.open(preSignedUrl, '_blank');
    },
  });

  const handleAttachmentClick = (id: string) => {
    getAttachmentUrl({
      variables: {
        getMedia: {
          id
        }
      }
    })
  }

  const handleDeleteAttachment = async () => {
    if (deletedAttachment) {
      await removeAttachmentData({
        variables: {
          removeAttachment: {
            id: deletedAttachment
          }
        }
      })
    }
  };

  if (!patientData && loading) {
    return (
      <Box>Loading...</Box>
    )
  }

  const { firstName, lastName, dob, contacts, usualProvider, createdAt } = patientData || {}
  const selfContact = contacts?.filter(item => item.primaryContact)

  const PATIENT_AGE = moment().diff(dob, 'years');
  let selfPhoneNumber = "";
  let selfEmail = ""
  let selfCurrentLocation = ""

  if (selfContact && selfContact[0]) {
    const { phone, email, country, state } = selfContact[0]
    selfPhoneNumber = phone || "--"
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
  let providerDateAdded = createdAt ? moment.unix(parseInt(createdAt)).format("MMM. DD, YYYY") : '--'

  if (usualProvider && usualProvider[0]) {
    const { firstName, lastName } = usualProvider[0]
    providerName = `${firstName} ${lastName}` || "--"
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

  const { id, url } = (attachments && attachments[2]) || {}

  return (
    <Box>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="Profile top tabs">
          {PROFILE_TOP_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>

        <Box className={classes.profileDetailsContainer}>
          <Box className={classes.profileCard}>
            <Box key={url} display="flex" alignItems="center">
              <Box pl={1} onClick={() => handleAttachmentClick(id || "")} >
                {JSON.stringify(url)}
                <Box pr={3.75}>
                  {url ? <img src={url} alt='patient profile' /> : <Avatar variant="square" src="" className={classes.profileImage}></Avatar>}
                </Box>
              </Box>
            </Box>

            <Box flex={1}>
              <Box display="flex">
                <Box flex={1}>
                  <Box display="flex" alignItems="center" className={classes.userName}>
                    {`${firstName} ${lastName}`}
                  </Box>

                  <Box display="flex" width="100%" maxWidth={650} pt={1} flexWrap="wrap">
                    {ProfileDetails.map((item, index) => (
                      <Box display="flex" key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                        <Box>{item.icon}</Box>
                        <Box>{item.description}</Box>
                      </Box>
                    ))}
                  </Box>

                </Box>


                <Box display="flex">
                  <Box pr={2}>
                    <Button color="default" variant="contained">Chart</Button>
                  </Box>

                  <Button color="primary" variant="contained" className="blue-button">Schedule Appointment</Button>
                </Box>
              </Box>

              <Box display="flex" pt={3}>
                {ProfileAdditionalDetails.map((item, index) => (
                  <Box key={`${item.title}-${index}`} className={classes.profileAdditionalInfo}>
                    <Box className={classes.profileInfoHeading}>{item.title}</Box>
                    <Box>{item.description}</Box>
                  </Box>
                ))}
              </Box>

              <Box display="flex" pt={2}>
                <Box className={classes.profileTag}>Adult Immunization Schedule Age: 20-30</Box>
                <Box className={classes.profileTag}>Adult Immunization Schedule Age: 20-30</Box>
              </Box>
            </Box>
          </Box>

          <TabPanel value="1">
            <Grid container spacing={3}>
              {ProfileDetailedData.map((item, index) => (
                <Grid item md={6} sm={12} xs={12} key={`${item.title}-${index}`}>
                  <CardComponent cardTitle={item.title}>
                    <Box fontSize={16} color={BLACK_TWO} pb={3.75}>
                      <Typography color="inherit">{item.description}</Typography>
                    </Box>
                  </CardComponent>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>

      {openDeleteModal && (
        <ConfirmationModal
          title={DELETE_REQUEST}
          isOpen={openDeleteModal}
          isLoading={deleteAttachmentLoading}
          description={DELETE_REQUEST_DESCRIPTION}
          handleDelete={handleDeleteAttachment}
          setOpen={(open: boolean) => setOpenDeleteModal(open)}
        />
      )}
    </Box>
  )
}

export default PatientDetailsComponent;
