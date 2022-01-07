// packages block
import { Link } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Box, TextField, Button, Typography, CircularProgress, FormControl, InputLabel } from "@material-ui/core";
// components block
import Alert from "../../common/Alert";
// context, constants, graphql,svgs, interfaces and styles block
import history from "../../../history";
import { requiredLabel } from "../../../utils";
import { MainLogo } from "../../../assets/svgs";
import { useLoginStyles } from "../../../styles/loginStyles";
import { ForgetPasswordInputs } from "../../../interfacesTypes";
import { useForgetPasswordMutation } from "../../../generated/graphql";
import { forgetPasswordValidationSchema } from "../../../validationSchemas";
import { SEND_EMAIL, FORGET_PASSWORD_SUCCESS, FORGOT_PASSWORD_MESSAGE, SIGN_IN, BACK_TO, LOGIN_ROUTE, EMR_ADMIN_PORTAL, EMAIL, ROOT_ROUTE } from "../../../constants";

const ForgetPasswordComponent = (): JSX.Element => {
  const classes = useLoginStyles();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ForgetPasswordInputs>({
    mode: "all",
    resolver: yupResolver(forgetPasswordValidationSchema)
  });

  const [forgotPassword, { loading }] = useForgetPasswordMutation({
    onError(message) {
      return null;
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

  const { email: { message: emailError } = {} } = errors;

  return (
    <Box className={classes.root}>
      <Box className={classes.loginFormContainer}>
        <Box pb={3}>
          <Typography variant="h3">{EMR_ADMIN_PORTAL}</Typography>
          <Typography variant="body1">{FORGOT_PASSWORD_MESSAGE}</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""

            render={({ field, fieldState: { invalid } }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel shrink htmlFor="email">
                  {requiredLabel(EMAIL)}
                </InputLabel>

                <TextField
                  id="email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  {...field}
                  error={invalid}
                  helperText={emailError}
                />
              </FormControl>
            )}
          />

          <Box py={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {SEND_EMAIL}
              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </form>

        <Box justifyContent="center" alignItems="center" display="flex">
          <Typography variant="body2">
            {BACK_TO}
          </Typography>

          <Typography component={Link} to={ROOT_ROUTE}>{SIGN_IN}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgetPasswordComponent;
