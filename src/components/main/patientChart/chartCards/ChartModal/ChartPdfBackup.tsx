import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import Logo from "../../../../../assets/images/aimed-logo.png";
import {
  ACTIVE, ACUITY, ADDRESS, ADDRESS_LINE_1, ADDRESS_LINE_2, ASSOCIATED_DX, BLOOD_PRESSURE_TEXT, CITY, LANGUAGE, START,
  CONTACT_INFORMATION, CURRENT, DIAGNOSES, DOB, DOB_TEXT, DRUG_ALLERGIES, EMAIL, ENVIRONMENTAL_ALLERGIES, ETHNICITY,
  FACILITY, FAMILY_HISTORY_TEXT, FAMILY_INFORMATION, FIRST_NAME, FOOD_ALLERGIES, HISTORICAL, HOME_PHONE, LAST_NAME,
  MEDICATIONS, MIDDLE_NAME, MOBILE_PHONE, NEXT_OF_KIN, NOTES, NO_DRUG_ALLERGIES_RECORDED, ONSET_DATE, PHONE, SSN,
  NO_ENVIRONMENTAL_ALLERGIES_RECORDED, NO_FOOD_ALLERGIES_RECORDED, ONSET, ONSET_AGE_TEXT, PRN, PROBLEM_TEXT, SIG,
  PROCEDURE_TEXT, RACE, RELATIONSHIP_TO_PATIENT, RELATIVE, RESPIRATORY_RATE_TEXT, SEVERITY_REACTIONS, START_STOP,
  STATE, STATUS, SURGERY_DATE, SURGICAL_HISTORY_TEXT, TEMPERATURE_TEXT, TRIAGE_NOTES, VITALS_TEXT, ZIP_CODE, SEX,
} from "../../../../../constants";
import { AllergyType, ContactType, Genderidentity, ProblemType } from "../../../../../generated/graphql";
import { PatientChartingInfo } from "../../../../../interfacesTypes";
import { calculateAge, formatAddress, formatPhone, formatValue, getFormatDateString } from "../../../../../utils";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column", padding: 15
  },
  table: {
    width: "auto",
    // borderStyle: "solid",
    // borderWidth: 1,
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
  },
  fieldTitleHeader: {
    padding: '0px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  fieldTitle: {
    padding: '2px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '10px',
  },
  fieldText: {
    padding: '2px 5px',
    wordBreak: 'break-all !important',
    whiteSpace: 'wrap !important',
    fontSize: '10px',
  },
  fieldTitle2: {
    padding: '5px',
    fontSize: 12,
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
  borderLeftWidth: {
    borderLeftWidth: 1,
  },
  borderRightWidth: {
    borderRightWidth: 1,
  },
  w60px: {
    minWidth: '60px',
  },
  w100px: {
    minWidth: '100px',
  },
  w150px: {
    minWidth: '150px',
  },
  w15: {
    width: '15%',
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
  w55: {
    width: '55%',
  },
  w60: {
    width: '60%',
  },
  w70: {
    width: '70%',
  },
  w100: {
    width: '100%',
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
  fieldRow2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '50px',
    margin: '5px 10px',
    maxWidth: '100%',
    objectFit: 'contain',
    overflow: 'hidden',
  }
});

