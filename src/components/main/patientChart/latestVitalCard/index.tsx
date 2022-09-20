import { Box, Card, CardHeader, Typography } from '@material-ui/core'
import { FC, useCallback, useEffect, useState } from 'react'
//interfaces, constants, utils, styles, graphql
import { renderLoading } from '../../../../utils';
import { LatestVitalCardProps } from '../../../../interfacesTypes'
import { PATIENT_VITAL_TEXT, VITAL_LABELS } from '../../../../constants'
import { useProfileDetailsStyles } from '../../../../styles/profileDetails'
import { PatientVitalPayload, useGetPatientLatestVitalLazyQuery } from '../../../../generated/graphql'

const LatestVitalCard: FC<LatestVitalCardProps> = ({ patientId }): JSX.Element => {

  const classes = useProfileDetailsStyles();
  const [vital, setVital] = useState<PatientVitalPayload['patientVital']>();
  const {
    systolicBloodPressure, diastolicBloodPressure, oxygenSaturation, patientTemperature, pulseRate, respiratoryRate,
    PainRange
  } = vital || {}

  const [getLatestPatientVital, { loading }] = useGetPatientLatestVitalLazyQuery({
    onCompleted: (data) => {
      const { getPatientLatestVital } = data || {}
      const { patientVital, response } = getPatientLatestVital || {}
      const { status } = response || {};
      if (status === 200) {
        setVital(patientVital)
      }
    },
    onError: () => {

    }
  })

  const fetchLatestVital = useCallback(async () => {
    try {
      await getLatestPatientVital({ variables: { patientId } })
    } catch (error) { }
  }, [patientId, getLatestPatientVital])

  useEffect(() => {
    patientId && fetchLatestVital()
  }, [patientId, fetchLatestVital])

  return (
    <Card>
      <CardHeader title={PATIENT_VITAL_TEXT} />
      <Box display="flex" width="100%" py={3} px={4} flexWrap="wrap">
        <Box className={classes.profileAdditionalInfo}>
          <Box className={classes.profileInfoHeading}>{VITAL_LABELS.patientTemperature}</Box>

          {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
            <Typography variant="body1">{patientTemperature || '---'}</Typography>
          </Box>}
        </Box>

        <Box className={classes.profileAdditionalInfo}>
          <Box className={classes.profileInfoHeading}>{VITAL_LABELS.bloodPressure}</Box>

          {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
            <Typography variant="body1">{`${systolicBloodPressure || '---'} / ${diastolicBloodPressure || '--'}`}</Typography>
          </Box>}
        </Box>

        <Box className={classes.profileAdditionalInfo}>
          <Box className={classes.profileInfoHeading}>{VITAL_LABELS.oxygenSaturation}</Box>

          {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
            <Typography variant="body1">{oxygenSaturation || '--'}</Typography>
          </Box>}
        </Box>

        <Box className={classes.profileAdditionalInfo}>
          <Box className={classes.profileInfoHeading}>{VITAL_LABELS.pulseRate}</Box>

          {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
            <Typography variant="body1">{pulseRate || '--'}</Typography>
          </Box>}
        </Box>

        <Box className={classes.profileAdditionalInfo}>
          <Box className={classes.profileInfoHeading}>{VITAL_LABELS.respiratoryRate}</Box>

          {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
            <Typography variant="body1">{respiratoryRate || '--'}</Typography>
          </Box>}
        </Box>

        <Box className={classes.profileAdditionalInfo}>
          <Box className={classes.profileInfoHeading}>{VITAL_LABELS.PainRange}</Box>

          {loading ? renderLoading('') : <Box className={classes.profileInfoItem}>
            <Typography variant="body1">{PainRange || '--'}</Typography>
          </Box>}
        </Box>

      </Box>
    </Card>
  )
}

export default LatestVitalCard