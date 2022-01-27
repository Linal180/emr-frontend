// packages block
import { Box, Button, Card, Typography } from "@material-ui/core";
import { Add, FilterList } from '@material-ui/icons';
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView, Appointments, TodayButton, Toolbar, DateNavigator, ViewSwitcher, DayView, WeekView } from '@devexpress/dx-react-scheduler-material-ui';
// components block
import PageHeader from "../../common/PageHeader";
// constants block
import { DASHBOARD_TEXT } from "../../../constants";
import { GRAY_SIX } from "../../../theme";
import { useState } from "react";

const appointments = [
  {
    "title": "Website Re-Design Plan",
    "startDate": "2018-07-23T04:30:00.000Z",
    "endDate": "2018-07-23T06:30:00.000Z"
  },
  {
    "title": "Book Flights to San Fran for Sales Trip",
    "startDate": "2018-07-23T07:00:00.000Z",
    "endDate": "2018-07-23T08:00:00.000Z"
  },
  {
    "title": "Install New Router in Dev Room",
    "startDate": "2018-07-23T09:30:00.000Z",
    "endDate": "2018-07-23T10:30:00.000Z"
  },
  {
    "title": "Approve Personal Computer Upgrade Plan",
    "startDate": "2018-07-24T05:00:00.000Z",
    "endDate": "2018-07-24T06:00:00.000Z"
  },
  {
    "title": "Final Budget Review",
    "startDate": "2018-07-24T07:00:00.000Z",
    "endDate": "2018-07-24T08:35:00.000Z"
  },
  {
    "title": "New Brochures",
    "startDate": "2018-07-24T09:30:00.000Z",
    "endDate": "2018-07-24T10:45:00.000Z"
  },
  {
    "title": "Install New Database",
    "startDate": "2018-07-25T04:45:00.000Z",
    "endDate": "2018-07-25T06:15:00.000Z"
  },
  {
    "title": "Approve New Online Marketing Strategy",
    "startDate": "2018-07-25T07:00:00.000Z",
    "endDate": "2018-07-25T09:00:00.000Z"
  },
  {
    "title": "Upgrade Personal Computers",
    "startDate": "2018-07-25T10:15:00.000Z",
    "endDate": "2018-07-25T11:30:00.000Z"
  },
  {
    "title": "Customer Workshop",
    "startDate": "2018-07-26T06:00:00.000Z",
    "endDate": "2018-07-26T07:00:00.000Z"
  },
  {
    "title": "Prepare 2015 Marketing Plan",
    "startDate": "2018-07-26T06:00:00.000Z",
    "endDate": "2018-07-26T08:30:00.000Z"
  },
  {
    "title": "Brochure Design Review",
    "startDate": "2018-07-26T09:00:00.000Z",
    "endDate": "2018-07-26T10:30:00.000Z"
  },
  {
    "title": "Create Icons for Website",
    "startDate": "2018-07-27T05:00:00.000Z",
    "endDate": "2018-07-27T06:30:00.000Z"
  },
  {
    "title": "Upgrade Server Hardware",
    "startDate": "2018-07-27T09:30:00.000Z",
    "endDate": "2018-07-27T11:00:00.000Z"
  },
  {
    "title": "Submit New Website Design",
    "startDate": "2018-07-27T11:30:00.000Z",
    "endDate": "2018-07-27T13:00:00.000Z"
  },
  {
    "title": "Launch New Website",
    "startDate": "2018-07-26T07:20:00.000Z",
    "endDate": "2018-07-26T09:00:00.000Z"
  },
  {
    "title": "Website Re-Design Plan",
    "startDate": "2018-07-16T04:30:00.000Z",
    "endDate": "2018-07-16T10:30:00.000Z"
  },
  {
    "title": "Book Flights to San Fran for Sales Trip",
    "startDate": "2018-07-16T07:00:00.000Z",
    "endDate": "2018-07-16T08:00:00.000Z"
  },
  {
    "title": "Install New Database",
    "startDate": "2018-07-17T10:45:00.000Z",
    "endDate": "2018-07-18T07:15:00.000Z"
  },
  {
    "title": "Approve New Online Marketing Strategy",
    "startDate": "2018-07-18T07:35:00.000Z",
    "endDate": "2018-07-18T09:15:00.000Z"
  },
  {
    "title": "Upgrade Personal Computers",
    "startDate": "2018-07-19T10:15:00.000Z",
    "endDate": "2018-07-20T15:30:00.000Z"
  },
  {
    "title": "Prepare 2015 Marketing Plan",
    "startDate": "2018-07-20T15:00:00.000Z",
    "endDate": "2018-07-20T08:30:00.000Z"
  },
  {
    "title": "Brochure Design Review",
    "startDate": "2018-07-20T09:10:00.000Z",
    "endDate": "2018-07-20T10:30:00.000Z"
  },
  {
    "title": "Vacation",
    "startDate": "2018-06-21T19:00:00.000Z",
    "endDate": "2018-06-30T19:00:00.000Z"
  },
  {
    "title": "Vacation",
    "startDate": "2018-07-27T19:00:00.000Z",
    "endDate": "2018-08-06T19:00:00.000Z"
  }
]

const StartProjectComponent = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState("2018-07-27")

  const handleDateChange = () => {
    setCurrentDate(currentDate)
  }

  return (
    <Box>
      <PageHeader title={DASHBOARD_TEXT} subTitle="Molestie imperdiet purus neque neque." />

      <Card>
        <Box display="flex" alignItems="center" justifyContent="space-between" px={3} py={2} borderBottom={`1px solid ${GRAY_SIX}`}>
          <Typography variant="body1">Basic Calendar</Typography>

          <Box display="flex" gridGap={16}>
            <Button color="default" variant="outlined" startIcon={<FilterList />}>Filter</Button>
            <Button color="primary" variant="contained" startIcon={<Add />}>Add New</Button>
          </Box>
        </Box>

        <Box>
          <Scheduler data={appointments}>
            <ViewState defaultCurrentDate={currentDate} onCurrentDateChange={handleDateChange} />
            <MonthView />
            <WeekView />
            <DayView />
            <Toolbar />
            <ViewSwitcher />
            <DateNavigator />
            <TodayButton />
            <Appointments />
          </Scheduler>
        </Box>
      </Card>
    </Box>
  )
};

export default StartProjectComponent;
