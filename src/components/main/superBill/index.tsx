// packages block
import { Box, Card, colors, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
// component block
import Loader from '../../common/Loader';
// constants, history, styling block
import { useParams } from 'react-router';
import {
  ADDRESS, APPOINTMENT_DATE, BILLING_CODE, CLINIC, DATE, DATE_OF_BIRTH, DATE_OF_SERVICE, DATE_OF_VISIT, DIAGNOSIS,
  DIAGNOSIS_CODE, DIS, DOS, DX_PTRS, EMAIL, FEE, GROUP_NO, INSURANCE_BALANCE_DUE, INSURANCE_PAID, INSURER,
  MEMBER_NO, MODS, N_A, OFFICE_EIN, OFFICE_PHONE, PATIENT_ADDRESS, PATIENT_BALANCE_DUE, PATIENT_INFORMATION,
  PATIENT_NAME, PATIENT_PAID, PATIENT_PHONE, PATIENT_RECEIPT, PATIENT_RECEIPT_AUTHORIZE_TEXT, PATIENT_SIGNATURE,
  PLACE_OF_SERVICE_CODE, PRACTICE_NAME, PROVIDER_INFORMATION, PROVIDER_NAME, PROVIDER_SIGNATURE, QTY, SIGNATURE_DATE,
  SUBSCRIBER, TOTAL_CHARGES, TOTAL_DISCOUNTS, TOTAL_TEXT, TREATMENT
} from '../../../constants';
import { CodeType, SuperBillPayload, useGetSuperBillInfoLazyQuery } from '../../../generated/graphql';
import { ParamsType } from '../../../interfacesTypes';
import { BLACK_FOUR, GREY_NINE } from '../../../theme';
import { formatPhone, formatToLeadingCode, getDateWithDayAndTime, getFormatDateString, getNumberFromChar, renderTh } from '../../../utils';
import NoDataFoundComponent from '../../common/NoDataFoundComponent';
import { Document, Page, PDFViewer, Text, StyleSheet, View } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column", padding: 15
  },
  table: {
    width: "auto",
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
  },
  title: {
    minHeight: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: '16px',
    marginLeft: '5px',
  },
  fieldTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    minHeight: '20px',
  },
  fieldText: {
    minHeight: '20px',
    maxWidth: '90%',
    overflow: 'hidden',
    fontSize: '14px',
  },
  fieldTitle2: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '5px',
  },
  fieldText2: {
    padding: '5px',
    overflow: 'hidden',
    fontSize: '14px',
  },
  fieldRow3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderStyle: {
    borderStyle: 'solid',
  },
  borderTopWidth: {
    borderTopWidth: 1
  },
  borderBottomWidth: {
    borderBottomWidth: 1
  },
  borderLeftWidth: {
    borderLeftWidth: 1
  },
  borderRightWidth: {
    borderRightWidth: 1
  },
  w10: {
    width: '10%',
  },
  w20: {
    width: '20%',
  },
  w30: {
    width: '30%',
  },
  w33: {
    width: '33%',
  },
  w40: {
    width: '40%',
  },
  w50: {
    width: '50%',
  },
  w60: {
    width: '60%',
  },
  w100: {
    width: '100%',
  },
  bgLightGrey: {
    backgroundColor: '#eeeeee',
  },
  ml10: {
    marginLeft: '10px',
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
});

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
      {/* <Card>
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

          {(diagnosesCodes?.length === 0) &&
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          }

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

          {(treatmentCodes?.length === 0) &&
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          }

          <Box mt={5} mb={3} p={2} bgcolor={GREY_NINE}>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap"
              pb={2} alignItems="center" maxWidth={600}>
              <Typography variant="h4">{TOTAL_CHARGES}</Typography>
              <Typography variant="body1">{totalCharges ? `$${totalCharges}` : `$${0}`}</Typography>
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
              <Typography variant="body1">{totalCharges ? `$${totalCharges}` : `$${0}`}</Typography>
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
      </Card> */}

      <PDFViewer style={{ width: "100%", height: `calc(100vh - 140px)`, }}>
        <Document>
          <Page style={styles.page} size="A3" wrap>
            <View style={styles.table}>
              {/* header-title */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <Text style={styles.title}>{PATIENT_RECEIPT}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '20px' }}></View>
              </View>

              {/* appointment-date */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.headerTitle}>{APPOINTMENT_DATE}:</Text>
                    <Text style={styles.headerText}>{'Tue Sep 20, 2022 11:30AM'}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '20px' }}></View>
              </View>

              {/* 1st-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{PROVIDER_INFORMATION}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 1.1-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w33]}>
                  <Text style={[styles.fieldTitle]}>{CLINIC}</Text>
                  <Text style={styles.fieldText}>{'Ahmad Hassan'}</Text>
                </View>

                <View style={[styles.w33]}>
                  <Text style={[styles.fieldTitle]}>{PLACE_OF_SERVICE_CODE}</Text>
                  <Text style={styles.fieldText}>{'11'}</Text>
                </View>

                <View style={[styles.w33]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{OFFICE_PHONE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'5153666666'}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{EMAIL} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'sedagic226@moenode.com'}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '30px' }}>
                </View>
              </View>

              {/* 2nd-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{PATIENT_INFORMATION}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 2.1-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w33]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{PATIENT_NAME} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'Jenny Harris'}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DATE_OF_BIRTH} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'Feb. 11, 1980'}</Text>
                  </View>
                </View>

                <View style={[styles.w33]}>
                  <Text style={[styles.fieldTitle]}>{PATIENT_ADDRESS} :</Text>
                  <Text style={[styles.fieldText]}>{'2 Castro Street Mountain View, CA 94040'}</Text>
                </View>

                <View style={[styles.w33]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{PATIENT_PHONE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'(555) 555-1234'}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '50px' }}>
                </View>
              </View>

              {/* Diagnosis */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <Text style={styles.headerTitle}>{DIAGNOSIS} :</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 3rd-row */}
              <View style={[styles.tableRow,]}>
                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={[styles.fieldTitle]}>{'#'}</Text>
                  </View>
                </View>

                <View style={[styles.w30, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{DATE_OF_VISIT}</Text>
                  </View>
                </View>

                <View style={[styles.w60, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{DIAGNOSIS_CODE}</Text>
                  </View>
                </View>
              </View>

              {/* 3.1-row */}
              <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth]}>
                  <Text style={[styles.fieldText2]}>{'1'}</Text>
                </View>

                <View style={[styles.w30, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'09/20/2022'}</Text>
                </View>

                <View style={[styles.w60, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'B00.2: Herpesviral gingivostomatitis and pharyngotonsillitis'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '30px' }}>
                </View>
              </View>

              {/* Treatment */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <Text style={styles.headerTitle}>{TREATMENT} :</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 4th-row */}
              <View style={[styles.tableRow,]}>
                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={[styles.fieldTitle]}>{DOS}</Text>
                  </View>
                </View>

                <View style={[styles.w30, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{BILLING_CODE}</Text>
                  </View>
                </View>

                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{MODS}</Text>
                  </View>
                </View>

                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{'Dx Ptrs'}</Text>
                  </View>
                </View>

                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{QTY}</Text>
                  </View>
                </View>

                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{FEE}</Text>
                  </View>
                </View>

                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{DIS}</Text>
                  </View>
                </View>

                <View style={[styles.w10, styles.borderStyle, styles.borderRightWidth,]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{TOTAL_TEXT}</Text>
                  </View>
                </View>
              </View>

              {/* 4.1-row */}
              <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth]}>
                  <Text style={[styles.fieldText2]}>{'09/20/2022'}</Text>
                </View>

                <View style={[styles.w30, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'87425: ROTAVIRUS AG IA'}</Text>
                </View>

                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{''}</Text>
                </View>

                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'1:0:0:0'}</Text>
                </View>

                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'1.00'}</Text>
                </View>

                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'$150.00'}</Text>
                </View>

                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'$0.00'}</Text>
                </View>

                <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                  <Text style={[styles.fieldText2]}>{'$150.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '30px' }}>
                </View>
              </View>

              {/* Bill-row */}
              <View style={[styles.tableRow]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{TOTAL_CHARGES}</Text>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.headerText, styles.textRight]}>{'$150.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{TOTAL_DISCOUNTS}</Text>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.headerText, styles.textRight]}>{'$0.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{PATIENT_PAID}</Text>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.headerText, styles.textRight]}>{'$0.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{INSURANCE_PAID}</Text>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.headerText, styles.textRight]}>{'$0.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{PATIENT_BALANCE_DUE}</Text>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.headerText, styles.textRight]}>{'$150.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{INSURANCE_BALANCE_DUE}</Text>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.headerText, styles.textRight]}>{'$0.00'}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '40px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w100]}>
                  <Text style={[styles.fieldTitle]}>{PATIENT_RECEIPT_AUTHORIZE_TEXT}</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '30px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DATE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'___________________________'}</Text>
                  </View>
                </View>

                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{PATIENT_SIGNATURE}</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'___________________________'}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              <View style={[styles.tableRow]}>
                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DATE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'___________________________'}</Text>
                  </View>
                </View>

                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{PROVIDER_SIGNATURE}</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'___________________________'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

export default SuperBillComponent;
