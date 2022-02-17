// packages block
import { FC, Reducer, useEffect, useReducer } from "react";
import { Box } from "@material-ui/core";
// components block
import AddImageModal from ".";
import EditMediaModal from "./EditMediaModal"
// graphql, media reducer and interfaces/types block
import { MediaCardsType } from "../../../interfacesTypes";
import { Attachment } from "../../../generated/graphql";
import { Action, ActionType, initialState, mediaReducer, State } from '../../../reducers/mediaReducer'
import MediaCardComponent from "./MediaCardComponent";

const MediaCards: FC<MediaCardsType> = ({ moduleType, itemId, attachmentsData, imageSide, notDescription, isProfile }): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(mediaReducer, initialState)
  const { isOpen, attachments, attachment, isEdit, isEditModalOpen } = state

  useEffect(() => {
    attachmentsData &&
      dispatch({
        type: ActionType.SET_ATTACHMENTS,
        attachments: attachmentsData
      })
  }, [attachmentsData])

  const renderCard = (title: string, allAttachments: Attachment[]) => {
    return (
      <MediaCardComponent
        notDescription={notDescription}
        title={title}
        imageSide={imageSide}
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
        allAttachments={allAttachments}
      />
    )
  }

  return (
    <Box>
      {renderCard('Upload banner media', attachments)}
      <AddImageModal
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

        isEdit={isEdit}
        isOpen={isOpen}
        itemId={itemId}
        setAttachments={(AttachmentsArray: Attachment[]) => {
          dispatch({
            type: ActionType.SET_ATTACHMENTS,
            attachments: AttachmentsArray
          })
        }}

        attachment={attachment}
      />

      <EditMediaModal
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
        setAttachments={(AttachmentsArray: Attachment[]) => {
          dispatch({
            type: ActionType.SET_ATTACHMENTS,
            attachments: AttachmentsArray
          })
        }}
        
        attachment={attachment}
        attachments={attachments}
      />
    </Box>
  );

};

export default MediaCards;
