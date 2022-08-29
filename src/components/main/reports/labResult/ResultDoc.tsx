import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import Logo from "../../../../assets/images/aimed-logo.png";
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
    width: '80px',
    margin: '10px',
  }
});

const ResultDoc = ({ labTest }: { labTest: LabTestsPayload['labTests'] }) => {
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
              <Image src={Logo} style={styles.logoImage} />
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