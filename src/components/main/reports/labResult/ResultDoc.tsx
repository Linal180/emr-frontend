import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
// import Logo from "../../../../assets/images/aimed-logo.png";
import {
  ADDRESS, ATTENDING, CLIA_ID_NUMBER, COLLECTED_DATE, COMMENT, DIAGNOSES, DOB_TEXT, FACILITY,
  FINAL_REPORT, GENDER, LAB_RESULTS_INFO, METHOD, NAME, PATIENT, PATIENT_NO, PHYSICIAN,
  PRIMARY, PRIMARY_CARE, RECEIVED_DATE, RESULTS, SPECIMEN, TEL, TESTS, URGENT_CARE,
} from "../../../../constants";
import { LabTestsPayload } from "../../../../generated/graphql";
import { formatAddress, formatPhone, getFormatDateString } from "../../../../utils";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column", padding: 15
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 12,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  fieldTitle: {
    minHeight: '30px',
    padding: '7px',
    fontWeight: 'bold',
  },
  fieldText: {
    minHeight: '30px',
    minWidth: '170px',
    padding: '7px',
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  fieldTitle2: {
    padding: '10px',
    textAlign: 'center',
    color: 'white',
  },
  fieldTitle3: {
    padding: '10px',
    textAlign: 'center',
    color: 'green',
  },
  fieldText2: {
    minHeight: '30px',
    padding: '7px',
    backgroundColor: '#eee',
    minWidth: '140px',
  },
  fieldText3: {
    padding: '10px',
    textAlign: 'center',
    color: 'black',
  },
  fieldRow1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: '7px',
  },
  fieldRow2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '7px',
  },
  fieldRow3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  paraText: {
    padding: '5px 10px',
  },
  paraText2: {
    padding: '3px 10px',
    fontWeight: 'bold',
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
  w20: {
    width: '20%',
  },
  w30: {
    width: '30%',
  },
  w50: {
    width: '50%',
  },
  w70: {
    width: '70%',
  },
  w100: {
    width: '100%',
  },
  mt15: {
    marginTop: '15px',
  },
  bgGrey: {
    backgroundColor: 'grey',
  },
  bgLightGrey: {
    backgroundColor: '#eeeeee',
  },
  colorBlue: {
    color: 'blue',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoImage: {
    width: '110px',
    margin: '10px',
  }
});


