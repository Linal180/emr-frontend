// packages block
import { useCallback, useEffect, useState } from 'react';
// component block
import Loader from '../../common/Loader';
// constants, history, styling block
import { Document, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useParams } from 'react-router';
import {
  ADDRESS, BALANCE_DUE, CODE, COPAY_TEXT, DEDUCTIBLE, DOB_TEXT, DOS, INSURANCE_NAME, INSURANCE_TYPE, MEMBER_ID, NAME,
  PATIENT_NAME, PHONE, PROCEDURE_CODES, SEX,
} from '../../../constants';
import { CodeType, SuperBillPayload, useGetSuperBillInfoLazyQuery } from '../../../generated/graphql';
import { ParamsType } from '../../../interfacesTypes';
import { formatAddress, formatPhone, getFormatDateString, } from '../../../utils';

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
  fieldTitleHeader: {
    padding: '0px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  fieldTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    minHeight: '20px',
    maxWidth: '90%',
    wordWrap: 'break-word',
  },
  fieldText: {
    minHeight: '20px',
    maxWidth: '95%',
    overflow: 'hidden',
    wordWrap: 'break-word',
    // border: '1px solid red',
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
  fieldRow2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  fieldRow3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    // border: '1px solid red',
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
  w5: {
    width: '5%',
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
  p10: {
    padding: '10px',
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
      <PDFViewer style={{ width: "100%", height: `calc(100vh - 140px)` }}>
        <Document>
          <Page style={styles.page} size="A3" wrap>
            <View style={styles.table}>
              {/* header-title */}
              {/* <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <Text style={styles.title}>{PATIENT_RECEIPT}</Text>
                </View>
              </View>

              <View style={styles.tableRow}>
                <View style={{ height: '20px' }}></View>
              </View> */}

              {/* appointment-date */}
              {/* <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.headerText}>{APPOINTMENT_DATE} :</Text>
                    <Text style={styles.headerText}>{getDateWithDayAndTime(scheduleStartDateTime || '')}</Text>
                  </View>
                </View>
              </View> */}

              {/* spacing-row */}
              {/* <View style={styles.tableRow}>
                <View style={{ height: '20px' }}></View>
              </View> */}

              {/* 1st-row */}
              <View style={[styles.tableRow]}>
                <View style={[styles.w30,]}>
                  <View>
                    <Text style={[styles.fieldTitle]}>{PATIENT_NAME}</Text>
                    <Text style={[styles.fieldText]}>{patientFirstName} {patientLastName}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DOB_TEXT} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{getFormatDateString(dob, 'MMM DD, YYYY')}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{SEX} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{'Male'}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{PHONE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{formatPhone(patientPhone || '')}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{ADDRESS} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>{formatAddress(patientAddress, patientCity, patientState, patientZipCode)}</Text>
                  </View>
                </View>

                <View style={[styles.w5,]}></View>

                <View style={[styles.w30,]}>
                  <View>
                    <Text style={[styles.fieldTitle]}>{'Physician Name'}</Text>
                    <Text style={[styles.fieldText]}>{patientFirstName} {patientLastName}</Text>
                  </View>

                  <View>
                    <Text style={[styles.fieldTitle]}>{INSURANCE_NAME}</Text>
                    <Text style={[styles.fieldText]}></Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{INSURANCE_TYPE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}></Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{MEMBER_ID} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}></Text>
                  </View>
                </View>

                <View style={[styles.w5,]}></View>

                <View style={[styles.w30,]}>
                 <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DOS} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>09/21/2022</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{BALANCE_DUE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>$0.00</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{DEDUCTIBLE} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}></Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle]}>{COPAY_TEXT} :</Text>
                    <Text style={[styles.fieldText, styles.ml10]}>$0.00</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '20px' }}>
                </View>
              </View>

              {/* Codes */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <Text style={styles.headerTitle}>{PROCEDURE_CODES} :</Text>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '20px' }}>
                </View>
              </View>

              {/* codes-row */}
              <View style={[styles.tableRow,]}>
                <View style={[styles.w30, styles.borderStyle, styles.borderRightWidth, styles.borderLeftWidth, styles.borderBottomWidth]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={[styles.fieldTitle]}>{NAME}</Text>
                  </View>
                  <View style={[styles.p10]}>
                    <Text style={[styles.fieldText]}>text here text here text here</Text>
                  </View>
                </View>

                <View style={[styles.w20, styles.borderStyle, styles.borderRightWidth, styles.borderBottomWidth]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{CODE}</Text>
                  </View>
                  <View style={[styles.p10]}>
                    <Text style={[styles.fieldText]}>code here</Text>
                  </View>
                </View>

                <View style={[styles.w30, styles.borderStyle, styles.borderRightWidth, styles.borderBottomWidth]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={[styles.fieldTitle]}>{NAME}</Text>
                  </View>
                  <View style={[styles.p10]}>
                    <Text style={[styles.fieldText]}>text here text here text here</Text>
                  </View>
                </View>

                <View style={[styles.w20, styles.borderStyle, styles.borderRightWidth, styles.borderBottomWidth]}>
                  <View style={[styles.bgLightGrey, styles.textCenter, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle}>{CODE}</Text>
                  </View>
                  <View style={[styles.p10]}>
                    <Text style={[styles.fieldText, styles.textCenter]}>code here</Text>
                  </View>
                </View>
              </View>

              <View><Text style={[styles.fieldText2]}>No Code Added</Text></View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </>
  )
}

export default SuperBillComponent;
