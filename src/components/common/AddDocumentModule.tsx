// packages block
import { FC, useCallback, useEffect, useRef } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, Box, Grid, CircularProgress } from "@material-ui/core";
// components block
import Selector from './Selector';
import DatePicker from "./DatePicker";
import DropzoneImage from "./DropZoneImage";
import CardComponent from "./CardComponent";
import InputController from "../../controller";
// interfaces/types block, theme, svgs and constants
import { AttachmentType } from "../../generated/graphql";
import { addDocumentSchema } from "../../validationSchemas";
import { AddDocumentModalProps, DocumentInputProps, FormForwardRef } from "../../interfacesTypes";
import { ADD_DOCUMENT, CANCEL, COMMENTS, DATE, DOCUMENT_NAME, DOCUMENT_TYPE, NAME, PATIENT_NAME, PROVIDER, UPLOAD_DOCUMENT } from "../../constants";

const AddDocumentModal: FC<AddDocumentModalProps> = ({ isOpen, setIsOpen, patientName, patientId }): JSX.Element => {
  const dropZoneRef = useRef<FormForwardRef>(null);
  const methods = useForm<DocumentInputProps>({
    mode: "all",
    resolver: yupResolver(addDocumentSchema)
  });
  const { reset, handleSubmit, watch, setValue } = methods;
  const { name, documentType } = watch()

  const handleClose = useCallback(() => {
    reset();
    setIsOpen(false)
  }, [setIsOpen, reset])

  const onSubmit: SubmitHandler<DocumentInputProps> = async ({ name, documentType }) => {

  };

  useEffect(() => {
    patientName && setValue('patientName', patientName)
  }, [patientId, patientName, setValue])

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={ADD_DOCUMENT}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="patientName"
                  controllerLabel={PATIENT_NAME}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  isRequired
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={DOCUMENT_NAME}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  isRequired
                  label={DOCUMENT_TYPE}
                  name="documentType"
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <DatePicker label={DATE} name='date' isRequired />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  isRequired
                  label={PROVIDER}
                  name="provider"
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  multiline
                  fieldType="text"
                  controllerName="comments"
                  controllerLabel={COMMENTS}
                />
              </Grid>
            </Grid>

            <DropzoneImage
              title={name}
              filesLimit={1}
              isEdit={false}
              ref={dropZoneRef}
              attachmentId={''}
              itemId={patientId}
              providerName={'Admin'}
              attachmentMetadata={{ documentType }}
              imageModuleType={AttachmentType.Patient}
              reload={() => { }}
              handleClose={handleClose}
              setAttachments={() => { }}
            />
          </CardComponent>

          <Box pb={2} display='flex' justifyContent='flex-end' alignItems='center' pr={4}>
            <Button onClick={handleClose} color="default">
              {CANCEL}
            </Button>

            <Box p={1} />

            <Button type="submit" variant="contained" color="primary"
              disabled={false}
            >
              {UPLOAD_DOCUMENT}
              {false && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default AddDocumentModal;
