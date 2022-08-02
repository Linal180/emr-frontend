// packages block
import { FC } from 'react';
import { Box, Typography } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
// interfaces styles and svgs block
import { BLUE_ONE } from '../../theme';
import { FileIcon } from "../../assets/svgs";
import { FormVerification } from "../../interfacesTypes";
import { documentVerificationFormStyles } from '../../styles/publicAppointmentStyles/documentVerificationStyles';
import { ACCEPTABLE_FILES } from '../../constants';

const DropzoneContainer: FC<FormVerification> = ({ imageSide }) => {
  const classes = documentVerificationFormStyles()

  return (
    <Box display="flex" className={classes.dropZoneContainer}>
      <Box>
        <FileIcon />
        <Typography component="p" variant="body2">{imageSide}</Typography>
      </Box>

      <Box ml={2}>
        <Typography component="h4" variant="h4">
          Drop your image here,
          <Box display="inline" color={BLUE_ONE}>or browse</Box>
        </Typography>
        
        <Typography component="h6" variant="body1">Supports: JPG,JPEG2000,PNG</Typography>
      </Box>

      <DropzoneArea maxFileSize={1} acceptedFiles={ACCEPTABLE_FILES} />
    </Box>
  );
};

export default DropzoneContainer;
