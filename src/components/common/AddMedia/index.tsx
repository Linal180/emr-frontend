// packages block
import { FC, useEffect, useReducer, Reducer } from "react";
import dotenv from 'dotenv';
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import Alert from "../Alert";
import DropzoneImage from "..//DropZoneImage";
// constants and interfaces block
import { ADD } from "../../../constants";
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { CreateAttachmentInput, useRemoveAttachmentDataMutation } from "../../../generated/graphql";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer"

dotenv.config()

const AddImageModal: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, setAttachments, attachment, isProfile, preSignedUrl
}): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(mediaReducer, initialState)
  const { fileUrl, attachmentId } = state;

  const { handleSubmit, reset } = useForm<ICreateMediaInput>();

  const handleClose = () => {
    setOpen && setOpen(!isOpen);
    setEdit(false);
    reset();
    dispatch({ type: ActionType.SET_FILE_URL, fileUrl: '' })
  };

  useEffect(() => {
    if (isEdit && attachment && preSignedUrl) {
      dispatch({ type: ActionType.SET_FILE_URL, fileUrl: preSignedUrl })
    }
  }, [attachment, isEdit, preSignedUrl]);

  const [removeAttachment, { loading: deleteAttachmentLoading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message);
    },

    onCompleted(data) {
      const { removeAttachmentData } = data

      if (removeAttachmentData) {
        const { response } = removeAttachmentData || {}

        if (response) {
          const { status, message } = response

          if (message && status && status === 200) {
            Alert.success(message)
            dispatch({ type: ActionType.SET_FILE_URL, fileUrl: '' })
          }
        }
      }
    }
  })

  const handleMediaSubmit = async (mediaData: Pick<CreateAttachmentInput, "title">) => {
    const { title } = mediaData
    dispatch({ type: ActionType.SET_ATTACHMENT_DATA, attachmentData: { title } })
  };

  const handleDelete = async () => {
    const { id } = attachment || {}

    id && await removeAttachment({
      variables: { removeAttachment: { id } }
    })
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog-title" aria-describedby="image-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="image-dialog-title">Add Media</DialogTitle>

      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>
          <Box pb={3}>

            {fileUrl ?
              <Box className="media-image">
                <img src={fileUrl} alt={attachment?.key || 'emr images'} />

                <Box className="media-overlay">
                  <IconButton aria-label="delete" color="secondary" onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              :
              <DropzoneImage
                reset={reset}
                isEdit={isEdit}
                itemId={itemId}
                isProfile={isProfile}
                handleClose={handleClose}
                attachmentId={attachmentId}
                setAttachments={setAttachments}
                imageModuleType={imageModuleType}
              />
            }
          </Box>
        </DialogContent>

        <DialogActions>
          <Box px={2} py={1} display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" flex={1} justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit" disabled={deleteAttachmentLoading}>
                {deleteAttachmentLoading &&
                  <CircularProgress size={20} />
                }

                {ADD}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddImageModal;
