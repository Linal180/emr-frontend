import { Box, Grid, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { ChangeEvent, FC, useState } from "react";
// components block
import ReviewTab from "./ReviewTab";
import ReviewOfSystem from "../reviewOfSystem";
import PatientHistory from "../patientHistoryIllness";
import AssessmentPlanTab from "../AssessmentPlan/AssessmentPlanTab";
// constants, utils, styles, interfaces and graphql block
import { EXAM_TABS } from "../../../../../constants";
import { ChartComponentProps } from "../../../../../interfacesTypes";
import { useChartingStyles } from "../../../../../styles/chartingStyles";

const ExamTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {

  const classes = useChartingStyles();
  const [tabValue, setTabValue] = useState("1");

  const handleChange = (_: ChangeEvent<unknown>, tab: string) => setTabValue(tab)

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <TabContext value={tabValue}>
            <Box mb={1}>
              <TabList className={classes.tabList}
                orientation='horizontal'
                onChange={handleChange}
                aria-label="exam tabs"
              >
                {EXAM_TABS.map(item => {
                  const { title, value } = item

                  return <Tab className={classes.tab}
                    key={`${title}-${value}`}
                    label={title}
                    value={value}
                  />
                })}
              </TabList>
            </Box>

            <Box className={classes.cardBox}>
              <TabPanel value="1">
                <ReviewTab shouldDisableEdit={shouldDisableEdit} shouldShowAdd={true} shouldShowExamDetails={true} />
              </TabPanel>

              <TabPanel value="2">
                <PatientHistory shouldDisableEdit={shouldDisableEdit} />
              </TabPanel>

              <TabPanel value="3">
                <ReviewOfSystem shouldDisableEdit={shouldDisableEdit} />
              </TabPanel>

              <TabPanel value="4">
                <AssessmentPlanTab shouldDisableEdit={shouldDisableEdit} />
              </TabPanel>
            </Box>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default ExamTab;
