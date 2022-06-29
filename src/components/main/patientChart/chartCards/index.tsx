// packages block
import { Box, Card, Grid, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { ChangeEvent, FC, ReactElement, Reducer, useReducer } from 'react';
// interfaces, graphql, constants block /styles
import { PATIENT_CHARTING_TABS } from "../../../../constants";
import { ChartComponentProps } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../styles/chartingStyles";
// components block
import AllergyTab from './tabs/AllergyTab';
import ProblemTab from './tabs/ProblemTab';
import VitalTab from './tabs/VitalTab';

const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit }): JSX.Element => {
  const classes = useChartingStyles()

  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  return (
    <>
      <Box mt={3}>
        <TabContext value={tabValue}>
          <Grid container spacing={3}>
            <Grid item lg={2} md={3} sm={12} xs={12}>
              <Card>
                <Box p={3} className={classes.cardBox} minHeight={450}>
                  <TabList className={classes.tabList} orientation='vertical' onChange={handleChange} aria-label="communication tabs">
                    {PATIENT_CHARTING_TABS.map(item => {
                      const { icon: Icon, title, value } = item

                      return <Tab className={classes.tab} key={`${title}-${value}`} label={title} value={value} icon={<Icon /> as unknown as ReactElement} />
                    })}
                  </TabList>
                </Box>
              </Card>
            </Grid>

            <Grid item lg={10} md={9} sm={12} xs={12}>
              <TabPanel value="1" className='tab-panel'>
                <VitalTab shouldDisableEdit={shouldDisableEdit} />
              </TabPanel>

              <TabPanel value="2" className='tab-panel'>
                <ProblemTab shouldDisableEdit={shouldDisableEdit} />
              </TabPanel>

              <TabPanel value="3" className='tab-panel'>
                <AllergyTab shouldDisableEdit={shouldDisableEdit} />
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Box>
    </>
  )
};

export default ChartCards;
