// packages block
import { useParams } from 'react-router';
import { Reducer, useReducer } from 'react';
import { Avatar, Box, Button, Grid } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
//components block
import InputController from '../../../controller';
import MediaCards from "../../common/AddMedia/MediaCards";
// constants, history, styling block
import { ParamsType } from "../../../interfacesTypes";
import { AttachmentType } from "../../../generated/graphql";
import { useProfileStyles } from "../../../styles/profileStyles";
import { patientReducer, Action, initialState, State } from "../../../reducers/patientReducer";
import { ADDRESS_NUMBER, CITY, CONTACT_NUMBER, COUNTRY, EMAIL, FIRST_NAME, LAST_NAME, SAVE_TEXT, STATE, UPLOAD_PICTURE, ZIP_CODE } from "../../../constants";
const ProfileComponent = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useProfileStyles()
  const [state] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { attachmentUrl, attachmentData, attachmentId } = state
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }
  return (
    <Grid container justifyContent='center'>
      <Grid item md={8} sm={12} xs={12}>
        <Box className={classes.profileContainer}>
          <Box>
            <Box key={attachmentId} pr={3.75} position="relative">
              <Avatar variant="square" src={attachmentUrl || ""} className={classes.profileImage} />

              {/* <MediaCards isProfile={true} moduleType={AttachmentType.Patient} itemId={id} imageSide={attachmentUrl} attachmentData={attachmentData || undefined} notDescription={true} /> */}
            </Box>

            <Box pt={2}>
              <Button type="submit" variant="outlined" color="primary">
                {UPLOAD_PICTURE}
              </Button>
            </Box>
          </Box>

          <Box py={3}>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="firstName"
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="lastName"
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="email"
                      controllerLabel={EMAIL}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="contactNumber"
                      controllerLabel={CONTACT_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="addressNumber"
                    controllerLabel={ADDRESS_NUMBER}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="zipCode"
                      controllerLabel={ZIP_CODE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-start" pt={2}>
                  <Button type="submit" variant="contained" color="primary">
                    {SAVE_TEXT}
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
export default ProfileComponent;