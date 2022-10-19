import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import {
  ACTIVE, ACUITY, ASSOCIATED_DX, BLOOD_PRESSURE_TEXT, START, CURRENT, DIAGNOSES, DOB, DOB_TEXT, DRUG_ALLERGIES,
  ENVIRONMENTAL_ALLERGIES, FACILITY, FAMILY_HISTORY_TEXT, FIRST_NAME, FOOD_ALLERGIES, HISTORICAL, LAST_NAME, SEX,
  MEDICATIONS, NOTES, NO_DRUG_ALLERGIES_RECORDED, ONSET_DATE, PHONE, NO_ENVIRONMENTAL_ALLERGIES_RECORDED, START_STOP,
  NO_FOOD_ALLERGIES_RECORDED, ONSET, ONSET_AGE_TEXT, PROBLEM_TEXT, SIG, PROCEDURE_TEXT, RELATIVE, TEMPERATURE_TEXT,
  RESPIRATORY_RATE_TEXT, SEVERITY_REACTIONS, SURGERY_DATE, SURGICAL_HISTORY_TEXT, TRIAGE_NOTES, VITALS_TEXT,
  PATIENT_ID, NO_SURGICAL_PROCEDURE_RECORDED, EXPRESS_HEALTHCARE_URL, NO_NOTES_ADDED,
} from "../../../../../constants";
import { AllergyType, Genderidentity, ProblemType } from "../../../../../generated/graphql";
import { PatientChartingInfo } from "../../../../../interfacesTypes";
import { calculateAge, formatAddress, formatPhone, formatValue, getFormatDateString } from "../../../../../utils";

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
  fieldTitleHeader: {
    padding: '0px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  fieldTitle: {
    padding: '2px 5px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  fieldTitle3: {
    padding: '2px 5px',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  fieldRow3: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  alignCenter: {
    alignItems: 'center',
    border: '1px solid red',
  },
  rowView: {
    display: "flex",
    flexDirection: "row"
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
  w10: {
    width: '10%',
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
  colorRed: {
    color: 'red',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  borderRed: {
    border: '1px solid red',
  }
});

const ChartPdf = ({ patientChartInfo, modulesToPrint }: { patientChartInfo: PatientChartingInfo | null, modulesToPrint: string[] }) => {
  const { patientInfo, patientProblems, patientAllergies, patientMedications, patientVitals, surgicalHistories, triageNotes, familyHistories } = patientChartInfo || {}
  const { firstName, lastName, dob, genderIdentity, patientRecord, facility } =
    patientInfo || {}
  // const { address: patientAddress, address2: patientAddress2, city: patientCity, state: patientState, zipCode: patientZipCode, mobile } =
  //   patientContacts?.find((patientContact) => patientContact?.primaryContact) || {}

  // const { relationship, phone: nextOfKinPhone, address: nextAddress, city: nextCity, state: nextState, zipCode: nextZipCode, name: nextName } =
  //   patientContacts?.find((patientContact) => patientContact?.contactType === ContactType.NextOfKin) || {}
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
            <View style={[styles.w20,]}>
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

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {modulesToPrint.includes('Patient Demographics') ?
            <>
              {/* 2nd-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{'Patient Identifying Details and Demographics'}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
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
                    <Text style={[styles.fieldTitle, styles.w100px]}>{LAST_NAME}</Text>
                    <Text style={styles.fieldText}>{lastName}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{DOB}</Text>
                    <Text style={styles.fieldText}>{dob}</Text>
                  </View>
                </View>

                <View style={[styles.w50]}>
                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{PATIENT_ID}</Text>
                    <Text style={styles.fieldText}>{patientRecord}</Text>
                  </View>

                  <View style={styles.fieldRow3}>
                    <Text style={[styles.fieldTitle, styles.w100px]}>{SEX}</Text>
                    <Text style={styles.fieldText}>{genderIdentity === Genderidentity.DeclineToSpecify ? 'None' : formatValue(genderIdentity || '')}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '20px' }}>
                </View>
              </View>

            </> : <View></View>}

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

                {/* spacing-row */}
                <View style={styles.tableRow}>
                  <View style={{ height: '10px' }}>
                  </View>
                </View>

                {/* 11.1-row */}
                <View style={[styles.tableRow, styles.borderStyle,]}>
                  <View style={[styles.w100]}>
                    {triageNotes?.length ? triageNotes?.map((triageNote) => {
                      const { notes } = triageNote || {}
                      return <Text style={styles.fieldText}>{notes || ''}</Text>
                    }) : <Text style={[styles.fieldTitle3]}>{NO_NOTES_ADDED}</Text>}
                  </View>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>
                </View>
              </> : <View></View>
          }

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
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

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 5.1-row */}
              <View style={[styles.tableRow, styles.borderStyle]}>
                <View style={[styles.w60]}>
                  <Text style={[styles.fieldTitle2]}>{CURRENT}</Text>
                  {activeProblems?.length ? activeProblems?.map((problem) => {
                    const { ICDCode } = problem || {}
                    const { code, description } = ICDCode || {}
                    return (
                      <Text style={[styles.fieldText]}>{`(${code}) ${description}`}</Text>
                    )
                  }) : <View style={[styles.tableRow]}>
                    <View style={[styles.w100]}>
                      <View style={[styles.borderStyle, styles.borderBottomWidth]}>
                        <Text style={styles.fieldText}>{'No Active diagnoses'}</Text>
                      </View>
                    </View>
                  </View>}

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>

                  <Text style={[styles.fieldTitle2]}>{HISTORICAL}</Text>
                  {historicProblems?.map((problem) => {
                    const { ICDCode } = problem || {}
                    const { code, description } = ICDCode || {}
                    return (
                      <Text style={[styles.fieldText]}>{`(${code}) ${description}`}</Text>
                    )
                  })}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle2]}>{ACUITY}</Text>
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

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>

                  <Text style={[styles.fieldTitle2]}>{ACUITY}</Text>
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
                  <Text style={[styles.fieldTitle2,]}>{START}</Text>
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

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>

                  <Text style={[styles.fieldTitle2]}>{START}</Text>
                  {historicProblems?.length ? historicProblems?.map((problem) => {
                    const { problemStartDate } = problem || {}
                    return (
                      <Text style={[styles.fieldText]}>{getFormatDateString(problemStartDate, "MM-DD-YYYY")}</Text>
                    )
                  }) : <View style={styles.tableRow}>
                    <View style={[styles.w100]}>
                      <View style={[styles.borderStyle,]}>
                        <Text style={[styles.fieldText]}>{" "}</Text>
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
            <View style={{ height: '10px' }}>
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

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 6.1-row */}
              <View style={[styles.tableRow,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2,]}>{ACTIVE}</Text>
                  {drugAllergies?.length ? drugAllergies?.map((allergyValue) => {
                    const { allergy } = allergyValue || {}
                    const { name } = allergy || {}
                    return (
                      <Text style={[styles.fieldText]}>{name}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle3]}>{NO_DRUG_ALLERGIES_RECORDED}</Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2,]}>{SEVERITY_REACTIONS}</Text>
                  {drugAllergies?.length ? drugAllergies?.map((allergyValue) => {
                    const { allergySeverity } = allergyValue || {}
                    return (
                      <Text style={[styles.fieldText]}>{formatValue(allergySeverity)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2,]}>{ONSET}</Text>
                  {drugAllergies?.length ? drugAllergies?.map((allergyValue) => {
                    const { allergyStartDate, allergyOnset } = allergyValue || {}
                    return (
                      <Text style={[styles.fieldText]}>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : formatValue(allergyOnset)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '30px' }}>
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

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 7.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{ACTIVE}</Text>
                  {foodAllergies?.length ? foodAllergies?.map((allergyValue) => {
                    const { allergy } = allergyValue || {}
                    const { name } = allergy || {}
                    return (
                      <Text style={[styles.fieldText]}>{name}</Text>
                    )
                  }) : <Text style={[styles.fieldText]}>{NO_FOOD_ALLERGIES_RECORDED}</Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2,]}>{SEVERITY_REACTIONS}</Text>
                  {foodAllergies?.length ? foodAllergies?.map((allergyValue) => {
                    const { allergySeverity } = allergyValue || {}
                    return (
                      <Text style={[styles.fieldText]}>{formatValue(allergySeverity)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2,]}>{ONSET}</Text>
                  {foodAllergies?.length ? foodAllergies?.map((allergyValue) => {
                    const { allergyStartDate, allergyOnset } = allergyValue || {}
                    return (
                      <Text style={[styles.fieldText]}>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : formatValue(allergyOnset)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '30px' }}>
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

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 8.1-row */}
              <View style={[styles.tableRow, styles.borderStyle]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2,]}>{ACTIVE}</Text>
                  {environmentAllergies?.length ? environmentAllergies?.map((allergyValue) => {
                    const { allergy } = allergyValue || {}
                    const { name } = allergy || {}
                    return (
                      <Text style={[styles.fieldText]}>{name}</Text>
                    )
                  }) : <Text style={[styles.fieldText]}>{NO_ENVIRONMENTAL_ALLERGIES_RECORDED}</Text>}

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2]}>{SEVERITY_REACTIONS}</Text>
                  {environmentAllergies?.length ? environmentAllergies?.map((allergyValue) => {
                    const { allergySeverity } = allergyValue || {}
                    return (
                      <Text style={[styles.fieldText]}>{formatValue(allergySeverity)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2]}>{ONSET}</Text>
                  {environmentAllergies?.length ? environmentAllergies?.map((allergyValue) => {
                    const { allergyStartDate, allergyOnset } = allergyValue || {}
                    return (
                      <Text style={[styles.fieldText]}>{allergyStartDate ? getFormatDateString(allergyStartDate, 'MM-DD-YYYY') : formatValue(allergyOnset)}</Text>
                    )
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>
            </> : <View></View>
          }

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

          {modulesToPrint.includes('Medications') ?
            <>
              {/* 9th-row */}
              <View style={styles.tableRow}>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{MEDICATIONS}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 9.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w10]}>
                  <Text style={[styles.fieldTitle2,]}>{ACTIVE}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { status } = patientMedication || {}
                    return <Text style={styles.fieldText}>{status}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2,]}>{SIG}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { sig } = patientMedication || {}
                    return <Text style={styles.fieldText}>{sig}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle2,]}>{START_STOP}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { startDate, stopDate } = patientMedication || {}
                    return <Text style={styles.fieldText}>{getFormatDateString(startDate, 'MM-DD-YYYY')} / {stopDate ? getFormatDateString(stopDate, 'MM-DD-YYYY') : ""}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w30]}>
                  <Text style={[styles.fieldTitle2,]}>{ASSOCIATED_DX}</Text>
                  {patientMedications?.length ? patientMedications?.map((patientMedication) => {
                    const { medication } = patientMedication || {}
                    const { fullName } = medication || {}
                    return <Text style={styles.fieldText}>{fullName}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>
            </> : <View></View>}

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '20px' }}>
            </View>
          </View>

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

                {/* spacing-row */}
                <View style={styles.tableRow}>
                  <View style={{ height: '10px' }}>
                  </View>
                </View>

                {/* 10.1-row */}
                <View style={[styles.tableRow, styles.borderStyle,]}>
                  <View style={[styles.w30]}>
                    <Text style={[styles.fieldTitle2,]}>{ONSET_DATE}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { vitalCreationDate } = patientVital || {}
                      return <Text style={styles.fieldText}>{getFormatDateString(vitalCreationDate, 'MM-DD-YYYY')}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>

                  <View style={[styles.w30]}>
                    <Text style={[styles.fieldTitle2,]}>{TEMPERATURE_TEXT}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { patientTemperature } = patientVital || {}
                      return <Text style={styles.fieldText}>{patientTemperature || ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>

                  <View style={[styles.w20]}>
                    <Text style={[styles.fieldTitle2,]}>{BLOOD_PRESSURE_TEXT}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { systolicBloodPressure, diastolicBloodPressure } = patientVital || {}
                      return <Text style={styles.fieldText}>{systolicBloodPressure ? `${systolicBloodPressure} / ${diastolicBloodPressure}` : ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>

                  <View style={[styles.w20]}>
                    <Text style={[styles.fieldTitle2,]}>{RESPIRATORY_RATE_TEXT}</Text>
                    {patientVitals?.length ? patientVitals?.map((patientVital) => {
                      const { respiratoryRate } = patientVital || {}
                      return <Text style={styles.fieldText}>{respiratoryRate || ''}</Text>
                    }) : <Text style={[styles.fieldTitle]}> </Text>}
                  </View>
                </View>

                {/* spacing-row */}
                <View style={styles.tableRow}>
                  <View style={{ height: '10px' }}>
                  </View>
                </View>
              </> : <View></View>
          }

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '30px' }}>
            </View>
          </View>

          {modulesToPrint.includes('Family History') ?
            <>
              {/* 12th-row */}
              <View style={styles.tableRow} break>
                <View style={[styles.w100]}>
                  <View style={[styles.bgLightGrey, styles.borderStyle, styles.borderTopWidth, styles.borderBottomWidth]}>
                    <Text style={styles.fieldTitle2}>{FAMILY_HISTORY_TEXT}</Text>
                  </View>
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 12.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2]}>{PROBLEM_TEXT}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle2,]}>{RELATIVE}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle2,]}>{ONSET_AGE_TEXT}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle2,]}>{NOTES}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>
                </View>
              </View>

              <View >
                {
                  familyHistories?.map((history) => {
                    const { name, familyHistoryRelatives } = history || {}
                    return (
                      <>
                        {familyHistoryRelatives?.map((family, index) => {
                          const { notes, onsetAge, relativeName } = family || {}
                          return (
                            <View style={[styles.rowView]}>
                              {index === 0 ? <View style={[styles.w40]}><Text style={[styles.fieldText]}>{name}</Text></View> : <View style={[styles.w40]}></View>}
                              <View style={[styles.w20]}><Text style={[styles.fieldText]}>{formatValue(relativeName || '')}</Text></View>
                              <View style={[styles.w20]}><Text style={[styles.fieldText]}>{onsetAge}</Text></View>
                              <View style={[styles.w20]}><Text style={[styles.fieldText]}>{notes}</Text></View>
                            </View>
                          )
                        })}
                      </>
                    )
                  })
                }
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>
            </> : <View></View>}

          {/* spacing-row */}
          <View style={styles.tableRow}>
            <View style={{ height: '30px' }}>
            </View>
          </View>

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

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>

              {/* 12.1-row */}
              <View style={[styles.tableRow, styles.borderStyle,]}>
                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2,]}>{PROCEDURE_TEXT}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>

                  {surgicalHistories?.length ? surgicalHistories?.map((surgicalHistory) => {
                    const { code, description } = surgicalHistory || {}
                    return <Text style={styles.fieldText}>{`${code} | ${description}`}</Text>
                  }) : <Text style={[styles.fieldText]}>{NO_SURGICAL_PROCEDURE_RECORDED}</Text>}
                </View>

                <View style={[styles.w20]}>
                  <Text style={[styles.fieldTitle2,]}>{SURGERY_DATE}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>

                  {surgicalHistories?.length ? surgicalHistories?.map((surgicalHistory) => {
                    const { surgeryDate } = surgicalHistory || {}
                    return <Text style={styles.fieldText}>{getFormatDateString(surgeryDate, 'MM-DD-YYYY')}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>

                <View style={[styles.w40]}>
                  <Text style={[styles.fieldTitle2,]}>{NOTES}</Text>

                  {/* spacing-row */}
                  <View style={styles.tableRow}>
                    <View style={{ height: '10px' }}>
                    </View>
                  </View>

                  {surgicalHistories?.length ? surgicalHistories?.map((surgicalHistory) => {
                    const { notes } = surgicalHistory || {}
                    return <Text style={styles.fieldText}>{notes}</Text>
                  }) : <Text style={[styles.fieldTitle]}> </Text>}
                </View>
              </View>

              {/* spacing-row */}
              <View style={styles.tableRow}>
                <View style={{ height: '10px' }}>
                </View>
              </View>
            </> : <View></View>}
        </View>
      </Page>
    </Document>
  )
}

export default ChartPdf;