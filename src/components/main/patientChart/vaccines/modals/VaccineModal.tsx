// packages block
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { FC, useCallback, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography
} from '@material-ui/core';
// component block
import Alert from '../../../../common/Alert';
import Selector from '../../../../common/Selector';
import DatePicker from '../../../../common/DatePicker';
import TextLoader from '../../../../common/TextLoader';
import InputController from '../../../../../controller';
import MvxSelector from '../../../../common/Selector/MvxSelector';
import NdcSelector from '../../../../common/Selector/VaccineNdcSelector';
// constants block
import { GREY_THREE } from '../../../../../theme';
import { PageBackIcon } from '../../../../../assets/svgs';
import { ActionType } from '../../../../../reducers/vaccinesReducer';
import { patientVaccineSchema } from '../../../../../validationSchemas';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { VaccineModalProps, ParamsType, PatientVaccineFormType } from '../../../../../interfacesTypes';
import {
  ADD, CANCEL, ADMINISTER_BY, UPDATE, ADMINISTRATION_DATE, ADD_VACCINE_TEXT, UPDATE_VACCINE_TEXT, AMOUNT, UNITS,
  VACCINE_UNITS_MAPPED, NDC_TEXT, ROUTE, VACCINE_ROUTES_MAPPED, SITE_TEXT, VACCINE_SITES_MAPPED, LOT_NO_TEXT,
  MANUFACTURER_TEXT, EXPIRY_DATE, VIS_GIVEN_TEXT, DATE_ON_VIS
} from '../../../../../constants';
import {
  useAddVaccineMutation, useGetVaccineLazyQuery, useUpdateVaccineMutation, VaccineProduct
} from '../../../../../generated/graphql';

