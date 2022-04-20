//packages block
import { memo } from 'react';
import { Dialog, DialogContent, Box, Grid, useTheme, Typography } from '@material-ui/core';
//interfaces & styles
import { UserFormPreviewModalProps } from '../../../../interfacesTypes';
import { usePreviewModalStyles } from '../../../../styles/formbuilder/previewModalStyles';
import { useFormResponsesStyles } from '../../../../styles/formbuilder/responses';
import { NAME, VALUE, VIEW } from '../../../../constants';
//component
const UserFormPreview = ({ open, closeModalHandler, formId, formLabels, userForms, imagePreviewHandler }: UserFormPreviewModalProps) => {
  //style
  const classes = usePreviewModalStyles();
  const responsesClasses = useFormResponsesStyles()
  const theme = useTheme();
  //render
  return (
    <Dialog open={!!open} onClose={closeModalHandler} fullWidth maxWidth={'md'}>
      <DialogContent dividers>
        <Box className={classes.main}>
          <Grid container>
            <Grid item xs={6}>
              <Box mb={2}>
                <Typography variant='h4'>{NAME}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box mb={2}>
                <Typography variant='h4'>{VALUE}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems='stretch'>
            <Grid item xs={6}>
              {formLabels?.map((ele) => {
                const { label, name } = ele || {}
                return (
                  <Box mb={2} maxHeight={200} minHeight={20} >
                    <Typography variant='h5'>{label || name}</Typography>
                  </Box>
                )
              })}
            </Grid>
            <Grid item xs={6}>
              {userForms?.map((responseElement, index) => {
                const { arrayOfStrings, FormsElementsId, value, id: responseId } = responseElement;
                return (
                  <Box key={`${FormsElementsId}-FormsElementsId-${formId}`} mb={2} maxHeight={200} minHeight={20} className={classes.tableCell}>
                    {(value?.includes(`form builder/${formId}`) ?
                      <Box color={theme.palette.primary.main} pl={2} onClick={() => imagePreviewHandler(value)} className={responsesClasses.viewBtn}>
                        {VIEW}
                      </Box>
                      : value) ||
                      <ul>
                        {arrayOfStrings?.filter((arr) => arr.value === true)?.map((val) => {
                          const { name } = val;
                          return (
                            <li key={`${formId}-${name}-${responseId}-${index}-${formId}`}>
                              {name}
                            </li>
                          )
                        }
                        )}
                      </ul>
                    }
                  </Box>
                )
              })}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default memo(UserFormPreview);
