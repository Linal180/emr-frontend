// packages block
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FormProvider, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import {
  Box, Card, colors, Grid, Typography, Button, CircularProgress, FormGroup, FormControlLabel, Checkbox,
} from "@material-ui/core";
//components block
import Alert from '../../../common/Alert';
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import LabOrdersResultSubForm from './LabOrdersResultSubForm';
// interfaces, graphql, constants block
import history from '../../../../history';
import { GREY, GREY_THREE } from '../../../../theme';
import { getFormatDateString, renderItem, setRecord } from '../../../../utils';
import { PatientProviderSelector } from '../../../common/Selector/PatientProviderSelector';
import { GeneralFormProps, LabOrderResultsFormInput, LabOrdersResultOption1, LabOrdersResultOption2, ParamsType, SelectorOption } from "../../../../interfacesTypes";
import {
  ACCESSION_NUMBER, DESCRIPTION, DOCTOR_SIGNOFF, LAB_TEXT, LOINC_CODE, NOT_FOUND_EXCEPTION,
  ORDERS_RESULT_INITIAL_VALUES_1, ORDERS_RESULT_INITIAL_VALUES_2, OTHER_OPTION,
  RESULTS, SAVE_TEXT, TESTS, USER_NOT_FOUND_EXCEPTION_MESSAGE, VENDOR_NAME,
} from '../../../../constants';
import {
  AbnormalFlag, LabTestStatus, useFindLabTestsByOrderNumLazyQuery,
  useRemoveLabTestObservationMutation, useUpdateLabTestMutation, useUpdateLabTestObservationMutation
} from '../../../../generated/graphql';