const ResultDoc = ({ labTest, attachmentUrl }: { labTest: LabTestsPayload['labTests'], attachmentUrl?: string | null }) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, `${process.env.REACT_APP_URL}${LAB_RESULTS_INFO}/${labTest?.[0]?.orderNumber}`);
  const barcode = canvas.toDataURL();

  const { patient, primaryProvider, collectedDate, receivedDate } = labTest?.[0] || {}
  const { firstName, lastName, dob, gender, patientRecord, contacts, facility } = patient || {}
  const primaryContact = contacts?.find((contact) => contact?.primaryContact)
  const { phone } = primaryContact || {}
  const { contacts: facilityContacts, name: facilityName, cliaIdNumber } = facility || {}
  const facilityPrimaryContact = facilityContacts?.find((facilityContact) => facilityContact?.primaryContact)
  const { phone: facilityPhone, address, city, state, zipCode } = facilityPrimaryContact || {}
  const { firstName: dFirstName, lastName: dLastName } = primaryProvider || {}
  const doctorFullName = `${dFirstName} ${dLastName}`
  const patientFullName = `${firstName} ${lastName}`
  const diagnoses = labTest?.find((test) => test?.diagnoses?.[0]?.code)?.diagnoses

  return (
    <Document>
      <Page style={styles.page} size="A3" wrap>
        <View style={styles.table}>
          {/* 1st-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w30, styles.flexRow, styles.borderStyle, styles.borderRightWidth]}>
              <Image
                src={'data:image/png;base64,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'}
                style={styles.logoImage}
              />
            </View>

            <View style={[styles.w70]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{SPECIMEN}</Text>
              </View>

              <View style={styles.fieldRow2}>
                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{PATIENT_NO}:</Text>
                  <Text style={styles.fieldText}>{patientRecord}</Text>
                </View>

                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{FINAL_REPORT}:</Text>
                  <Text style={styles.fieldText}></Text>
                </View>
              </View>

              <View style={styles.fieldRow2}>
                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{COLLECTED_DATE}:</Text>
                  <Text style={styles.fieldText}>{collectedDate}</Text>
                </View>

                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{RECEIVED_DATE}:</Text>
                  <Text style={styles.fieldText}>{receivedDate}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2nd-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w30, styles.borderStyle, styles.borderRightWidth, styles.borderTopWidth]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{PATIENT}</Text>
              </View>

              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>{NAME}:</Text>
                <Text style={styles.fieldText}>{patientFullName}</Text>
              </View>

              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>{DOB_TEXT}:</Text>
                <Text style={styles.fieldText}>{getFormatDateString(dob, 'MM-DD-YYYY')}</Text>
              </View>

              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>{GENDER}:</Text>
                <Text style={styles.fieldText}>{gender}</Text>
              </View>

              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>ID #:</Text>
                <Text style={styles.fieldText}>{patientRecord}</Text>
              </View>

              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>{TEL}:</Text>
                <Text style={styles.fieldText}>{formatPhone(phone)}</Text>
              </View>
            </View>

            <View style={[styles.w70, styles.borderStyle, styles.borderTopWidth]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{PHYSICIAN}</Text>
              </View>

              <View style={[styles.fieldRow2, styles.w100]}>
                <Text style={styles.fieldTitle}>{FACILITY}:</Text>
                <Text style={styles.fieldText}>{facilityName}</Text>
              </View>

              <View style={styles.fieldRow2}>
                <Text style={styles.fieldTitle}>{CLIA_ID_NUMBER}:</Text>
                <Text style={styles.fieldText}>{cliaIdNumber}</Text>
              </View>

              <View style={styles.fieldRow2}>
                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{PRIMARY_CARE}:</Text>
                  <Text style={styles.fieldText}>{PRIMARY}</Text>
                </View>

                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{URGENT_CARE}:</Text>
                  <Text style={styles.fieldText}>{PRIMARY}</Text>
                </View>
              </View>

              <View style={styles.fieldRow2}>
                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{ATTENDING}:</Text>
                  <Text style={styles.fieldText}>Dr. {doctorFullName}</Text>
                </View>

                <View style={styles.fieldRow3}>
                  <Text style={styles.fieldTitle}>{TEL}:</Text>
                  <Text style={styles.fieldText}>{formatPhone(facilityPhone)}</Text>
                </View>
              </View>

              <View style={[styles.fieldRow2, styles.w100]}>
                <Text style={styles.fieldTitle}>{ADDRESS}:</Text>
                <Text style={styles.fieldText}>{formatAddress(address, city, state, zipCode)} </Text>
              </View>
            </View>
          </View>

          {/* 3rd-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{DIAGNOSES}</Text>
              </View>

              <View style={[styles.bgLightGrey]}>
                <Text style={styles.fieldTitle3}>{diagnoses?.map((diagnose, i) => `${diagnose?.code} ${i !== (diagnoses.length - 1) ? '|' : ''} `)}</Text>
              </View>
            </View>
          </View>

          {/* 4th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w20, styles.borderStyle, styles.borderRightWidth, styles.borderTopWidth]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{TESTS}</Text>
              </View>

              <View>
                {labTest?.map((test) => {
                  return (
                    <Text style={styles.fieldText3}>{test?.test?.component}</Text>
                  )
                })}
              </View>
            </View>

            <View style={[styles.w50, styles.borderStyle, styles.borderRightWidth, styles.borderTopWidth]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{METHOD}</Text>
              </View>

              <View>
                <Text style={styles.fieldText3}>PKamp™ Respiratory SARS-CoV-2 RT-PCR</Text>
                <Text style={styles.fieldText3}>Panel 1</Text>
              </View>
            </View>

            <View style={[styles.w30, styles.borderStyle, styles.borderTopWidth]}>
              <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{RESULTS}</Text>
              </View>

              <View>
                {labTest?.map((test) => {
                  return (
                    <View style={[styles.w100,]}>
                      <Text style={styles.fieldText3}>{test?.testObservations?.[0]?.resultValue}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>

          {/* 5th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.borderStyle, styles.borderTopWidth]}>
              <Text style={styles.paraText}>{COMMENT}:</Text>

              <Text style={styles.paraText}>
                The PKamp™ Respiratory SARS-CoV-2  RT-PCR  Panel  1  is  a  real-time  RT-PCR  multiplexed  test  intended  for  the
                simultaneous  qualitative  detection  and  differentiation  of  SARS-CoV-2,  influenza  A,  influenza  B  and/or  respiratory
                syncytial  virus  (RSV)  nucleic  acid  from  nasopharyngeal  swabs,  anterior  nasal  swabs,  and  mid-turbinate  swabs,
                collected  from  individuals  suspected  by  a  healthcare  provider  of  having  respiratory  viral  infection  consistent  with
                COVID-19.  Symptoms  of  respiratory  viral  infection  due  to  SARS-CoV-2,  influenza,  and  RSV  can  be  similar.  Testing  is
                limited to laboratories certified under the Clinical Laboratory Improvement Amendments of 1988 (CLIA), 42 U.S.C. §
                263a, that meet requirements to perform high complexity tests. The PKamp™ Respiratory SARS-CoV-2 RT-PCR Panel is
                intended for use in the detection and differentiation of SARS-CoV-2, influenza A, influenza B, and/or RSV viral RNA in
                patient specimens, and is not intended to detect influenza C. RNA from SARS-CoV-2, influenza A, influenza B, and RSV
                viruses is generally detectable in upper respiratory specimens during the acute phase of infection.
              </Text>

              <Text style={styles.paraText}>
                Positive  results  are  indicative  of  active  infection  but  do  not  rule  out  bacterial  infection  or  coinfection  with  other
                viruses  not  detected  by  the  test;  clinical  correlation  with  patient  history  and  other  diagnostic  information  is
                necessary  to  determine  patient  infection  status.  The  agent  detected  may  not  be  the  definite  cause  of  disease.
                Laboratories  within  the  United  States  and  its  territories  are  required  to  report  all  SARS-CoV-2  results  to  the
                appropriate  public  health  authorities.  Negative PKamp™ Respiratory SARS-CoV-2  RT-PCR  Panel  1  results  do  not
                preclude  SARS-CoV-2,  influenza  A,  influenza  B,  and/or  RSV  infection  and  should  not  be  used  as  the  sole  basis  for
                patient  management  decisions.  Negative  results  must  be  combined  with  clinical  observations,  patient  history,
                and/or epidemiological information.
              </Text>

              {/* <Text style={styles.paraText}>
                  For additional information, please refer to the Perkin Elmer Fact Sheet for Patients located online at:
                </Text> */}

              {/* <Text style={styles.paraText}>
                  <a href="" style={styles.colorBlue}>EUA-PerkElmer-Respanel1-ifu_1 (1).pdf</a>
                </Text> */}
            </View>
          </View>

          {/* 6th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100, styles.mt15]}>
              <Text style={styles.paraText2}>{facilityName}</Text>
              <Text style={styles.paraText2}>Tel: {formatPhone(facilityPhone)}</Text>
              <Text style={styles.paraText2}>{formatAddress(address, city, state, zipCode)}</Text>
              {/* <Text style={styles.paraText2}>Authorized by Lab Director: Sarwat W. Siddiqui, MD</Text> */}
            </View>
          </View>

          <Image src={barcode} />
        </View>
      </Page>
    </Document>
  )
}

export default ResultDoc