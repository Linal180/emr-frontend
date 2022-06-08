//packages Import
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import { useParams } from "react-router";
//components Import
import Alert from "../../../../common/Alert";
import MediaCards from "../../../../common/AddMedia/MediaCards";
import ConfirmationModal from "../../../../common/ConfirmationModal";
//constants, types, interfaces imports 
import {
  ADD_UPLOAD_IMAGES, ATTACHMENT_TITLES, DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION, INSURANCE_CARD, 
  NOT_FOUND_EXCEPTION, TAKE_A_PICTURE_OF_INSURANCE, USER_NOT_FOUND_EXCEPTION_MESSAGE, PATIENT_INSURANCE
} from "../../../../../constants";
import {
  Attachment, AttachmentType, useFetchDocumentTypeByNameLazyQuery, useGetAttachmentsByPolicyIdLazyQuery, 
  useRemoveAttachmentMediaMutation
} from "../../../../../generated/graphql";
import { ParamsType, PolicyAttachmentProps } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, mediaReducer, State } from "../../../../../reducers/mediaReducer";
import { TrashOutlinedIcon } from "../../../../../assets/svgs";
import { BLUE } from "../../../../../theme";

const PolicyAttachments: FC<PolicyAttachmentProps> = ({ policyId, handleReload }) => {
  const { id: patientId } = useParams<ParamsType>()
  const [policyAttachmentId, setPolicyAttachmentId] = useState<string>('')
  const [documentTypeId, setDocumentTypeId] = useState<string>('')
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [{ attachmentUrl, attachmentData, attachments }, dispatch] =
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

    onCompleted(data) {
      if (data) {
        const { getAttachmentsByPolicyId } = data

        if (getAttachmentsByPolicyId) {
          const { attachments } = getAttachmentsByPolicyId
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

  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Typography variant='h5'>{TAKE_A_PICTURE_OF_INSURANCE}</Typography>
          <Box p={1} />
          {
            attachments.map((attachment) => {
              return (
                <Box mt={1} color={BLUE} display="flex" alignItems="center">
                  <li className="word-break">{attachment.attachmentName}</li>
                  <Box p={0.5} />
                  <IconButton onClick={() => onDeleteClick(attachment?.id || '')}>
                    <TrashOutlinedIcon />
                  </IconButton>
                </Box>
              )
            })
          }
          <Box p={2} />

          <MediaCards
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
    </Box>
  )
}

export default PolicyAttachments