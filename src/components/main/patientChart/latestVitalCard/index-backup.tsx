import { Box, Button, Card, Collapse, colors, Typography } from '@material-ui/core';
import { FC, useCallback, useEffect, useState } from 'react';
//interfaces, constants, utils, styles, graphql
import { LESS_INFO, MORE_INFO, PATIENT_VITAL_TEXT, VITAL_LABELS } from '../../../../constants';
import { PatientVitalPayload, useGetPatientLatestVitalLazyQuery } from '../../../../generated/graphql';
import { LatestVitalCardProps } from '../../../../interfacesTypes';
import { useProfileDetailsStyles } from '../../../../styles/profileDetails';
import { getAppointmentDateWithDay, isAbnormalBloodPressureRate, isAbnormalOxygenSaturation, isAbnormalPain, isAbnormalPulseRate, isAbnormalRespiratoryRate, isAbnormalTemperature, renderLoading } from '../../../../utils';

const LatestVitalCard: FC<LatestVitalCardProps> = ({ patientId, shouldRefetch, setShouldRefetch }): JSX.Element => {

  const classes = useProfileDetailsStyles();
  const [vital, setVital] = useState<PatientVitalPayload['patientVital']>();
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(true);

  const {
    systolicBloodPressure, diastolicBloodPressure, oxygenSaturation, patientTemperature, pulseRate, respiratoryRate,
    PainRange, vitalCreationDate
  } = vital || {}

  const [getLatestPatientVital, { loading }] = useGetPatientLatestVitalLazyQuery({
    onCompleted: (data) => {
      const { getPatientLatestVital } = data || {}
      const { patientVital, response } = getPatientLatestVital || {}
      const { status } = response || {};
      if (status === 200) {
        const { vitalCreationDate: updateDate, ...rest } = patientVital || {}
        if (updateDate) {
          const newDate = getAppointmentDateWithDay(updateDate, undefined, 'MM-DD-YYYY');
          const vitals = { ...rest, vitalCreationDate: newDate }
          setVital(vitals as PatientVitalPayload['patientVital'])
        }
        else {
          setVital(patientVital)
        }
      }
    },
    onError: () => { }
  })

  const fetchLatestVital = useCallback(async () => {
    try {
      await getLatestPatientVital({ variables: { patientId } })
    } catch (error) { }
  }, [patientId, getLatestPatientVital])

  useEffect(() => {
    patientId && fetchLatestVital()
  }, [patientId, fetchLatestVital])

  useEffect(() => {
    if (shouldRefetch) {
      fetchLatestVital()
      setShouldRefetch && setShouldRefetch(false)
    }
  }, [fetchLatestVital, setShouldRefetch, shouldRefetch])


  return (
    <Card>
      <Box p={2} display='flex' justifyContent='space-between' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
        <Box>
          <Typography variant="h4">{PATIENT_VITAL_TEXT}</Typography>
          <Typography>{vitalCreationDate || '---'}</Typography>
        </Box>

        <Box p={1} />

        <Button onClick={() => setOpenMoreInfo(!openMoreInfo)} variant="text" className="btn-focus">
          {openMoreInfo ? <Typography variant="body2">... {LESS_INFO}</Typography>
            : <Typography variant="body2">... {MORE_INFO}</Typography>}
        </Button>
      </Box>

      <Collapse in={openMoreInfo} mountOnEnter unmountOnExit>
        <Box display="flex" width="100%" py={3} px={4} flexWrap="wrap">
          <Box className={classes.profileAdditionalInfo}>
            <Box className={classes.profileInfoHeading}>{VITAL_LABELS.patientTemperature}</Box>

            {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
              <Typography
                variant="body1"
                className={`${isAbnormalTemperature(patientTemperature || '') ? 'danger' : ''}`}
              >
                {patientTemperature || '--'}
              </Typography>
            </Box>}
          </Box>

          <Box className={classes.profileAdditionalInfo}>
            <Box className={classes.profileInfoHeading}>{VITAL_LABELS.bloodPressure}</Box>

            {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
              <Typography
                variant="body1"
                className={`${isAbnormalBloodPressureRate(systolicBloodPressure || '', diastolicBloodPressure || '') ? 'danger' : ''}`}
              >
                {`${systolicBloodPressure || '--'} / ${diastolicBloodPressure || '--'}`}
              </Typography>
            </Box>}
          </Box>

          <Box className={classes.profileAdditionalInfo}>
            <Box className={classes.profileInfoHeading}>{VITAL_LABELS.oxygenSaturation}</Box>

            {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
              <Typography
                variant="body1"
                className={`${isAbnormalOxygenSaturation(oxygenSaturation || '') ? 'danger' : ''}`}
              >
                {oxygenSaturation || '--'}
              </Typography>
            </Box>}
          </Box>

          <Box className={classes.profileAdditionalInfo}>
            <Box className={classes.profileInfoHeading}>{VITAL_LABELS.pulseRate}</Box>

            {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
              <Typography
                variant="body1"
                className={`${isAbnormalPulseRate(pulseRate || '') ? 'danger' : ''}`}
              >
                {pulseRate || '--'}
              </Typography>
            </Box>}
          </Box>

          <Box className={classes.profileAdditionalInfo}>
            <Box className={classes.profileInfoHeading}>{VITAL_LABELS.respiratoryRate}</Box>

            {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
              <Typography
                variant="body1"
                className={`${isAbnormalRespiratoryRate(respiratoryRate || '') ? 'danger' : ''}`}
              >
                {respiratoryRate || '--'}
              </Typography>
            </Box>}
          </Box>

          <Box className={classes.profileAdditionalInfo}>
            <Box className={classes.profileInfoHeading}>{VITAL_LABELS.PainRange}</Box>

            {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
              <Typography
                variant="body1"
                className={`${isAbnormalPain(PainRange || '') ? 'danger' : ''}`}
              >
                {PainRange || '--'}
              </Typography>
            </Box>}
          </Box>

        </Box>
      </Collapse>
    </Card>
  )
}

export default LatestVitalCard