const LabOrdersResultForm: FC<GeneralFormProps> = (): JSX.Element => {
  const { orderNum, patientId, appointmentId } = useParams<ParamsType>();
  const [resultsToRemove, setResultsToRemove] = useState<string[]>([])
  const [doctorSignOff, setDoctorSignOff] = useState(false);
  const [accessionNumber, setAccessionNumber] = useState<string>('');
  const methods = useForm<LabOrderResultsFormInput>({ mode: "all" });
  const { handleSubmit, setValue, control } = methods;

  const [updateLabTest] = useUpdateLabTestMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },
  });

  const [updateLabTestObservation, { loading: updateLoading }] = useUpdateLabTestObservationMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      history.push(appointmentId ? `/appointments/${appointmentId}/${patientId}/check-in` : `/patients/${patientId}/details/1`)
    }
  });

  const [removeLabTestMutation, { loading: removeLoading }] = useRemoveLabTestObservationMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },
  });

  const onSubmit: SubmitHandler<LabOrderResultsFormInput> = async (values) => {
    const { assignedProvider, collectedDate, receivedDate, labName, venderName } = values ?? {}

    if (resultsToRemove.length) {
      resultsToRemove.forEach(async (resultId) => {
        resultId && await removeLabTestMutation({
          variables: {
            removeLabTestObservation: {
              id: resultId ?? ''
            }
          }
        })
      })
    }

    values.loinsCodeFields.forEach(async (loinsCodeField) => {
      const { testId, description, resultsField, isCovid } = loinsCodeField ?? {}

      await updateLabTest({
        variables: {
          updateLabTestInput: {
            updateLabTestItemInput: {
              id: testId ?? '',
              patientId: patientId ?? '',
              status: LabTestStatus.ResultReceived,
              collectedDate: getFormatDateString(collectedDate, 'MM-DD-YYYY'),
              receivedDate: getFormatDateString(receivedDate, 'MM-DD-YYYY'),
              labName: labName?.id ?? '',
              vendorName: venderName ?? '',
              ...(assignedProvider?.id && { doctorId: assignedProvider?.id ?? '' })
            },
          }
        }
      })

      const transformedObservations = resultsField.map((resultsFieldValues) => {
        let observationId = ''
        let abnormalFlag: SelectorOption = { id: '', name: '' }
        let normalRange = ''
        let normalRangeUnits = ''
        let resultUnits = ''
        let resultValue = ''
        if (isCovid) {
          const resultFieldValue = resultsFieldValues as LabOrdersResultOption2 ?? {}
          resultValue = resultFieldValue.resultValue?.id || ''
          observationId = resultFieldValue.observationId || ''
        } else {
          const resultFieldValue = resultsFieldValues as LabOrdersResultOption1 ?? {}
          observationId = resultFieldValue.observationId || ''
          abnormalFlag = resultFieldValue.abnormalFlag || setRecord('', '')
          normalRange = resultFieldValue.normalRange || ''
          normalRangeUnits = resultFieldValue.normalRangeUnits || ''
          resultUnits = resultFieldValue.resultUnits || ''
          resultValue = resultFieldValue.resultValue || ''
        }

        return {
          id: observationId ?? '',
          ...(abnormalFlag?.id && { abnormalFlag: abnormalFlag?.id as AbnormalFlag }),
          description,
          normalRange,
          normalRangeUnit: normalRangeUnits,
          resultUnit: resultUnits,
          resultValue: resultValue,
          doctorsSignOff: doctorSignOff
        }
      })

      await updateLabTestObservation({
        variables: {
          updateLabTestObservationInput: {
            updateLabTestObservationItemInput: transformedObservations,
            labTestId: testId
          }
        }
      })
    })
  }

  const { fields: resultFields } = useFieldArray({ control: control, name: "loinsCodeFields" });

  const [findLabTestsByOrderNum] = useFindLabTestsByOrderNumLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(`/patients/${patientId}/details/1`)
    },

    async onCompleted(data) {
      const { findLabTestsByOrderNum } = data || {};

      if (findLabTestsByOrderNum) {
        const { labTests } = findLabTestsByOrderNum

        const transformedLabTests = labTests?.map((labTest) => {
          const { test, id, testObservations, doctor, vendorName, collectedDate, receivedDate, accessionNumber, labName, testSpecimens } = labTest ?? {}
          const { component, loincNum, isCovid, unitsRequired } = test ?? {}

          setValue('labName', {
            id: labName ?? OTHER_OPTION.id,
            name: labName ?? OTHER_OPTION.name
          })
          setValue('assignedProvider', {
            id: doctor?.id ?? '',
            name: `${doctor?.firstName ?? ''} ${doctor?.lastName ?? ''}`.trim()
          })
          setValue('venderName', vendorName ?? '')
          setValue('collectedDate', collectedDate ?? testSpecimens?.[0]?.collectionDate ?? '')
          setValue('receivedDate', receivedDate ?? '')
          setAccessionNumber(accessionNumber || '')

          const transformedObservations = testObservations?.map((testObservation) => {
            const { normalRange, resultUnit, resultValue, normalRangeUnit, abnormalFlag, id, doctorsSignOff } = testObservation ?? {}

            setDoctorSignOff(doctorsSignOff || false)

            if (isCovid) {
              return {
                observationId: id,
                resultValue: setRecord(resultValue || '', resultValue || ''),
              }
            }

            return {
              observationId: id,
              resultValue: resultValue ?? '',
              resultUnits: resultUnit ?? unitsRequired ?? '',
              normalRange: normalRange ?? '',
              normalRangeUnits: normalRangeUnit ?? '',
              abnormalFlag: {
                id: abnormalFlag ?? '',
                name: abnormalFlag ?? ''
              }
            }
          })

          return {
            testId: id ?? '',
            loinccode: loincNum ?? '',
            description: component ?? '',
            isCovid: isCovid || false,
            resultsField: transformedObservations?.length ? transformedObservations : [component?.includes('corona') ? ORDERS_RESULT_INITIAL_VALUES_2 : { ...ORDERS_RESULT_INITIAL_VALUES_1, resultUnits: unitsRequired ?? '' }]
          }
        }) ?? []

        setValue('loinsCodeFields', transformedLabTests)
      }
    }
  });

  const fetchLabTests = useCallback(async () => {
    try {
      await findLabTestsByOrderNum({
        variables: {
          labTestByOrderNumInput: {
            orderNumber: orderNum ?? ''
          }
        }
      });
    } catch (error) { }
  }, [findLabTestsByOrderNum, orderNum])

  useEffect(() => {
    fetchLabTests()
  }, [fetchLabTests])

  const handleDoctorSignOffToggle = (
    { target: { checked } }: ChangeEvent<HTMLInputElement>
  ) => {
    setDoctorSignOff(checked);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Box px={3}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h4'>{RESULTS}</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="labName"
                    label={LAB_TEXT}
                    options={[OTHER_OPTION]}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <PatientProviderSelector patientId={patientId ?? ''} />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  {renderItem(ACCESSION_NUMBER, accessionNumber)}
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="venderName"
                    controllerLabel={VENDOR_NAME}
                  />
                </Grid>

                {/* <Grid item md={3} sm={12} xs={12}>
                  <DatePicker name="collectedDate" label={COLLECTED_DATE} disableFuture={false} />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker name="receivedDate" label={RECEIVED_DATE} disableFuture={false} />
                </Grid> */}
              </Grid>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box p={3}>
              <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{TESTS}</Typography>
              </Box>

              <Box mb={2}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox color="primary" checked={doctorSignOff} onChange={handleDoctorSignOffToggle} />
                    }
                    label={DOCTOR_SIGNOFF}
                  />
                </FormGroup>
              </Box>

              {resultFields?.map((resultField, index) => {
                return (
                  <Box mb={2} borderBottom={(resultFields.length - 1) === index ? 'none' : `2px solid ${GREY}`} key={index}>
                    <Grid container spacing={3}>
                      <Grid item md={12}>
                        <Grid container>
                          <Grid item md={6} sm={12} xs={12}>
                            <Box p={1.5} display='flex'>
                              <Grid container>
                                <Grid item md={4}>
                                  <Typography variant='h6'>{LOINC_CODE}</Typography>

                                  <Box py={0.6} mb={2} color={GREY_THREE}>
                                    <Typography variant='body1'>{resultField.loinccode}</Typography>
                                  </Box>
                                </Grid>

                                <Grid item md={8}>
                                  <Typography variant='h6'>{DESCRIPTION}</Typography>

                                  <Box py={0.6} mb={2} color={GREY_THREE}>
                                    <Typography variant='body1'>{resultField.description}</Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item md={12}>
                        <LabOrdersResultSubForm index={index} setResultsToRemove={setResultsToRemove} />
                      </Grid>
                    </Grid>
                  </Box>
                )
              })
              }

              <Button type="submit" variant="contained" color="primary" disabled={removeLoading || updateLoading}>
                {SAVE_TEXT} {(removeLoading || updateLoading) && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>

          </Card>
        </form>
      </FormProvider>

      <Box p={2} />
    </>
  );
};

export default LabOrdersResultForm;
