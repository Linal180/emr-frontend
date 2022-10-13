import React from 'react'
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { VisitModalPdfProps } from '../../../../../interfacesTypes';
import { 
  ALLERGIES_TEXT, ASSESSMENT_PLAN, DIAGNOSES, FOLLOWUP, HISTORY_OF_PATIENT_ILLNESS, INTAKE, MEDICATIONS, 
  REASON_FOR_VISIT, REVIEW_OF_SYSTEM_TEXT, VITALS_TEXT, 
} from '../../../../../constants';

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
  fieldTitle: {
    padding: '2px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  fieldText: {
    padding: '2px 5px',
    wordBreak: 'break-all !important',
    whiteSpace: 'wrap !important',
    fontSize: '12px',
  },
  fieldTitle2: {
    padding: '5px',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderTopWidth: 1,
  },
  borderBottomWidth: {
    borderBottomWidth: 1,
  },
  w200px: {
    width: '200px',
  },
  w100: {
    width: '100%',
  },
  bgLightGrey: {
    backgroundColor: '#eeeeee',
  },
  colorGray: {
    color: '#5E6278',
  },
  ml5: {
    marginLeft: '5px',
  },
  ml10: {
    marginLeft: '10px',
  },
  ml15: {
    marginLeft: '15px',
  },
  ml20: {
    marginLeft: '20px',
  },
});

function VisitModalPdf({ assessmentProblems, patientChartingReview, patientIllnessHistory, reviewOfSystem }: VisitModalPdfProps) {
  return (
    <Document>
      <Page style={styles.page} size="A3" wrap>
        <View style={styles.table}>
          {/* 1st-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{REASON_FOR_VISIT}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          {/* 1.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={styles.fieldText}>{'Severe acute respiratory syndrome coronavirus 2 RNA'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {/* 2nd-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{INTAKE}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 2nd-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.fieldRow3,]}>
                <Text style={[styles.fieldTitle2, styles.ml5]}>{VITALS_TEXT}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 2.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldText, styles.w200px]}>{'Patient Temperature'}</Text>
                <Text style={[styles.fieldText, styles.colorGray, styles.ml10]}>{'--'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          <View style={[styles.tableRow]}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 3rd-row */}
          <View style={[styles.tableRow, styles.ml5]}>
            <View style={[styles.w100]}>
              <View style={[styles.fieldRow3,]}>
                <Text style={styles.fieldTitle2}>{DIAGNOSES}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 3.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldText, styles.w200px]}>{'Severe acute respiratory syndrome coronavirus 2 RNA'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          <View style={[styles.tableRow]}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 4th-row */}
          <View style={[styles.tableRow, styles.ml5]}>
            <View style={[styles.w100]}>
              <View style={[styles.fieldRow3,]}>
                <Text style={styles.fieldTitle2}>{MEDICATIONS}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 4.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldText, styles.w200px]}>{'0.05 ML brolucizumab-dbll 120 MG/ML Injection'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          <View style={[styles.tableRow]}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 5th-row */}
          <View style={[styles.tableRow, styles.ml5]}>
            <View style={[styles.w100]}>
              <View style={[styles.fieldRow3,]}>
                <Text style={styles.fieldTitle2}>{ALLERGIES_TEXT}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 5.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldText, styles.w200px]}>{'Aspartame and Phenylalanine'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={[styles.tableRow]}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {/* 6th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{ASSESSMENT_PLAN}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          {/* 6th-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={[styles.fieldRow3,]}>
                <Text style={styles.fieldTitle}>{'Severe acute  respiratory syndrome coronavirus 2 RNA | 124041100000107'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '5px' }}>
            </View>
          </View>

          {/* 6.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={[styles.fieldRow3, styles.ml15]}>
                <Text style={[styles.fieldText, styles.w200px]}>{'Medications'}</Text>
              </View>

              <View style={[styles.fieldRow3, styles.ml20]}>
                <Text style={[styles.fieldText, styles.colorGray]}>
                  0.05 ML Quidel solona SARS-CoV2
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.tableRow]}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {/* 7th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{HISTORY_OF_PATIENT_ILLNESS}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          {/* 7.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={styles.fieldText}>{'patient DOES have separate bedroom and bathroom for patient'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {/* 8th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{REVIEW_OF_SYSTEM_TEXT}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          {/* 8.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={styles.fieldText}>{'patient DOES have separate bedroom and bathroom for patient'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {/* 9th-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{FOLLOWUP}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          {/* 9.1-row */}
          <View style={[styles.tableRow, styles.ml10]}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={styles.fieldText}>{'patient will return to the office as needed.'}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default VisitModalPdf