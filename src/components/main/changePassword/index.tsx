// packages block
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Grid, MenuItem, Typography } from "@material-ui/core";
//components block
import Alert from '../../common/Alert';
import InputController from '../../../controller';
import CardComponent from "../../common/CardComponent";
// constants, history, styling block
import { WHITE } from "../../../theme";
import { SettingsIcon, ShieldIcon } from "../../../assets/svgs";
import { useProfileDetailsStyles } from "../../../styles/profileDetails";
import {
  CHANGE_PASSWORD, CONFIRM_PASSWORD, GENERAL, NEW_PASSWORD, OLD_PASSWORD, PROFILE_GENERAL_MENU_ITEMS,
  PROFILE_SECURITY_MENU_ITEMS, SAVE_TEXT, SECURITY, SET_PASSWORD_SUCCESS, USER_SETTINGS
} from "../../../constants";
import { updatePasswordSchema } from '../../../validationSchemas';
import { ChangePasswordInputs } from '../../../interfacesTypes';
import { useUpdatePasswordMutation } from '../../../generated/graphql';
import { AuthContext } from '../../../context';

const ChangePasswordComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const { user } = useContext(AuthContext)
  const { id: userId, } = user || {}
  const methods = useForm<ChangePasswordInputs>({
    mode: "all",
    resolver: yupResolver(updatePasswordSchema),
  });

  const [updatePassword, { loading }] = useUpdatePasswordMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted({ updatePassword }) {
      const { response } = updatePassword;
      const { status } = response || {}
      if (status === 200) {
        Alert.success(SET_PASSWORD_SUCCESS);
      }
    }
  })
  const { handleSubmit, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
    const { password, oldPassword } = data;
    try {
      userId && await updatePassword({
        variables: { updatePasswordInput: { id: userId, newPassword: password, oldPassword } }
      });
    } catch (error) { }

  };

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
          <CardComponent cardTitle={CHANGE_PASSWORD}>
            <Box p={2} mb={2}>
              <FormProvider {...methods}>
                {JSON.stringify(errors)}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item md={8} sm={12} xs={12}>
                      <InputController
                        isPassword
                        fieldType="password"
                        controllerName="oldPassword"
                        controllerLabel={OLD_PASSWORD}
                      />

                      <InputController
                        isPassword
                        fieldType="password"
                        controllerName="password"
                        controllerLabel={NEW_PASSWORD}
                      />

                      <InputController
                        isPassword
                        fieldType="password"
                        controllerName="repeatPassword"
                        controllerLabel={CONFIRM_PASSWORD}
                      />

                      <Button type="submit" variant="contained" color="primary">
                        {SAVE_TEXT}

                        {loading && <CircularProgress size={20} color="inherit" />}
                      </Button>
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
}

export default ChangePasswordComponent;
