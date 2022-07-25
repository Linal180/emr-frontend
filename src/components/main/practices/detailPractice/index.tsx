// packages block
import { Reducer, useReducer, FC, useCallback, useContext, useEffect } from 'react';
import { Edit } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, Card, CircularProgress, Collapse, Grid, Typography } from '@material-ui/core';
// component block
import Alert from '../../../common/Alert';
import PracticeData from './practiceData';
import PhoneField from '../../../common/PhoneInput';
import InputController from '../../../../controller';
// constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { updatePracticeSchema } from '../../../../validationSchemas';
import { CustomPracticeInputProps } from '../../../../interfacesTypes';
import { PracticePayload, useGetPracticeLazyQuery, useUpdatePracticeMutation } from '../../../../generated/graphql';
import {
  CANCEL, CHAMPUS, EDIT, EIN, FAX, MEDICAID, MEDICARE, NOT_FOUND_EXCEPTION, PHONE, UPIN,
  PRACTICE_IDENTIFIER, PRACTICE_NAME, SAVE_TEXT, SETTINGS_ROUTE, NO_ASSOCIATED_PRACTICE,
  ATTACHMENT_TITLES, TAX_ID_INFO, GROUP_TAX_ID, NPI_INFO, GROUP_NPI, PRACTICE_DETAILS,
} from '../../../../constants';
import {
  Action as MediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer,
  State as MediaState
} from '../../../../reducers/mediaReducer';

const DetailPracticeComponent: FC = (): JSX.Element => {
  const { user, setPracticeName } = useContext(AuthContext);
  const { facility } = user || {};
  const { practice } = facility || {};

  const { id: practiceId } = practice || {};
  const [mediaState, mediaDispatch] = useReducer<Reducer<MediaState, MediaAction>>(mediaReducer, mediaInitialState)
  const { isEdit, practiceData } = mediaState

  const methods = useForm<CustomPracticeInputProps>({
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
            const { attachments } = practice || {}
            const practiceAttachment = attachments?.find(({ title }) => title === ATTACHMENT_TITLES.PracticeLogo);
            const { id } = practiceAttachment || {}

            id && mediaDispatch({ type: mediaActionType.SET_ATTACHMENT_ID, attachmentId: id })

            practiceAttachment && mediaDispatch({
              type: mediaActionType.SET_ATTACHMENT_DATA,
              attachmentData: practiceAttachment
            })

            mediaDispatch({ type: mediaActionType.SET_PRACTICE_DATA, practiceData: practice })
            setEditData(practice);
          }
        }
      }
    }
  });

  const setEditData = (practice: PracticePayload['practice']) => {
    const { name, phone, fax, ein, upin, medicaid, medicare, champus, npi, taxId } = practice || {};

    fax && setValue('fax', fax)
    ein && setValue('ein', ein)
    upin && setValue('upin', upin)
    name && setValue('name', name.trim())
    phone && setValue('phone', phone)
    champus && setValue('champus', champus)
    medicare && setValue('medicare', medicare)
    medicaid && setValue('medicaid', medicaid)
    taxId && setValue('taxId', taxId)
    npi && setValue('npi', npi)
  }

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
          Alert.success(message);
          mediaDispatch({ type: mediaActionType.SET_IS_EDIT, isEdit: !isEdit })
          fetchPractice()
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
    const { name, phone, fax, upin, ein, medicaid, medicare, champus, npi, taxId } = inputs;
    const practiceInput = { name, champus, ein, fax, medicaid, medicare, phone, upin, npi, taxId }

    practiceId && await updatePractice({
      variables: {
        updatePracticeInput: {
          updatePracticeItemInput: { id: practiceId, ...practiceInput }
        }
      }
    })
  };

  const editHandler = () => {
    mediaDispatch({ type: mediaActionType.SET_IS_EDIT, isEdit: !isEdit })
    isEdit && setEditData(practiceData)
  }

  const isLoading = loading || updatePracticeLoading

  return (
    <Box p={4}>
      <Grid container justifyContent='center'>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box mt={5} p={5}>
              <Grid container spacing={3}>
                {/* <Grid item md={4} sm={12} xs={12}>
                  <Box className={`${attachmentLoading || attachmentId ? '' : 'logo-container'}`} ml={2}>
                    {attachmentLoading ?
                      <Avatar variant="square" className={classes.profileImage}>
                        <CircularProgress size={20} color="inherit" />
                      </Avatar>
                      : attachmentId ?
                        <Avatar variant="square" src={attachmentUrl} className={classes.profileImage} />
                        : <Avatar variant="square" src={LogoIcon} className={classes.profileImage} />
                    }
                  </Box>

                  <Box>
                    <MediaCards
                      button={true}
                      notDescription={true}
                      buttonText={UPLOAD_LOGO}
                      itemId={practiceId || ''}
                      imageSide={attachmentUrl}
                      moduleType={AttachmentType.Practice}
                      title={ATTACHMENT_TITLES.PracticeLogo}
                      attachmentData={attachmentData || undefined}
                      reload={() => fetchAttachments()}
                    />
                  </Box>
                </Grid> */}

                <Grid item md={12} sm={12}>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Box mb={3} display="flex" justifyContent="space-between">
                        <Typography variant='h3'>{PRACTICE_DETAILS}</Typography>

                        <Box display='flex'>
                          {isEdit ?
                            <>
                              <Button onClick={editHandler} color="secondary">{CANCEL}</Button>

                              <Box display="flex" justifyContent="flex-start" pl={2}>
                                <Button type="submit" variant="contained" color="primary"
                                  disabled={isLoading}
                                >
                                  {SAVE_TEXT}

                                  {isLoading && <CircularProgress size={20} color="inherit" />}
                                </Button>
                              </Box>
                            </>
                            :
                            <Button onClick={editHandler} variant="contained" color="primary" startIcon={<Edit />}>
                              {EDIT}
                            </Button>
                          }
                        </Box>
                      </Box>

                      <Collapse in={!isEdit} mountOnEnter unmountOnExit>
                        <PracticeData practiceData={practiceData} loading={isLoading} />
                      </Collapse>

                      <Collapse in={isEdit} mountOnEnter unmountOnExit>
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
                          <Grid item md={4} sm={12}>
                            <InputController
                              fieldType="text"
                              controllerName="champus"
                              controllerLabel={CHAMPUS}
                            />
                          </Grid>
                          <Grid item md={4} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              info={TAX_ID_INFO}
                              controllerName="taxId"
                              controllerLabel={GROUP_TAX_ID}
                            />
                          </Grid>

                          <Grid item md={4} sm={12} xs={12}>
                            <InputController
                              isRequired
                              info={NPI_INFO}
                              fieldType="text"
                              controllerName="npi"
                              controllerLabel={GROUP_NPI}
                            />
                          </Grid>
                        </Grid>

                      </Collapse>
                    </form>
                  </FormProvider>
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
