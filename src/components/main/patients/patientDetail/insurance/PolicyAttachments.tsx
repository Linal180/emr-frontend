//packages Import
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import { forwardRef, Reducer, useCallback, useEffect, useImperativeHandle, useReducer, useRef, useState } from "react";
import { useParams } from "react-router";
import { TrashOutlinedIcon } from "../../../../../assets/svgs";
//constants, types, interfaces imports 
import {
  ATTACHMENT_TITLES, DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION, INSURANCE_CARD,
  NOT_FOUND_EXCEPTION, PATIENT_INSURANCE, TAKE_A_PICTURE_OF_INSURANCE, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../../constants";
import {
  Attachment, AttachmentType, useFetchDocumentTypeByNameLazyQuery, useGetAttachmentLazyQuery, useGetAttachmentsByPolicyIdLazyQuery,
  useRemoveAttachmentMediaMutation
} from "../../../../../generated/graphql";
import { FormForwardRef, ParamsType, PolicyAttachmentProps, PreSignedUrlInterface } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, mediaReducer, State } from "../../../../../reducers/mediaReducer";
//components Import
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import DropzoneImage from "../../../../common/DropZoneImage";

const PolicyAttachments = forwardRef<FormForwardRef, PolicyAttachmentProps>(({ policyId, handleReload }, ref) => {
  const { id: patientId } = useParams<ParamsType>()
  const [policyAttachmentId, setPolicyAttachmentId] = useState<string>('')
  const [documentTypeId, setDocumentTypeId] = useState<string>('')
  const [preSignedUrl, setPreSignedUrl] = useState<PreSignedUrlInterface[]>([])
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const dropZoneRef = useRef<FormForwardRef>(null);
  const [, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

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

  const [getAttachment] = useGetAttachmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { getAttachment } = data || {};

      if (getAttachment) {
        const { preSignedUrl } = getAttachment

        if (preSignedUrl) {
          window.open(preSignedUrl);

          preSignedUrl && dispatch({ type: ActionType.SET_PRE_SIGNED_URL, preSignedUrl })
        }
      }
    },
  });

  const [getAttachments] = useGetAttachmentsByPolicyIdLazyQuery({
    variables: {
      getAttachmentsByPolicyId: {
        policyId: policyId ?? '',
        typeId: patientId ?? ''
      }
    },

    onError() {
      return null;
    },

    async onCompleted(data) {
      if (data) {
        const { getAttachmentsByPolicyId } = data

        if (getAttachmentsByPolicyId) {
          const { attachments } = getAttachmentsByPolicyId
          const preSignedUrls = await Promise.all(attachments?.map(async (attachmentInfo) => {
            const getAttachmentResp = await getAttachment({
              variables: {
                getMedia: {
                  id: attachmentInfo?.id
                }
              }
            })
            const { data } = getAttachmentResp ?? {}
            const { getAttachment: getAttachmentResponse } = data ?? {}
            const { preSignedUrl } = getAttachmentResponse ?? {}
            console.log("getAttachmentResp", preSignedUrl)
            return {
              attachmentId: attachmentInfo?.id || '',
              preSignedUrl: preSignedUrl || ''
            }
          }) ?? [])

          setPreSignedUrl(preSignedUrls)

          attachments && dispatch({ type: ActionType.SET_ATTACHMENTS, attachments: attachments as Attachment[] })
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
    fetchAttachmentsByPolicyId()
  }, [fetchAttachmentsByPolicyId])

  const [removeAttachmentMedia, { loading: removeAttachmentLoading }] = useRemoveAttachmentMediaMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      Alert.success('Insurance Card deleted successfully')
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
      variables: {
        id: policyAttachmentId
      }
    })

    setOpenDelete(false)
  }

  useImperativeHandle(ref, () => ({
    submit() {
      dropZoneRef?.current?.submit()
    }
  }));

  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Typography variant='h5'>{TAKE_A_PICTURE_OF_INSURANCE}</Typography>
          <Box my={3}>
            <Grid container spacing={3}>
              {preSignedUrl.map((attachment) => {
                return (
                  <Grid item md={3} sm={12} xs={12}>
                    <Box className="card-box">
                      <Box className="card-img">
                        <img src={attachment?.preSignedUrl} alt={attachment?.preSignedUrl} />
                      </Box>

                      <Box className="card-overlay">
                        <IconButton className="del-icon" onClick={() => onDeleteClick(attachment?.attachmentId || '')}>
                          <TrashOutlinedIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Box>

          {/* <MediaCards
            itemId={patientId ?? ''}
            button={true}
            notDescription={true}
            imageSide={attachmentUrl}
            buttonText={ADD_UPLOAD_IMAGES}
            moduleType={AttachmentType.Patient}
            title={ATTACHMENT_TITLES.InsuranceCard1}
            attachmentData={attachmentData || undefined}
            filesLimit={2}
            reload={() => handleReload()}
            attachmentMetadata={{ documentTypeId, policyId: policyId ?? '' }}
          /> */}

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
            acceptableFilesType={[".jpg", ".jpeg", ".png"]}
          />

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
    </Box >
  )
})

export default PolicyAttachments