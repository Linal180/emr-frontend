// packages
import { useState } from "react";
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
// components block
import Selector from "../../common/Selector";
import DatePicker from "../../common/DatePicker";
import { FormProvider, useForm } from "react-hook-form";
//constants bock
import { renderTh } from "../../../utils";
import { GRAY_SIX, } from "../../../theme";
import { useTableStyles } from "../../../styles/tableStyles";
import { useChartingStyles } from '../../../styles/chartingStyles';
import {
  ACTION, ALL_LOG_TYPES, AUDIT_LOG_TABLE_DUMMY_DATA, DATE, DETAIL, FROM_DATE, IP_TEXT,
  PATIENT, PATIENT_NAME, TIME, TO_DATE, TYPE, UPDATE_FILTER, USER_NAME, USER_TEXT
} from "../../../constants";

const AuditLogTable = (): JSX.Element => {
  const timeKeys = ['Day', 'Week', 'Month', 'Year']
  const [timeDuration, setTimeDuration] = useState<string>(timeKeys[0])
  const classes = useTableStyles();
  const chartingClasses = useChartingStyles();
  const methods = useForm({ mode: "all" });

  return (
    <>
      <Box mt={3} mb={1}>
        <FormProvider {...methods}>
          <Grid container spacing={3} direction='row'>
            <Grid item md={10} sm={12} xs={12}>
              <Grid container spacing={3} direction='row'>
                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={PATIENT_NAME}
                    name="patientName"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={USER_NAME}
                    name="userName"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    label={ALL_LOG_TYPES}
                    name="allLog"
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <DatePicker name="date" label={FROM_DATE} />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <DatePicker name="date" label={TO_DATE} />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <Box mt={2.5}>
                    <Button variant="contained" color="secondary">{UPDATE_FILTER}</Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleBox}`}>
                <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6} mt={2}>
                  {timeKeys?.map((timeKey, index) => {
                    return (<Box key={`${timeKey}-${index}`}
                      className={timeKey === timeDuration ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => setTimeDuration(timeKey)}
                    >
                      <Typography variant='h6'>{timeKey}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>

      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(DATE)}
                {renderTh(TIME)}
                {renderTh(PATIENT)}
                {renderTh(USER_TEXT)}
                {renderTh(TYPE)}
                {renderTh(ACTION)}
                {renderTh(DETAIL)}
                {renderTh(IP_TEXT)}
              </TableRow>
            </TableHead>

            <TableBody>
              {AUDIT_LOG_TABLE_DUMMY_DATA.map((item, id) => {
                const { date, time, patient, user, type, action, detail, ip } = item
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{date}</TableCell>
                    <TableCell scope="row">{time}</TableCell>
                    <TableCell scope="row">{patient}</TableCell>
                    <TableCell scope="row">{user}</TableCell>
                    <TableCell scope="row">{type}</TableCell>
                    <TableCell scope="row">{action}</TableCell>
                    <TableCell scope="row">{detail}</TableCell>
                    <TableCell scope="row">{ip}</TableCell>
                  </TableRow>
                );
              }
              )}
            </TableBody>
          </Table>

          {/* <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box> */}
        </Box>
      </Box>

      {/* {totalPages > 1 && (
      <Box display="flex" justifyContent="flex-end" p={3}>
        <Pagination
          count={totalPages}
          shape="rounded"
          variant="outlined"
          page={page}
        onChange={handleChange}
        />
      </Box>
      )} */}
    </>
  )
}

export default AuditLogTable;
