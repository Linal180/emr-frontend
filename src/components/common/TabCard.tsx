// packages block
import { Box, Step, StepLabel, Stepper, Tab, Typography } from '@material-ui/core';
// components block
import CustomStepIcon from './CustomStepIcon';
// constants, interfaces and styles block
import { StepperComponentProps } from "../../interfacesTypes";
import { CustomConnector, useExternalPatientStyles } from "../../styles/publicAppointmentStyles/externalPatientStyles";
import { useChartingStyles } from '../../styles/chartingStyles';
import { TabContext, TabList } from '@material-ui/lab';

const StepperCard = ({ activeStep, stepperData, handleStep }: StepperComponentProps) => {
  const classes = useChartingStyles();

  return (
    <TabContext value={`${activeStep}`}>
    <Box mb={1}>
      <TabList className={classes.tabList}
        orientation='horizontal'
        // onChange={(_,value)=> }
        aria-label="exam tabs"
      >
        {/* {EXAM_TABS.map(item => {
          const { title, value } = item

          return <Tab className={classes.tab}
            key={`${title}-${value}`}
            label={title}
            value={value}
          />
        })} */}
      </TabList>
    </Box>

    <Box className={classes.cardBox}>
      {/* <TabPanel value="1">
        <ReviewTab shouldDisableEdit={shouldDisableEdit} shouldShowAdd={true} shouldShowExamDetails={true} />
      </TabPanel>

      <TabPanel value="2">
        <PatientHistory shouldDisableEdit={shouldDisableEdit} />
      </TabPanel>

      <TabPanel value="3">
        <ReviewOfSystem shouldDisableEdit={shouldDisableEdit} />
      </TabPanel>

      <TabPanel value="4">
        <PhysicalExam shouldDisableEdit={shouldDisableEdit} />
      </TabPanel>

      <TabPanel value="5">
        <AssessmentPlanTab shouldDisableEdit={shouldDisableEdit} />
      </TabPanel> */}
    </Box>
  </TabContext>
  );
};

export default StepperCard;