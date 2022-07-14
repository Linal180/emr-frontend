import { useState } from 'react';
// packages block
import { Box, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { BLACK_FOUR, GRAY_SIX, GREY_THREE } from '../../../../../theme';
// components block
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  AMOUNT, AUTH_CERT_REQUIRED, CHIROPRACTIC, CHIROPRACTIC_DUMMY_DATA, COVERAGE_LEVEL, COVERAGE_SUMMARY, PATIENT_INFORMATION,
  DETAILED_COVERAGE_INFORMATION, FACILITY_TYPE, IN_NETWORK, MESSAGE, PATIENT_COVERAGE_DUMMY_DATA, PLAN_COVERAGE_DUMMY_DATA,
  PLAN_DETAIL_INFORMATION, PRIMARY_CARE_COVERAGE_DUMMY_DATA, PRIMARY_CARE_PROVIDER_INFO, PROFESSIONAL_PHYSICIAN_DATA,
  PROFESSIONAL_VISIT_DUMMY_DATA, REMAINING, SERVICE_TYPE, SUBSCRIBER_COVERAGE_DUMMY_DATA, SUBSCRIBER_INFORMATION, TIME_PERIOD,
  URGENT_CARE, URGENT_CARE_DUMMY_DATA, COVERAGE_SUMMARY_DUMMY_DATA, PROFESSIONAL_OFFICE_VISIT, HEALTH_PLAN_BENEFITS
} from '../../../../../constants';
import { renderTh } from '../../../../../utils';
import { useChartingStyles } from '../../../../../styles/chartingStyles';

const CoverageDetailsComponent = () => {
  const chartingClasses = useChartingStyles()
  const coverageSummaryTypes = ['In Network', 'Out Network']
  const [coverageType, setCoverageType] = useState<string>(coverageSummaryTypes[0])
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Card>
            <Box p={3} minHeight={270}>
              <Typography variant="h4" color="textPrimary">{PATIENT_INFORMATION}</Typography>

              <Box p={1} />

              {PATIENT_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body2'>{name}</Typography>
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
            <Box p={3} minHeight={270}>
              <Typography variant="h4" color="textPrimary">{SUBSCRIBER_INFORMATION}</Typography>

              <Box p={1} />

              {SUBSCRIBER_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body2'>{name}</Typography>
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
            <Box p={3} minHeight={270}>
              <Typography variant="h4" color="textPrimary">{PLAN_DETAIL_INFORMATION}</Typography>

              <Box p={1} />

              {PLAN_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body2'>{name}</Typography>
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
            <Box p={3} minHeight={270}>
              <Typography variant="h4" color="textPrimary">{PRIMARY_CARE_PROVIDER_INFO}</Typography>

              <Box p={1} />

              {PRIMARY_CARE_COVERAGE_DUMMY_DATA.map((item, id) => {
                const { name, value } = item;
                return (
                  <Box key={id} display='flex' justifyContent='space-between'>
                    <Box color={GREY_THREE} pr={1}>
                      <Typography variant='body2'>{name}</Typography>
                    </Box>

                    <Typography variant='body2' color='textPrimary'>{value}</Typography>
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
                    <TableRow className='border-bottom'>
                      <Box width="100%" py={2} pl={4}>
                        <Typography variant="h4" color="secondary">{URGENT_CARE}</Typography>
                      </Box>
                    </TableRow>

                    {URGENT_CARE_DUMMY_DATA.map((item, id) => {
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

                    <TableRow className='border-bottom'>
                      <Box width="100%" py={2} pl={4}>
                        <Typography variant="h4" color="secondary">{PROFESSIONAL_PHYSICIAN_DATA}</Typography>
                      </Box>
                    </TableRow>

                    {PROFESSIONAL_VISIT_DUMMY_DATA.map((item, id) => {
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

                    <TableRow className='border-bottom'>
                      <Box width="100%" py={2} pl={4}>
                        <Typography variant="h4" color="secondary">{CHIROPRACTIC}</Typography>
                      </Box>
                    </TableRow>

                    {CHIROPRACTIC_DUMMY_DATA.map((item, id) => {
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

      <Box p={2} />

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box p={3}>
              <Typography variant="h4" color="textPrimary">{COVERAGE_SUMMARY}</Typography>

              <Box className={chartingClasses.toggleProblem}>
                <Box my={2} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                  {coverageSummaryTypes?.map((name, index) => {
                    return (<Box key={`${index}-${name}`}
                      className={name === coverageType ? 'selectedBox selectBox' : 'selectBox'}
                      onClick={() => setCoverageType(name)}
                    >
                      <Typography variant='h6'>{name}</Typography>
                    </Box>
                    )
                  })}
                </Box>
              </Box>

              <Grid container spacing={3} direction="row">
                <Grid item md={2} sm={2} xs={2}></Grid>

                <Grid item md={10} sm={10} xs={10}>
                  <Grid container spacing={3} direction="row">
                    <Grid item md={3} sm={3} xs={3}>
                      <Box color={GREY_THREE} py={1}>
                        <Typography variant='body2' color='inherit'>{URGENT_CARE}</Typography>
                      </Box>
                    </Grid>

                    <Grid item md={3} sm={3} xs={3}>
                      <Box color={GREY_THREE} py={1}>
                        <Typography variant='body2' color='inherit'>{PROFESSIONAL_OFFICE_VISIT}</Typography>
                      </Box>
                    </Grid>

                    <Grid item md={3} sm={3} xs={3}>
                      <Box color={GREY_THREE} py={1}>
                        <Typography variant='body2' color='inherit'>{HEALTH_PLAN_BENEFITS}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {COVERAGE_SUMMARY_DUMMY_DATA.map((item, id) => {
                const { name, urgentCare, professionalOfficeVisit, healthPlanBenefits } = item;
                return (
                  <Box key={id}>
                    <Grid container spacing={3} direction="row">
                      <Grid item md={2} sm={2} xs={2}>
                        <Box color={GREY_THREE} py={1}>
                          <Typography variant='body2' color='inherit'>{name}</Typography>
                        </Box>
                      </Grid>

                      <Grid item md={10} sm={10} xs={10}>
                        <Grid container spacing={3} direction="row">
                          <Grid item md={3} sm={3} xs={3}>
                            <Box color={BLACK_FOUR} py={1}>
                              <Typography variant='body2' color='inherit'>{urgentCare}</Typography>
                            </Box>
                          </Grid>

                          <Grid item md={3} sm={3} xs={3}>
                            <Box color={BLACK_FOUR} py={1}>
                              <Typography variant='body2' color='inherit'>{professionalOfficeVisit}</Typography>
                            </Box>
                          </Grid>

                          <Grid item md={3} sm={3} xs={3}>
                            <Box color={BLACK_FOUR} py={1}>
                              <Typography variant='body2' color='inherit'>{healthPlanBenefits}</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                )
              })}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default CoverageDetailsComponent;
