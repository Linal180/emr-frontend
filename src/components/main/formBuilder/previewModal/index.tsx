//packages block
import { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Dialog, DialogContent, Grid, Box, Typography, DialogTitle } from '@material-ui/core';
//components
import FieldRenderer from '../../../common/FieldRenderer';
//interfaces & constants
import { FormBuilderPreviewProps } from '../../../../interfacesTypes'
import { parseColumnGrid } from '../../../../utils';
import { CANCEL_TEXT, FORM_SUBMIT_TEXT } from '../../../../constants';
//styles
import { usePreviewModalStyles } from '../../../../styles/formbuilder/previewModalStyles'
//component
const FormPreview = ({ open, closeModalHandler, data, formName }: FormBuilderPreviewProps) => {
  //style
  const classes = usePreviewModalStyles()
  const methods = useForm<any>({ defaultValues: {} });
  const { handleSubmit } = methods || {}

  const submitHandler = (values: any) => {

  }
  //render
  return (
    <Dialog open={!!open} onClose={closeModalHandler} fullWidth maxWidth={'md'}>
      <DialogTitle>{formName}</DialogTitle>
      <DialogContent dividers>
        <Box className={classes.main}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <Grid container spacing={2}>
                {data?.map((item, index) => (
                  <Grid item md={parseColumnGrid(item?.col)} key={`${item.id}-${index}`}>
                    <Box p={2} pl={0}>
                      <Typography variant='h4'>
                        {item?.name}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {item?.fields?.map((field) => (
                        <Grid
                          item
                          md={parseColumnGrid(field?.column)}
                          key={`${item?.id}-${field?.fieldId}`}
                        >
                          <Box>
                            <Box display={'flex'} marginBottom={1} paddingX={1}>
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
                  <Button variant={'contained'} onClick={closeModalHandler}>
                    {CANCEL_TEXT}
                  </Button>
                </Box>
                <Box>
                  <Button onClick={closeModalHandler} variant={'contained'} color={'primary'}>
                    {FORM_SUBMIT_TEXT}
                  </Button>
                </Box>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FormPreview);
