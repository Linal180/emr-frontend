//packages block
import { memo } from 'react';
import { Dialog, DialogContent, Box, Grid, useTheme, Typography, IconButton } from '@material-ui/core';
//interfaces & styles
import { UserFormPreviewModalProps } from '../../../../interfacesTypes';
import { usePreviewModalStyles } from '../../../../styles/formbuilder/previewModalStyles';
import { useFormResponsesStyles } from '../../../../styles/formbuilder/responses';
import { NAME, VALUE, VIEW } from '../../../../constants';
import { CrossIcon } from '../../../../assets/svgs';
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
          <Box mb={2} display="flex" justifyContent="flex-end">
            <IconButton size='small' onClick={closeModalHandler}>
              <CrossIcon />
            </IconButton>
          </Box>

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
                  <Box mb={2} maxHeight={30} minHeight={30}>
                    <Typography variant='h5'>{label || name}</Typography>
                  </Box>
                )
              })}
            </Grid>

            <Grid item xs={6}>
              {userForms?.map((responseElement, index) => {
                const { arrayOfStrings, FormsElementsId, value, id: responseId, arrayOfObjects } = responseElement;
                return (
                  <Box key={`${FormsElementsId}-FormsElementsId-${formId}`} mb={2} maxHeight={30} minHeight={30} className={classes.tableCell}>
                    {(value?.includes(`form builder/${formId}`) ?
                      <Box color={theme.palette.primary.main} pl={2} onClick={() => imagePreviewHandler(value)} className={responsesClasses.viewBtn}>
                        {VIEW}
                      </Box>
                      : value) ||
                      <ul>
                        {arrayOfObjects?.filter((arr) => arr.value === true)?.map((val) => {
                          const { name } = val;
                          return (
                            <li key={`${responseId}-${name}-${responseId}-${index}`}>
                              {name}
                            </li>
                          )
                        }
                        )}
                        {arrayOfStrings?.map((val) => (
                          <li key={`${val}-${responseId}-${index}`}>
                            {val}
                          </li>
                        ))}
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
