import { Box, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { FormVerification } from '../../../../../../interfacesTypes';
import { documentVerificationForm } from '../../../../../../styles/publicAppointment/documentVerification';
import { BLUE_ONE } from '../../../../../../theme';
import { DropzoneArea } from 'material-ui-dropzone';
import { FileIcon } from '../../../../../../assets/svgs';

const DropZoneContainer: FC<FormVerification> = ({ imageSide }) => {
  const classes = documentVerificationForm()

  return (
    <Box display="flex" className={classes.dropZoneContainer}>
      <Box >
        <FileIcon />
        <Typography component="p" variant="body2">{imageSide}</Typography>
      </Box>

      <Box ml={2}>
        <Typography component="h4" variant="h4">Drop your image here, <Box display="inline" color={BLUE_ONE}>or browse</Box></Typography>
        <Typography component="h6" variant="body1">Supports: JPG,JPEG2000,PNG</Typography>
      </Box>

      <DropzoneArea maxFileSize={1} />
    </Box>
  );
};

export default DropZoneContainer;
