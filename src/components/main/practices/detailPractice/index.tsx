// packages block
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Edit } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Card, CircularProgress, Collapse, Grid, Typography } from '@material-ui/core';
// component block
import Alert from '../../../common/Alert';
import PracticeData from './practiceData';
import PhoneField from '../../../common/PhoneInput';
import InputController from '../../../../controller';
import LogoIcon from "../../../../assets/images/logo.svg";
import ViewDataLoader from '../../../common/ViewDataLoader';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { updatePracticeSchema } from '../../../../validationSchemas';
import { CustomPracticeInputProps } from '../../../../interfacesTypes';
import {
  PracticePayload, useGetPracticeLazyQuery, useUpdatePracticeMutation
} from '../../../../generated/graphql';
import {
  CANCEL, CHAMPUS, EDIT, EIN, FAX, MEDICAID, MEDICARE, NOT_FOUND_EXCEPTION, PHONE, UPIN,
  PRACTICE_IDENTIFIER, PRACTICE_NAME, SAVE_TEXT, SETTINGS_ROUTE, UPLOAD_LOGO, NO_ASSOCIATED_PRACTICE,
} from '../../../../constants';

const DetailPracticeComponent: FC = (): JSX.Element => {
  const { user, setPracticeName } = useContext(AuthContext);
  const { facility } = user || {};
  const { practice } = facility || {};
  const { id: practiceId } = practice || {};
  const [edit, setEdit] = useState<boolean>(false);
  const [practiceData, setPracticeData] = useState<PracticePayload['practice']>(null);
  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(updatePracticeSchema)
  });
  const { handleSubmit, setValue } = methods;

  const [getPractice, { loading }] = useGetPracticeLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(SETTINGS_ROUTE)
    },

    onCompleted(data) {
      const { getPractice } = data || {};

      if (getPractice) {
        const { response, practice } = getPractice

        if (response) {
          const { status } = response

          if (practice && status && status === 200) {
            setPracticeData(practice)
            const { name, phone, fax, ein, upin, medicaid, medicare, champus } = practice

            fax && setValue('fax', fax)
            ein && setValue('ein', ein)
            upin && setValue('upin', upin)
            name && setValue('name', name)
            phone && setValue('phone', phone)
            champus && setValue('champus', champus)
            medicare && setValue('medicare', medicare)
            medicaid && setValue('medicaid', medicaid)
          }
        }
      }
    }
  });

  const [updatePractice, { loading: updatePracticeLoading }] = useUpdatePracticeMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { updatePractice: { response, practice } } = data;

      if (response) {
        const { status, message } = response

        if (practice && message && status && status === 200) {
          const { name } = practice

          name && setPracticeName(name)
          fetchPractice();
          setEdit(false)
          Alert.success(message);
        }
      }
    }
  });

  const fetchPractice = useCallback(async () => {
    try {
      await getPractice({
        variables: { getPractice: { id: practiceId } }
      });
    } catch (error) { }
  }, [getPractice, practiceId]);

  useEffect(() => {
    if (practiceId) {
      fetchPractice();
    } else {
      Alert.error(NO_ASSOCIATED_PRACTICE)
      history.push(SETTINGS_ROUTE)
    }
  }, [practiceId, fetchPractice]);

  const onSubmit: SubmitHandler<CustomPracticeInputProps> = async (inputs) => {
    const { name, phone, fax, upin, ein, medicaid, medicare, champus } = inputs;
    const practiceInput = { name, champus, ein, fax, medicaid, medicare, phone, upin }

    practiceId && await updatePractice({
      variables: { updatePracticeInput: { id: practiceId, ...practiceInput } }
    })
  };

  const disableSubmit = loading || updatePracticeLoading

  return (
    <Box p={4}>
      <Grid container justifyContent='center'>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box mt={5} p={5}>
              <Grid container spacing={3}>
                <Grid item md={4} sm={12}>
                  <Box className='logo-container'>
                    <img src={LogoIcon} alt="" />
                  </Box>

                  <Box mt={2} ml={1}>
                    <Button type="submit" variant="outlined" color="secondary">
                      {UPLOAD_LOGO}
                    </Button>
                  </Box>
                </Grid>

                <Grid item md={8} sm={12}>
                  {loading ? <ViewDataLoader columns={6} rows={4} /> :
                    <FormProvider {...methods}>
                      <Box onClick={() => setEdit(!edit)} mb={3} display="flex" justifyContent="flex-end">
                        <Box display='flex'>
                          {edit ?
                            <>
                              <Button color="secondary">{CANCEL}</Button>

                              <Box display="flex" justifyContent="flex-start" pl={2}>
                                <Button type="submit" variant="contained" color="primary"
                                  disabled={disableSubmit}
                                >
                                  {SAVE_TEXT}

                                  {disableSubmit && <CircularProgress size={20} color="inherit" />}
                                </Button>
                              </Box>
                            </>
                            :
                            <Button variant="contained" color="primary" startIcon={<Edit />}>{EDIT}</Button>
                          }
                        </Box>
                      </Box>

                      <Collapse in={!edit} mountOnEnter unmountOnExit>
                        <PracticeData practiceData={practiceData} />
                      </Collapse>

                      <Collapse in={edit} mountOnEnter unmountOnExit>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Grid container spacing={3}>
                            <Grid item md={12} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="name"
                                controllerLabel={PRACTICE_NAME}
                              />
                            </Grid>
                          </Grid>

                          <Grid container spacing={3}>
                            <Grid item md={6} sm={12}>
                              <PhoneField name="phone" label={PHONE} />
                            </Grid>

                            <Grid item md={6} sm={12}>
                              <PhoneField name="fax" label={FAX} />
                            </Grid>
                          </Grid>

                          <Grid container spacing={3}>
                            <Grid item md={12} sm={12}>
                              <Typography variant='h6'>{PRACTICE_IDENTIFIER}</Typography>
                            </Grid>
                          </Grid>

                          <Box p={2} />

                          <Grid container spacing={3}>
                            <Grid item md={6} sm={12}>
                              <Grid container spacing={3}>
                                <Grid item md={6} sm={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="ein"
                                    controllerLabel={EIN}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="upin"
                                    controllerLabel={UPIN}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item md={6} sm={12}>
                              <Grid container spacing={3}>
                                <Grid item md={6} sm={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="medicare"
                                    controllerLabel={MEDICARE}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="medicaid"
                                    controllerLabel={MEDICAID}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid container spacing={3}>
                            <Grid item md={6} sm={12}>
                              <Grid container spacing={3}>
                                <Grid item md={6} sm={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="champus"
                                    controllerLabel={CHAMPUS}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </form>
                      </Collapse>
                    </FormProvider>}
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DetailPracticeComponent;
