// packages block
import { Box, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { GREY_THREE } from '../../../../../theme';
// components block
import BackButton from "../../../../common/BackButton";
import PageHeader from "../../../../common/PageHeader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  AMOUNT,
  AUTH_CERT_REQUIRED,
  COVERAGE_BREAD, COVERAGE_DETAILS, COVERAGE_LEVEL, DETAILED_COVERAGE_DUMMY_DATA, DETAILED_COVERAGE_INFORMATION, FACILITY_TYPE, IN_NETWORK, MESSAGE, PATIENTS_ROUTE, PATIENT_COVERAGE_DUMMY_DATA, PATIENT_INFORMATION,
  PLAN_COVERAGE_DUMMY_DATA, PLAN_DETAIL_INFORMATION, PRIMARY_CARE_COVERAGE_DUMMY_DATA,
  PRIMARY_CARE_PROVIDER_INFO, REMAINING, SERVICE_TYPE, SUBSCRIBER_COVERAGE_DUMMY_DATA, SUBSCRIBER_INFORMATION, TIME_PERIOD
} from '../../../../../constants';
import { renderTh } from '../../../../../utils';

const CoverageDetailsComponent = () => {
  return (
    <>
      <Box display='flex'>
        <BackButton to={`${PATIENTS_ROUTE}`} />

        <Box ml={2}>
          <PageHeader
            title={COVERAGE_DETAILS}
            path={[COVERAGE_BREAD]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Card>
            <Box p={3} minHeight={305}>
              <Typography variant="h4" color="textPrimary">{PATIENT_INFORMATION}</Typography>

              <Box p={1} />

              {PATIENT_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body1'>{name}</Typography>
                    </Box>

                    <Typography variant='body2' color='textPrimary'>{value}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Card>
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Card>
            <Box p={3} minHeight={305}>
              <Typography variant="h4" color="textPrimary">{SUBSCRIBER_INFORMATION}</Typography>

              <Box p={1} />

              {SUBSCRIBER_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body1'>{name}</Typography>
                    </Box>

                    <Typography variant='body1' color='textPrimary'>{value}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Card>
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Card>
            <Box p={3} minHeight={305}>
              <Typography variant="h4" color="textPrimary">{PLAN_DETAIL_INFORMATION}</Typography>

              <Box p={1} />

              {PLAN_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body1'>{name}</Typography>
                    </Box>

                    <Typography variant='body1' color='textPrimary'>{value}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Card>
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Card>
            <Box p={3} minHeight={305}>
              <Typography variant="h4" color="textPrimary">{PRIMARY_CARE_PROVIDER_INFO}</Typography>

              <Box p={1} />

              {PRIMARY_CARE_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body1'>{name}</Typography>
                    </Box>

                    <Typography variant='body1' color='textPrimary'>{value}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Box p={2} />

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box p={3}>
              <Typography variant="h4" color="textPrimary">{DETAILED_COVERAGE_INFORMATION}</Typography>

              <Box className="table-overflow" mt={4}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {renderTh(SERVICE_TYPE)}
                      {renderTh(COVERAGE_LEVEL)}
                      {renderTh(AMOUNT)}
                      {renderTh(REMAINING)}
                      {renderTh(MESSAGE)}
                      {renderTh(IN_NETWORK)}
                      {renderTh(FACILITY_TYPE)}
                      {renderTh(AUTH_CERT_REQUIRED)}
                      {renderTh(TIME_PERIOD)}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {DETAILED_COVERAGE_DUMMY_DATA.map((item, id) => {
                      const { service, coverage, amount, remaining, message, network, facility, auth, time } = item;
                      return (
                        <TableRow key={id}>
                          <TableCell scope="row"> {service}</TableCell>
                          <TableCell scope="row">{coverage}</TableCell>
                          <TableCell scope="row">{amount}</TableCell>
                          <TableCell scope="row">{remaining}</TableCell>
                          <TableCell scope="row">
                            <Box maxWidth={300}>{message}</Box>
                            </TableCell>
                          <TableCell scope="row">{network}</TableCell>
                          <TableCell scope="row">{facility}</TableCell>
                          <TableCell scope="row">{auth}</TableCell>
                          <TableCell scope="row">{time}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* {((!(loading) && !patients?.length) || (error)) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )} */}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default CoverageDetailsComponent;
