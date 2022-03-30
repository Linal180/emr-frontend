// packages block
import { Box, Button, Grid } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//components block
import InputController from '../../../controller';
import CardComponent from "../../common/CardComponent";
// constants, history, styling block
import { useProfileDetailsStyles } from "../../../styles/profileDetails";
import { CONFIRM_PASSWORD, NEW_PASSWORD, OLD_PASSWORD, SAVE_TEXT } from "../../../constants";

const ChangePasswordComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <Box className={classes.changePasswordContainer}>
      <Grid container justifyContent='center'>
        <Grid item md={4} sm={12} xs={12}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className={classes.changePasswordCard}>
                <CardComponent cardTitle="Change Password">
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
                    <Button type="submit" variant="contained" color="primary">
                      {SAVE_TEXT}
                    </Button>
                  </Box>
                </CardComponent>
              </Box>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ChangePasswordComponent;
