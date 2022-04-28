// packages block
import { MouseEvent, ChangeEvent, Reducer, useReducer } from 'react';
import { useParams } from 'react-router';
import { Link } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Grid, Menu, Tab, Typography } from "@material-ui/core";
//components block
import Insurance from './Insurance';
import Selector from "../../../common/Selector";
import PortalTable from '../../../common/patient/portal';
import LabOrdersTable from '../../../common/patient/labOrders';
import DocumentsTable from '../../../common/patient/documents';
import ConfirmationModal from "../../../common/ConfirmationModal";
import PatientProfileHero from '../../../common/patient/profileHero';
// constants, history, styling block
import { ParamsType } from "../../../../interfacesTypes";
import { BLACK, BLACK_TWO, WHITE } from "../../../../theme";
import { AddWidgetIcon, DeleteWidgetIcon } from "../../../../assets/svgs";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { AttachmentsPayload, PatientPayload } from '../../../../generated/graphql';
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import {
  ADD_WIDGET_TEXT, DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, EMPTY_OPTION, VIEW_CHART_TEXT,
  MAPPED_WIDGETS, CHART_ROUTE, PATIENTS_ROUTE, PROFILE_DETAIL_DATA, PROFILE_TOP_TABS, 
} from "../../../../constants";

const PatientDetailsComponent = (): JSX.Element => {
  const widgetId = "widget-menu";
  const { id } = useParams<ParamsType>();
  const classes = useProfileDetailsStyles();
  const [{ anchorEl, openDelete, tabValue, patientData }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const [{ attachmentsData }, mediaDispatcher] = 
  useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const isMenuOpen = Boolean(anchorEl);
  const methods = useForm<any>({ mode: "all", });
  const { handleSubmit } = methods;
  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });

  const handleWidgetMenuOpen = (event: MouseEvent<HTMLElement>) =>
    dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget })

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const onDeleteClick = () =>
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })

  const handleDeleteWidget = () => { };
  const onSubmit: SubmitHandler<any> = async (inputs) => { }

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <TabList onChange={handleChange} aria-label="Profile top tabs">
            <Box display="flex" flexWrap="wrap">
              {PROFILE_TOP_TABS.map(item => (
                <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
              ))}
            </Box>
          </TabList>

          <Box pr={2}>
            <Link to={`${PATIENTS_ROUTE}/${id}${CHART_ROUTE}`}>
              <Button color="primary" variant="contained">{VIEW_CHART_TEXT}</Button>
            </Link>
          </Box>
        </Box>

        <Box className={classes.profileDetailsContainer}>
          <PatientProfileHero
            setPatient={(patient: PatientPayload['patient']) =>
              dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient })
            }
            setAttachmentsData={(attachments: AttachmentsPayload['attachments']) =>
              mediaDispatcher({ type: mediaActionType.SET_ATTACHMENTS_DATA, attachmentsData: attachments })
            }
          />

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

          <TabPanel value="2">
            <Insurance />
          </TabPanel>

          <TabPanel value="8">
              <DocumentsTable dispatcher={mediaDispatcher} attachments={attachmentsData} />
          </TabPanel>

          <TabPanel value="9">
            <PortalTable inviteAccepted={Boolean(patientData?.inviteAccepted)} />
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