const VaccineModal: FC<VaccineModalProps> = ({
  dispatcher, fetch, isEdit, item, recordId, isOpen = false, handleClose
}): JSX.Element => {

  const chartingClasses = useChartingStyles()
  const { id: patientId, appointmentId } = useParams<ParamsType>()
  const methods = useForm<PatientVaccineFormType>({ mode: "all", resolver: yupResolver(patientVaccineSchema) });

  const { handleSubmit, reset, setValue } = methods;
  const { id: vaccineProductId, cvx, name, mvx: vaccineMvx } = item as VaccineProduct || {}
  const { shortDescription: description, name: cvxName } = cvx || {}
  const { manufacturerName, mvxCode } = vaccineMvx || {}


  const closeAddModal = () => {
    reset()
    dispatcher({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: null })
    dispatcher({ type: ActionType.SET_ITEM_ID, itemId: '' });
    dispatcher({ type: ActionType.SET_SELECTED_ITEM, selectedItem: undefined });
    handleClose && handleClose()
  }

  const [getPatientVaccine, { loading: getVaccineLoading }] = useGetVaccineLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getVaccine } = data || {};

      if (getVaccine) {
        const { vaccine, response } = getVaccine
        const { status } = response || {}

        if (vaccine && status && status === 200) {
          const {
            administrationDate, amount, lotNo, expiryDate, route, site, units, visDate, visGiven, mvxId, mvx,
            ndcId, ndc, administerBy
          } = vaccine


          amount && setValue('amount', amount)
          lotNo && setValue('lotNo', lotNo)
          administerBy && setValue('administerBy', administerBy)
          administrationDate && setValue('administrationDate', moment(administrationDate, 'DD-MM-YYYY').format())
          expiryDate && setValue('expiryDate', moment(expiryDate, 'DD-MM-YYYY').format())
          visDate && setValue('visDate', moment(visDate, 'DD-MM-YYYY').format())
          visGiven && setValue('visGiven', moment(visGiven, 'DD-MM-YYYY').format())

          if (route) {
            const routeValue = VACCINE_ROUTES_MAPPED?.find(({ id }) => id === route);
            routeValue && setValue('route', routeValue)
          }

          if (units) {
            const unitsValue = VACCINE_UNITS_MAPPED?.find(({ id }) => id === units);
            unitsValue && setValue('units', unitsValue)
          }

          if (site) {
            const siteValue = VACCINE_SITES_MAPPED?.find(({ id }) => id === site);
            siteValue && setValue('site', siteValue)
          }

          if (mvxId) {
            const { id, manufacturerName, mvxCode } = mvx || {}
            id && manufacturerName && setValue('mvx', { id, name: mvxCode ? `${mvxCode} | ${manufacturerName}` : manufacturerName })
          }

          if (ndcId) {
            const { id, code, description } = ndc || {}
            id && code && setValue('ndc', { id, name: description ? `${code} | ${description}` : code })
          }
        }
      }
    }
  });

  const [addPatientVaccine, { loading: addVaccineLoading }] = useAddVaccineMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { addVaccine: { response } } = data;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(message || '');
        }
      }
    }
  });

  const [updatePatientVaccine, { loading: updateVaccineLoading }] = useUpdateVaccineMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateVaccine: { response } } = data;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          fetch()
          closeAddModal()
          Alert.success(message || '');
        }
      }
    }
  });

  const fetchPatientVaccine = useCallback(async () => {
    try {
      recordId && await getPatientVaccine({
        variables: { getVaccineInput: { id: recordId } }
      })
    } catch (error) { }
  }, [getPatientVaccine, recordId])

  useEffect(() => {
    isOpen && isEdit && fetchPatientVaccine();
  }, [fetchPatientVaccine, isEdit, recordId, isOpen])


  const onSubmit: SubmitHandler<PatientVaccineFormType> = async (data) => {
    const {
      mvx, ndc, route, site, units, administerBy, administrationDate, amount, lotNo, expiryDate, visDate,
      visGiven
    } = data || {};

    const { id: mvxId } = mvx || {}
    const { id: ndcId } = ndc || {}
    const { id: routeId } = route || {}
    const { id: siteId } = site || {}
    const { id: unit } = units || {}
    const vis = moment(visDate).format('DD-MM-YYYY');
    const visGivenDate = moment(visGiven).format('DD-MM-YYYY');
    const exp = moment(expiryDate).format('DD-MM-YYYY');
    const administrativeDate = moment(administrationDate).format('DD-MM-YYYY');

    const inputs = {
      administerBy, administrationDate: administrativeDate,
      amount, lotNo, visGiven: visGivenDate, vaccineProductId: vaccineProductId, mvxId,
      ndcId, route: routeId, site: siteId, units: unit,
      visDate: vis, expiryDate: exp, ...(appointmentId && { appointmentId })
    }

    if (isEdit) {
      recordId && await updatePatientVaccine({
        variables: {
          updateVaccineInput: {
            id: recordId, ...inputs,
          }
        }
      })
    } else {
      await addPatientVaccine({
        variables: {
          addVaccineInput: {
            patientId, ...inputs,
          }
        }
      })
    }
  }

  const loading = addVaccineLoading || updateVaccineLoading || getVaccineLoading

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h4">{isEdit ? UPDATE_VACCINE_TEXT : ADD_VACCINE_TEXT}</Typography>
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
                  : <Typography variant='h4'>{cvxName ? `${name} | ${cvxName}` : name}</Typography>
                }

                <Box mt={1} color={GREY_THREE}>
                  {loading ?
                    <TextLoader width='300px' rows={[{ column: 1, size: 12 }]} /> :
                    <Typography variant='h6'>
                      {manufacturerName ? `${description || ""} |  ${manufacturerName}` : description || ''}
                    </Typography>}
                </Box>
              </Box>
            </Box>

            <Box m={2} />

            <Grid container spacing={3}>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  loading={loading}
                  label={ADMINISTRATION_DATE}
                  name='administrationDate'
                  defaultValue={new Date()}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <InputController
                  loading={loading}
                  controllerLabel={ADMINISTER_BY}
                  controllerName='administerBy'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <InputController
                  notStep
                  loading={loading}
                  fieldType="number"
                  controllerLabel={AMOUNT}
                  controllerName='amount'
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  addEmpty
                  name='units'
                  label={UNITS}
                  loading={loading}
                  options={VACCINE_UNITS_MAPPED}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <MvxSelector
                  addEmpty
                  name='mvx'
                  loading={loading}
                  mvxCode={mvxCode || ''}
                  label={MANUFACTURER_TEXT}
                  options={VACCINE_SITES_MAPPED}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <NdcSelector
                  addEmpty
                  name='ndc'
                  label={NDC_TEXT}
                  loading={loading}
                  vaccineProductId={vaccineProductId}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  addEmpty
                  name='route'
                  label={ROUTE}
                  loading={loading}
                  options={VACCINE_ROUTES_MAPPED}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <Selector
                  addEmpty
                  name='site'
                  loading={loading}
                  label={SITE_TEXT}
                  options={VACCINE_SITES_MAPPED}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <InputController
                  notStep
                  loading={loading}
                  fieldType="number"
                  controllerName='lotNo'
                  controllerLabel={LOT_NO_TEXT}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  name='expiryDate'
                  loading={loading}
                  label={EXPIRY_DATE}
                  defaultValue={new Date()}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  name='visGiven'
                  loading={loading}
                  label={VIS_GIVEN_TEXT}
                  defaultValue={new Date()}
                />
              </Grid>

              <Grid item md={6} sm={6} xs={12}>
                <DatePicker
                  isRequired
                  name='visDate'
                  loading={loading}
                  label={DATE_ON_VIS}
                  defaultValue={new Date()}
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
    </Dialog>
  )
};

export default VaccineModal;
