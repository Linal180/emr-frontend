// packages block
import { FC, useEffect, useCallback, Reducer, useReducer, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import DropzoneImage from "../DropZoneImage";
// graphql and interfaces/types block
import { mediaType } from "../../../utils";
import { TrashNewIcon } from "../../../assets/svgs";
import { CANCEL, EDIT_MEDIA, OPEN_CAMERA, UPDATE_MEDIA } from "../../../constants";
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer";

const EditMediaModel: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, reload, setAttachments, attachment,
  preSignedUrl, title, providerName, filesLimit
}): JSX.Element => {
  const dropZoneRef = useRef<any>();
  const { handleSubmit, setValue } = useForm<ICreateMediaInput>();
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const [{ fileUrl, attachmentId, loading }, dispatch] =
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
    dispatch({ type: ActionType.SET_LOADING, loading: true })
    const { title } = data
    dropZoneRef && dropZoneRef.current && dropZoneRef.current.submit && dropZoneRef.current.submit()
    dispatch({ type: ActionType.SET_MEDIA_DATA, mediaData: { title } })
    dispatch({ type: ActionType.SET_LOADING, loading: false })
  }

  const onUploading = (open: boolean) => {
    setUploading(open)
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
      <DialogTitle id="image-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {EDIT_MEDIA}
          </Box>
          {(!cameraOpen) && <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setCameraOpen(!cameraOpen)}
              disabled={loading || (fileUrl !== '') || uploading}
            >
              {OPEN_CAMERA}
            </Button>
          </Box>}
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit((data) => handleMediaSubmit(data))}>
        <DialogContent>

          {fileUrl ?
            <Box className="media-image">
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className="media-overlay">
                <IconButton size='small' aria-label="delete" onClick={() =>
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
              acceptableFilesType={mediaType(title)}
              cameraOpen={cameraOpen}
              setCameraOpen={setCameraOpen}
              onUploading={onUploading}
            />
          }
        </DialogContent>

        <DialogActions>
          <Box py={1} display="flex">
            <Button
              type="button"
              onClick={handleClose}
            >
              {CANCEL}
            </Button>

            <Box px={1} />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || (fileUrl !== '') || uploading}
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
