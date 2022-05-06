// packages block
import { useParams } from 'react-router';
import { Fragment, useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableRow, TableHead, Box, Typography } from '@material-ui/core'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//component block
import InputController from '../../../../../controller';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { getCurrentDate, getDate, renderTh } from '../../../../../utils';
import { dummyVitalsChartingList, LIST_PAGE_LIMIT, NAME, NO_RECORDS } from '../../../../../constants';
import { PatientVitalsPayload, useFindAllPatientVitalsLazyQuery } from '../../../../../generated/graphql';
import { ParamsType } from '../../../../../interfacesTypes';
import ViewDataLoader from '../../../../common/ViewDataLoader';
import { GREY_SEVEN } from '../../../../../theme';


const PatientVitalsListing = () => {
  const [patientVitals, setPatientVitals] = useState<PatientVitalsPayload['patientVitals']>([]);
  const { id } = useParams<ParamsType>()

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const [getPatientVitals, { loading }] = useFindAllPatientVitalsLazyQuery({
    variables: {
      patientVitalInput: { patientId: id, paginationOptions: { page: 1, limit: LIST_PAGE_LIMIT } }
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
              patientVitals && setPatientVitals(patientVitals as PatientVitalsPayload['patientVitals'])
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


  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Fragment>
      {loading ?
        <ViewDataLoader columns={12} rows={3} />
        : <Box mb={2}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(getCurrentDate(`${new Date()}`))}
                {patientVitals?.map((vital) => {
                  const { createdAt } = vital || {}
                  return (renderTh(getDate(createdAt || '')))
                }
                )}
              </TableRow>
            </TableHead>
            {!!patientVitals && patientVitals.length > 0 ? (


              <TableBody>
                {dummyVitalsChartingList?.map((item) => {
                  const { id, firstName, lastName, email, phone, specialty, code } = item || {};

                  return (
                    <TableRow key={id}><TableCell scope="row">{`${firstName} ${lastName}`}</TableCell>
                      <TableCell scope="row">
                        <FormProvider {...methods}>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <InputController
                              fieldType="text"
                              controllerName="reason"
                              controllerLabel={''}
                            />
                          </form>
                        </FormProvider>
                      </TableCell>
                      <TableCell scope="row">{email}</TableCell>
                      <TableCell scope="row">{phone}</TableCell>
                      <TableCell scope="row">{specialty}</TableCell>
                      <TableCell scope="row">{code}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            ) : (
              <Box color={GREY_SEVEN}>
                <Typography variant="h6" >{NO_RECORDS}</Typography>
              </Box>
            )}
          </Table>
        </Box>
      }
    </Fragment>
  )
}

export default PatientVitalsListing