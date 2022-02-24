// packages block
import { FC } from 'react';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Grid, Typography } from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import InputController from '../../../../controller';
import {
  ADDRESS, ADDRESS_CTA, CITY, COUNTRY, EMAIL, EMPTY_OPTION, FACILITY_DETAILS_TEXT,
  FACILITY_NAME, FAX, FIRST_NAME, LAST_NAME, MAPPED_ROLES, PHONE, PRACTICE_DETAILS_TEXT,
  PRACTICE_IDENTIFIER, PRACTICE_NAME, ROLE, SAVE_TEXT, STATE, USER_DETAILS_TEXT, ZIP_CODE
} from "../../../../constants";

const AddPracticeForm: FC = (): JSX.Element => {
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
          <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
            <Grid container spacing={3}>
              <Grid md={12} item>
                <CardComponent cardTitle={USER_DETAILS_TEXT}>
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
                    <Grid item md={4} sm={12} xs={12}>
                      <InputController
                        fieldType="email"
                        controllerName="email"
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      <PhoneField name="phone" label={PHONE} />
                    </Grid>

                    <Grid item md={4}>
                      <Selector
                        label={ROLE}
                        name="roleType"
                        value={EMPTY_OPTION}
                        options={MAPPED_ROLES}
                      />
                    </Grid>
                  </Grid>
                </CardComponent>
              </Grid>
            </Grid>

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

            <Grid container spacing={3}>
              <Grid md={12} item>
                <CardComponent cardTitle={FACILITY_DETAILS_TEXT}>
                  <Grid item md={12} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="facilityName"
                      controllerLabel={FACILITY_NAME}
                    />
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="address"
                        controllerLabel={ADDRESS}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="addressCTA"
                        controllerLabel={ADDRESS_CTA}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="zipCode"
                        controllerLabel={ZIP_CODE}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="city"
                        controllerLabel={CITY}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="state"
                        controllerLabel={STATE}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="country"
                        controllerLabel={COUNTRY}
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
    </FormProvider >
  );
};

export default AddPracticeForm;

