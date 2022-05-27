//packages block
import { memo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Dialog, DialogContent, Grid, Box, DialogTitle } from '@material-ui/core';
//components
import FieldController from '../../../common/FormFieldController';
//interfaces & constants
import { FormBuilderPreviewProps } from '../../../../interfacesTypes'
import { parseColumnGrid } from '../../../../utils';
//styles
import { usePreviewModalStyles } from '../../../../styles/formbuilder/previewModalStyles'
import CardComponent from '../../../common/CardComponent';
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
                    <CardComponent cardTitle={item?.name}>
                      <Grid container spacing={3}>
                        {item?.fields?.map((field) => (
                          <Grid
                            item
                            md={parseColumnGrid(field?.column)}
                            key={`${item?.id}-${field?.fieldId}`}
                          >
                            <FieldController item={field} isCreating={true} />
                          </Grid>
                        ))}
                      </Grid>
                    </CardComponent>
                  </Grid>
                ))}
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FormPreview);
