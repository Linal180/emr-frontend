// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography
} from '@material-ui/core';
import { FC, useCallback, useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
// component block
import InputController from '../../../../../controller';
import Alert from '../../../../common/Alert';
import CheckboxController from '../../../../common/CheckboxController';
import DatePicker from '../../../../common/DatePicker';
import TextLoader from '../../../../common/TextLoader';
import Selector from '../../../../common/Selector';
// constants block
import { PageBackIcon } from '../../../../../assets/svgs';
import {
  ACTIVE, ADD, ADD_MEDICATION, CANCEL, NOTES, ORAL_ROUTE_OPTIONS, PATIENT_MEDICATION_ADD, PATIENT_MEDICATION_UPDATED, SIG, START_DATE, STATUS, STOP_DATE, STOP_REASON, STOP_REASON_OPTIONS, STRUCTURED, TABLET_UNIT_OPTIONS, TAKE, TIME_DURATION_OPTIONS, UPDATE, UPDATE_MEDICATION
} from '../../../../../constants';
import {
  Medications, ProblemType, useAddPatientMedicationMutation,
  useGetPatientMedicationsLazyQuery, useUpdatePatientMedicationMutation
} from '../../../../../generated/graphql';
import {
  AddModalProps, ParamsType, PatientMedicationInputs
} from '../../../../../interfacesTypes';
import { ActionType } from '../../../../../reducers/chartReducer';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { GRAY_SIX, GREEN, GREY_TWO, WHITE } from '../../../../../theme';
import { renderLoading, setRecord } from '../../../../../utils';
import { patientMedicationSchema } from '../../../../../validationSchemas';

const MedicationModal: FC<AddModalProps> = ({
  dispatcher, fetch, isEdit, item, recordId, isOpen = false, handleClose
}): JSX.Element => {
  const chartingClasses = useChartingStyles()
  const { id: medicationId, fullName } = item as Medications || {}
  const { id: patientId } = useParams<ParamsType>()
  const statuses = Object.keys(ProblemType)

  const methods = useForm<PatientMedicationInputs>({
    mode: "all",
    resolver: yupResolver(patientMedicationSchema),
    defaultValues: { status: statuses[0] }
  });
  const { handleSubmit, reset, watch, setValue } = methods;
  const { status, structured } = watch()

  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
    dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' });
    dispatcher({ type: ActionType.SET_SELECTED_ITEM, selectedItem: undefined });
    handleClose && handleClose()
  }

  const [getPatientMedication, { loading: getMedicationLoading }] = useGetPatientMedicationsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getPatientMedications } = data || {};

      if (getPatientMedications) {
        const { patientMedication, response } = getPatientMedications
        const { status } = response || {}

        if (patientMedication && status && status === 200) {
          const { noOfDays, note, sig, startDate, status, stopDate, stopReason, tabletUnit, takeAmount, timeDuration, oralRoute } = patientMedication

          note && setValue('note', note)
          sig && setValue('sig', sig)
          startDate && setValue('startDate', startDate)
          stopDate && setValue('stopDate', stopDate)
          status && setValue('status', status)
          stopReason && setValue('stopReason', setRecord(stopReason, stopReason))
          stopReason && setValue('stopReason', setRecord(stopReason, stopReason))
          tabletUnit && setValue('tabletUnit', setRecord(tabletUnit, tabletUnit))
          oralRoute && setValue('oralRoute', setRecord(oralRoute, oralRoute))
          takeAmount && setValue('takeAmount', takeAmount)
          timeDuration && setValue('timeDuration', setRecord(timeDuration, timeDuration))
          noOfDays && setValue('noOfDays', noOfDays)

        }
      }
    }
  });

  const [addPatientMedication, { loading: addMedicationLoading }] = useAddPatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addPatientMedication: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_MEDICATION_ADD);
        }
      }
    }
  });

  const [updatePatientMedication, { loading: updateMedicationLoading }] = useUpdatePatientMedicationMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatientMedication: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(PATIENT_MEDICATION_UPDATED);
        }
      }
    }
  });

  const fetchPatientMedication = useCallback(async () => {
    try {
      recordId && await getPatientMedication({
        variables: { getPatientMedication: { id: recordId } }
      })
    } catch (error) { }
  }, [getPatientMedication, recordId])

  useEffect(() => {
    isOpen && isEdit && fetchPatientMedication();
  }, [fetchPatientMedication, isEdit, recordId, isOpen])

  const handleStatus = (status: string) => setValue('status', status)

  const onSubmit: SubmitHandler<PatientMedicationInputs> = async ({
    note, startDate, status, structured, oralRoute, stopReason, tabletUnit, timeDuration, noOfDays, sig, stopDate, takeAmount
  }) => {
    let sigValue = ''

    if (structured) {
      sigValue = `TAKE ${takeAmount || ''} (${tabletUnit?.id || ''}) ${timeDuration?.id || ''} BY ORAL ROUTE ${oralRoute?.id || ''} FOR ${noOfDays} days.`
    } else {
      sigValue = sig || ''
    }

    const commonInput = {
      note,
      startDate,
      sig: sigValue,
      stopDate,
      status,
      stopReason: stopReason?.id,
      takeAmount,
      oralRoute: oralRoute?.id,
      tabletUnit: tabletUnit?.id,
      timeDuration: timeDuration?.id,
      noOfDays,
      medicationId,
      patientId
    }

    if (isEdit) {
      recordId && await updatePatientMedication({
        variables: {
          updatePatientMedicationInput: {
            id: recordId, ...commonInput,
          }
        }
      })
    } else {
      await addPatientMedication({
        variables: {
          createPatientMedicationInput: {
            ...commonInput,
          }
        }
      })
    }
  }

  const loading = addMedicationLoading || updateMedicationLoading || getMedicationLoading

  const getMedicationTypeColor = (type: string) => {
    switch (type) {
      case ACTIVE:
        return GREEN

      case 'Historic':
        return GREY_TWO

      default:
        return '';
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{isEdit ? UPDATE_MEDICATION : ADD_MEDICATION}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent className={chartingClasses.chartModalBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" alignItems="center">
              <Box className='pointer-cursor' mr={2} onClick={() => dispatcher({
                type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false
              })}>
                <PageBackIcon />
              </Box>

              <Box>
                {loading ? <TextLoader width='300px' rows={[{ column: 1, size: 12 }]} />
                  : <Typography variant='h4'>{fullName}</Typography>
                }
              </Box>
            </Box>

            <Box m={2} />

            <Grid container className={chartingClasses.problemGrid}>
              <Grid item md={12} sm={12} xs={12}>
                <CheckboxController controllerName='structured' controllerLabel={STRUCTURED} loading={loading} />
              </Grid>
            </Grid>


            {
              structured ?
                <>
                  <Grid container alignContent='center' alignItems='center'>
                    <Grid item md={3} sm={12} xs={12}>
                      <Typography variant='body1'>{SIG}</Typography>
                    </Grid>

                    <Grid item md={9} sm={12} xs={12}>
                      <Grid container spacing={2} direction="row" alignItems='center'>
                        <Grid item md={1}>
                          <Typography variant='body1'>{TAKE}</Typography>
                        </Grid>

                        <Grid item md={3}>
                          <InputController
                            fieldType="number"
                            controllerName="takeAmount"
                            controllerLabel={''}
                          />
                        </Grid>

                        <Grid item md={3}>
                          <Selector
                            addEmpty
                            name="tabletUnit"
                            label={""}
                            options={TABLET_UNIT_OPTIONS}
                          />
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item md={7}>
                          <Selector
                            addEmpty
                            name="timeDuration"
                            label={""}
                            options={TIME_DURATION_OPTIONS}
                          />
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item md={6}>
                          <Typography variant='body2'>by oral route</Typography>

                          <Selector
                            addEmpty
                            name="oralRoute"
                            label={""}
                            options={ORAL_ROUTE_OPTIONS}
                          />
                        </Grid>

                        <Grid item md={7}>
                          <Box display='flex' alignItems='center'>
                            <Typography variant='body2'>{'for'}</Typography>

                            <Box mx={1}>
                              <InputController
                                fieldType="number"
                                controllerName="noOfDays"
                                controllerLabel={''}
                                notStep
                              />
                            </Box>

                            <Typography variant='body2'>{'day(s).'}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </> :
                <Grid container alignContent='center' alignItems='center'>
                  <Grid item md={3} sm={12} xs={12}>
                    <Typography variant='body1'>{SIG}</Typography>
                  </Grid>

                  <Grid item md={5} sm={12} xs={12}>
                    <InputController
                      multiline
                      fieldType="text"
                      controllerName="sig"
                      controllerLabel={''}
                      notStep
                    />
                  </Grid>
                </Grid>
            }

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{START_DATE}</Typography>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                <DatePicker defaultValue={new Date()} name='startDate' label={''} />
              </Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{STATUS}</Typography>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                {loading ? renderLoading('') :
                  <Box mt={0.5} className={chartingClasses.toggleProblem}>
                    <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                      {statuses.map(statusValue =>
                        <Box onClick={() => handleStatus(statusValue)}
                          className={statusValue === status ? 'selectedBox selectBox' : 'selectBox'}
                          style={{
                            color: statusValue === status ? WHITE : getMedicationTypeColor(statusValue),
                            backgroundColor: statusValue === status ? getMedicationTypeColor(statusValue) : WHITE,
                          }}
                        >
                          <Typography variant='h6'>{statusValue}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                }
              </Grid>
            </Grid>

            {status === statuses[1] && <>
              <Grid container alignContent='center' alignItems='center'>
                <Grid item md={3} sm={12} xs={12}>
                  <Typography variant='body1'>{STOP_DATE}</Typography>
                </Grid>

                <Grid item md={5} sm={12} xs={12}>
                  <DatePicker
                    loading={loading}
                    label={""}
                    name='stopDate'
                  />
                </Grid>
              </Grid>

              <Grid container alignContent='center' alignItems='center'>
                <Grid item md={3} sm={12} xs={12}>
                  <Typography variant='body1'>{STOP_REASON}</Typography>
                </Grid>

                <Grid item md={5} sm={12} xs={12}>
                  <Selector
                    addEmpty
                    name="stopReason"
                    label={""}
                    options={STOP_REASON_OPTIONS}
                  />
                </Grid>
              </Grid>
            </>
            }

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{NOTES}</Typography>
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="note"
                  controllerLabel={''}
                  notStep
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <Button variant='text' onClick={closeAddModal}>
              {CANCEL}
            </Button>

            <Box p={1} />

            <Button type='submit' disabled={loading} variant='contained' color='primary'
              onClick={handleSubmit(onSubmit)}
            >
              {isEdit ? UPDATE : ADD}

              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog >
  )
};

export default MedicationModal;
