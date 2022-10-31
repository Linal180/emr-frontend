// packages
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FC, Reducer, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import {
  Box, Button, Card, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, Typography
} from '@material-ui/core';
//components
import Alert from '../../common/Alert';
import BackButton from '../../common/BackButton';
import PageHeader from '../../common/PageHeader';
import InputController from '../../../controller';
import DropzoneImage from '../../common/DropZoneImage';
import ViewDataLoader from '../../common/ViewDataLoader';
//constants, types, interfaces, utils
import history from '../../../history';
import { GRAY_SIX } from '../../../theme';
import { AuthContext } from '../../../context';
import { createAgreementSchema } from '../../../validationSchemas';
import { useTableStyles } from "../../../styles/tableStyles";
import { isFacilityAdmin, isPracticeAdmin, isSuperAdmin, mediaType } from '../../../utils';
import { Action, ActionType, agreementReducer, initialState, State } from '../../../reducers/agreementReducer';
import { CreateAgreementFormProps, FormForwardRef, GeneralFormProps, ParamsType } from '../../../interfacesTypes';
import {
  AttachmentType, useCreateAgreementMutation, useFetchAgreementLazyQuery, useRemoveAgreementMutation, useUpdateAgreementMutation
} from '../../../generated/graphql';
import {
  AGREEMENTS, AGREEMENTS_BREAD, AGREEMENTS_EDIT_BREAD, AGREEMENTS_NEW_BREAD, AGREEMENTS_ROUTE, AGREEMENT_BODY,
  ATTACHMENT_TITLES, CREATE_AGREEMENT_MESSAGE, DASHBOARD_BREAD, DETAILS, EDIT_AGREEMENT, REQUIRE_SIGNATURE,
  SAVE_TEXT, TITLE, UPDATE_AGREEMENT_MESSAGE, REQUIRE_AGREEMENT_BEFORE_AGREEING, DESCRIPTION_TYPE,
  AGREEMENT_BODY_REQUIRED, FILE_REQUIRED, ADD_AGREEMENT, PLEASE_SELECT_MEDIA,
} from '../../../constants';

