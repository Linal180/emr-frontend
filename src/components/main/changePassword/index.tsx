// packages block
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Grid, MenuItem, Typography } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//components block
import Alert from '../../common/Alert';
import InputController from '../../../controller';
import CardComponent from "../../common/CardComponent";
// constants, history, styling block
import { WHITE } from "../../../theme";
import { SettingsIcon, ShieldIcon } from "../../../assets/svgs";
import { updatePasswordInputs } from '../../../interfacesTypes';
import { updatePasswordSchema } from '../../../validationSchemas';
import { useUpdatePasswordMutation } from '../../../generated/graphql';
import { useProfileDetailsStyles } from "../../../styles/profileDetails";
import {
  CONFIRM_PASSWORD, GENERAL, NEW_PASSWORD, OLD_PASSWORD, PROFILE_GENERAL_MENU_ITEMS, PROFILE_SECURITY_MENU_ITEMS,
  SAVE_TEXT, SECURITY, USER_SETTINGS, CHANGE_PASSWORD, PRECONDITION_FAILED_EXCEPTION, OLD_PASSWORD_DID_NOT_MATCH,
  RESET_PASSWORD_SUCCESS,
} from "../../../constants";
import { useContext } from 'react';
import { AuthContext } from '../../../context';

const ChangePasswordComponent = (): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { id } = user || {};
  const classes = useProfileDetailsStyles()
  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(updatePasswordSchema)
  });
  const { handleSubmit, reset } = methods;

  const [updatePassword, { loading }] = useUpdatePasswordMutation({
    onError({ message }) {
      Alert.error(message === PRECONDITION_FAILED_EXCEPTION ?
        OLD_PASSWORD_DID_NOT_MATCH : message
      )
    },

    onCompleted() {
      reset();
      Alert.success(RESET_PASSWORD_SUCCESS);
    }
  })

  const onSubmit: SubmitHandler<updatePasswordInputs> = async ({ oldPassword, password }) => {
    id && await updatePassword({
      variables: {
        updatePasswordInput: {
          id, newPassword: password, oldPassword
        }
      }
    })
  }

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
                {PROFILE_GENERAL_MENU_ITEMS.map(({ name, link }) =>
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
                {PROFILE_SECURITY_MENU_ITEMS.map(({ name, link }) =>
                  <Link key={`${link}-${name}`} to={link}>
                    <MenuItem>{name}</MenuItem>
                  </Link>
                )}
              </Box>
            </CardComponent>
          </Box>
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardComponent cardTitle={CHANGE_PASSWORD}>
                <Box p={2}>
                  <InputController
                    isPassword
                    fieldType="password"
                    controllerName="oldPassword"
                    controllerLabel={OLD_PASSWORD}
                  />

                  <InputController
                    isPassword
                    fieldType="password"
                    controllerName="newPassword"
                    controllerLabel={NEW_PASSWORD}
                  />

                  <InputController
                    isPassword
                    fieldType="password"
                    controllerName="confirmPassword"
                    controllerLabel={CONFIRM_PASSWORD}
                  />

                  <Box display="flex" justifyContent="flex-start" pt={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                      {SAVE_TEXT}

                      {loading && <CircularProgress size={20} color="inherit" />}
                    </Button>
                  </Box>
                </Box>
              </CardComponent>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ChangePasswordComponent;
