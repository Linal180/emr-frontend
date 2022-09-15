// packages block
import { Box, Button, Card, Grid, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { PrintOutlined } from "@material-ui/icons";
import { ChangeEvent, FC, ReactElement, Reducer, useReducer, useState } from 'react';
// components block
import AllergyTab from './tabs/AllergyListing';
import ProblemTab from './tabs/ProblemListing';
import TriageNoteTab from './tabs/TriageNotesListing';
import ChartSelectionModal from './ChartModal/ChartSelectionModal';
import HistoryTab from './tabs/HistoryTab';
import MedicationTab from './tabs/MedicationsListing';
import ChartPrintModal from "./ChartModal/ChartPrintModal";
import VitalTab from './tabs/VitalListing';
// interfaces, graphql, constants block /styles
import { PATIENT_CHARTING_TABS, PRINT_CHART } from "../../../../constants";
import { ChartContextProvider } from '../../../../context';
import { ChartComponentProps } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { WHITE } from '../../../../theme';

const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit }): JSX.Element => {
  const classes = useChartingStyles()
  const [isChartingModalOpen, setIsChartingModalOpen] = useState(false)
  const [modulesToPrint, setModulesToPrint] = useState<string[]>([])
  const [isChartPdfModalOpen, setIsChartPdfModalOpen] = useState<boolean>(false)
  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  return (
    <Box mt={3}>
      <Box mb={2} px={2} display='flex' justifyContent='flex-end'>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          startIcon={
            <Box width={20} color={WHITE}><PrintOutlined /></Box>
          }
          onClick={() => setIsChartingModalOpen(true)}
        >
          {PRINT_CHART}
        </Button>
      </Box>

      <TabContext value={tabValue}>
        <Grid container spacing={3}>
          <Grid item lg={2} md={3} sm={12} xs={12}>
            <Card>
              <Box p={3} className={classes.cardBox} minHeight={250}>
                <TabList className={classes.tabList}
                  orientation='vertical'
                  onChange={handleChange}
                  aria-label="communication tabs"
                >
                  {PATIENT_CHARTING_TABS.map(item => {
                    const { icon: Icon, title, value } = item

                    return <Tab className={classes.tab}
                      key={`${title}-${value}`} label={title}
                      value={value} icon={<Icon /> as unknown as ReactElement}
                    />
                  })}
                </TabList>
              </Box>
            </Card>
          </Grid>

          <Grid item lg={10} md={9} sm={12} xs={12}>
            <Box className={classes.tabPanelPadding}>
              <Box pt={0} borderRadius={8}>
                <TabPanel value="1">
                  <TriageNoteTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="2">
                  <VitalTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="3">
                  <ProblemTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="4">
                  <ChartContextProvider>
                    <AllergyTab shouldDisableEdit={shouldDisableEdit} />
                  </ChartContextProvider>
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="5">
                  <ChartContextProvider>
                    <MedicationTab shouldDisableEdit={shouldDisableEdit} />
                  </ChartContextProvider>
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="6">
                  <ChartContextProvider>
                    <HistoryTab shouldDisableEdit={shouldDisableEdit} />
                  </ChartContextProvider>
                </TabPanel>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </TabContext>
      {isChartingModalOpen && <ChartSelectionModal
        isOpen={isChartingModalOpen}
        handleClose={() => setIsChartingModalOpen(false)}
        setIsChartPdfModalOpen={setIsChartPdfModalOpen}
        modulesToPrint={modulesToPrint}
        setModulesToPrint={setModulesToPrint}
      />}

      {isChartPdfModalOpen && <ChartPrintModal
        modulesToPrint={modulesToPrint}
        isOpen={isChartPdfModalOpen}
        handleClose={() => setIsChartPdfModalOpen(false)}
      />}
    </Box>
  )
};

export default ChartCards;
