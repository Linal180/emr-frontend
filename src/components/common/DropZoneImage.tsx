// packages block
import { FC, useImperativeHandle, useState, forwardRef, useContext } from "react";
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
import { MediaDoctorDataType, MediaPatientDataType, MediaStaffDataType, MediaUserDataType } from "../../interfacesTypes";
import { useDropzoneStyles } from "../../styles/dropzoneStyles";
import { ACCEPTABLE_FILES, PLEASE_ADD_DOCUMENT, PLEASE_CLICK_TO_UPDATE_DOCUMENT } from "../../constants";

const DropzoneImage: FC<any> = forwardRef(({
  imageModuleType, isEdit, attachmentId, itemId, handleClose, setAttachments, isDisabled, attachment, reload, title,
}, ref): JSX.Element => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext)
  const classes = useDropzoneStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageEdit, setImageEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

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

    default:
      break;
  }

  const handleModalClose = () => handleClose();

  useImperativeHandle(ref, () => ({
    submit() {
      file && handleFileChange()
    }
  }));

  const handleFileChange = async () => {
    const formData = new FormData();
    attachmentId && formData.append("id", attachmentId);
    itemId && formData.append("typeId", itemId);
    title && formData.append("title", title);
    file && formData.append("file", file);

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
              filesLimit={1}
              maxFileSize={5000000}
              acceptedFiles={ACCEPTABLE_FILES}
              onChange={(files) => setFile(files[0])}
              alertSnackbarProps={{ autoHideDuration: 3000 }}
              dropzoneText={isEdit ? PLEASE_CLICK_TO_UPDATE_DOCUMENT : PLEASE_ADD_DOCUMENT}
            />
          </Box>
        )
      )}
    </>
  );
});

export default DropzoneImage;
