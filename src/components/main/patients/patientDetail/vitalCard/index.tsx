// packages block
import { Box, Grid, Typography } from "@material-ui/core";
import { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { BloodPressureIcon, HeartRateIcon } from "../../../../../assets/svgs";
//components block
import AreaChartComponent from "../charts";
// constants, history, styling block
import {
  BLOOD_PRESSURE_TEXT, BLOOD_PRESSURE_UNIT, DASHES, HEART_RATE_TEXT, HEART_RATE_UNIT, LAST_READING_TEXT, N_A
} from "../../../../../constants";
import { PatientVitalPayload, useFindAllPatientVitalsLazyQuery } from "../../../../../generated/graphql";
import { GeneralFormProps, ParamsType } from "../../../../../interfacesTypes";
import {
  getBloodPressureGraphValues, getBloodPressureStatus, getFormatDateString, getHeartBeatStatus, getPulseRateGraphValues
} from "../../../../../utils";

const VitalCard: FC<GeneralFormProps> = () => {
  const [vital, setVital] = useState<PatientVitalPayload['patientVital']>()
  const [bloodPressures, setBloodPressures] = useState<number[]>([])
  const [pulseRates, setPulseRates] = useState<number[]>([])
  const { id } = useParams<ParamsType>()

  const [getPatientLatestVital] = useFindAllPatientVitalsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() { },

    onCompleted(data) {
      if (data) {
        const { findAllPatientVitals } = data;

        if (findAllPatientVitals) {

          const { patientVitals } = findAllPatientVitals;
          const allBloodPressures = patientVitals?.map((patientVital) => {
            return Number(patientVital?.systolicBloodPressure || '')
          }) || []
          setBloodPressures(allBloodPressures)

          const allPulseRate = patientVitals?.map((patientVital) => {
            return Number(patientVital?.pulseRate || '')
          }) || []
          setPulseRates(allPulseRate)
          patientVitals && setVital(patientVitals?.[0] as PatientVitalPayload['patientVital'])
        }
      }
    },
  });

  const fetchAllPatientsLatestVital = useCallback(async () => {
    try {
      id && await getPatientLatestVital({
        variables: {
          patientVitalInput: {
            patientId: id,
            paginationOptions: { limit: 50, page: 1 }
          }
        }
      })
    } catch (error) { }
  }, [id, getPatientLatestVital])

  useEffect(() => {
    fetchAllPatientsLatestVital()
  }, [fetchAllPatientsLatestVital]);

  const { vitalCreationDate, systolicBloodPressure, diastolicBloodPressure, pulseRate } = vital || {}
  const { color: bloodPressureColor, status: bloodPressureStatus } = getBloodPressureStatus(Number(systolicBloodPressure || 0), Number(diastolicBloodPressure || 0))
  const { color: heartRateColor, status: heartRateStatus } = getHeartBeatStatus(Number(pulseRate) || 0)

  return (
    <Box className='masonry-box'>
      <Grid container spacing={2}>
        <Grid item lg={6} md={12} sm={12} xs={12}>
          <Box width="100%" className='card-chart'>
            <Box display="flex" justifyContent="space-between" p={3}>
              <BloodPressureIcon />

              <Box>
                <Typography variant="h2" align='right'>{BLOOD_PRESSURE_TEXT}</Typography>
                <Typography component="span" align='right'>
                  {LAST_READING_TEXT}: {vitalCreationDate ? getFormatDateString(vitalCreationDate, 'MMM D, YYYY') : N_A}
                </Typography>
              </Box>
            </Box>

            <Box className='bloodPressure-measurement'>
              <Typography variant="h2">{systolicBloodPressure ? `${systolicBloodPressure} / ${diastolicBloodPressure}` : DASHES}
                <span className='measure-unit'>{BLOOD_PRESSURE_UNIT}</span>
              </Typography>

              <Box p={0.2} />

              <Typography className={`measure-frequency ${bloodPressureColor}`} component="span">
                {bloodPressureStatus}
              </Typography>
            </Box>

            <Box className='areaBloodPressureChart areaChartContainer'>
              <AreaChartComponent data={getBloodPressureGraphValues(bloodPressures)} />
            </Box>
          </Box>
        </Grid>

        <Grid item lg={6} md={12} xs={12} sm={12}>
          <Box width="100%" className='card-chart'>
            <Box display="flex" justifyContent="space-between" p={3}>
              <HeartRateIcon />

              <Box>
                <Typography variant="h2" align='right'>{HEART_RATE_TEXT}</Typography>

                <Typography component="span" align='right'>
                  {LAST_READING_TEXT}: {vitalCreationDate ? getFormatDateString(vitalCreationDate, 'MMM D, YYYY') : N_A}
                </Typography>
              </Box>
            </Box>

            <Box className='heartRate-measurement'>
              <Typography variant="h2">{pulseRate ? pulseRate : '--'}
                <span className='measure-unit'>{HEART_RATE_UNIT}</span>
              </Typography>

              <Box p={0.2} />

              <Typography className={`measure-frequency ${heartRateColor}`} component="span">
                {heartRateStatus}
              </Typography>
            </Box>

            <Box className='areaBloodPressureChart areaChartContainer'>
              <AreaChartComponent data={getPulseRateGraphValues(pulseRates)} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default VitalCard;
