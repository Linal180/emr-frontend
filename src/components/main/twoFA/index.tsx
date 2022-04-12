// packages block
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import InputController from '../../../controller';
import { Box, Button, Grid, Typography, } from '@material-ui/core';
// constants, history, styling block
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
import { STATUS, DISABLED, TWO_FA_AUTHENTICATION_DESCRIPTION, ENABLE, ENTER_PASSWORD } from '../../../constants';

const TwoFAComponent = (): JSX.Element => {
  const methods = useForm<any>({ mode: "all" });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <ProfileSettingsLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={4} display="flex" alignItems="center">
            <Typography variant='h4'>{STATUS}</Typography>

            <Box p={1} />

            <Button variant='contained' color='default'>{DISABLED}</Button>
          </Box>

          <Typography variant='body1'>{TWO_FA_AUTHENTICATION_DESCRIPTION}</Typography>

          <Box p={2} />

          <Grid container spacing={3}>
            <Grid item md={5} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="password"
                controllerLabel={ENTER_PASSWORD}
              />
            </Grid>
          </Grid>

          <Box p={1} />

          <Button type="submit" variant="contained" color='primary'>{ENABLE}</Button>
        </form>
      </FormProvider>
    </ProfileSettingsLayout>
  )
};

export default TwoFAComponent;
