// packages block
import { FC, useEffect, useReducer, Reducer, useRef, useState } from "react";
import dotenv from 'dotenv';
import { FormProvider, useForm } from "react-hook-form";
import {
  Button, Dialog, DialogActions, DialogTitle, CircularProgress, DialogContent, Box, IconButton
} from "@material-ui/core";
// components block
import Alert from "../Alert";
import DropzoneImage from "..//DropZoneImage";
// constants and interfaces block
import { mediaType } from "../../../utils";
import { ADD, ADD_MEDIA, OPEN_CAMERA } from "../../../constants";
import { TrashNewIcon } from "../../../assets/svgs";
import { useEditMediaModalStyles } from "../../../styles/editMediaModalStyles";
import { FormForwardRef, ICreateMediaInput, MediaModalTypes } from "../../../interfacesTypes";
import { CreateAttachmentInput, useRemoveAttachmentDataMutation } from "../../../generated/graphql";
import { Action, ActionType, mediaReducer, State, initialState } from "../../../reducers/mediaReducer"

dotenv.config()

const AddImageModal: FC<MediaModalTypes> = ({
  imageModuleType, itemId, isOpen, setOpen, isEdit, setEdit, setAttachments, attachment, preSignedUrl,
  title, reload, providerName, filesLimit, attachmentMetadata, btnType = 'button'
}): JSX.Element => {
  const classes = useEditMediaModalStyles();
  const dropZoneRef = useRef<FormForwardRef>(null);
  const methods = useForm<ICreateMediaInput>();
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const { handleSubmit, reset } = methods

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
  };

  const handleDelete = async () => {
    const { id } = attachment || {}

    id && await removeAttachment({
      variables: { removeAttachment: { id } }
    })
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="image-dialog-title"
      aria-describedby="image-dialog-description" maxWidth="sm" fullWidth>
      <DialogTitle id="image-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {ADD_MEDIA}
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setCameraOpen(true)}
            >
              {OPEN_CAMERA}
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent>
          {fileUrl ?
            <Box className={classes.mediaImage}>
              <img src={fileUrl} alt={attachment?.key || 'emr images'} />

              <Box className={classes.mediaOverlay}>
                <IconButton aria-label="delete" color="secondary" onClick={handleDelete}>
                  <TrashNewIcon />
                </IconButton>
              </Box>
            </Box>
            :
            <DropzoneImage
              title={title}
              reload={reload}
              isEdit={isEdit}
              itemId={itemId}
              ref={dropZoneRef}
              handleClose={handleClose}
              attachmentId={attachmentId}
              filesLimit={filesLimit || 1}
              setAttachments={setAttachments}
              providerName={providerName || ''}
              imageModuleType={imageModuleType}
              acceptableFilesType={mediaType(title)}
              attachmentMetadata={attachmentMetadata}
              cameraOpen={cameraOpen}
              setCameraOpen={setCameraOpen}
            />
          }
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" type={btnType}
            onClick={handleSubmit((data) => handleMediaSubmit(data))} disabled={deleteAttachmentLoading}
          >
            {deleteAttachmentLoading &&
              <CircularProgress size={20} />
            }
            {ADD}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default AddImageModal;
