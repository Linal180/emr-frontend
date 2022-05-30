import { Box, Grid, Typography } from "@material-ui/core";
import { RemoveCircleOutline } from "@material-ui/icons";
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { ADD_UPLOAD_IMAGES, ATTACHMENT_TITLES, DELETE_POLICY_CARD_ATTACHMENT_DESCRIPTION, INSURANCE_CARD, NOT_FOUND_EXCEPTION, TAKE_A_PICTURE_OF_INSURANCE, USER_NOT_FOUND_EXCEPTION_MESSAGE } from "../../../../../constants";
import { Attachment, AttachmentMetaDataType, AttachmentType, useGetAttachmentsByPolicyIdLazyQuery, useRemoveAttachmentMediaMutation } from "../../../../../generated/graphql";
import { ParamsType, PolicyAttachmentProps } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, mediaReducer, State } from "../../../../../reducers/mediaReducer";
import MediaCards from "../../../../common/AddMedia/MediaCards";
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";

const PolicyAttachments: FC<PolicyAttachmentProps> = ({ policyId, handleReload }) => {
  const { id: patientId } = useParams<ParamsType>()
  const [policyAttachmentId, setPolicyAttachmentId] = useState<string>('')
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [{ attachmentUrl, attachmentData, attachments }, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

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
          {
            attachments.map((attachment) => {
              return (
                <li>{attachment.attachmentName}    <RemoveCircleOutline onClick={() => onDeleteClick(attachment?.id || '')} /> </li>
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
            attachmentMetadata={{ metadataType: AttachmentMetaDataType.InsuranceCard1, policyId: policyId ?? '' }}
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