//packages Import
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useParams } from "react-router";
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
//components Import
import Alert from "../../../../common/Alert";
import DropzoneImage from "../../../../common/DropZoneImage";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import ConfirmationModal from "../../../../common/ConfirmationModal";
//constants, types, interfaces imports 
import { mediaType } from "../../../../../utils";
import { TrashOutlinedIcon } from "../../../../../assets/svgs";
import { FormForwardRef, ParamsType, PolicyAttachmentProps } from "../../../../../interfacesTypes";
import {
  ATTACHMENT_TITLES, DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION, INSURANCE_CARD,
  INSURANCE_CARD_DELETED, NOT_FOUND_EXCEPTION, PATIENT_INSURANCE, PLEASE_SELECT_MEDIA, TAKE_A_PICTURE_OF_INSURANCE,
  USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../../constants";
import {
  AttachmentType, AttachmentWithPreSignedUrlPayload, useFetchDocumentTypeByNameLazyQuery,
  useGetAttachmentsByPolicyIdLazyQuery, useRemoveAttachmentMediaMutation
} from "../../../../../generated/graphql";
import { ActionType } from "../../../../../reducers/mediaReducer";

const PolicyAttachments = forwardRef<FormForwardRef, PolicyAttachmentProps>(({ policyId, dispatch, state, isEdit }, ref) => {
  const { id: patientId } = useParams<ParamsType>()
  const [policyAttachmentId, setPolicyAttachmentId] = useState<string>('')
  const dropZoneRef = useRef<FormForwardRef>(null);

  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [documentTypeId, setDocumentTypeId] = useState<string>('')
  const [attachments, setAttachments] =
    useState<AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl']>([])
  const { files, policyAttachments } = state || {}
  const [fetchDocumentType] = useFetchDocumentTypeByNameLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      name: PATIENT_INSURANCE
    },

    onCompleted(data) {
      if (data) {
        const { fetchDocumentTypeByName } = data ?? {}
        const { documentType } = fetchDocumentTypeByName ?? {}
        const { id } = documentType ?? {}
        setDocumentTypeId(id || '')
      }
    }
  })

  useEffect(() => {
    fetchDocumentType()
  }, [fetchDocumentType])

  const [getAttachments, { loading }] = useGetAttachmentsByPolicyIdLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      getAttachmentsByPolicyId: {
        policyId: policyId ?? '',
        typeId: patientId ?? ''
      }
    },

    onError() {
      return null
    },

    async onCompleted(data) {
      if (data) {
        const { getAttachmentsByPolicyId } = data

        if (getAttachmentsByPolicyId) {
          const { attachmentsWithPreSignedUrl } = getAttachmentsByPolicyId

          attachmentsWithPreSignedUrl &&
            setAttachments(
              attachmentsWithPreSignedUrl as AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl']
            )
          dispatch && dispatch({ type: ActionType.SET_POLICY_ATTACHMENTS, policyAttachments: attachmentsWithPreSignedUrl as AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl'] })
        }
      }
    },
  })

  const fetchAttachmentsByPolicyId = useCallback(async () => {
    try {
      await getAttachments({});
    } catch (error) { }
  }, [getAttachments])

  useEffect(() => {
    policyId && fetchAttachmentsByPolicyId()
  }, [fetchAttachmentsByPolicyId, policyId])

  const [removeAttachmentMedia, { loading: removeAttachmentLoading }] = useRemoveAttachmentMediaMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        : Alert.error(message)
    },

    onCompleted() {
      Alert.success(INSURANCE_CARD_DELETED)
      fetchAttachmentsByPolicyId()
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      setPolicyAttachmentId(id)
      setOpenDelete(true)
    }
  };

  const handleFileDeletion = async () => {
    await removeAttachmentMedia({
      variables: { id: policyAttachmentId }
    })

    setOpenDelete(false)
  }

  useImperativeHandle(ref, () => ({
    submit() {
      dropZoneRef?.current?.submit()
    }
  }));
  console.log('!!policyAttachments?.length || !!files?.length', !!policyAttachments?.length || !!files?.length)
  return (
    loading ? <ViewDataLoader columns={3} rows={4} /> :
      <Box minWidth="100%">
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <Typography variant='h5'>{TAKE_A_PICTURE_OF_INSURANCE}</Typography>
            <Box my={3}>
              <Grid container spacing={3}>
                {attachments?.map((attachment) => {
                  return (
                    <Grid item md={3} sm={12} xs={12}>
                      <Box className="card-box">
                        <Box className="card-img">
                          <img src={attachment?.preSignedUrl || ''} alt={attachment?.preSignedUrl || ''} />
                        </Box>

                        <Box className="card-overlay">
                          <IconButton className="del-icon" onClick={() => onDeleteClick(attachment?.id || '')}>
                            <TrashOutlinedIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            <DropzoneImage
              filesLimit={2}
              isEdit={false}
              ref={dropZoneRef}
              attachmentId={''}
              itemId={patientId}
              attachmentName={''}
              providerName={''}
              imageModuleType={AttachmentType.Patient}
              title={ATTACHMENT_TITLES.InsuranceCard1}
              attachmentMetadata={{ documentTypeId, policyId: policyId ?? '' }}
              reload={() => { }}
              handleClose={() => { }}
              setAttachments={() => { }}
              acceptableFilesType={mediaType(ATTACHMENT_TITLES.InsuranceCard1)}
              setFiles={(files: File[]) => dispatch && dispatch({ type: ActionType.SET_FILES, files: files })}
            />

            {isEdit ? (!!!policyAttachments?.length && !!!files?.length)
              && <Typography className='danger' variant="caption">{PLEASE_SELECT_MEDIA}</Typography>
              : !!!files?.length &&
              <Typography className='danger' variant="caption">{PLEASE_SELECT_MEDIA}</Typography>
            }

            <ConfirmationModal
              title={INSURANCE_CARD}
              isOpen={openDelete}
              isLoading={removeAttachmentLoading}
              description={DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION}
              handleDelete={handleFileDeletion}
              setOpen={(openDelete: boolean) => setOpenDelete(openDelete)}
            />
          </Grid>
        </Grid>
      </Box>
  )
})

export default PolicyAttachments
