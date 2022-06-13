// packages block
import { useImperativeHandle, useState, forwardRef, useContext } from "react";
import axios from "axios";
import { Edit } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import { Box, Button, CircularProgress, IconButton } from "@material-ui/core";
// components block
import Alert from "./Alert";
// styles, utils, graphql, constants and interfaces/types block
import { AuthContext } from "../../context";
import { getToken, handleLogout } from "../../utils";
import { AttachmentType } from "../../generated/graphql";
import { useDropzoneStyles } from "../../styles/dropzoneStyles";
import { ACCEPTABLE_FILES, PLEASE_ADD_DOCUMENT, PLEASE_CLICK_TO_UPDATE_DOCUMENT } from "../../constants";
import {
  DropzoneImageType, FormForwardRef, MediaDoctorDataType, MediaPatientDataType, MediaPracticeDataType,
  MediaStaffDataType, MediaUserDataType
} from "../../interfacesTypes";

const DropzoneImage = forwardRef<FormForwardRef, DropzoneImageType>(({
  imageModuleType, isEdit, attachmentId, itemId, handleClose, setAttachments, isDisabled, attachment,
  reload, title, providerName, filesLimit, attachmentMetadata, attachmentName, acceptableFilesType
}, ref): JSX.Element => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext)
  const classes = useDropzoneStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageEdit, setImageEdit] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>();

  const token = getToken();
  let moduleRoute = "";

  switch (imageModuleType) {
    case AttachmentType.Patient:
      moduleRoute = "patients";
      break;

    case AttachmentType.Doctor:
      moduleRoute = "doctor";
      break;

    case AttachmentType.Staff:
      moduleRoute = "staff";
      break;

    case AttachmentType.SuperAdmin:
      moduleRoute = "users";
      break;

    case AttachmentType.Practice:
      moduleRoute = "practices";
      break;
    default:
      break;
  }

  const handleModalClose = () => handleClose();

  useImperativeHandle(ref, () => ({
    submit() {
      files && handleFileChange()
    }
  }));

  const handleFileChange = async () => {
    files && files.map(async (file) => {
      const formData = new FormData();
      file && formData.append("file", file);
      title && formData.append("title", title);
      itemId && formData.append("typeId", itemId);
      attachmentId && formData.append("id", attachmentId);
      providerName && formData.append("providerName", providerName);
      attachmentName && formData.append("attachmentName", attachmentName);

      if (attachmentMetadata) {
        for (var key in attachmentMetadata) {
          formData.append(key, attachmentMetadata[key]);
        }
      }

      setLoading(true);
      await axios.post(
        isEdit ?
          `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/image/update`
          :
          `${process.env.REACT_APP_API_BASE_URL}/${moduleRoute}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(response => {
        const { status, data } = response;

        if (status === 201 && data) {
          switch (imageModuleType) {

            case AttachmentType.Patient:
              const patientData = data as unknown as MediaPatientDataType;

              if (patientData) {
                const { patient: { attachments: patientAttachment } } = patientData || {};
                patientAttachment && setAttachments(patientAttachment)
                setLoading(false);
                handleModalClose();
                reload()
              }

              break;

            case AttachmentType.Doctor:
              const doctorData = data as unknown as MediaDoctorDataType

              if (doctorData) {
                const { doctor: { attachments: doctorAttachments } } = doctorData || {};
                doctorAttachments && setAttachments(doctorAttachments)
                setLoading(false);
                handleModalClose();
                reload()
              }

              break;

            case AttachmentType.Staff:
              const staffData = data as unknown as MediaStaffDataType

              if (staffData) {
                const { staff: { attachments: staffAttachments } } = staffData || {};
                staffAttachments && setAttachments(staffAttachments)
                setLoading(false);
                handleModalClose();
                reload()
              }

              break;

            case AttachmentType.SuperAdmin:
              const userData = data as unknown as MediaUserDataType

              if (userData) {
                const { user: { attachments: staffAttachments } } = userData || {};
                staffAttachments && setAttachments(staffAttachments)
                setLoading(false);
                handleModalClose();
                reload()
              }

              break;

            case AttachmentType.Practice:
              const practiceData = data as unknown as MediaPracticeDataType

              if (practiceData) {
                const { practice: { attachments: practiceAttachments } } = practiceData || {};
                practiceAttachments && setAttachments(practiceAttachments)
                setLoading(false);
                handleModalClose();
                reload()
              }

              break;

            default:
              break;
          }
        } else {
          Alert.error("Something went wrong!");

          if (status === 401) {
            setIsLoggedIn(false)
            setUser(null)
            handleLogout();
          }
        }
      }).then(data => {

      }).catch(error => {
        const { response: { data: { error: errorMessage } } } = error || {}
        Alert.error(errorMessage);
      });
    })
  }

  const handleUpdateImage = () => setImageEdit(true)

  return (
    <>
      {loading && (
        <Box className={classes.dropZoneUploadedImage}>
          <Box className={classes.loadingText}>
            <CircularProgress size={40} />
          </Box>
        </Box>
      )}

      {attachment?.url && !loading && !imageEdit ? (
        <Box className={classes.dropZoneUploadedImage}>
          {isDisabled && <Box className={classes.disabledDropzone} />}

          <img src={attachment.url} alt="option icon" />
          {!isDisabled && (
            <Box className={classes.updateOverlay}>
              <Box>
                <IconButton onClick={handleUpdateImage} aria-label="Edit image">
                  <Edit />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        !loading && (
          <Box position="relative">
            {isDisabled && <Box className={classes.disabledDropzone} />}

            {imageEdit && !isDisabled && (
              <Box position="absolute" zIndex={3} right={10} top={5}>
                <Button
                  className={''}
                  variant="text"
                  color="primary"
                  onClick={() => setImageEdit(false)}
                >
                  Go Back
                </Button>
              </Box>
            )}

            <DropzoneArea
              previewGridClasses={{ item: 'media-inner-image' }}
              filesLimit={filesLimit ?? 1}
              maxFileSize={5000000}
              acceptedFiles={acceptableFilesType ?? ACCEPTABLE_FILES}
              onChange={(files) => setFiles(files)}
              alertSnackbarProps={{ autoHideDuration: 3000 }}
              dropzoneText={imageEdit ?
                PLEASE_CLICK_TO_UPDATE_DOCUMENT : (files && files?.length === 0 ? PLEASE_ADD_DOCUMENT : "")}
            />
          </Box>
        )
      )}
    </>
  );
});

export default DropzoneImage;
