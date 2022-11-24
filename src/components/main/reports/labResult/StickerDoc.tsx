import { Document, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";
import QRCode from 'qrcode'
import { useEffect, useState } from "react";

import { ADD_TEST_SPECIMEN_ROUTE, COLLECTED_DATE, DOB_TEXT, NAME, TEST } from "../../../../constants";
import { LabTestPayload } from "../../../../generated/graphql";
import { getFormatDateString } from "../../../../utils";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 15,
  },
  table: {
    // width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 12,
    width: '100%',
    overflow: 'hidden',
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    padding: '15px 0',
  },
  fieldTitle: {
    minHeight: '30px',
    minWidth: '20%',
    padding: '7px',
    fontWeight: 'bold',
  },
  fieldText: {
    minHeight: '30px',
    minWidth: '80%',
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
    justifyContent: 'flex-start',
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
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  const { patient, test, testDate } = labTest || {}
  const { firstName, lastName, dob, id } = patient || {}
  const patientFullName = `${firstName} ${lastName}`
  const canvas = document.createElement('canvas');
  const link = `${process.env.REACT_APP_URL}${ADD_TEST_SPECIMEN_ROUTE}/${id}/${labTest?.id}`
  JsBarcode(canvas, link);
  const barcode = canvas.toDataURL();
  useEffect(() => {
    QRCode.toDataURL(link, function (err, uri) {
      if (!err) {
        setQrCodeUrl(uri)
      }
    });
  }, [link])



  return (
    <Document title={`test_${test?.component}`}>
      <Page style={styles.page} size="A4" wrap>
        <View style={styles.table}>
          {/* 2nd-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100, styles.borderStyle,]}>
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
              <View style={styles.fieldRow1}>
                <Text style={styles.fieldTitle}>You can upload specimen by using this <Link src={link} style={{marginRight: 2}}>
                  link
                </Link>
                or by scanning the QR or Bar code.
                </Text>
              </View>
            </View>
          </View>

          <Image src={qrCodeUrl} style={[styles.w20, styles.mt15]} />

          <Image src={barcode} />


        </View>
      </Page>
    </Document>
  )
}

export default StickerDoc