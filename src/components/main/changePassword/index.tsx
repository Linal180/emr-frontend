// packages block
import { useContext, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Grid, } from "@material-ui/core";
//components block
import Alert from '../../common/Alert';
import InputController from '../../../controller';
import CardComponent from "../../common/CardComponent";
import ProfileSettingsLayout from '../../common/ProfileSettingsLayout';
// constants, history, styling block
import { AuthContext } from '../../../context';
import { ChangePasswordInputs } from '../../../interfacesTypes';
import { updatePasswordSchema } from '../../../validationSchemas';
import { useUpdatePasswordMutation } from '../../../generated/graphql';
import {
  CHANGE_PASSWORD, CONFIRM_PASSWORD, NEW_PASSWORD, OLD_PASSWORD, OLD_PASSWORD_DID_NOT_MATCH,
  PASSWORDS_MUST_MATCH, SAVE_TEXT, SET_PASSWORD_SUCCESS,
} from "../../../constants";

const ChangePasswordComponent = (): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { id: userId, } = user || {}
  const methods = useForm<ChangePasswordInputs>({
    mode: "all",
    resolver: yupResolver(updatePasswordSchema),
  });

  const { handleSubmit, reset, setError, watch, clearErrors } = methods;
  const { password, repeatPassword } = watch()

  const [updatePassword, { loading }] = useUpdatePasswordMutation({
    onError() {
      reset()
      Alert.error(OLD_PASSWORD_DID_NOT_MATCH)
    },

    onCompleted({ updatePassword }) {
      const { response } = updatePassword;
      const { status } = response || {}

      if (status === 200) {
        Alert.success(SET_PASSWORD_SUCCESS);
        reset()
      }
    }
  })

  const onSubmit: SubmitHandler<ChangePasswordInputs> = async (data) => {
    const { password, oldPassword } = data;
    try {
      userId && await updatePassword({
        variables: { updatePasswordInput: { id: userId, newPassword: password, oldPassword } }
      });
    } catch (error) { }
  };

  useEffect(() => {
    password === repeatPassword || !!!repeatPassword ?
      clearErrors("repeatPassword")
      : setError("repeatPassword", { message: PASSWORDS_MUST_MATCH })
  }, [clearErrors, password, repeatPassword, setError, watch])

  return (
    <ProfileSettingsLayout>
      <CardComponent cardTitle={CHANGE_PASSWORD}>
        <Box p={2} mb={2}>
          <FormProvider {...methods}>
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
    </ProfileSettingsLayout>
  )
}

export default ChangePasswordComponent;
