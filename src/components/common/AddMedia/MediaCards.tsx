// packages block
import { FC, Reducer, useEffect, useReducer } from "react";
import { Box } from "@material-ui/core";
// components block
import AddImageModal from ".";
import EditMediaModal from "./EditMediaModal"
import MediaCardComponent from "./MediaCardComponent";
// graphql, media reducer and interfaces/types block
import { Attachment } from "../../../generated/graphql";
import { MediaCardsType } from "../../../interfacesTypes";
import { Action, ActionType, initialState, mediaReducer, State } from '../../../reducers/mediaReducer'

const MediaCards: FC<MediaCardsType> = ({
  moduleType, itemId, attachmentData, imageSide, notDescription, reload, title, button,
  buttonText, providerName, filesLimit, attachmentMetadata
}): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(mediaReducer, initialState)
  const { isOpen, attachments, attachment, isEdit, isEditModalOpen } = state

  useEffect(() => {
    if (attachmentData) {
      dispatch({
        type: ActionType.SET_ATTACHMENT,
        attachment: attachmentData
      })
    }
  }, [attachmentData])

  const renderCard = (title: string, allAttachments: Attachment[]) => {
    return (
      <MediaCardComponent
      title={title}
      button={button}
      imageSide={imageSide}
      buttonText={buttonText}
      notDescription={notDescription}
        setOpen={(isOpen: boolean) => {
          dispatch({
            type: ActionType.SET_IS_OPEN,
            isOpen: isOpen
          })
        }}

        setAttachments={(AttachmentsArray: Attachment[]) => {
          dispatch({
            type: ActionType.SET_ATTACHMENTS,
            attachments: AttachmentsArray
          })
        }}

        setEdit={(editable: boolean) => {
          dispatch({
            type: ActionType.SET_IS_EDIT,
            isEdit: editable,
          })

          dispatch({
            type: ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN,
            isEditModalOpen: editable
          })
        }}

        isEdit={isEdit}
        isOpen={isOpen}
        imageModuleType={moduleType}
        attachment={attachment}
        allAttachments={allAttachments}
      />
    )
  }

  return (
    <Box>
      {renderCard('Upload records', attachments)}

      <AddImageModal
        title={title}
        reload={reload}
        providerName={providerName}
        imageModuleType={moduleType}
        setOpen={(isOpen: boolean) => {
          dispatch({
            type: ActionType.SET_IS_OPEN,
            isOpen: isOpen
          })
        }}

        setEdit={(edit: boolean) => {
          dispatch({
            type: ActionType.SET_IS_EDIT,
            isEdit: edit,
          })
        }}

        isEdit={!!attachment}
        isOpen={isOpen}
        itemId={itemId}
        setAttachments={(attachment: Attachment) => {
          dispatch({
            type: ActionType.SET_ATTACHMENT,
            attachment: attachment
          })
        }}

        attachment={attachment}
        preSignedUrl={imageSide}
        filesLimit={filesLimit}
        attachmentMetadata={attachmentMetadata}
      />

      <EditMediaModal
        title={title}
        reload={reload}
        providerName={providerName}
        imageModuleType={moduleType}
        setOpen={(isOpen: boolean) => {
          dispatch({
            type: ActionType.SET_IS_EDIT_MEDIA_MODAL_OPEN,
            isEditModalOpen: isOpen
          })
        }}

        setEdit={(edit: boolean) => {
          dispatch({
            type: ActionType.SET_IS_EDIT,
            isEdit: edit,
          })
        }}

        isOpen={isEditModalOpen}
        itemId={itemId}
        setAttachments={(attachment: Attachment) => {
          dispatch({
            type: ActionType.SET_ATTACHMENT,
            attachment: attachment
          })
        }}

        attachment={attachment}
        attachments={attachments}
        preSignedUrl={imageSide}
        filesLimit={filesLimit}
      />
    </Box>
  );

};

export default MediaCards;
