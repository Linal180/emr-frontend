//packages Import
import { forwardRef, Reducer, useCallback, useEffect, useImperativeHandle, useReducer, useRef } from "react";
import { useParams } from "react-router";
import { Box, Button, Grid, IconButton, Typography } from "@material-ui/core";
//components Import
import Alert from "../../../../common/Alert";
import DropzoneImage from "../../../../common/DropZoneImage";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import ConfirmationModal from "../../../../common/ConfirmationModal";
//constants, types, interfaces imports 
import { TrashOutlinedIcon } from "../../../../../assets/svgs";
import { mediaType, renderTextLoading } from "../../../../../utils";
import { FormForwardRef, ParamsType, PolicyAttachmentProps } from "../../../../../interfacesTypes";
import {
  Action, ActionType, insuranceReducer, initialState, State
} from "../../../../../reducers/insuranceReducer";
import {
  ATTACHMENT_TITLES, DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION, INSURANCE_CARD,
  INSURANCE_CARD_DELETED, NOT_FOUND_EXCEPTION, OPEN_CAMERA, PATIENT_INSURANCE, TAKE_A_PICTURE_OF_INSURANCE,
  USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../../constants";
import {
  AttachmentType, AttachmentWithPreSignedUrlPayload, useFetchDocumentTypeByNameLazyQuery,
  useGetAttachmentsByPolicyIdLazyQuery, useRemoveAttachmentMediaMutation
} from "../../../../../generated/graphql";

const PolicyAttachments = forwardRef<FormForwardRef, PolicyAttachmentProps>(
  ({ policyId, dispatch, numberOfFiles }, ref) => {
    const { id: patientId } = useParams<ParamsType>()
    const dropZoneRef = useRef<FormForwardRef>(null);

    const [{ documentTypeId, openDelete, policyAttachmentId, attachments, cameraOpen }, insuranceDispatch] =
      useReducer<Reducer<State, Action>>(insuranceReducer, initialState)

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

          insuranceDispatch({ type: ActionType.SET_DOCUMENT_TYPE_ID, documentTypeId: id || '' })
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

            attachmentsWithPreSignedUrl && dispatch({
              type: ActionType.SET_NUMBER_OF_FILES,
              numberOfFiles: attachmentsWithPreSignedUrl?.length
            })

            attachmentsWithPreSignedUrl &&
              insuranceDispatch({
                type: ActionType.SET_ATTACHMENTS,
                attachments: attachmentsWithPreSignedUrl as AttachmentWithPreSignedUrlPayload['attachmentsWithPreSignedUrl']
              })
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
        insuranceDispatch({ type: ActionType.SET_POLICY_ATTACHMENT_ID, policyAttachmentId: id })
        insuranceDispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
      }
    };

    const handleFileDeletion = async () => {
      await removeAttachmentMedia({
        variables: { id: policyAttachmentId }
      })

      insuranceDispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    }

    useImperativeHandle(ref, () => ({
      submit() {
        dropZoneRef?.current?.submit()
      }
    }));

    return (
      <Box minWidth="100%">
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <Typography variant='h5'>{loading ? renderTextLoading() : TAKE_A_PICTURE_OF_INSURANCE}</Typography>

            {loading ? <ViewDataLoader columns={1} rows={1} hasMedia /> :
              <Box my={3}>
                <Grid container spacing={3}>
                  {attachments?.map((attachment) => (
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
                  ))}
                </Grid>
              </Box>
            }

            {!cameraOpen && <Box mb={2} display="flex" justifyContent="flex-end">
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => insuranceDispatch({ type: ActionType.SET_CAMERA_OPEN, cameraOpen: true })}>
                {OPEN_CAMERA}
              </Button>
            </Box>}

            {!loading &&
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
                setFiles={(files: File[]) => numberOfFiles ?
                  dispatch({
                    type: ActionType.SET_NUMBER_OF_FILES,
                    numberOfFiles: numberOfFiles
                  })
                  : dispatch({
                    type: ActionType.SET_NUMBER_OF_FILES,
                    numberOfFiles: files?.length
                  })}
                numberOfFiles={numberOfFiles}
                acceptableFilesType={mediaType(ATTACHMENT_TITLES.InsuranceCard1)}
                cameraOpen={cameraOpen}
                setCameraOpen={(value) => insuranceDispatch({ type: ActionType.SET_CAMERA_OPEN, cameraOpen: value })}
              />
            }

            <ConfirmationModal
              title={INSURANCE_CARD}
              isOpen={openDelete}
              isLoading={removeAttachmentLoading}
              description={DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION}
              handleDelete={handleFileDeletion}
              setOpen={(openDelete: boolean) => insuranceDispatch({
                type: ActionType.SET_OPEN_DELETE,
                openDelete: openDelete
              })}
            />
          </Grid>
        </Grid>
      </Box>
    )
  })

export default PolicyAttachments
