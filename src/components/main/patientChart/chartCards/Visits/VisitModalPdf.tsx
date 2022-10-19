import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  ALLERGIES_TEXT, APPOINTMENT_DATE, ASSESSMENT_PLAN, DASHES, DIAGNOSES, DOB_TEXT, EXPRESS_HEALTHCARE_URL, FACILITY, FOLLOWUP, HISTORY_OF_PATIENT_ILLNESS, INTAKE, LAB_ORDER, MEDICATIONS,
  NO_DATA_FOUND,
  PATIENT_ID,
  PHONE,
  REASON_FOR_VISIT, REVIEW_OF_SYSTEM_TEXT, SEX, TRIAGE_NOTES, VITALS_TEXT
} from '../../../../../constants';
import { Genderidentity, PatientVitals } from '../../../../../generated/graphql';
import { VisitModalPdfProps } from '../../../../../interfacesTypes';
import { calculateAge, formatAddress, formatPhone, formatValue, getAppointmentDateWithDay, getStandardTime } from '../../../../../utils';

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
  w20: {
    width: '20%',
  },
  fieldTitleHeader: {
    padding: '0px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  w40: {
    width: '40%',
  },
  fieldRow2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoImage: {
    // width: '100px',
    margin: '0px 10px',
    maxWidth: '100%',
    maxHeight: '90px',
    objectFit: 'contain',
    overflow: 'hidden',
  },
});

