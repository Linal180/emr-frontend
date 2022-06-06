// packages block
import { FC, useState, useEffect, useCallback, Reducer, useReducer, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import DropzoneImage from "../DropZoneImage";
// graphql and interfaces/types block
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer";
import { TrashNewIcon } from "../../../assets/svgs";
import { EDIT_MEDIA, UPDATE_MEDIA } from "../../../constants";

const EditMediaModel: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, reload, setAttachments, attachment,
  preSignedUrl, title, providerName, filesLimit
}): JSX.Element => {
  const dropZoneRef = useRef<any>();
  const { handleSubmit, setValue } = useForm<ICreateMediaInput>();
  const [loading, setLoading] = useState<boolean>(false);
  const [{ fileUrl, attachmentId }, dispatch] =
    useReducer<Reducer<State, Action>>(mediaReducer, initialState)

  const handlePreview = useCallback(() => {
    const { id } = attachment || {}
    preSignedUrl && dispatch({ type: ActionType.SET_FILE_URL, fileUrl: preSignedUrl })
    id && dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId: id })
  }, [attachment, preSignedUrl])

  useEffect(() => {
    handlePreview()
  }, [attachment, handlePreview, preSignedUrl, setValue])

  const handleClose = () => {
    setOpen && setOpen(!isOpen);
    setEdit && setEdit(false);
    handlePreview()
  };

  const handleMediaSubmit = async (data: ICreateMediaInput) => {
    setLoading(true)
    const { title } = data
    dropZoneRef && dropZoneRef.current && dropZoneRef.current.submit && dropZoneRef.current.submit()
    dispatch({ type: ActionType.SET_MEDIA_DATA, mediaData: { title } })
    setLoading(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="image-dialog-title"
      aria-describedby="image-dialog-description"
    >
      <DialogTitle id="image-dialog-title">{EDIT_MEDIA}</DialogTitle>
      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>

          {fileUrl ?
            <Box className="media-image">
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className="media-overlay">
                <IconButton aria-label="delete" onClick={() =>
                  dispatch({ type: ActionType.SET_FILE_URL, fileUrl: '' })
                }>
                  <TrashNewIcon />
                </IconButton>
              </Box>
            </Box> :
            <DropzoneImage
              filesLimit={filesLimit || 1}
              title={title}
              reload={reload}
              itemId={itemId}
              isEdit={isEdit}
              ref={dropZoneRef}
              handleClose={handleClose}
              providerName={providerName || ''}
              attachmentId={attachmentId}
              setAttachments={setAttachments}
              imageModuleType={imageModuleType}
            />
          }
        </DialogContent>

        <DialogActions>
          <Box px={2} py={1} display="flex">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || (fileUrl !== '')}
            >
              {loading && (
                <CircularProgress size={20} />
              )}

              {UPDATE_MEDIA}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditMediaModel;
