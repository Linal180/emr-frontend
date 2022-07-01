// packages block
import { FC, useCallback, useEffect, useRef, useState } from "react";
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
import { mediaType, setRecord } from "../../../../utils";
import { GREY_SIXTEEN } from "../../../../theme";
import { AttachmentType } from "../../../../generated/graphql";
import { addDocumentSchema } from "../../../../validationSchemas";
import { AddDocumentModalProps, DocumentInputProps, FormForwardRef, SelectorOption } from "../../../../interfacesTypes";
import {
  ATTACHMENT_TITLES,
  CANCEL, COMMENTS, DATE, DOCUMENT_DETAILS, DOCUMENT_NAME, DOCUMENT_TYPE, EMPTY_OPTION, ITEM_MODULE, PATIENT_NAME, SAVE_TEXT,
} from "../../../../constants";
import { ActionType } from "../../../../reducers/mediaReducer";

const AddDocumentModal: FC<AddDocumentModalProps> = ({
  toggleSideDrawer, patientName, patientId, fetchDocuments, attachmentId, submitUpdate, attachment, state, dispatch
}): JSX.Element => {
  const dropZoneRef = useRef<FormForwardRef>(null);
  const { files } = state || {}
  const methods = useForm<DocumentInputProps>({
    mode: "all",
    resolver: yupResolver(addDocumentSchema)
  });
  const { reset, handleSubmit, watch, setValue } = methods;
  const { attachmentName, documentType, provider, comments, date } = watch()
  const { name: providerName } = provider || {}
  const { name: documentMeta, id: documentMetaId } = documentType || {}

  const [documentTypeId, setDocumentTypeId] = useState<SelectorOption>(EMPTY_OPTION)

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
    // set form values in edit cases
    setValue('attachmentName', attachmentName || '')
    setValue('comments', comments || '')
    setValue('date', documentDate || '')
    setValue('documentType', setRecord(id || '', type || ''))
    setDocumentTypeId(setRecord(id || '', type || ''))
  }, [attachment, setValue])

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
                {attachmentId ? documentTypeId.id && <ItemSelector
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

              {/* <Grid item md={7} sm={12} xs={12}>
                <DoctorSelector
                  isRequired
                  addEmpty
                  facilityId={facilityId}
                  label={PROVIDER}
                  name="provider"
                />
              </Grid>

              <Grid item md={5} sm={12} xs={12}>
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
                  attachmentName={attachmentName || ''}
                  providerName={providerName || ''}
                  imageModuleType={AttachmentType.Patient}
                  title={ATTACHMENT_TITLES.ProviderUploads}
                  attachmentMetadata={{ documentTypeId: documentMetaId, documentTypeName: documentMeta, comments, documentDate: date  }}
                  reload={() => fetchDocuments()}
                  handleClose={handleClose}
                  setAttachments={() => { }}
                  acceptableFilesType={mediaType(ATTACHMENT_TITLES.ProviderUploads)}
                  setFiles={(files: File[]) => dispatch && dispatch({ type: ActionType.SET_FILES, files: files })}
                  />
                {!files?.length ? <Typography className='danger' variant="caption">Please select atleast one file</Typography> : ''}
              </Grid>}
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default AddDocumentModal;
