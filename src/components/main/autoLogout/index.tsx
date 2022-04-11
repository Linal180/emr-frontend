// packages block
import { Link } from 'react-router-dom';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// component block
import Selector from '../../common/Selector';
import CardComponent from '../../common/CardComponent';
import { Box, Button, Grid, MenuItem, Typography, } from '@material-ui/core';
// constants, history, styling block
import { WHITE } from '../../../theme';
import { SettingsIcon, ShieldIcon } from '../../../assets/svgs';
import { useHeaderStyles } from " ../../../src/styles/headerStyles";
import {
  AUTO_LOGOUT, AUTO_LOGOUT_DESCRIPTION, EMPTY_OPTION, GENERAL, PROFILE_GENERAL_MENU_ITEMS, SAVE_TEXT, SECURITY,
  USER_SETTINGS, PROFILE_SECURITY_MENU_ITEMS,
} from '../../../constants';

const AutoLogoutComponent = (): JSX.Element => {
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
          <CardComponent cardTitle={AUTO_LOGOUT}>
            <Box p={2} mb={2}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item md={10} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="notice"
                        label={AUTO_LOGOUT_DESCRIPTION}
                        value={EMPTY_OPTION}
                        options={[]}
                      />

                      <Button type="submit" variant="contained" color='primary'>{SAVE_TEXT}</Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </CardComponent>
        </Grid>
      </Grid>
    </Box>
  )
};

export default AutoLogoutComponent;
