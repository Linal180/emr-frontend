// packages block
import { FC, useEffect, useReducer, Reducer, useRef } from "react";
import dotenv from 'dotenv';
import { useForm } from "react-hook-form";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import Alert from "../Alert";
import DropzoneImage from "..//DropZoneImage";
// constants and interfaces block
import { ADD, ADD_MEDIA } from "../../../constants";
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { CreateAttachmentInput, useRemoveAttachmentDataMutation } from "../../../generated/graphql";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer"
import { TrashNewIcon } from "../../../assets/svgs";

dotenv.config()

const AddImageModal: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, setAttachments, attachment, preSignedUrl,
  title, reload
}): JSX.Element => {
  const dropZoneRef = useRef<any>();
  const { handleSubmit, reset } = useForm<ICreateMediaInput>();
  const [{ fileUrl, attachmentId }, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

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
            reset();
            reload();
            dispatch({ type: ActionType.SET_FILE_URL, fileUrl: '' })
          }
        }
      }
    }
  })

  const handleMediaSubmit = async (mediaData: Pick<CreateAttachmentInput, "title">) => {
    const { title } = mediaData
    dropZoneRef && dropZoneRef.current && dropZoneRef.current.submit && dropZoneRef.current.submit()
    dispatch({ type: ActionType.SET_MEDIA_DATA, mediaData: { title } })
    setOpen && setOpen(!isOpen);
  };

  const handleDelete = async () => {
    const { id } = attachment || {}

    id && await removeAttachment({
      variables: { removeAttachment: { id } }
    })
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog-title" aria-describedby="image-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="image-dialog-title">{ADD_MEDIA}</DialogTitle>

      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>
          {fileUrl ?
            <Box className="media-image">
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className="media-overlay">
                <IconButton aria-label="delete" color="secondary" onClick={handleDelete}>
                  <TrashNewIcon />
                </IconButton>
              </Box>
            </Box>
            :
            <DropzoneImage
              ref={dropZoneRef}
              title={title}
              reload={reload}
              isEdit={isEdit}
              itemId={itemId}
              handleClose={handleClose}
              attachmentId={attachmentId}
              setAttachments={setAttachments}
              imageModuleType={imageModuleType}
            />
          }
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" type="submit" disabled={deleteAttachmentLoading}>
            {deleteAttachmentLoading &&
              <CircularProgress size={20} />
            }
            {ADD}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddImageModal;
