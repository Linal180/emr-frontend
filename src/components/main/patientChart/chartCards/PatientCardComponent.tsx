// packages block
import { useParams } from "react-router-dom";
import { FC, Reducer, useReducer, MouseEvent, useState, useCallback, useEffect } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader, IconButton, Box, Typography, Menu, Grid } from "@material-ui/core";
// components block
import PatientCardForm from "./PatientCardForm";
// interfaces/types block
import history from "../../../../history";
import { AddChartingIcon, NoDataIcon } from "../../../../assets/svgs";
import { ChartingCardComponentType, ParamsType } from "../../../../interfacesTypes";
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";
import { PatientVitalPayload, useFindAllPatientVitalsLazyQuery } from "../../../../generated/graphql";
import {
  BLOOD_PRESSURE_TEXT, BMI_TEXT, BPM_TEXT, DASHES, FEVER_TEXT, HEAD_CIRCUMFERENCE, HEIGHT_TEXT, IN_TEXT, KG_PER_METER_SQUARE_TEXT, LATEST_RECORDED_DATE,
  LBS_TEXT, MMHG_TEXT, NO_RECORDS, ONE_TO_TEN_TEXT, OXYGEN_SATURATION_TEXT, PAIN_TEXT, PERCENTAGE, PULSE_TEXT, RESPIRATORY_RATE_TEXT,
  RPM_TEXT,
  SMOKING_STATUS_TEXT, VITAL_LIST_PAGE_LIMIT, WEIGHT_TEXT
} from "../../../../constants";
import { VitalListComponent } from "../common/VitalList";
import { formatValue, getDate } from "../../../../utils";
import ViewDataLoader from "../../../common/ViewDataLoader";
import { GREY_SEVEN } from "../../../../theme";


const VitalCardComponent: FC<ChartingCardComponentType> = (
  { cardTitle, hasAdd, disableAddIcon, vitalsCard }
): JSX.Element => {
  const [patientVitals, setPatientVitals] = useState<PatientVitalPayload['patientVital']>(null);
  const classes = usePatientChartingStyles()
  const { id } = useParams<ParamsType>()
  const [{ anchorEl }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const isMenuOpen = Boolean(anchorEl);
  const cardId = "widget-menu";
  const methods = useForm<any>({ mode: "all", });
  const { handleSubmit } = methods;
  const {
    pulseRate, createdAt, PatientBMI, respiratoryRate, PainRange, systolicBloodPressure, diastolicBloodPressure,
    smokingStatus, oxygenSaturation, patientHeadCircumference, PatientHeight, temperatureUnitType, patientTemperature,
    PatientWeight
  } = patientVitals || {}
  const vitalDate = getDate(createdAt || '')

  const onSubmit: SubmitHandler<any> = () => { }
  const handleChartingCardsMenuOpen = (event: MouseEvent<HTMLElement>) => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget })
  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });
  const handleVitalsCard = () => { history.push(`./chart/vitals`) };

  const [getPatientVitals, { loading }] = useFindAllPatientVitalsLazyQuery({
    variables: {
      patientVitalInput: { patientId: id, paginationOptions: { page: 1, limit: VITAL_LIST_PAGE_LIMIT } }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientVitals(null)
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientVitals } = data;

        if (findAllPatientVitals) {
          const { response, patientVitals } = findAllPatientVitals

          if (response) {
            const { status } = response

            if (patientVitals && status && status === 200) {
              const sortedVitals = patientVitals?.sort((a, b) => {
                if (a?.createdAt && b?.createdAt) {
                  return (a?.createdAt < b?.createdAt) ? 1 : ((b?.createdAt < a?.createdAt) ? -1 : 0)
                }
                return 0
              })
              sortedVitals?.length > 0 && setPatientVitals(sortedVitals[0])
            }
          }
        }
      }
    }
  })

  const fetchPatientAllVitals = useCallback(async () => {
    try {
      await getPatientVitals()
    } catch (error) { }
  }, [getPatientVitals])

  useEffect(() => {
    id && fetchPatientAllVitals()
  }, [id, fetchPatientAllVitals])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            action={
              hasAdd && (
                <Box display="flex" alignItems="center">
                  <IconButton disabled={disableAddIcon} onClick={vitalsCard ? handleVitalsCard : handleChartingCardsMenuOpen} aria-label="patient-charting">
                    <AddChartingIcon />
                  </IconButton>
                  <Menu
                    getContentAnchorEl={null}
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    id={cardId}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    className={classes.dropdown}
                  >
                    <PatientCardForm />
                  </Menu>
                </Box>
              )
            }
            title={cardTitle}
          />

          <CardContent>
            {loading ?
              <ViewDataLoader columns={6} rows={5} /> :
              patientVitals === null ? (<Box color={GREY_SEVEN} margin='auto' textAlign='center' mb={2}>
                <NoDataIcon />

                <Typography variant="h6">{NO_RECORDS}</Typography>
              </Box>) :
                <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography className={classes.cardContentDateText}>{LATEST_RECORDED_DATE}</Typography>
                      <Typography>
                        {vitalDate}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${PULSE_TEXT} (${BPM_TEXT})`}
                      description={pulseRate || DASHES}
                      isError={!!pulseRate ? (parseInt(pulseRate) < 60 || parseInt(pulseRate) > 100) : false} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${BMI_TEXT} (${KG_PER_METER_SQUARE_TEXT})`}
                      description={PatientBMI || DASHES}
                      isError={!!PatientBMI ? (parseFloat(PatientBMI) < 18.5 || parseFloat(PatientBMI) > 25) : false} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${RESPIRATORY_RATE_TEXT} (${RPM_TEXT})`}
                      description={respiratoryRate || DASHES}
                      isError={!!respiratoryRate ? (parseInt(respiratoryRate) < 12 || parseInt(respiratoryRate) > 16) : false} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${PAIN_TEXT} (${ONE_TO_TEN_TEXT})`}
                      description={PainRange || DASHES}
                      isError={!!PainRange ? (parseInt(PainRange) > 3) : false} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${BLOOD_PRESSURE_TEXT} (${MMHG_TEXT})`}
                      description={`${diastolicBloodPressure}/${systolicBloodPressure}` || DASHES}
                      isError={!!PainRange ? (parseInt(PainRange) > 3) : false} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={SMOKING_STATUS_TEXT}
                      description={(smokingStatus && formatValue(smokingStatus)) || DASHES} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${OXYGEN_SATURATION_TEXT} (${PERCENTAGE})`}
                      description={oxygenSaturation || DASHES}
                      isError={!!oxygenSaturation ? (parseInt(oxygenSaturation) < 95) : false} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${HEAD_CIRCUMFERENCE} (${IN_TEXT})`}
                      description={patientHeadCircumference || DASHES}
                      isError={!!patientHeadCircumference ? (parseFloat(patientHeadCircumference) < 23.62 || parseFloat(patientHeadCircumference) > 24.8) : false} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${HEIGHT_TEXT} (${IN_TEXT})`}
                      description={PatientHeight || DASHES} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${FEVER_TEXT} (${(temperatureUnitType && formatValue(temperatureUnitType))})`}
                      description={patientTemperature || DASHES}
                      isError={!!patientTemperature ? (parseFloat(patientTemperature) < 97 || parseFloat(patientTemperature) > 99) : false} />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <VitalListComponent
                      title={`${WEIGHT_TEXT} (${LBS_TEXT})`}
                      description={PatientWeight || DASHES} />
                  </Grid>
                </Grid>}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}


export default VitalCardComponent;