function VisitModalPdf({ assessmentProblems, patientChartingReview, patientIllnessHistory, reviewOfSystem, triageNotes, appointmentInfo }: VisitModalPdfProps) {
  const { patientAllergies, patientMedications, patientProblems, patientVitals, } = patientChartingReview || {}
  const { patient, id: appointmentId, scheduleStartDateTime, appointmentDate } = appointmentInfo || {}
  const { firstName, lastName, dob, genderIdentity, patientRecord, facility } =
    patient || {}
  const { practice, contacts: facilityContacts } = facility || {}
  const { phone, address, address2, city, state, zipCode } = facilityContacts?.find((facilityContact) => facilityContact?.primaryContact) || {}
  const { name: practiceName, attachments } = practice || {}
  const { url } = attachments?.[0] || {}

  const latestPatientVitals = patientVitals?.sort((a, b) => Number(b?.createdAt || 0) - Number(a?.createdAt || 0))?.[0] || {}

  const singlePatientProblems = patientProblems?.filter((problem, index, self) => index === self.findIndex((t) => (
    t.ICDCode?.code === problem.ICDCode?.code
  )))

  return (
    <Document>
      <Page style={styles.page} size="A3" wrap>
        <View style={styles.table}>
          <View style={[styles.tableRow]}>
            <View style={[styles.w20]}>
              <Text style={[styles.fieldTitleHeader]}>{'PATIENT'}</Text>
              <Text style={styles.fieldText}>{`${firstName} ${lastName}`}</Text>

              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldTitle]}>{DOB_TEXT}</Text>
                <Text style={styles.fieldText}>{dob}</Text>
              </View>

              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldTitle]}>{'AGE'}</Text>
                <Text style={styles.fieldText}>{calculateAge(dob || '')}</Text>
              </View>

              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldTitle]}>{SEX}</Text>
                <Text style={styles.fieldText}>{genderIdentity === Genderidentity.DeclineToSpecify ? 'None' : formatValue(genderIdentity || '')}</Text>
              </View>

              <View style={styles.fieldRow3}>
                <Text style={[styles.fieldTitle]}>{PATIENT_ID}</Text>
                <Text style={styles.fieldText}>{patientRecord}</Text>
              </View>
            </View>

            <View style={[styles.w40, styles.fieldRow2,]}>
              <Image
                src={url ? url + '?noCache=randomString' : EXPRESS_HEALTHCARE_URL}
                style={styles.logoImage}
              />
            </View>

            <View style={[styles.w40]}>
              <Text style={styles.fieldTitleHeader}>{FACILITY}</Text>
              <Text style={styles.fieldText}>{practiceName}</Text>

              <View style={styles.fieldRow3}>
                <Text style={styles.fieldTitle}>{PHONE}</Text>
                <Text style={styles.fieldText}>{formatPhone(phone)}</Text>
              </View>

              <Text style={styles.fieldText}>{address}</Text>
              <Text style={styles.fieldText}>{formatAddress(address2, city, state, zipCode)}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={styles.fieldTitle}>{APPOINTMENT_DATE}</Text>
                <Text style={styles.fieldText}>{getAppointmentDateWithDay(appointmentDate || '', 'YYYY-MM-DD')}  {getStandardTime(scheduleStartDateTime || '')}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

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
          {singlePatientProblems?.length ? singlePatientProblems?.map(patientProblem => {
            const { appointmentId: problemAppointmentId, ICDCode } = patientProblem || {}
            if (problemAppointmentId === appointmentId) {
              return (
                <View style={[styles.tableRow, styles.ml10]}>
                  <View style={[styles.w100]}>
                    <View style={styles.fieldRow3}>
                      <Text style={styles.fieldText}>{ICDCode?.description || DASHES}</Text>
                    </View>
                  </View>
                </View>
              )
            }
            return <Text></Text>
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {/* 1st-row */}
          <View style={styles.tableRow}>
            <View style={[styles.w100]}>
              <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                <Text style={styles.fieldTitle2}>{TRIAGE_NOTES}</Text>
              </View>
            </View>
          </View>

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '10px' }}>
            </View>
          </View>

          {/* 1.1-row */}
          {triageNotes?.length ? triageNotes?.map(triageNote => {
            const { notes } = triageNote || {}
            return (
              <View style={[styles.tableRow, styles.ml10]} >
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldText}>{notes || DASHES}</Text>
                  </View>
                </View>
              </View>
            )
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}

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
          {Object.keys(latestPatientVitals as PatientVitals).map(vital => {
            if (['patientTemperature', 'systolicBloodPressure', 'diastolicBloodPressure', 'respiratoryRate', 'PatientBMI'].includes(vital)) {
              return (
                <View style={[styles.tableRow, styles.ml10]}>
                  <View style={[styles.w100]}>
                    <View style={styles.fieldRow3}>
                      <Text style={[styles.fieldText, styles.w200px]}>{vital}</Text>
                      <Text style={[styles.fieldText, styles.colorGray, styles.ml10]}>{(latestPatientVitals as PatientVitals)[vital as keyof PatientVitals] || DASHES}</Text>
                    </View>
                  </View>
                </View>
              )
            }

            return <Text></Text>
          })
          }
          {/* spacing-row */}
          < View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]} >
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
          {singlePatientProblems?.length ?
            singlePatientProblems?.map(problem => {
              const { ICDCode } = problem || {}
              const { description } = ICDCode || {}
              return (
                <View style={[styles.tableRow, styles.ml10]}>
                  <View style={[styles.w100]}>
                    <View style={styles.fieldRow3}>
                      <Text style={[styles.fieldText]}>{description || DASHES}</Text>
                    </View>
                  </View>
                </View>
              )
            }) : <View style={[styles.w100]}>
              <View style={styles.fieldRow3}>
                <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
              </View>
            </View>
          }

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
          {patientMedications?.length ? patientMedications?.map(patientMedication => {
            const { medication } = patientMedication || {}
            const { fullName } = medication || {}
            return (
              <View style={[styles.tableRow, styles.ml10]}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldText]}>{fullName || DASHES}</Text>
                  </View>
                </View>
              </View>
            )
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}


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
          {patientAllergies?.length ? patientAllergies?.map(patientAllergy => {
            const { allergy } = patientAllergy || {}
            const { name } = allergy || {}
            return (
              <View style={[styles.tableRow, styles.ml10]}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldText, styles.w200px]}>{name || DASHES}</Text>
                  </View>
                </View>
              </View>
            )
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}


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
          {assessmentProblems?.length ? assessmentProblems?.map((assessmentProblem) => {
            const { icdCodes, medications, tests } = assessmentProblem || {}
            const { code, description } = icdCodes || {}
            return (
              <>
                <View style={[styles.tableRow, styles.ml10]}>
                  <View style={[styles.w100]}>
                    <View style={[styles.fieldRow3,]}>
                      <Text style={styles.fieldTitle}>{`${description} | ${code} `}</Text>
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

                    {
                      medications?.map(medication => {
                        const { fullName } = medication || {}
                        return (
                          <View style={[styles.fieldRow3, styles.ml20]}>
                            <Text style={[styles.fieldText, styles.colorGray]}>
                              {fullName}
                            </Text>
                          </View>
                        )
                      })
                    }
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={{ height: '10px' }}>
                  </View>
                </View>

                {/* 6.1-row */}
                <View style={[styles.tableRow, styles.ml10]}>
                  <View style={[styles.w100]}>
                    <View style={[styles.fieldRow3, styles.ml15]}>
                      <Text style={[styles.fieldText, styles.w200px]}>{LAB_ORDER}</Text>
                    </View>

                    {
                      tests?.map(test => {
                        const { component } = test || {}
                        return (
                          <View style={[styles.fieldRow3, styles.ml20]}>
                            <Text style={[styles.fieldText, styles.colorGray]}>
                              {component}
                            </Text>
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              </>
            )
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}

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
          {patientIllnessHistory?.answers?.length ? patientIllnessHistory?.answers?.map(answerInfo => {
            const { answer, value } = answerInfo || {}
            const { name } = answer || {}
            const [first, second] = name?.split('fill') || []

            return (
              <View style={[styles.tableRow, styles.ml10]}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldText}>{`${first} ${value || ''} ${second || ''}`}</Text>
                  </View>
                </View>
              </View>
            )
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}


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
          {reviewOfSystem?.answers?.length ? reviewOfSystem?.answers?.map(answerInfo => {
            const { answer, value } = answerInfo || {}
            const { name } = answer || {}
            const [first, second] = name?.split('fill') || []

            return (
              <View style={[styles.tableRow, styles.ml10]}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={styles.fieldText}>{`${first} ${value || ''} ${second || ''}`}</Text>
                  </View>
                </View>
              </View>
            )
          }) : <View style={[styles.w100]}>
            <View style={styles.fieldRow3}>
              <Text style={styles.fieldText}>{NO_DATA_FOUND}</Text>
            </View>
          </View>}

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
                <Text style={styles.fieldText}>{'Patient will return to the office as needed.'}</Text>
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