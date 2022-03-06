// packages block
import { FC, useState, useEffect, useCallback, Reducer, useReducer, useRef } from "react";
import { useForm } from "react-hook-form";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import DropzoneImage from "../DropZoneImage";
// graphql and interfaces/types block
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer";

const EditMediaModel: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, reload, setAttachments, attachment,
  preSignedUrl, title
}): JSX.Element => {
  const dropZoneRef = useRef<any>();
  const [{ fileUrl }, dispatch] = useReducer<Reducer<State, Action>>(mediaReducer, initialState)
  const { handleSubmit, setValue } = useForm<ICreateMediaInput>();
  const [attachmentId, setAttachmentId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handlePreview = useCallback(() => {
    const { id } = attachment || {}
    preSignedUrl && dispatch({ type: ActionType.SET_FILE_URL, fileUrl: preSignedUrl })
    id && setAttachmentId(id)
  }, [attachment, preSignedUrl])

  useEffect(() => {
    handlePreview()
  }, [attachment, handlePreview, preSignedUrl, setValue])

  const handleClose = () => {
    setOpen && setOpen(!isOpen);
    setEdit && setEdit(false);
    handlePreview()
  };

  const handleMediaSubmit = async (mediaData: ICreateMediaInput) => {
    setLoading(true)
    const { title } = mediaData
    dispatch({ type: ActionType.SET_ATTACHMENT_DATA, attachmentData: { title } })
    dropZoneRef && dropZoneRef.current && dropZoneRef.current.submit && dropZoneRef.current.submit()
    setLoading(false)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog-title" aria-describedby="image-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="image-dialog-title">Edit Media</DialogTitle>
      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>

          {fileUrl ?
            <Box className="media-image">
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className="media-overlay">
                <IconButton aria-label="delete" color="secondary" onClick={() =>
                  dispatch({ type: ActionType.SET_FILE_URL, fileUrl: '' })
                }>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box> :
            <DropzoneImage
              ref={dropZoneRef}
              title={title}
              reload={reload}
              itemId={itemId}
              isEdit={isEdit}
              handleClose={handleClose}
              attachmentId={attachmentId}
              setAttachments={setAttachments}
              imageModuleType={imageModuleType}
            />
          }

          <Box pt={3} />
        </DialogContent>

        <DialogActions>
          <Box px={2} py={1} display="flex">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <CircularProgress size={20} />
              )}

              Update media
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditMediaModel;
