// packages block
import { Link } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Box, Button, Typography, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
import AuthLayout from "../AuthLayout";
import InputController from "../../../controller";
// context, constants, graphql,svgs, interfaces and styles block
import history from "../../../history";
import { ForgetPasswordInputs } from "../../../interfacesTypes";
import { useForgetPasswordMutation } from "../../../generated/graphql";
import { forgetPasswordValidationSchema } from "../../../validationSchemas";
import {
  SEND_EMAIL, FORGET_PASSWORD_SUCCESS, SIGN_IN, BACK_TO, LOGIN_ROUTE, EMAIL, NOT_FOUND_EXCEPTION,
  USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../constants";

const ForgetPasswordComponent = (): JSX.Element => {
  const methods = useForm<ForgetPasswordInputs>({
    mode: "all",
    resolver: yupResolver(forgetPasswordValidationSchema)
  });
  const { handleSubmit, reset } = methods

  const [forgotPassword, { loading }] = useForgetPasswordMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      Alert.success(FORGET_PASSWORD_SUCCESS);
      history.push(LOGIN_ROUTE)
      reset({ email: "" });
    }
  });

  const onSubmit: SubmitHandler<ForgetPasswordInputs> = async (data) => {
    await forgotPassword({
      variables: {
        forgotPasswordInput: data,
      },
    });
  };

  return (
    <AuthLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputController
            fieldType="email"
            controllerName="email"
            controllerLabel={EMAIL}
          />

          <Box py={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {SEND_EMAIL}

              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>
      </FormProvider>

      <Box justifyContent="center" alignItems="center" display="flex">
        <Typography variant="body2">
          {BACK_TO}
        </Typography>

        <Box ml={0.5}>
          <Typography component={Link} to={LOGIN_ROUTE}>{SIGN_IN}</Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ForgetPasswordComponent;
