// packages block
import React from 'react';
import { Box, Card, colors, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { ADDRESS, APPOINTMENT_DATE, BILLING_CODE, DATE_OF_BIRTH, DATE_OF_SERVICE, DATE_OF_VISIT, DIAGNOSIS, DIAGNOSIS_CODE, DIS, DX_PTRS, EMAIL, FEE, GROUP_NO, INSURER, MEMBER_NO, MODS, OFFICE_EIN, OFFICE_PHONE, PATIENT_ADDRESS, PATIENT_INFORMATION, PATIENT_NAME, PATIENT_PHONE, PATIENT_RECEIPT, PLACE_OF_SERVICE_CODE, PRACTICE_NAME, PROVIDER_INFORMATION, PROVIDER_NAME, QTY, SUBSCRIBER, TOTAL_TEXT, TREATMENT } from '../../../constants';
import { GREY_NINE } from '../../../theme';
import { renderTh } from '../../../utils';
// component block
// constants, history, styling block

const SuperBillComponent = (): JSX.Element => {
  return (
    <>
      <Card>
        <Box p={3}>
          <Typography variant="h2" color='textPrimary'>{PATIENT_RECEIPT}</Typography>

          <Box mt={3} display="flex" alignItems="baseline">
            <Typography variant="h4">{APPOINTMENT_DATE}</Typography>

            <Box p={1} />

            <Typography variant="body1">Mon May 16, 2022 12:00AM</Typography>
          </Box>

          <Box my={3} p={2} bgcolor={GREY_NINE}>
            <Typography variant="h4">{PROVIDER_INFORMATION}</Typography>
          </Box>

          <Box px={1}>
            <Grid container spacing={3} direction="row">
              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PRACTICE_NAME} :</strong></Typography>
                  <Box p={1} />
                  <Typography>MedCity</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PROVIDER_NAME} :</strong></Typography>
                  <Box p={1} />
                  <Typography>Ahmad Hassan</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{OFFICE_EIN} :</strong></Typography>
                  <Box p={1} />
                  <Typography>58356464664</Typography>
                </Box>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PLACE_OF_SERVICE_CODE} :</strong></Typography>
                  <Box p={1} />
                  <Typography>11</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{ADDRESS} :</strong></Typography>
                  <Box p={1} />
                  <Typography>lark field Road East North Port, NY 1173</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{OFFICE_PHONE} :</strong></Typography>
                  <Box p={1} />
                  <Typography>(413) 213-5672</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{EMAIL} :</strong></Typography>
                  <Box p={1} />
                  <Typography>hiletep839@3dinews.com</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box my={3} p={2} bgcolor={GREY_NINE}>
            <Typography variant="h4">{PATIENT_INFORMATION}</Typography>
          </Box>

          <Box px={1} pb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Grid container spacing={3} direction="row">
              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PATIENT_NAME} :</strong></Typography>
                  <Box p={1} />
                  <Typography>Chrissy Bright</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{DATE_OF_BIRTH} :</strong></Typography>
                  <Box p={1} />
                  <Typography>Sept. 10, 1971</Typography>
                </Box>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PATIENT_ADDRESS} :</strong></Typography>
                  <Box p={1} />
                  <Typography>1600 Amphitheatre Pkwy Mountain View, CA 94040</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PATIENT_PHONE} :</strong></Typography>
                  <Box p={1} />
                  <Typography>(844) 569-8628</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box p={1}>
            <Grid container spacing={3} direction="row">
              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{INSURER} :</strong></Typography>
                  <Box p={1} />
                  <Typography>CBA Blue</Typography>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{SUBSCRIBER} :</strong></Typography>
                  <Box p={1} />
                  <Typography>Chrissy Bright</Typography>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{GROUP_NO} :</strong></Typography>
                  <Box p={1} />
                  <Typography>54646466</Typography>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{MEMBER_NO} :</strong></Typography>
                  <Box p={1} />
                  <Typography>45656222</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box my={3} p={2} bgcolor={GREY_NINE}>
            <Typography variant="h4">{DIAGNOSIS}</Typography>
          </Box>

          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh('#')}
                {renderTh(DATE_OF_VISIT)}
                {renderTh(DIAGNOSIS_CODE)}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell scope="row">
                  <Typography variant="h6">1</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>05/16/2022</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>U07.1: COVID-19</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Box mt={5} mb={3} p={2} bgcolor={GREY_NINE}>
            <Typography variant="h4">{TREATMENT}</Typography>
          </Box>

          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(DATE_OF_SERVICE)}
                {renderTh(BILLING_CODE)}
                {renderTh(MODS)}
                {renderTh(DX_PTRS)}
                {renderTh(QTY)}
                {renderTh(FEE)}
                {renderTh(DIS)}
                {renderTh(TOTAL_TEXT)}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell scope="row">
                  <Typography>05/16/2022</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>0064A: ADM SARSCOV2 50MCG/0.25MLBST</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>W9:WP:XU:3P</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>1:0:0:0</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>1.00</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>$150.00</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>$0.00</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>$150.00</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell scope="row">
                  <Typography>05/16/2022</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>91307: SARSCOV2 VAC 10 MCG TRS-SUCR</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography></Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>1:0:0:0</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>1.00</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>$150.00</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>$0.00</Typography>
                </TableCell>

                <TableCell scope="row">
                  <Typography>$150.00</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Card>
    </>
  )
}

export default SuperBillComponent;
