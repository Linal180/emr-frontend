// packages block
import { FC, useEffect, useCallback, Reducer, useReducer, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import DropzoneImage from "../DropZoneImage";
// graphql and interfaces/types block
import { mediaType } from "../../../utils";
import { TrashNewIcon } from "../../../assets/svgs";
import { CANCEL, EDIT_MEDIA, UPDATE_MEDIA } from "../../../constants";
import { ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { useEditMediaModalStyles } from "../../../styles/editMediaModalStyles";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer";

const EditMediaModel: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, reload, setAttachments, attachment,
  preSignedUrl, title, providerName, filesLimit
}): JSX.Element => {
  const classes = useEditMediaModalStyles();
  const dropZoneRef = useRef<any>();
  const { handleSubmit, setValue } = useForm<ICreateMediaInput>();
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
            <Box className={classes.mediaImage}>
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className={classes.mediaOverlay}>
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
              acceptableFilesType={mediaType(title)}
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
