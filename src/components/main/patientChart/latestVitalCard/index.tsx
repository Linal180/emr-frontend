import { Box, Button, Card, Collapse, colors, Typography } from '@material-ui/core'
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from 'react'
//interfaces, constants, utils, styles, graphql
import { renderLoading } from '../../../../utils';
import { LatestVitalCardProps } from '../../../../interfacesTypes'
import { LESS_INFO, MORE_INFO, PATIENT_VITAL_TEXT, VITAL_LABELS } from '../../../../constants'
import { useProfileDetailsStyles } from '../../../../styles/profileDetails'
import { PatientVitalPayload, useGetPatientLatestVitalLazyQuery } from '../../../../generated/graphql'
import { patientReducer, Action, State, initialState, ActionType } from '../../../../reducers/patientReducer';

const LatestVitalCard: FC<LatestVitalCardProps> = ({ patientId }): JSX.Element => {

  const classes = useProfileDetailsStyles();
  const [vital, setVital] = useState<PatientVitalPayload['patientVital']>();

  const [patientState, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { openMoreInfo } = patientState

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
      <Box p={2} display='flex' justifyContent='space-between' alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant="h4">{PATIENT_VITAL_TEXT}</Typography>

        <Box p={1} />

        <Button onClick={() => dispatch({ type: ActionType.SET_OPEN_MORE_INFO, openMoreInfo: !openMoreInfo })} variant="text" className="btn-focus">
          {openMoreInfo ? <Typography variant="body2">... {LESS_INFO}</Typography>
            : <Typography variant="body2">... {MORE_INFO}</Typography>}
        </Button>
      </Box>

      <Collapse in={openMoreInfo} mountOnEnter unmountOnExit>
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
      </Collapse>
    </Card>
  )
}

export default LatestVitalCard