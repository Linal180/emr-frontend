// packages block
import { useParams } from 'react-router';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { Box, Grid } from '@material-ui/core'
//component block
import { AddVitals } from '../add';
import { VitalsLabels } from './labels'
import { VitalListingTable } from './lists'
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { VITAL_LIST_PAGE_LIMIT } from '../../../../../constants';
import { PatientVitalsPayload, useFindAllPatientVitalsLazyQuery } from '../../../../../generated/graphql';
import { ParamsType, PatientVitalsListingProps } from '../../../../../interfacesTypes';
import ViewDataLoader from '../../../../common/ViewDataLoader';
import { usePatientVitalListingStyles } from '../../../../../styles/patientVitalsStyles';

const PatientVitalsListing = ({ patientStates }: PatientVitalsListingProps) => {
  const [patientVitals, setPatientVitals] = useState<PatientVitalsPayload['patientVitals']>([]);

  const classes = usePatientVitalListingStyles()
  const { id } = useParams<ParamsType>()

  const [getPatientVitals, { loading }] = useFindAllPatientVitalsLazyQuery({
    variables: {
      patientVitalInput: { patientId: id, paginationOptions: { page: 1, limit: VITAL_LIST_PAGE_LIMIT } }
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientVitals([])
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
              sortedVitals?.length > 0 && setPatientVitals(sortedVitals as PatientVitalsPayload['patientVitals'])
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
    <Fragment>
      {loading ?
        <ViewDataLoader columns={12} rows={3} />
        : <Box mb={2}>
          <Grid container>
            <Grid item xs={2}>
              <VitalsLabels patientStates={patientStates} />
            </Grid>
            <Grid item xs={2}>
              <AddVitals fetchPatientAllVitals={fetchPatientAllVitals} patientStates={patientStates} />
            </Grid>
            <Grid item xs={8}>
              <Box className={classes.listingTable}>
                <VitalListingTable patientVitals={patientVitals} patientStates={patientStates} />
              </Box>
            </Grid>
          </Grid>

        </Box>
      }
    </Fragment>
  )
}

export default PatientVitalsListing