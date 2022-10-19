// packages block
import { useCallback, useEffect, useState } from 'react';
// component block
import Loader from '../../common/Loader';
// constants, history, styling block
import { Document, Link, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useParams } from 'react-router';
import {
  APPOINTMENT_DATE, BILLING_CODE, CLINIC, DATE, DATE_OF_BIRTH, DATE_OF_VISIT, DIAGNOSIS,
  DIAGNOSIS_CODE, DIS, DOS, EMAIL, FEE, INSURANCE_BALANCE_DUE, INSURANCE_PAID, MODS, OFFICE_PHONE, PATIENT_ADDRESS, PATIENT_BALANCE_DUE, PATIENT_INFORMATION,
  PATIENT_NAME, PATIENT_PAID, PATIENT_PHONE, PATIENT_RECEIPT, PATIENT_RECEIPT_AUTHORIZE_TEXT, PATIENT_SIGNATURE,
  PLACE_OF_SERVICE_CODE, PROVIDER_INFORMATION, PROVIDER_SIGNATURE, QTY, TOTAL_CHARGES, TOTAL_DISCOUNTS, TOTAL_TEXT, TREATMENT
} from '../../../constants';
import { CodeType, SuperBillPayload, useGetSuperBillInfoLazyQuery } from '../../../generated/graphql';
import { ParamsType } from '../../../interfacesTypes';
import { formatAddress, formatPhone, formatToLeadingCode, getDateWithDayAndTime, getFormatDateString, getNumberFromChar } from '../../../utils';

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

  const { patientInfo, appointmentInfo, providerInfo, billingInfo } = superBillInfo || {}
  const { scheduleStartDateTime } = appointmentInfo || {}
  const { facility, contacts: providerContacts } = providerInfo || {}
  const { email: providerEmail, phone: providerPhone } = providerContacts?.find((providerContact) => providerContact?.primaryContact) || {}
  const { practice, serviceCode } = facility || {}
  const { name: practiceName } = practice || {}
  const { firstName: patientFirstName, lastName: patientLastName, contacts: patientContacts, dob } = patientInfo || {}
  const { address: patientAddress, state: patientState, zipCode: patientZipCode, phone: patientPhone, city: patientCity } = patientContacts?.find((providerContact) => providerContact?.primaryContact) || {}
  const { codes, claimDate } = billingInfo || {}
  const diagnosesCodes = codes?.filter((code) => code.codeType === CodeType.Icd_10Code) ?? []
  const treatmentCodes = codes?.filter((code) => code.codeType === CodeType.CptCode) ?? []

  const totalCharges = codes?.reduce((acc, code) => {
    if (code.codeType === CodeType.CptCode) {
      return acc += Number(code?.price || 0)
    }
    return acc
  }, 0)

  return (
    <>
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
                    <Text style={styles.headerText}>{getDateWithDayAndTime(scheduleStartDateTime || '')}</Text>
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
                  <Text style={styles.fieldText}>{practiceName}</Text>
                </View>

                <View style={[styles.w33]}>
                  <Text style={[styles.fieldTitle]}>{PLACE_OF_SERVICE_CODE}</Text>
                  <Text style={styles.fieldText}>{formatToLeadingCode(serviceCode || '')}</Text>
                </View>

                <View style={[styles.w33]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{OFFICE_PHONE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{formatPhone(providerPhone || '')}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{EMAIL} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}><Link src={providerEmail ? `mailto:${providerEmail}` : ''} style={{ textDecoration: "none" }} >{providerEmail}</Link></Text>
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
                    <Text style={[styles.fieldText, styles.ml10]}>{patientFirstName} {patientLastName}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DATE_OF_BIRTH} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{getFormatDateString(dob, 'MMM DD, YYYY')}</Text>
                  </View>
                </View>

                <View style={[styles.w33]}>
                  <Text style={[styles.fieldTitle]}>{PATIENT_ADDRESS} :</Text>
                  <Text style={[styles.fieldText]}>{formatAddress(patientAddress, patientCity, patientState, patientZipCode)}</Text>
                </View>

                <View style={[styles.w33]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{PATIENT_PHONE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{formatPhone(patientPhone || '')}</Text>
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
              {
                diagnosesCodes.length ? diagnosesCodes.map((diagnose, i) => {
                  return (
                    <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth]}>
                        <Text style={[styles.fieldText2]}>{i + 1}</Text>
                      </View>

                      <View style={[styles.w30, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{getFormatDateString(claimDate, 'MM/DD/YYYY')}</Text>
                      </View>

                      <View style={[styles.w60, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{diagnose?.code}: {diagnose?.description}</Text>
                      </View>
                    </View>
                  )
                }) : <View><Text style={[styles.fieldText2]}>No Diagnose Added</Text></View>
              }

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
              {treatmentCodes.length ?
                treatmentCodes?.map((treatmentCode) => {
                  const { m1, m2, m3, m4, code, description, diagPointer, unit, price } = treatmentCode || {}
                  const diag1 = diagPointer ? String(getNumberFromChar(diagPointer, 0)) : ''
                  const diag2 = diagPointer ? String(getNumberFromChar(diagPointer, 1)) : ''
                  const diag3 = diagPointer ? String(getNumberFromChar(diagPointer, 3)) : ''
                  const diag4 = diagPointer ? String(getNumberFromChar(diagPointer, 4)) : ''
                  return (
                    <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth]}>
                        <Text style={[styles.fieldText2]}>{getFormatDateString(claimDate, 'MM/DD/YYYY')}</Text>
                      </View>

                      <View style={[styles.w30, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{code}: {description}</Text>
                      </View>

                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{m1}:{m2}:{m3}:{m4}</Text>
                      </View>

                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{diag1 || 0}:{diag2 || 0}:{diag3 || 0}:{diag4 || 0}</Text>
                      </View>

                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{unit}</Text>
                      </View>

                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>${Number(price) / Number(unit)}</Text>
                      </View>

                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>{'$0.00'}</Text>
                      </View>

                      <View style={[styles.w10, styles.textCenter, styles.borderStyle, styles.borderRightWidth,]}>
                        <Text style={[styles.fieldText2]}>${price}</Text>
                      </View>
                    </View>
                  )
                }) : <View><Text style={[styles.fieldText2]}>No Treatment Added</Text></View>
              }

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
                  <Text style={[styles.headerText, styles.textRight]}>{totalCharges ? `$${totalCharges}` : `$${0}`}</Text>
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
                  <Text style={[styles.headerText, styles.textRight]}>{totalCharges ? `$${totalCharges}` : `$${0}`}</Text>
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
