import {
  Document, Image, Page, PDFViewer, StyleSheet, View
} from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import { useCallback, useEffect, useState } from "react";
import { LabTestsPayload, useFindLabResultInfoLazyQuery } from "../../../../generated/graphql";
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#d11fb6",
    color: "white",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  viewer: {
    width: "100%", //the pdf viewer will take up all of the width and height
    height: "100%",
  },
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
    <PDFViewer style={{ width: "100%", height: 600 }}>
      <Document>
        <Page size="A4">
          <View>
            <Image src={barcode} />
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
export default LabResultDetail;