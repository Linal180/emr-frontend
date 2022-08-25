import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import { ADD_TEST_SPECIMEN_ROUTE, COLLECTED_DATE, DOB_TEXT, NAME, PATIENT, TEST } from "../../../../constants";
import { LabTestPayload } from "../../../../generated/graphql";
import { getFormatDateString } from "../../../../utils";

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

const StickerDoc = ({ labTest }: { labTest: LabTestPayload['labTest'] }) => {
  const { patient, test, testDate } = labTest || {}
  const { firstName, lastName, dob, id } = patient || {}
  const patientFullName = `${firstName} ${lastName}`
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, `${process.env.REACT_APP_URL}${ADD_TEST_SPECIMEN_ROUTE}/${id}/${labTest?.id}`);
  const barcode = canvas.toDataURL();

  return (
    <Document title={`test_${test?.component}`}>
      <Page style={styles.page} size="A3" wrap>
        <View style={styles.table}>
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
                <Text style={styles.fieldTitle}>{TEST}:</Text>
                <Text style={styles.fieldText}>{test?.component}</Text>
              </View>

              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>{COLLECTED_DATE}</Text>
                <Text style={styles.fieldText}>{testDate}</Text>
              </View>
            </View>
          </View>

          <Image src={barcode} />
        </View>
      </Page>
    </Document>
  )
}

export default StickerDoc