// packages block
import { Link } from 'react-router-dom';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import InputController from '../../../controller';
import CardComponent from '../../common/CardComponent';
import { Box, Button, Grid, MenuItem, Typography, } from '@material-ui/core';
// constants, history, styling block
import { WHITE } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  GENERAL, PROFILE_GENERAL_MENU_ITEMS, SECURITY, USER_SETTINGS, PROFILE_SECURITY_MENU_ITEMS, TWO_FA_AUTHENTICATION, STATUS,
  DISABLED, TWO_FA_AUTHENTICATION_DESCRIPTION, ENABLE, ENTER_PASSWORD,
} from '../../../constants';

const TwoFAComponent = (): JSX.Element => {
  const classes = useHeaderStyles();
  const methods = useForm<any>({ mode: "all" });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Box mt={5}>
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Box minHeight="calc(100vh - 170px)" bgcolor={WHITE}>
            <CardComponent cardTitle={USER_SETTINGS}>
              <Box display="flex">
                <SettingsIcon />

                <Box p={1} />

                <Typography variant='h6'>{GENERAL}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_GENERAL_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
              </Box>

              <Box mt={2} display="flex">
                <ShieldIcon />
                <Box p={1} />
                <Typography variant='h6'>{SECURITY}</Typography>
              </Box>

              <Box p={2} className={classes.sidebarMenu}>
                {PROFILE_SECURITY_MENU_ITEMS.map(({ link, name }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={5} sm={12} xs={12}>
          <CardComponent cardTitle={TWO_FA_AUTHENTICATION}>
            <Box p={2} mb={2}>
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
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
};

export default TwoFAComponent;
