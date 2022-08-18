import {
  Document, Image, Page, PDFViewer, StyleSheet, View, Text
} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import { useCallback, useEffect, useState } from "react";
import { LabTestsPayload, useFindLabResultInfoLazyQuery } from "../../../../generated/graphql";
import Logo from "../../../../assets/images/aimed-logo.png";

// Create styles
const styles = StyleSheet.create({
  page: { 
    flexDirection: "column", padding: 15 
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 14,
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

// Create Document Component
function LabResultDetail() {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, "https://www.npmjs.com/package/jsbarcode");
  const barcode = canvas.toDataURL();

  const [labTest, setLabTest] = useState<LabTestsPayload['labTests']>()

  const [findLabResultInfo] = useFindLabResultInfoLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLabTest(null)
    },

    onCompleted(data) {
      const { findLabResultInfo } = data || {};

      if (findLabResultInfo) {
        const { labTests } = findLabResultInfo
        setLabTest(labTests as LabTestsPayload['labTests'])
      }
    }
  });

  const fetchLabTests = useCallback(async () => {
    try {
      await findLabResultInfo({
        variables: {
          orderNumber: 'TW106225'
        }
      });
    } catch (error) { }
  }, [findLabResultInfo])

  useEffect(() => {
    fetchLabTests()
  }, [fetchLabTests])

  console.log("labTest", labTest)

  const { patient, primaryProvider, diagnoses } = labTest?.[0] || {}
  const { firstName, lastName, dob, gender, id, patientRecord, contacts, facility } = patient || {}
  const primaryContact = contacts?.find((contact) => contact?.primaryContact)
  const { phone } = primaryContact || {}
  const { contacts: facilityContacts } = facility || {}
  const facilityPrimaryContact = facilityContacts?.find((facilityContact) => facilityContact?.primaryContact)
  const { phone: facilityPhone, address } = facilityPrimaryContact || {}
  const { firstName: dFirstName, lastName: dLastName } = primaryProvider || {}
  const doctorFullName = `${dFirstName} ${dLastName}`
  const patientFullName = `${firstName} ${lastName}`

  return (
    <PDFViewer style={{ width: "100%", height: `calc(100vh - 140px)`, }}>
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
                  <Text style={styles.fieldTitle2}>SPECIMEN</Text>
                </View>

                <View style={styles.fieldRow2}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Patient No:</Text>
                    <Text style={styles.fieldText}></Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Final Report:</Text>
                    <Text style={styles.fieldText}></Text>
                  </View>
                </View>

                <View style={styles.fieldRow2}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Collected Date:</Text>
                    <Text style={styles.fieldText}></Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Received Date:</Text>
                    <Text style={styles.fieldText}></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 2nd-row */}
            <View style={styles.tableRow}>
              <View style={[styles.w30, styles.borderStyle, styles.borderRightWidth, styles.borderTopWidth]}>
                <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                  <Text style={styles.fieldTitle2}>PATIENT</Text>
                </View>

                <View style={styles.fieldRow1}>
                  <Text style={styles.fieldTitle}>Name:</Text>
                  <Text style={styles.fieldText}>aimed</Text>
                </View>

                <View style={styles.fieldRow1}>
                  <Text style={styles.fieldTitle}>DOB:</Text>
                  <Text style={styles.fieldText}>12-21-1991</Text>
                </View>

                <View style={styles.fieldRow1}>
                  <Text style={styles.fieldTitle}>Gender:</Text>
                  <Text style={styles.fieldText}>Male</Text>
                </View>

                <View style={styles.fieldRow1}>
                  <Text style={styles.fieldTitle}>ID #:</Text>
                  <Text style={styles.fieldText}></Text>
                </View>

                <View style={styles.fieldRow1}>
                  <Text style={styles.fieldTitle}>Tel:</Text>
                  <Text style={styles.fieldText}>36-9587-20</Text>
                </View>
              </View>

              <View style={[styles.w70, styles.borderStyle, styles.borderTopWidth]}>
                <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                  <Text style={styles.fieldTitle2}>PHYSICIAN</Text>
                </View>

                <View style={[styles.fieldRow2, styles.w100]}>
                  <Text style={styles.fieldTitle}>Facility:</Text>
                  <Text style={styles.fieldText}>College Park Medical Center</Text>
                </View>

                <View style={styles.fieldRow2}>
                  <Text style={styles.fieldTitle}>CLIA Number:</Text>
                  <Text style={styles.fieldText}>21D2136938</Text>
                </View>

                <View style={styles.fieldRow2}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Primary Care:</Text>
                    <Text style={styles.fieldText}>Primary</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Urgent Care:</Text>
                    <Text style={styles.fieldText}>Primary</Text>
                  </View>
                </View>

                <View style={styles.fieldRow2}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Attending:</Text>
                    <Text style={styles.fieldText}>Dr Jamal Fadul</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldTitle}>Tel:</Text>
                    <Text style={styles.fieldText}>(301)345-4400</Text>
                  </View>
                </View>

                <View style={[styles.fieldRow2, styles.w100]}>
                  <Text style={styles.fieldTitle}>Address:</Text>
                  <Text style={styles.fieldText}>4701 Melbourne Place, College Park, Maryland 20740 </Text>
                </View>
              </View>
            </View>

            {/* 3rd-row */}
            <View style={styles.tableRow}>
              <View style={[styles.w100]}>
                <View style={[styles.bgGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                  <Text style={styles.fieldTitle2}>DIAGNOSIS</Text>
                </View>

                <View style={[styles.bgLightGrey]}>
                  <Text style={styles.fieldTitle3}>Nasopharyngeal Swab Test:  S A R S - C o V - 2 / F l u / R S V</Text>
                </View>
              </View>
            </View>

            {/* 4th-row */}
            <View style={styles.tableRow}>
              <View style={[styles.w20, styles.borderStyle, styles.borderRightWidth, styles.borderTopWidth]}>
                <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                  <Text style={styles.fieldTitle2}>VIRAL STRAIN</Text>
                </View>

                <View>
                  <Text style={styles.fieldText3}>SARS-CoV-2</Text>
                  <Text style={styles.fieldText3}>Flu-A</Text>
                  <Text style={styles.fieldText3}>Flu-B</Text>
                  <Text style={styles.fieldText3}>RSV</Text>
                </View>
              </View>

              <View style={[styles.w50, styles.borderStyle, styles.borderRightWidth, styles.borderTopWidth]}>
                <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                  <Text style={styles.fieldTitle2}>METHOD</Text>
                </View>

                <View>
                  <Text style={styles.fieldText3}>PKamp™ Respiratory SARS-CoV-2 RT-PCR</Text>
                  <Text style={styles.fieldText3}>Panel 1</Text>
                </View>
              </View>

              <View style={[styles.w30, styles.borderStyle, styles.borderTopWidth]}>
                <View style={[styles.bgGrey, styles.borderStyle, styles.borderBottomWidth]}>
                  <Text style={styles.fieldTitle2}>VIRAL STRAIN</Text>
                </View>

                <View>
                  <View style={styles.fieldRow1}>
                    <Text style={styles.fieldTitle}>SARS-CoV-2:</Text>
                    <Text style={styles.fieldText2}>12-21-1991</Text>
                  </View>

                  <View style={styles.fieldRow1}>
                    <Text style={styles.fieldTitle}>Flu-A:</Text>
                    <Text style={styles.fieldText2}></Text>
                  </View>

                  <View style={styles.fieldRow1}>
                    <Text style={styles.fieldTitle}>Flu-B:</Text>
                    <Text style={styles.fieldText2}></Text>
                  </View>

                  <View style={styles.fieldRow1}>
                    <Text style={styles.fieldTitle}>RSV:</Text>
                    <Text style={styles.fieldText2}></Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 5th-row */}
            <View style={styles.tableRow}>
              <View style={[styles.borderStyle, styles.borderTopWidth]}>
                <Text style={styles.paraText}>COMMENT:</Text>

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

                <Text style={styles.paraText}>
                  For additional information, please refer to the Perkin Elmer Fact Sheet for Patients located online at:
                </Text>

                <Text style={styles.paraText}>
                  <a href="" style={styles.colorBlue}>EUA-PerkElmer-Respanel1-ifu_1 (1).pdf</a>
                </Text>
              </View>
            </View>

            {/* 6th-row */}
            <View style={styles.tableRow}>
              <View style={[styles.w100, styles.mt15]}>
                <Text style={styles.paraText2}>College Park Medical Center</Text>
                <Text style={styles.paraText2}>Tel: (301)345-4400</Text>
                <Text style={styles.paraText2}>4701 Melbourne Place, College Park, Maryland 20740</Text>
                <Text style={styles.paraText2}>Authorized by Lab Director: Sarwat W. Siddiqui, MD</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
export default LabResultDetail;
