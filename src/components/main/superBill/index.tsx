// packages block
import { Box, Card, colors, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
// component block
import Loader from '../../common/Loader';
// constants, history, styling block
import { useParams } from 'react-router';
import {
  ADDRESS, APPOINTMENT_DATE, BILLING_CODE, DATE_OF_BIRTH, DATE_OF_SERVICE, DATE_OF_VISIT, DIAGNOSIS,
  DIAGNOSIS_CODE, DIS, DX_PTRS, EMAIL, FEE, GROUP_NO, INSURANCE_BALANCE_DUE, INSURANCE_PAID, INSURER,
  MEMBER_NO, MODS, N_A, OFFICE_EIN, OFFICE_PHONE, PATIENT_ADDRESS, PATIENT_BALANCE_DUE,
  PATIENT_INFORMATION, PATIENT_NAME, PATIENT_PAID, PATIENT_PHONE, PATIENT_RECEIPT,
  PATIENT_RECEIPT_AUTHORIZE_TEXT, PATIENT_SIGNATURE, PLACE_OF_SERVICE_CODE, PRACTICE_NAME, PROVIDER_INFORMATION,
  PROVIDER_NAME, PROVIDER_SIGNATURE, QTY, SIGNATURE_DATE, SUBSCRIBER, TOTAL_CHARGES, TOTAL_DISCOUNTS, TOTAL_TEXT, TREATMENT
} from '../../../constants';
import { CodeType, SuperBillPayload, useGetSuperBillInfoLazyQuery } from '../../../generated/graphql';
import { ParamsType } from '../../../interfacesTypes';
import { BLACK_FOUR, GREY_NINE } from '../../../theme';
import { formatPhone, formatToLeadingCode, getDateWithDayAndTime, getFormatDateString, getNumberFromChar, renderTh } from '../../../utils';

const SuperBillComponent = (): JSX.Element => {
  const { id: appointmentId } = useParams<ParamsType>()
  const [superBillInfo, setSuperBillInfo] = useState<SuperBillPayload>()
  const [getSuperBill, { loading: getSuperBillInfoLoading }] = useGetSuperBillInfoLazyQuery({
    onCompleted(data) {
      if (data) {
        const { getSuperBillInfo } = data || {}
        setSuperBillInfo(getSuperBillInfo as SuperBillPayload)
      }
    }
  })

  const fetchBillingDetails = useCallback(async () => {
    try {
      getSuperBill({
        variables: {
          superBillInput: {
            appointmentId: appointmentId ?? ''
          }
        }
      })
    } catch (error) { }
  }, [appointmentId, getSuperBill])

  useEffect(() => {
    appointmentId && fetchBillingDetails()
  }, [appointmentId, fetchBillingDetails])

  if (getSuperBillInfoLoading) {
    return <Loader loading loaderText='Fetching Super Bill Info...' />
  }

  const { patientInfo, appointmentInfo, providerInfo, insuranceDetail, policyHolderInfo, billingInfo } = superBillInfo || {}
  const { scheduleStartDateTime } = appointmentInfo || {}
  const { facility, firstName: providerFirstName, lastName: providerLastName, npi, contacts: providerContacts } = providerInfo || {}
  const { address: providerAddress, state: providerState, zipCode: providerZipCode, email: providerEmail, phone: providerPhone } = providerContacts?.find((providerContact) => providerContact?.primaryContact) || {}
  const { practice, serviceCode } = facility || {}
  const { name: practiceName } = practice || {}
  const { firstName: patientFirstName, lastName: patientLastName, contacts: patientContacts, dob } = patientInfo || {}
  const { address: patientAddress, state: patientState, zipCode: patientZipCode, phone: patientPhone } = patientContacts?.find((providerContact) => providerContact?.primaryContact) || {}
  const { insurance, groupNumber, memberId } = insuranceDetail || {}
  const { payerName } = insurance || {}
  const { firstName: policyHolderFirst, lastName: policyHolderLast } = policyHolderInfo || {}
  const { codes, claimDate } = billingInfo || {}
  const diagnosesCodes = codes?.filter((code) => code.codeType === CodeType.Icd_10Code) ?? []
  const treatmentCodes = codes?.filter((code) => code.codeType === CodeType.CptCode) ?? []

  const totalCharges = codes?.reduce((acc, code) => {
    return acc += Number(code?.price || 0)
  }, 0)

  return (
    <>
      <Card>
        <Box p={3}>
          <Typography variant="h2" color='textPrimary'>{PATIENT_RECEIPT}</Typography>

          <Box mt={3} display="flex" alignItems="baseline">
            <Typography variant="h4">{APPOINTMENT_DATE}</Typography>

            <Box p={1} />

            <Typography variant="body1">{getDateWithDayAndTime(scheduleStartDateTime || '')}</Typography>
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
                  <Typography>{practiceName}</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PROVIDER_NAME} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{providerFirstName} {providerLastName}</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{OFFICE_EIN} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{npi}</Typography>
                </Box>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PLACE_OF_SERVICE_CODE} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{formatToLeadingCode(serviceCode || '')}</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{ADDRESS} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{providerAddress ? `${providerAddress}, ${providerState} ${providerZipCode}` : N_A}</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{OFFICE_PHONE} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{formatPhone(providerPhone || '')}</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{EMAIL} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{providerEmail}</Typography>
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
                  <Typography>{patientFirstName} {patientLastName}</Typography>
                </Box>

                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{DATE_OF_BIRTH} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{getFormatDateString(dob, 'MMM DD, YYYY')}</Typography>
                </Box>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PATIENT_ADDRESS} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{patientAddress ? `${patientAddress}, ${patientState} ${patientZipCode}` : N_A}</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{PATIENT_PHONE} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{formatPhone(patientPhone || '')}</Typography>
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
                  <Typography>{payerName}</Typography>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{SUBSCRIBER} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{policyHolderFirst} {policyHolderLast}</Typography>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{GROUP_NO} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{groupNumber}</Typography>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box my={1} display="flex" flexWrap="wrap">
                  <Typography><strong>{MEMBER_NO} :</strong></Typography>
                  <Box p={1} />
                  <Typography>{memberId}</Typography>
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
              {diagnosesCodes.map((diagnosesCode, index) => {
                return (
                  <TableRow>
                    <TableCell scope="row">
                      <Typography variant="h6">{index + 1}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>{getFormatDateString(claimDate, 'MM/DD/YYYY')}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>{diagnosesCode?.code}: {diagnosesCode?.description}</Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
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
              {treatmentCodes?.map((treatmentCode) => {
                const { m1, m2, m3, m4, code, description, diagPointer, unit, price } = treatmentCode || {}
                const diag1 = diagPointer ? String(getNumberFromChar(diagPointer, 0)) : ''
                const diag2 = diagPointer ? String(getNumberFromChar(diagPointer, 1)) : ''
                const diag3 = diagPointer ? String(getNumberFromChar(diagPointer, 3)) : ''
                const diag4 = diagPointer ? String(getNumberFromChar(diagPointer, 4)) : ''
                return (
                  <TableRow>
                    <TableCell scope="row">
                      <Typography>{getFormatDateString(claimDate, 'MM/DD/YYYY')}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>{code}: {description}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>{m1}:{m2}:{m3}:{m4}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>{diag1 || 0}:{diag2 || 0}:{diag3 || 0}:{diag4 || 0}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>{unit}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>${Number(price) / Number(unit)}</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>$0.00</Typography>
                    </TableCell>

                    <TableCell scope="row">
                      <Typography>${price}</Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <Box mt={5} mb={3} p={2} bgcolor={GREY_NINE}>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{TOTAL_CHARGES}</Typography>
              <Typography variant="body1">${totalCharges}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{TOTAL_DISCOUNTS}</Typography>
              <Typography variant="body1">$0</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{PATIENT_PAID}</Typography>
              <Typography variant="body1">$0</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{INSURANCE_PAID}</Typography>
              <Typography variant="body1">$0</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{PATIENT_BALANCE_DUE}</Typography>
              <Typography variant="body1">${totalCharges}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{INSURANCE_BALANCE_DUE}</Typography>
              <Typography variant="body1">$0</Typography>
            </Box>
          </Box>

          <Box mt={3} mb={2} p={2}>
            <Typography variant="body1">{PATIENT_RECEIPT_AUTHORIZE_TEXT}</Typography>
          </Box>

          <Box display="flex" mx={2} maxWidth={1000}>
            <Box display="flex" flex="40%" mb={3} width="100%">
              <Box alignSelf="end">
                <Typography variant="body1">{SIGNATURE_DATE}</Typography>
              </Box>

              <Box flex={1} mx={1} borderBottom={`2px solid ${BLACK_FOUR}`}></Box>
            </Box>

            <Box display="flex" flex="60%" mb={3} width="100%">
              <Box alignSelf="end">
                <Typography variant="body1">{PATIENT_SIGNATURE}</Typography>
              </Box>

              <Box flex={1} mx={1} borderBottom={`2px solid ${BLACK_FOUR}`}></Box>
            </Box>
          </Box>

          <Box display="flex" mx={2} maxWidth={1000}>
            <Box display="flex" flex="40%" mb={3} width="100%">
              <Box alignSelf="end">
                <Typography variant="body1">{SIGNATURE_DATE}</Typography>
              </Box>

              <Box flex={1} mx={1} borderBottom={`2px solid ${BLACK_FOUR}`}></Box>
            </Box>

            <Box display="flex" flex="60%" mb={3} width="100%">
              <Box alignSelf="end">
                <Typography variant="body1">{PROVIDER_SIGNATURE}</Typography>
              </Box>

              <Box flex={1} mx={1} borderBottom={`2px solid ${BLACK_FOUR}`}></Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </>
  )
}

export default SuperBillComponent;
