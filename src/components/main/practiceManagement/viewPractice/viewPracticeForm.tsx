// packages block
import { FC } from 'react';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Grid, Typography } from "@material-ui/core";
// components block
import PhoneField from '../../../common/PhoneInput';
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import InputController from '../../../../controller';
import { FAX, PHONE, PRACTICE_DETAILS_TEXT, PRACTICE_IDENTIFIER, PRACTICE_NAME, SAVE_TEXT } from "../../../../constants";

const ViewPracticeForm: FC = (): JSX.Element => {
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => {
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxWidth="100vh">
          <Box maxHeight="calc(100vh - 248px)">
            <Grid container spacing={3}>
              <Grid md={12} item>
                <CardComponent cardTitle={PRACTICE_DETAILS_TEXT}>
                  <Grid item md={12} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="practiceName"
                      controllerLabel={PRACTICE_NAME}
                    />
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <PhoneField name="phone" label={PHONE} />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="fax"
                        controllerLabel={FAX}
                      />
                    </Grid>
                  </Grid>

                  <Typography>{PRACTICE_IDENTIFIER}</Typography>

                  <Grid container spacing={3}>
                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="npi"
                      />
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="ein"
                      />
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="upin"
                      />
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="medicare"
                      />
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="medicaid"
                      />
                    </Grid>

                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="champus"
                      />
                    </Grid>
                  </Grid>
                </CardComponent>
              </Grid>
            </Grid>
          </Box>

          <Box display="flex" justifyContent="flex-end" pt={2}>
            <Button type="submit" variant="contained" color="primary">
              {SAVE_TEXT}
            </Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default ViewPracticeForm;