const ChartPdf = ({ patientChartInfo, modulesToPrint }: { patientChartInfo: PatientChartingInfo | null, modulesToPrint: string[] }) => {
  const { patientInfo, patientProblems, patientAllergies, patientMedications, patientVitals, surgicalHistories, triageNotes, familyHistories } = patientChartInfo || {}
  const { firstName, lastName, middleName, dob, genderIdentity, patientRecord, facility, ssn, race, ethnicity, language, contacts: patientContacts, email } =
    patientInfo || {}
  const { phone: patientPhone, address: patientAddress, address2: patientAddress2, city: patientCity, state: patientState, zipCode: patientZipCode, mobile } =
    patientContacts?.find((patientContact) => patientContact?.primaryContact) || {}

  const { relationship, phone: nextOfKinPhone, address: nextAddress, city: nextCity, state: nextState, zipCode: nextZipCode, name: nextName } =
    patientContacts?.find((patientContact) => patientContact?.contactType === ContactType.NextOfKin) || {}
  const { practice, contacts: facilityContacts } = facility || {}
  const { phone, address, address2, city, state, zipCode } = facilityContacts?.find((facilityContact) => facilityContact?.primaryContact) || {}
  const { name: practiceName, attachments } = practice || {}
  const { url } = attachments?.[0] || {}

  const activeProblems = patientProblems?.filter((problem) => problem.problemType === ProblemType.Active) || []
  const historicProblems = patientProblems?.filter((problem) => problem.problemType === ProblemType.Historic) || []

  const drugAllergies = patientAllergies?.filter((allergy) => allergy.allergy?.allergyType === AllergyType.Drug)
  const foodAllergies = patientAllergies?.filter((allergy) => allergy.allergy?.allergyType === AllergyType.Food)
  const environmentAllergies = patientAllergies?.filter((allergy) => allergy.allergy?.allergyType === AllergyType.Environment)

  return (
    <Document>
      <Page style={styles.page} size="A3" wrap>
        <View style={styles.table}>
          {/* 1st-row */}
          <View style={[styles.tableRow]}>
            <View style={[styles.w30,]}>
              <Text style={[styles.fieldTitleHeader,]}>{'PATIENT'}</Text>
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
                <Text style={[styles.fieldTitle]}>{PRN}</Text>
                <Text style={styles.fieldText}>{patientRecord}</Text>
              </View>
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

            <View style={[styles.w30, styles.fieldRow2,]}>
              <Image
                src={url ? url + '?noCache=randomString' : Logo}
                style={styles.logoImage}
              />
            </View>
          </View>

          {modulesToPrint.includes('Patient Demographics') ?
            <>
              {/* 2nd-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{'Patient identifying details and demographics'}</Text>
                  </View>
                </View>
              </View>

              {/* 2.1-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{FIRST_NAME}</Text>
                    <Text style={styles.fieldText}>{firstName}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{MIDDLE_NAME}</Text>
                    <Text style={styles.fieldText}>{middleName || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{LAST_NAME}</Text>
                    <Text style={styles.fieldText}>{lastName}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{DOB}</Text>
                    <Text style={styles.fieldText}>{dob}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{LANGUAGE}</Text>
                    <Text style={styles.fieldText}>{language || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{ETHNICITY}</Text>
                    <Text style={styles.fieldText}>{ethnicity || ''}</Text>
                  </View>
                </View>

                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{SSN}</Text>
                    <Text style={styles.fieldText}>1{ssn || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{PRN}</Text>
                    <Text style={styles.fieldText}>{patientRecord}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{RACE}</Text>
                    <Text style={styles.fieldText}>{race || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{SEX}</Text>
                    <Text style={styles.fieldText}>{genderIdentity === Genderidentity.DeclineToSpecify ? 'None' : formatValue(genderIdentity || '')}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{STATUS}</Text>
                    <Text style={styles.fieldText}>Active Patient</Text>
                  </View>
                </View>
              </View>

              {/* 3rd-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{CONTACT_INFORMATION}</Text>
                  </View>
                </View>
              </View>

              {/* 3.1-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{ADDRESS_LINE_1}</Text>
                    <Text style={styles.fieldText}>{formatAddress(patientAddress, patientCity, patientState, patientZipCode)}</Text>
                  </View>
                </View>
              </View>

              {/* 3.2-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{ADDRESS_LINE_2}</Text>
                    <Text style={styles.fieldText}>{patientAddress2 || ''}</Text>
                  </View>
                </View>
              </View>

              {/* 3.3-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{CITY}</Text>
                    <Text style={styles.fieldText}>{patientCity || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{STATE}</Text>
                    <Text style={styles.fieldText}>{patientState || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{ZIP_CODE}</Text>
                    <Text style={styles.fieldText}>{patientZipCode || ''}</Text>
                  </View>
                </View>

                <View style={[styles.w50]}>
                  {/* <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{CONTACT_BY}</Text>
                    <Text style={styles.fieldText}>-</Text>
                  </View> */}

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{HOME_PHONE}</Text>
                    <Text style={styles.fieldText}>{formatPhone(patientPhone)}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{MOBILE_PHONE}</Text>
                    <Text style={styles.fieldText}>{formatPhone(mobile)}</Text>
                  </View>
                </View>
              </View>

              {/* 3.4-row */}
              <View style={styles.tableRow}>
                <View style={styles.fieldRow3}>
                  <Text style={[styles.fieldTitle, styles.w150px]}>{EMAIL}</Text>
                  <Text style={styles.fieldText}>{email}</Text>
                </View>
              </View>

              {/* 4th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{FAMILY_INFORMATION}</Text>
                  </View>
                </View>
              </View>

              {/* 4.1-row */}
              <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{NEXT_OF_KIN}</Text>
                    <Text style={styles.fieldText}>{nextName || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{RELATIONSHIP_TO_PATIENT}</Text>
                    <Text style={styles.fieldText}>{relationship || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{PHONE}</Text>
                    <Text style={styles.fieldText}>{nextOfKinPhone || ''}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w150px]}>{ADDRESS}</Text>
                    <Text style={styles.fieldText}>{formatAddress(nextAddress, nextCity, nextState, nextZipCode)}</Text>
                  </View>
                </View>
              </View>
            </> : <View></View>}

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ minHeight: '30px' }}>
            </View>
          </View>

          {modulesToPrint.includes('Diagnoses') ?
            <>
              {/* 5th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{DIAGNOSES}</Text>
                  </View>
                </View>
              </View>

              {/* 5.1-row */}
              <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                <View style={[styles.w60]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{CURRENT}</Text>
                  {activeProblems?.length ? activeProblems?.map((problem) => {
                    const { ICDCode } = problem || {}
                    const { code, description } = ICDCode || {}
                    return (
                      <Text style={[styles.fieldText, styles.colorBlue]}>{`(${code}) ${description}`}</Text>
                    )
                  }) : <View style={styles.tableRow}>
                    <View style={[styles.w100]}>
                      <View style={[styles.borderStyle, styles.borderBottomWidth]}>
                        <Text style={styles.fieldText}>{'No Active diagnoses'}</Text>
                      </View>
                    </View>
                  </View>}
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{HISTORICAL}</Text>
                  {historicProblems?.map((problem) => {
                    const { ICDCode } = problem || {}
                    const { code, description } = ICDCode || {}
                    return (
                      <Text style={[styles.fieldText, styles.colorBlue]}>{`(${code}) ${description}`}</Text>
                    )
                  })}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ACUITY}</Text>
                  {activeProblems?.length ? activeProblems?.map((problem) => {
                    const { problemSeverity } = problem || {}
                    return (
                      <Text style={[styles.fieldText]}>{problemSeverity}</Text>
                    )
                  }) : <View style={styles.tableRow}>
                    <View style={[styles.w100]}>
                      <View style={[styles.borderStyle, styles.borderBottomWidth]}>
                        <Text style={styles.fieldText}>{"     "}</Text>
                      </View>
                    </View>
                  </View>}
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ACUITY}</Text>
                  {historicProblems?.length ? historicProblems?.map((problem) => {
                    const { problemSeverity } = problem || {}
                    return (
                      <Text style={[styles.fieldText]}>{problemSeverity}</Text>
                    )
                  }) : <View style={styles.tableRow}>
                    <View style={[styles.w100]}>
                      <View>
                        <Text style={styles.fieldText}>{"     "}</Text>
                      </View>
                    </View>
                  </View>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{START}</Text>
                  {activeProblems?.length ? activeProblems?.map((problem) => {
                    const { problemStartDate } = problem || {}
                    return (
                      <Text style={[styles.fieldText]}>{getFormatDateString(problemStartDate, "MM-DD-YYYY")}</Text>
                    )
                  }) : <View style={styles.tableRow}>
                    <View style={[styles.w100]}>
                      <View style={[styles.borderStyle, styles.borderBottomWidth]}>
                        <Text style={styles.fieldText}>{"     "}</Text>
                      </View>
                    </View>
                  </View>}
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{START}</Text>
                  {historicProblems?.length ? historicProblems?.map((problem) => {
                    const { problemStartDate } = problem || {}
                    return (
                      <Text style={[styles.fieldText]}>{getFormatDateString(problemStartDate, "MM-DD-YYYY")}</Text>
                    )
                  }) : <View style={styles.tableRow}>
                    <View style={[styles.w100]}>
                      <View style={[styles.borderStyle,]}>
                        <Text style={styles.fieldText}>{"     "}</Text>
                      </View>
                    </View>
                  </View>}
                </View>

                {/* <View style={[styles.w15]}>
              <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{STOP}</Text>
              <Text style={[styles.fieldText]}> </Text>
              <Text style={[styles.fieldText]}> </Text>
              <Text style={[styles.fieldText]}> </Text>
              <Text style={[styles.fieldText]}> </Text>
              <Text style={[styles.fieldText]}> </Text>
              <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{STOP}</Text>
            </View> */}
              </View></> : <View></View>}


          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ minHeight: '30px' }}>
            </View>
          </View>

          {modulesToPrint.includes('Allergies') ?
            <>
              {/* 6th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{DRUG_ALLERGIES}</Text>
                  </View>
                </View>
              </View>

              {/* 6.1-row */}
              <View style={[styles.tableRow,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ACTIVE}</Text>
                  {drugAllergies?.length ? drugAllergies?.map((allergyValue) => {
                    const { allergy } = allergyValue || {}
                    const { name } = allergy || {}
                    return (
                      <Text style={styles.fieldText}>{name}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}>{NO_DRUG_ALLERGIES_RECORDED}</Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{SEVERITY_REACTIONS}</Text>
                  {drugAllergies?.length ? drugAllergies?.map((allergyValue) => {
                    const { allergySeverity } = allergyValue || {}
                    return (
                      <Text style={styles.fieldText}>{allergySeverity}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ONSET}</Text>
                  {drugAllergies?.length ? drugAllergies?.map((allergyValue) => {
                    const { allergyStartDate, allergyOnset } = allergyValue || {}
                    return (
                      <Text style={styles.fieldText}>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : formatValue(allergyOnset)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* 7th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{FOOD_ALLERGIES}</Text>
                  </View>
                </View>
              </View>

              {/* 7.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ACTIVE}</Text>
                  {foodAllergies?.length ? foodAllergies?.map((allergyValue) => {
                    const { allergy } = allergyValue || {}
                    const { name } = allergy || {}
                    return (
                      <Text style={styles.fieldText}>{name}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}>{NO_FOOD_ALLERGIES_RECORDED}</Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{SEVERITY_REACTIONS}</Text>
                  {foodAllergies?.length ? foodAllergies?.map((allergyValue) => {
                    const { allergySeverity } = allergyValue || {}
                    return (
                      <Text style={styles.fieldText}>{allergySeverity}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ONSET}</Text>
                  {foodAllergies?.length ? foodAllergies?.map((allergyValue) => {
                    const { allergyStartDate, allergyOnset } = allergyValue || {}
                    return (
                      <Text style={styles.fieldText}>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : formatValue(allergyOnset)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* 8th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{ENVIRONMENTAL_ALLERGIES}</Text>
                  </View>
                </View>
              </View>

              {/* 8.1-row */}
              <View style={[styles.tableRow, styles.borderStyle, styles.borderBottomWidth]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ACTIVE}</Text>
                  {environmentAllergies?.length ? environmentAllergies?.map((allergyValue) => {
                    const { allergy } = allergyValue || {}
                    const { name } = allergy || {}
                    return (
                      <Text style={styles.fieldText}>{name}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}>{NO_ENVIRONMENTAL_ALLERGIES_RECORDED}</Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{SEVERITY_REACTIONS}</Text>
                  {environmentAllergies?.length ? environmentAllergies?.map((allergyValue) => {
                    const { allergySeverity } = allergyValue || {}
                    return (
                      <Text style={styles.fieldText}>{allergySeverity}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ONSET}</Text>
                  {environmentAllergies?.length ? environmentAllergies?.map((allergyValue) => {
                    const { allergyStartDate, allergyOnset } = allergyValue || {}
                    return (
                      <Text style={styles.fieldText}>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : formatValue(allergyOnset)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>
            </> : <View></View>
          }

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ minHeight: '30px' }}>
            </View>
          </View>

          {modulesToPrint.includes('Medications') ?
            <>
              {/* 9th-row */}
              <View style={styles.tableRow} break>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{MEDICATIONS}</Text>
                  </View>
                </View>
              </View>

              {/* 9.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ACTIVE}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { status } = patientMedication || {}
                    return <Text style={styles.fieldText}>{status}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{SIG}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { sig } = patientMedication || {}
                    return <Text style={styles.fieldText}>{sig}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{START_STOP}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { startDate, stopDate } = patientMedication || {}
                    return <Text style={styles.fieldText}>{getFormatDateString(startDate, 'MM-DD-YYYY')} / {stopDate ? getFormatDateString(stopDate, 'MM-DD-YYYY') : ""}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ASSOCIATED_DX}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { medication } = patientMedication || {}
                    const { fullName } = medication || {}
                    return <Text style={styles.fieldText}>{fullName}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>
            </> : <View></View>}

          {
            modulesToPrint.includes('Vitals') ?
              <>
                {/* 10th-row */}
                <View style={styles.tableRow}>
                  <View style={[styles.w100]}>
                    <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                      <Text style={styles.fieldTitle2}>{VITALS_TEXT}</Text>
                    </View>
                  </View>
                </View>

                {/* 10.1-row */}
                <View style={[styles.tableRow, styles.borderStyle,]}>
                  <View style={[styles.w30]}>
                    <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ONSET_DATE}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { vitalCreationDate } = patientVital || {}
                      return <Text style={styles.fieldText}>{getFormatDateString(vitalCreationDate, 'MM-DD-YYYY')}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>

                  <View style={[styles.w30]}>
                    <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{TEMPERATURE_TEXT}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { patientTemperature } = patientVital || {}
                      return <Text style={styles.fieldText}>{patientTemperature || ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>

                  <View style={[styles.w20]}>
                    <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{BLOOD_PRESSURE_TEXT}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { systolicBloodPressure, diastolicBloodPressure } = patientVital || {}
                      return <Text style={styles.fieldText}>{systolicBloodPressure ? `${systolicBloodPressure} / ${diastolicBloodPressure}` : ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>

                  <View style={[styles.w20]}>
                    <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{RESPIRATORY_RATE_TEXT}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { respiratoryRate } = patientVital || {}
                      return <Text style={styles.fieldText}>{respiratoryRate || ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>
                </View>
              </> : <View></View>
          }

          {
            modulesToPrint.includes('Triage Notes') ?
              <>
                {/* 11th-row */}
                <View style={styles.tableRow}>
                  <View style={[styles.w100]}>
                    <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                      <Text style={styles.fieldTitle2}>{TRIAGE_NOTES}</Text>
                    </View>
                  </View>
                </View>

                {/* 11.1-row */}
                <View style={[styles.tableRow, styles.borderStyle,]}>
                  <View style={[styles.w100]}>
                    <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{NOTES}</Text>
                    {triageNotes?.length ? triageNotes?.map((triageNote) => {
                      const { notes } = triageNote || {}
                      return <Text style={styles.fieldText}>{notes || ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>
                </View>
              </> : <View></View>
          }

          {modulesToPrint.includes('Family History') ?
            <>
              {/* 12th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{FAMILY_HISTORY_TEXT}</Text>
                  </View>
                </View>
              </View>

              {/* 12.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{PROBLEM_TEXT}</Text>
                  {familyHistories?.length ? familyHistories?.map((familyHistory) => {
                    const { name } = familyHistory || {}
                    return <Text style={styles.fieldText}>{name}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{RELATIVE}</Text>
                  {familyHistories?.length ? familyHistories?.map((familyHistory) => {
                    const { familyHistoryRelatives } = familyHistory || {}
                    const { relativeName } = familyHistoryRelatives?.[0] || {}
                    return <Text style={styles.fieldText}>{relativeName}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{ONSET_AGE_TEXT}</Text>
                  {familyHistories?.length ? familyHistories?.map((familyHistory) => {
                    const { familyHistoryRelatives } = familyHistory || {}
                    const { onsetAge } = familyHistoryRelatives?.[0] || {}
                    return <Text style={styles.fieldText}>{onsetAge}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{NOTES}</Text>
                  {familyHistories?.length ? familyHistories?.map((familyHistory) => {
                    const { familyHistoryRelatives } = familyHistory || {}
                    const { notes } = familyHistoryRelatives?.[0] || {}
                    return <Text style={styles.fieldText}>{notes}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>
            </> : <View></View>}

          {modulesToPrint.includes('Surgical History') ?
            <>
              {/* 12th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{SURGICAL_HISTORY_TEXT}</Text>
                  </View>
                </View>
              </View>

              {/* 12.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{PROCEDURE_TEXT}</Text>
                  {surgicalHistories?.length ? surgicalHistories?.map((surgicalHistory) => {
                    const { code, description } = surgicalHistory || {}
                    return <Text style={styles.fieldText}>{`${code} | ${description}`}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{SURGERY_DATE}</Text>
                  {surgicalHistories?.length ? surgicalHistories?.map((surgicalHistory) => {
                    const { surgeryDate } = surgicalHistory || {}
                    return <Text style={styles.fieldText}>{getFormatDateString(surgeryDate, 'MM-DD-YYYY')}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle, styles.bgLightGrey,]}>{NOTES}</Text>
                  {surgicalHistories?.length ? surgicalHistories?.map((surgicalHistory) => {
                    const { notes } = surgicalHistory || {}
                    return <Text style={styles.fieldText}>{notes}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>
            </> : <View></View>}
        </View>
      </Page>
    </Document>
  )
}

export default ChartPdf;