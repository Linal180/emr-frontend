// packages
import { FC } from 'react';
import { CKEditor } from 'ckeditor4-react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Card, Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@material-ui/core'
//components
import InputController from '../../../../../controller';
//constants, types, interfaces, utils
import { GRAY_SIX, } from '../../../../../theme';
import { AgreementGeneralProps } from '../../../../../interfacesTypes';
import {
  AGREEMENTS, DELETE, DETAILS, FACILITY, REQUIRE_AGREEMENT_BEFORE_AGREEING, REQUIRE_SIGNATURE,
  SAVE_TEXT, TITLE
} from '../../../../../constants';

const AddAgreementComponent: FC<AgreementGeneralProps> = ({ setEdit }) => {
  const methods = useForm({
    mode: "all",
  });

  return (
    <>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color='textPrimary'>{AGREEMENTS}</Typography>

        <Box onClick={() => setEdit(false)} display="flex" alignItems="center">
          <Button variant="outlined" color="inherit" className='danger'>
            {DELETE}
          </Button>

          <Box p={1} />

          <Button onClick={() => setEdit(false)} type="submit" variant="contained" color="primary">
            {SAVE_TEXT}
          </Button>
        </Box>
      </Box>

      <Card>
        <Box p={3}>
          <Box pb={2} mb={4} borderBottom={`1px solid ${GRAY_SIX}`}>
            <Typography variant='h6'>{DETAILS}</Typography>
          </Box>

          <FormProvider {...methods}>
            <form>
              <Grid container>
                <Grid item md={4} sm={12} xs={12}>
                  <InputController
                    fieldType="number"
                    controllerName="amount"
                    controllerLabel={TITLE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Typography>{FACILITY}</Typography>
                  <Box p={0.5} />
                  <CKEditor />
                </Grid>

                <Box p={2} />

                <Grid item md={12} sm={12} xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Box>
                          <Checkbox />
                        </Box>
                      }

                      label={<Typography variant="h6">{REQUIRE_SIGNATURE}</Typography>}
                    />
                  </FormGroup>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Box>
                          <Checkbox />
                        </Box>
                      }

                      label={<Typography variant="h6">{REQUIRE_AGREEMENT_BEFORE_AGREEING}</Typography>}
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Box>
      </Card>
    </>
  )
}

export default AddAgreementComponent
