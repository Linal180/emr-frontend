import { Box, Card, Grid, Tab } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { ChangeEvent, FC, useState } from "react";
// components block
import FamilyHistory from "../familyHistory";
import SurgicalHistoryTab from "./SurgicalHistoryListing";
// import SocialHistory from "../socialHistory";
// constants, utils, styles, interfaces and graphql block
import { HISTORY_CHARTING_TABS } from "../../../../../constants";
import { ChartComponentProps } from "../../../../../interfacesTypes";
import { useChartingStyles } from "../../../../../styles/chartingStyles";

const HistoryTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {

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
                aria-label="communication tabs"
              >
                {HISTORY_CHARTING_TABS.map(item => {
                  const { title, value } = item

                  return <Tab className={classes.tab}
                    key={`${title}-${value}`}
                    label={title}
                    value={value}
                  />
                })}
              </TabList>
            </Box>

            <Card>
              <Box className={classes.cardBox} px={2}>
                {/* <TabPanel value="1">
                  <SocialHistory shouldDisableEdit={shouldDisableEdit} />
                </TabPanel> */}

                <TabPanel value="1">
                  <FamilyHistory shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>

                <TabPanel value="2">
                  <SurgicalHistoryTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>
            </Card>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default HistoryTab;
