// packages block
import { FC, ChangeEvent, Reducer, useReducer, ReactElement, useState, } from 'react';
import { useForm } from 'react-hook-form';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Box, Card, Grid, IconButton, Tab } from "@material-ui/core";
// components block
import VitalTab from './tabs/VitalTab';
import ProblemTab from './tabs/ProblemTab';
import AllergyTab from './tabs/AllergyTab';
// interfaces, graphql, constants block /styles
import { FormEditNewIcon, } from '../../../../assets/svgs';
import { PATIENT_CHARTING_TABS } from "../../../../constants";
import { PatientInputProps } from '../../../../interfacesTypes';
import { useHeaderStyles } from '../../../../styles/headerStyles';
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";

const ChartCards: FC = (): JSX.Element => {
  const classes = useChartingStyles()
  const [checked, setChecked] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false);

  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  return (

    <>
      {/* <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <AllergyList />
        </Grid> 

        <Grid item md={4} sm={12} xs={12}>
          <ProblemList />
        </Grid> 
      </Grid> */}

      <Box mt={3}>
        <TabContext value={tabValue} >
          <Grid container spacing={3}>
            <Grid item md={2} sm={4} xs={12}>
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

            <Grid item md={10} sm={8} xs={12}>
              <TabPanel value="1" className='tab-panel'>
                <VitalTab />
              </TabPanel>

              <TabPanel value="2" className='tab-panel'>
                <ProblemTab />
              </TabPanel>

              <TabPanel value="3" className='tab-panel'>
                <AllergyTab />
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Box>
    </>
    // import AllergyList from '../allergies/list';
    // import PatientCardComponent from "./PatientCardComponent";
    // import ProblemList from '../problems/list';
    // // interfaces, graphql, constants block /styles
    // import { PATIENT_CHARTING_DATA, VITALS_TEXT } from "../../../../constants";
    // import { ChartComponentProps } from '../../../../interfacesTypes';

    // const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit }): JSX.Element => {
    //   const [isVitals] = useState<boolean>(true)

    //   return (
    //     <Grid container spacing={3}>
    //       <Grid item md={4} sm={12} xs={12}>
    //         <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd={!shouldDisableEdit} cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />
    //       </Grid>

    //       <Grid item md={4} sm={12} xs={12}>
    //         <AllergyList shouldDisableEdit={shouldDisableEdit} />
    //       </Grid>

    //       <Grid item md={4} sm={12} xs={12}>
    //         <ProblemList shouldDisableEdit={shouldDisableEdit} />
    //       </Grid>
    //     </Grid>
  );
};
export default ChartCards;
