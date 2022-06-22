// packages
import { Box, Button, Card, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid, Typography } from '@material-ui/core';
import { CKEditor, CKEditorEventPayload } from 'ckeditor4-react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//components
import InputController from '../../../controller';
import Alert from '../../common/Alert';
import BackButton from '../../common/BackButton';
import DropzoneImage from '../../common/DropZoneImage';
import PageHeader from '../../common/PageHeader';
import ViewDataLoader from '../../common/ViewDataLoader';
//constants, types, interfaces, utils
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router';
import {
  ADD_AGREEMENT,
  AGREEMENTS, AGREEMENTS_BREAD, AGREEMENTS_EDIT_BREAD, AGREEMENTS_NEW_BREAD, AGREEMENTS_ROUTE, AGREEMENT_BODY, ATTACHMENT_TITLES,
  CREATE_AGREEMENT_MESSAGE, DASHBOARD_BREAD, DETAILS, EDIT_AGREEMENT, REQUIRE_AGREEMENT_BEFORE_AGREEING, REQUIRE_SIGNATURE,
  SAVE_TEXT, TITLE, UPDATE_AGREEMENT_MESSAGE
} from '../../../constants';
import { AttachmentType, useCreateAgreementMutation, useFetchAgreementLazyQuery, useUpdateAgreementMutation } from '../../../generated/graphql';
import history from '../../../history';
import { CreateAgreementFormProps, FormForwardRef, GeneralFormProps, ParamsType } from '../../../interfacesTypes';
import { GRAY_SIX } from '../../../theme';
import { mediaType } from '../../../utils';
import { createAgreementSchema } from '../../../validationSchemas';
import { useChartingStyles } from '../../../styles/chartingStyles';

const AddAgreementComponent: FC<GeneralFormProps> = () => {
  const chartingClasses = useChartingStyles()
  const [files, setFiles] = useState<File[]>();
  const [signatureRequired, setSignatureRequired] = useState<boolean>(false)
  const [viewAgreementBeforeAgreeing, setViewAgreementBeforeAgreeing] = useState<boolean>(false)
  const [agreementBody, setAgreementBody] = useState<string>('')
  const [agreementId, setAgreementId] = useState<string>('')
  const descriptionTypes = ['Text Editor', 'File Upload']
  const [descriptionType, setDescriptionType] = useState<string>(descriptionTypes[0])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const { id } = useParams<ParamsType>()

  const dropZoneRef = useRef<FormForwardRef>(null)

  const methods = useForm<CreateAgreementFormProps>({
    mode: "all",
    resolver: yupResolver(createAgreementSchema)
  });
  const { reset, handleSubmit, setValue } = methods

  const [createAgreement, { loading: createAgreementLoading }] = useCreateAgreementMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createAgreement: { response, agreement } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          agreement && setAgreementId(agreement.id)
          dropZoneRef.current?.submit()
          Alert.success(CREATE_AGREEMENT_MESSAGE);
          reset()
          history.push(AGREEMENTS_ROUTE)
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
          Alert.success(UPDATE_AGREEMENT_MESSAGE);
          agreement && setAgreementId(agreement.id)
          dropZoneRef.current?.submit()
          reset()
          history.push(AGREEMENTS_ROUTE)
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
        console.log('agreement', agreement)
        body && setAgreementBody(body)
        title && setValue('title', title)
        setSignatureRequired(signatureRequired ?? false)
        setViewAgreementBeforeAgreeing(viewAgreementBeforeAgreeing ?? false)
        setIsLoaded(false)
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
    if ((descriptionType === descriptionTypes[0] && !agreementBody.length) || (descriptionType === descriptionTypes[1] && !files?.length)) {
      return
    }

    if (id) {
      return await updateAgreement({
        variables: {
          updateAgreementInput: {
            id,
            body: agreementBody,
            title: title,
            signatureRequired,
            viewAgreementBeforeAgreeing
          }
        },
      });
    }
    await createAgreement({
      variables: {
        createAgreementInput: {
          body: agreementBody,
          title: title,
          signatureRequired,
          viewAgreementBeforeAgreeing
        }
      },
    });
  };

  const onEditorChange = ({ editor }: CKEditorEventPayload<"change">) => setAgreementBody(editor.getData());
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex'>
            <BackButton to={`${AGREEMENTS_ROUTE}`} />

            <Box ml={2}>
              <PageHeader title={id ? EDIT_AGREEMENT : ADD_AGREEMENT} path={[DASHBOARD_BREAD, AGREEMENTS_BREAD, id ? AGREEMENTS_EDIT_BREAD : AGREEMENTS_NEW_BREAD]} />
            </Box>

          </Box>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" color='textPrimary'>{AGREEMENTS}</Typography>

            <Box display="flex" alignItems="center">
              <Button type="submit" variant="contained" color="primary" disabled={createAgreementLoading || updateAgreementLoading}>
                {SAVE_TEXT}
                {(createAgreementLoading || updateAgreementLoading) && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </Box>

          <Card>
            {
              id && isLoaded ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> :
                <Box p={3}>
                  <Box pb={2} mb={4} borderBottom={`1px solid ${GRAY_SIX}`}>
                    <Typography variant='h6'>{DETAILS}</Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item md={4} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="title"
                        controllerLabel={TITLE}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <Typography variant='body1'>Description Type</Typography>

                      <Box className={chartingClasses.toggleProblem}>
                        <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                          {descriptionTypes.map(type =>
                            <Box onClick={() => setDescriptionType(type)}
                              className={type === descriptionType ? 'selectedBox selectBox' : 'selectBox'}
                            >
                              <Typography variant='h6'>{type}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {descriptionType === descriptionTypes[0] && <Grid item md={12} sm={12} xs={12}>
                      <Typography>{AGREEMENT_BODY}</Typography>
                      <Box p={0.5} />
                      {
                        id ? agreementBody && <CKEditor
                          name="agreementBody"
                          initData={agreementBody}
                          onChange={onEditorChange}
                        /> :
                          <CKEditor
                            name="agreementBody"
                            initData={agreementBody}
                            onChange={onEditorChange}
                          />
                      }
                      {!agreementBody.length ? <Typography className='danger' variant="caption">Agreement Body is a required Field</Typography> : ''}
                    </Grid>}

                    <Box p={2} />

                    {descriptionType === descriptionTypes[1] && <Grid item md={12} sm={12} xs={12}>
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
                        setFiles={setFiles}
                        acceptableFilesType={mediaType(ATTACHMENT_TITLES.Agreement)}
                      />
                      {!files?.length ? <Typography className='danger' variant="caption">Please select atleast one file</Typography> : ''}
                    </Grid>}
                    <Grid item md={12} sm={12} xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Box>
                              <Checkbox color="primary" checked={signatureRequired} onChange={({ currentTarget: { checked } }) => setSignatureRequired(checked)} />
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
                              <Checkbox color="primary" checked={viewAgreementBeforeAgreeing} onChange={({ currentTarget: { checked } }) => setViewAgreementBeforeAgreeing(checked)} />
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

export default AddAgreementComponent