const AddAgreementComponent: FC<GeneralFormProps> = () => {
  const { id } = useParams<ParamsType>()
  const { user } = useContext(AuthContext)
  const classes = useTableStyles()
  const descriptionTypes = ['Text Editor', 'File Upload'];

  const { roles, facility } = user || {};
  const [state, dispatch] = useReducer<Reducer<State, Action>>(agreementReducer, initialState)
  const { agreementId, agreementBody, signatureRequired, viewAgreementBeforeAgreeing,
    descriptionType, isLoaded, withFile, files, cameraOpen, uploading
  } = state

  const { id: facilityId, practice } = facility || {};
  const { id: practiceId } = practice || {}
  const isSuper = isSuperAdmin(roles)

  const isPractice = isPracticeAdmin(roles)
  const isFac = isFacilityAdmin(roles)
  const dropZoneRef = useRef<FormForwardRef>(null)

  const methods = useForm<CreateAgreementFormProps>({
    mode: "all",
    resolver: yupResolver(createAgreementSchema)
  });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods
  const validated = !!Object.keys(errors).length

  const [removeAgreement, { loading: deleteAgreementLoading }] = useRemoveAgreementMutation({
    onError: () => { },

    onCompleted: (data) => {
      const { removeAgreement } = data;
      const { response } = removeAgreement || {}
      const { status } = response || {}

      if (status === 200) {
        dispatch({ type: ActionType.SET_AGREEMENT_ID, agreementId: '' })
      }
    }
  });

  const [createAgreement, { loading: createAgreementLoading }] = useCreateAgreementMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createAgreement: { response, agreement } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          agreement && dispatch({ type: ActionType.SET_AGREEMENT_ID, agreementId: agreement.id })
          if (descriptionType === descriptionTypes[1]) { dropZoneRef.current?.submit() }
          else {
            Alert.success(CREATE_AGREEMENT_MESSAGE);
            reset()
            history.push(AGREEMENTS_ROUTE)
          }
        }
      }
    }
  });

  const [updateAgreement, { loading: updateAgreementLoading }] = useUpdateAgreementMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateAgreement: { response, agreement } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          agreement && dispatch({ type: ActionType.SET_AGREEMENT_ID, agreementId: agreement.id })
          if (descriptionType === descriptionTypes[1]) { dropZoneRef.current?.submit() }
          else {
            Alert.success(UPDATE_AGREEMENT_MESSAGE);
            reset()
            history.push(AGREEMENTS_ROUTE)
          }
        }
      }
    }
  });

  const [fetchAgreement] = useFetchAgreementLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      Alert.error('Unable to find Agreement Info')
    },

    onCompleted(data) {
      const { fetchAgreement: fetchAgreementResults } = data || {};

      if (fetchAgreementResults) {
        const { agreement } = fetchAgreementResults
        const { body, signatureRequired, title, viewAgreementBeforeAgreeing } = agreement ?? {}
        !body && dispatch({ type: ActionType.SET_WITH_FILE, withFile: true })
        body && dispatch({ type: ActionType.SET_AGREEMENT_BODY, agreementBody: body })
        title && setValue('title', title)
        dispatch({ type: ActionType.SET_SIGNATURE_REQUIRED, signatureRequired: signatureRequired ?? false })
        dispatch({ type: ActionType.SET_VIEW_AGREEMENT_BEFORE_AGREEING, viewAgreementBeforeAgreeing: viewAgreementBeforeAgreeing ?? false })
        dispatch({ type: ActionType.SET_IS_LOADED, isLoaded: false })
      }
    }
  });

  const findAgreement = useCallback(async () => {
    try {
      await fetchAgreement({ variables: { agreementId: id } })
    } catch (error) { }
  }, [fetchAgreement, id])

  useEffect(() => {
    id && findAgreement()
  }, [findAgreement, id])

  const onSubmit: SubmitHandler<CreateAgreementFormProps> = async ({ title }) => {
    const agreementInputs = isSuper ? { practiceId: null, facilityId: null } :
      isPractice ? { practiceId, facilityId: null } :
        isFac ? { practiceId, facilityId } : undefined
    if (id) {
      if (withFile) {
        return await updateAgreement({
          variables: {
            updateAgreementInput: {
              id,
              title: title,
              signatureRequired,
              viewAgreementBeforeAgreeing,
              ...(agreementInputs ? agreementInputs : {})
            }
          },
        });
      }

      if (agreementBody.length) {
        return await updateAgreement({
          variables: {
            updateAgreementInput: {
              id,
              title: title,
              body: agreementBody,
              signatureRequired,
              viewAgreementBeforeAgreeing,
              ...(agreementInputs ? agreementInputs : {})
            }
          },
        });
      }
    }

    if ((descriptionType === descriptionTypes[0] && !agreementBody.length)) {
      dispatch({ type: ActionType.SET_BODY_STATUS, bodyStatus: true })
      return Alert.error(AGREEMENT_BODY_REQUIRED)
    }

    if ((descriptionType === descriptionTypes[1] && !files?.length)) {
      dispatch({ type: ActionType.SET_BODY_STATUS, bodyStatus: true })
      return Alert.error(PLEASE_SELECT_MEDIA)
    }

    await createAgreement({
      variables: {
        createAgreementInput: {
          body: agreementBody,
          title: title,
          signatureRequired,
          viewAgreementBeforeAgreeing,
          ...(agreementInputs ? agreementInputs : {})
        }
      },
    });
  };

  const onEditorChange = (editor: ClassicEditor) =>
    dispatch({ type: ActionType.SET_AGREEMENT_BODY, agreementBody: editor.getData() });

  const onUploading = (open: boolean, errMsg?: string) => {
    dispatch({ type: ActionType.SET_UPLOADING, uploading: open })
    if (!open && errMsg) {
      removeAgreement({ variables: { agreementId } })
      Alert.error(errMsg);
    } else if (!open) {
      Alert.success(id ? UPDATE_AGREEMENT_MESSAGE : CREATE_AGREEMENT_MESSAGE);
      reset()
      history.push(AGREEMENTS_ROUTE)
    }

  }

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex'>
            <BackButton to={`${AGREEMENTS_ROUTE}`} />

            <Box ml={2}>
              <PageHeader title={id ? EDIT_AGREEMENT : ADD_AGREEMENT}
                path={[DASHBOARD_BREAD, AGREEMENTS_BREAD, id ?
                  AGREEMENTS_EDIT_BREAD : AGREEMENTS_NEW_BREAD]
                }
              />
            </Box>
          </Box>

          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" color='textPrimary'>{AGREEMENTS}</Typography>

            <Box display="flex" alignItems="center">
              <Button type="submit" variant="contained" color="primary"
                disabled={createAgreementLoading || updateAgreementLoading || uploading || deleteAgreementLoading}
              >
                {SAVE_TEXT}

                {(createAgreementLoading || updateAgreementLoading || uploading || deleteAgreementLoading) &&
                  <CircularProgress size={20} color="inherit" />
                }
              </Button>
            </Box>
          </Box>

          <Card>
            {id && isLoaded ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> :
              <Box p={3}>
                <Box pb={2} mb={4} borderBottom={`1px solid ${GRAY_SIX}`}>
                  <Typography variant='h6'>{DETAILS}</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      isRequired
                      controllerName="title"
                      controllerLabel={TITLE}
                    />
                  </Grid>

                  {!id && <Grid item md={12} sm={12} xs={12}>
                    <Typography variant='body1'>{DESCRIPTION_TYPE}</Typography>

                    <Box mt={1} width="fit-content">
                      <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                        {descriptionTypes.map(type =>
                          <Box
                            className={type === descriptionType ? `${classes.selectedBox} ${classes.selectBox}` : classes.selectBox}
                            onClick={() => {
                              dispatch({ type: ActionType.SET_DESCRIPTION_TYPE, descriptionType: type })
                              type === descriptionTypes[1] && dispatch({ type: ActionType.SET_AGREEMENT_BODY, agreementBody: '' })
                            }}
                          >
                            <Typography variant='h6'>{type}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>}

                  {descriptionType === descriptionTypes[0] && !withFile && <Grid item md={12} sm={12} xs={12}>
                    <Typography>{AGREEMENT_BODY}</Typography>
                    <Box p={0.5} />

                    <CKEditor
                      editor={ClassicEditor}
                      data={agreementBody}
                      onChange={(_: any, editor: ClassicEditor) => onEditorChange(editor)}
                    />
                    {/* 
                    {bodyStatus &&
                      <Typography className='danger' variant="caption">{AGREEMENT_BODY_REQUIRED}</Typography>} */}
                  </Grid>}

                  <Box p={2} />

                  {!id && descriptionType === descriptionTypes[1] &&
                    <Grid item md={12} sm={12} xs={12}>
                      <DropzoneImage
                        isEdit={false}
                        ref={dropZoneRef}
                        attachmentId={''}
                        itemId={agreementId}
                        attachmentName={''}
                        providerName={''}
                        imageModuleType={AttachmentType.SuperAdmin}
                        title={ATTACHMENT_TITLES.Agreement}
                        attachmentMetadata={{ agreementId: agreementId ?? '' }}
                        reload={() => { }}
                        handleClose={() => { }}
                        setAttachments={() => { }}
                        setFiles={(files: File[]) => dispatch({ type: ActionType.SET_FILES, files: files })}
                        acceptableFilesType={mediaType(ATTACHMENT_TITLES.Agreement)}
                        cameraOpen={cameraOpen}
                        onUploading={onUploading}
                        setCameraOpen={(value) => dispatch({ type: ActionType.SET_CAMERA_OPEN, cameraOpen: value })}
                      />

                      {validated && !!!files?.length &&
                        <Typography className='danger' variant="caption">{FILE_REQUIRED}</Typography>
                      }
                    </Grid>}

                  <Grid item md={12} sm={12} xs={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Box>
                            <Checkbox color="primary" checked={signatureRequired}
                              onChange={({ currentTarget: { checked } }) =>
                                dispatch({ type: ActionType.SET_SIGNATURE_REQUIRED, signatureRequired: checked })}
                            />
                          </Box>
                        }

                        label={<Typography variant="h6">{REQUIRE_SIGNATURE}</Typography>}
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Box>
                            <Checkbox color="primary" checked={viewAgreementBeforeAgreeing}
                              onChange={({ currentTarget: { checked } }) =>
                                dispatch({
                                  type: ActionType.SET_VIEW_AGREEMENT_BEFORE_AGREEING,
                                  viewAgreementBeforeAgreeing: checked
                                })}
                            />
                          </Box>
                        }

                        label={<Typography variant="h6">{REQUIRE_AGREEMENT_BEFORE_AGREEING}</Typography>}
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </Box>
            }
          </Card>
        </form>
      </FormProvider>
    </>
  )
}

export default AddAgreementComponent;
