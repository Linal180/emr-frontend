//packages block
import { memo } from 'react';
import { Button, Dialog, DialogContent, Grid, Box, Typography } from '@material-ui/core';
//interfaces & constants
import { FormBuilderPreviewProps } from '../../../../interfacesTypes'
import { parseColumnGrid } from '../../../../utils';
import FieldRenderer from '../../../common/FieldRenderer';
//styles
import {usePreviewModalStyles} from '../../../../styles/formbuilder/previewModalStyles'
//component
const FormPreview = ({ open, closeModalHanlder, data }: FormBuilderPreviewProps) => {
  //style
  const classes = usePreviewModalStyles()
  //render
  return (
    <Dialog open={!!open} onClose={closeModalHanlder} fullWidth maxWidth={'md'}>
      <DialogContent  dividers>
        <Box className={classes.main}>
        <Grid container spacing={2} >
          {data?.map((item, index) => (
            <Grid item md={parseColumnGrid(item?.col)} key={`${item.id}-${index}`}>
              <Grid container spacing={2}>
                {item?.fields?.map((field) => (
                  <Grid
                    item
                    md={parseColumnGrid(field?.column)}
                    key={`${item?.id}-${field?.fieldId}`}
                  >
                    <Box>
                      <Box display={'flex'}  marginBottom={1} paddingX={1}>
                        <Typography>
                          {field.required ? `${field.label} *` : field.label}
                        </Typography>
                      </Box>
                      <FieldRenderer item={field} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Box marginY={2} display={'flex'} justifyContent={'flex-end'}>
          <Box marginX={2}>
            <Button variant={'contained'} onClick={closeModalHanlder}>
              Cancel
            </Button>
          </Box>
          <Box>
            <Button onClick={closeModalHanlder} variant={'contained'} color={'primary'}>
              Form Submit
            </Button>
          </Box>
        </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FormPreview);
