// packages block
import { FC } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import InputController from '../../../../controller';
import PhoneField from '../../../common/PhoneInput';
import LogoIcon from "../../../../assets/images/logo.svg"
// constants block
import { 
  CHAMPUS, EIN, FAX, MEDICAID, MEDICARE, PHONE, PRACTICE_IDENTIFIER, PRACTICE_NAME, PRACTICE_NPI, 
  SAVE_TEXT, UPIN, UPLOAD_LOGO 
} from '../../../../constants';

const DetailPracticeComponent: FC = (): JSX.Element => {
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }
  return (
    <>
      <Box p={4} />
      
      <Grid container justifyContent='center'>
        <Grid item md={8} sm={12} xs={12}>
          <Card>
            <Box mt={5} p={5}>
              <Grid container spacing={3}>
                <Grid item md={4} sm={12}>
                  <Box className='logo-container'>
                    <img src={LogoIcon} alt="" />
                  </Box>

                  <Box mt={2} ml={1}>
                    <Button type="submit" variant="outlined" color="secondary">
                      {UPLOAD_LOGO}
                    </Button>
                  </Box>
                </Grid>

                <Grid item md={8} sm={12}>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container spacing={3}>
                        <Grid item md={12} sm={12}>
                          <InputController
                            fieldType="text"
                            controllerName="Name"
                            controllerLabel={PRACTICE_NAME}
                          />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12}>
                          <PhoneField name="phone" label={PHONE} />
                        </Grid>

                        <Grid item md={6} sm={12}>
                          <PhoneField name="fax" label={FAX} />
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={12} sm={12}>
                          <Typography variant='h6'>{PRACTICE_IDENTIFIER}</Typography>
                        </Grid>
                      </Grid>

                      <Box p={2} />

                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12}>
                          <Grid container spacing={3}>
                            <Grid item md={6} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="NPI"
                                controllerLabel={PRACTICE_NPI}
                              />
                            </Grid>

                            <Grid item md={6} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="EIN"
                                controllerLabel={EIN}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item md={6} sm={12}>
                          <Grid container spacing={3}>
                            <Grid item md={6} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="UPIN"
                                controllerLabel={UPIN}
                              />
                            </Grid>

                            <Grid item md={6} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="medicare"
                                controllerLabel={MEDICARE}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12}>
                          <Grid container spacing={3}>
                            <Grid item md={6} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="medicad"
                                controllerLabel={MEDICAID}
                              />
                            </Grid>

                            <Grid item md={6} sm={12}>
                              <InputController
                                fieldType="text"
                                controllerName="champus"
                                controllerLabel={CHAMPUS}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item md={12} sm={12}>
                          <Button variant='contained' color='primary'>{SAVE_TEXT}</Button>
                        </Grid>
                      </Grid>
                    </form>
                  </FormProvider>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default DetailPracticeComponent;