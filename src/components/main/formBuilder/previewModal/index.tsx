//packages block
import { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Dialog, DialogContent, Grid, Box, DialogTitle, IconButton } from '@material-ui/core';
//components
import FieldController from '../../../common/FormFieldController';
//interfaces & constants
import { FormBuilderPreviewProps } from '../../../../interfacesTypes'
import { parseColumnGrid, parseXmGrid } from '../../../../utils';
//styles
import { usePreviewModalStyles } from '../../../../styles/formbuilder/previewModalStyles'
import CardComponent from '../../../common/CardComponent';
import { CrossIcon } from '../../../../assets/svgs';
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
    <Dialog open={!!open} onClose={closeModalHandler} fullWidth maxWidth={'lg'}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {formName}
          <IconButton size='small' onClick={closeModalHandler}>      
              <CrossIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box className={classes.main}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <Grid container spacing={3} direction="row">
                {data?.map((tab, i) => {
                  const { sections } = tab || {}

                  return sections?.map((item, index) => {
                    const { col, fields, id, name } = item || {}
                    return (
                      <Grid item md={parseColumnGrid(col)} xs={parseXmGrid(col)} key={`${id}-${index}`}>
                        <CardComponent cardTitle={name}>
                          <Grid container spacing={3} direction="row">
                            {fields?.map((field) => {
                              const { fieldId, column } = field
                              return (
                                <Grid
                                  item
                                  md={parseColumnGrid(column)}
                                  xs={parseXmGrid(column)}
                                  key={`${id}-${fieldId}`}
                                >
                                  <FieldController item={field} isCreating={true} />
                                </Grid>
                              )
                            }
                            )}
                          </Grid>
                        </CardComponent>
                      </Grid>
                    )
                  })
                }
                )}
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FormPreview);
