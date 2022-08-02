// packages block
import { FC, useCallback, useEffect, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Box, Grid, Typography, } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import DatePicker from "../../DatePicker";
import ItemSelector from "../../ItemSelector";
import DropzoneImage from "../../DropZoneImage";
import InputController from "../../../../controller";
// import DoctorSelector from "../../Selector/DoctorSelector";
// interfaces/types block, theme, svgs and constants
import { GREY_SIXTEEN } from "../../../../theme";
import { mediaType, setRecord } from "../../../../utils";
import { AttachmentType } from "../../../../generated/graphql";
import { ActionType } from "../../../../reducers/mediaReducer";
import { addDocumentSchema } from "../../../../validationSchemas";
import { AddDocumentModalProps, DocumentInputProps, FormForwardRef } from "../../../../interfacesTypes";
import {
  CANCEL, COMMENTS, DATE, DOCUMENT_DETAILS, DOCUMENT_NAME, DOCUMENT_TYPE, ITEM_MODULE,
  PATIENT_NAME, SAVE_TEXT, ATTACHMENT_TITLES, PLEASE_SELECT_MEDIA,
} from "../../../../constants";

const AddDocumentModal: FC<AddDocumentModalProps> = ({
  toggleSideDrawer, patientName, patientId, fetchDocuments, attachmentId, submitUpdate, attachment,
  state, dispatch
}): JSX.Element => {
  const dropZoneRef = useRef<FormForwardRef>(null);
  const { files, documentTypeId } = state || {}
  const methods = useForm<DocumentInputProps>({
    mode: "all",
    resolver: yupResolver(addDocumentSchema)
  });

  const { reset, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const { attachmentName, documentType, provider, comments, date } = watch()
  const { name: providerName } = provider || {}

  const validated = !!Object.keys(errors).length
  const { name: documentMeta, id: documentMetaId } = documentType || {}

  const handleClose = useCallback(() => {
    reset();
    toggleSideDrawer()
  }, [toggleSideDrawer, reset])

  useEffect(() => {
    patientName && setValue('patientName', patientName)
  }, [patientId, patientName, setValue])

  const onSubmit: SubmitHandler<DocumentInputProps> = async (inputs) => {
    attachmentId ? submitUpdate(inputs)
      : dropZoneRef.current?.submit()
  }

  const setPreview = useCallback(() => {
    const { attachmentMetadata, attachmentName } = attachment ?? {}
    const { comments, documentDate, documentType } = attachmentMetadata ?? {}
    const { id, type } = documentType ?? {}

    comments && setValue('comments', comments)
    documentDate && setValue('date', documentDate)
    attachmentName && setValue('attachmentName', attachmentName)

    if (id && type) {
      dispatch && dispatch({ type: ActionType.SET_DOCUMENT_TYPE_ID, documentTypeId: setRecord(id, type) })
      setValue('documentType', setRecord(id, type))
    }
  }, [attachment, setValue, dispatch])

  useEffect(() => {
    attachmentId && setPreview()
  }, [attachmentId, setPreview])

  return (
    <Box maxWidth={500}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{DOCUMENT_DETAILS}</Typography>

            <Box display="flex" alignItems="center">
              <Button onClick={handleClose} variant="text" color="inherit" className="danger">
                {CANCEL}
              </Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary">{SAVE_TEXT}</Button>
            </Box>
          </Box>

          <Box p={3} mt={2}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  disabled
                  fieldType="text"
                  controllerName="patientName"
                  controllerLabel={PATIENT_NAME}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="attachmentName"
                  controllerLabel={DOCUMENT_NAME}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                {attachmentId ? documentTypeId?.id && <ItemSelector
                  isRequired
                  isEdit={!!attachmentId}
                  label={DOCUMENT_TYPE}
                  name="documentType"
                  modalName={ITEM_MODULE.documentTypes}
                  value={documentTypeId}
                /> : <ItemSelector
                  isRequired
                  isEdit={!!attachmentId}
                  label={DOCUMENT_TYPE}
                  name="documentType"
                  modalName={ITEM_MODULE.documentTypes}
                  value={documentTypeId}
                />}
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <DatePicker label={DATE} name='date' isRequired />
              </Grid>

              {/*<Grid item md={5} sm={12} xs={12}>
                <Box mt={2.5} display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="secondary">{ASSIGN_TO_ME}</Button>
                </Box>
              </Grid> */}

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  controllerName="comments"
                  controllerLabel={COMMENTS}
                />
              </Grid>

              {!attachmentId && <Grid item md={12} sm={12} xs={12}>
                <DropzoneImage
                  filesLimit={1}
                  isEdit={false}
                  ref={dropZoneRef}
                  attachmentId={''}
                  itemId={patientId}
                  providerName={providerName || ''}
                  attachmentName={attachmentName || ''}
                  imageModuleType={AttachmentType.Patient}
                  title={ATTACHMENT_TITLES.ProviderUploads}
                  acceptableFilesType={mediaType(ATTACHMENT_TITLES.ProviderUploads)}
                  attachmentMetadata={{
                    documentTypeId: documentMetaId, documentTypeName: documentMeta, comments,
                    documentDate: date
                  }}
                  setAttachments={() => { }}
                  handleClose={handleClose}
                  reload={() => fetchDocuments()}
                  setFiles={(files: File[]) => dispatch && dispatch({ type: ActionType.SET_FILES, files: files })}
                />

                {validated && !!!files?.length &&
                  <Typography className='danger' variant="caption">{PLEASE_SELECT_MEDIA}</Typography>
                }
              </Grid>}
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddDocumentModal;
