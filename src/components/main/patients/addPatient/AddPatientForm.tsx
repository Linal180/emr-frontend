// packages block
import { FC, useState, ChangeEvent } from 'react';
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography, FormControlLabel, Radio, RadioGroup, FormLabel, FormGroup, Checkbox, TextField, TextareaAutosize
} from "@material-ui/core";
// components block
import AddPatientController from "./AddPatientController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import { Gender } from "../../../../generated/graphql";
import {
  FIRST_NAME, LAST_NAME, MAPPED_GENDER_1, CITY, STATE, COUNTRY, CONTACT_INFORMATION, IDENTIFICATION, DOB, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, ADD_PATIENT, DEMOGRAPHICS,
  GUARANTOR, PRIVACY, REGISTRATION_DATES, EMERGENCY_CONTACT, NEXT_OF_KIN, EMPLOYMENT, INSURANCE_POLICY_INFO, GUARDIAN, BILLING_TEXT, POLICY_HOLDER, ELIGIBILITY, SUFFIX,
  MIDDLE_NAME, FIRST_NAME_USED, PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME, MOTHERS_MAIDEN_NAME, SSN, ZIP_CODE, ADDRESS, ADDRESS_2, ADDRESS_CTA,
  REGISTRATION_DATE, NOTICE_ON_FILE, CONSENT_TO_CALL, MEDICATION_HISTORY_AUTHORITY, PATIENT_NOTES, NAME, HOME_PHONE, MOBILE_PHONE, EMPLOYER_NAME, USUAL_OCCUPATION,
  USUAL_INDUSTRY, STATEMENT_DELIVERED_ONLINE, ISSUE_DATE, EXPIRATION_DATE, COINSURANCE_PERCENTAGE, NOTES, POLICY_HOLDER_ID, EMPLOYER, DECREASED_DATE, EMPLOYER_PHONE,
  STATEMENT_NOTE, ID_NUMBER, GROUP_NUMBER,
} from "../../../../constants";

const AddPatientForm: FC = (): JSX.Element => {
  const [value, setValue] = useState("one");
  const [state, setState] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false
  })
  const methods = useForm<any>({
    mode: "all"
  });
  const { handleSubmit, control } = methods;

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const onSubmit: any = () => {

  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="Suffix"
                      control={control}
                      controllerLabel={SUFFIX}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="middleName"
                      control={control}
                      controllerLabel={MIDDLE_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME_USED}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="preferredName"
                      control={control}
                      controllerLabel={PREFERRED_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="previousFirstName"
                      control={control}
                      controllerLabel={PREVIOUS_FIRST_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="previousLastName"
                      control={control}
                      controllerLabel={PREVIOUS_LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="mothersMaidenName"
                      control={control}
                      controllerLabel={MOTHERS_MAIDEN_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="ssn"
                      control={control}
                      controllerLabel={SSN}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="legalSex"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12}>
                  <AddPatientController
                    fieldType="date"
                    controllerName="dob"
                    control={control}
                    controllerLabel={DOB}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={CONTACT_INFORMATION}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="zipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="address"
                    control={control}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="address2"
                    control={control}
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="email"
                    control={control}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="homePhone"
                      controllerName="DEAActiveDate"
                      control={control}
                      controllerLabel={DEA_ACTIVE_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="mobilePhone"
                      controllerName="DEATermDate"
                      control={control}
                      controllerLabel={DEA_TERM_DATE}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={DEMOGRAPHICS}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="languageSpoken"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="Race"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="ethnicity"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="maritialStatus"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="sexualOrientation"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="gender"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="assignedSexAtBirth"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="pronouns"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="homebound"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={GUARANTOR}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientsRelationshipWithGuarantor*"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="suffix"
                      control={control}
                      controllerLabel={SUFFIX}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="fristName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="middleName"
                      control={control}
                      controllerLabel={MIDDLE_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12}>
                  <AddPatientController
                    fieldType="date"
                    controllerName="dob"
                    control={control}
                    controllerLabel={DOB}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="zipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="address"
                    control={control}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="addressCTA"
                    control={control}
                    controllerLabel={ADDRESS_CTA}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="ssn"
                      control={control}
                      controllerLabel={SSN}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="phone"
                      control={control}
                      controllerLabel={PHONE}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="email"
                    control={control}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employer"
                    control={control}
                    controllerLabel={EMPLOYER}
                  />
                </Grid>
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={REGISTRATION_DATES}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="usualProvider"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="registerationDepartment"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="primaryDepartment"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="registrationDate"
                      control={control}
                      controllerLabel={REGISTRATION_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="decreasedDate"
                      control={control}
                      controllerLabel={DECREASED_DATE}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={PRIVACY}>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{NOTICE_ON_FILE}</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.one}
                            onChange={handleChangeForCheckBox("one")}
                          />
                        }
                        label="One"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.two} onChange={handleChangeForCheckBox("two")} />
                        }
                        label="Two"
                      />
                    </FormGroup>
                  </FormControl>
                  <Box display="flex" flexDirection="row">
                    <FormControl component="fieldset">
                      <FormGroup>
                        <Box mr={3} mb={2} mt={2}>
                          <FormLabel component="legend">{CONSENT_TO_CALL}</FormLabel>
                          <FormControlLabel
                            control={
                              <Checkbox checked={state.three} onChange={handleChangeForCheckBox("three")} />
                            }
                            label="Three"
                          />
                        </Box>
                      </FormGroup>
                    </FormControl>
                    <FormControl component="fieldset">
                      <FormGroup>
                        <Box ml={3} mt={2} mb={2}>
                          <FormLabel component="legend">{MEDICATION_HISTORY_AUTHORITY}</FormLabel>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={state.four}
                                onChange={handleChangeForCheckBox("four")}
                              />
                            }
                            label="Four"
                          />
                        </Box>
                      </FormGroup>
                    </FormControl>
                  </Box>


                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientNotes"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl fullWidth margin="normal">
                        <InputLabel shrink htmlFor={"taxonomyCode"}>
                          {PATIENT_NOTES}
                        </InputLabel>

                        <TextField
                          fullWidth
                          multiline
                          type="text"
                          variant="outlined"
                          id="taxonomyCode"
                          InputProps={{
                            inputComponent: TextareaAutosize,
                            rows: 3
                          }}
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={EMERGENCY_CONTACT}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="name"
                    control={control}
                    controllerLabel={NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="relationship"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="homePhone"
                    control={control}
                    controllerLabel={HOME_PHONE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="mobilePhone"
                    control={control}
                    controllerLabel={MOBILE_PHONE}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={NEXT_OF_KIN}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="name"
                    control={control}
                    controllerLabel={NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="relationship"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="homePhone"
                    control={control}
                    controllerLabel={HOME_PHONE}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={EMPLOYMENT}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employerName"
                    control={control}
                    controllerLabel={EMPLOYER_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employerPhone"
                    control={control}
                    controllerLabel={EMPLOYER_PHONE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="usualOccupation"
                    control={control}
                    controllerLabel={USUAL_OCCUPATION}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="usualIndustry"
                    control={control}
                    controllerLabel={USUAL_INDUSTRY}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={GUARDIAN}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="firstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="middleName"
                    control={control}
                    controllerLabel={MIDDLE_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="lastName"
                    control={control}
                    controllerLabel={LAST_NAME}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="suffix"
                    control={control}
                    controllerLabel={SUFFIX}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_TEXT}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="holdStatement"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{STATEMENT_DELIVERED_ONLINE}</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.five}
                            onChange={handleChangeForCheckBox("five")}
                          />
                        }
                        label="Five"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="statementNote"
                    control={control}
                    controllerLabel={STATEMENT_NOTE}
                  />
                </Grid>

                <Grid item md={12}>
                  <AddPatientController
                    fieldType="date"
                    controllerName="dob"
                    control={control}
                    controllerLabel={DOB}
                  />
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
          <Box mt={3} ml={3} mb={3}>
            <Typography component="h4" variant="h4">Add Insurance</Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={INSURANCE_POLICY_INFO}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="insuranceCompany"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="zipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="address"
                    control={control}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="idNumber"
                    control={control}
                    controllerLabel={ID_NUMBER}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientRelationshipToPolicyHolder"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="groupNumber"
                    control={control}
                    controllerLabel={GROUP_NUMBER}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="issueDate"
                      control={control}
                      controllerLabel={ISSUE_DATE}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="expirationDate"
                      control={control}
                      controllerLabel={EXPIRATION_DATE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="copayAmounts"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName=""
                      control={control}
                      controllerLabel=""
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="coinsurancePercentage"
                    control={control}
                    controllerLabel={COINSURANCE_PERCENTAGE}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="referringProvider"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="primaryCareProvider"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="pricingProductType"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="notes"
                    control={control}
                    controllerLabel={NOTES}
                  />
                </Grid>
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={POLICY_HOLDER}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="entityType"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="policyHolderID"
                    control={control}
                    controllerLabel={POLICY_HOLDER_ID}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="suffix"
                      control={control}
                      controllerLabel={SUFFIX}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="firstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="middleName"
                      control={control}
                      controllerLabel={MIDDLE_NAME}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="lastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="zipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="address"
                    control={control}
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="addressCTA"
                    control={control}
                    controllerLabel={ADDRESS_CTA}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="ssn"
                      control={control}
                      controllerLabel={SSN}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="gender"
                      defaultValue={Gender.Male}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_1.map((gender) => {
                                const { label, value } = gender || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12}>
                  <AddPatientController
                    fieldType="date"
                    controllerName="dob"
                    control={control}
                    controllerLabel={DOB}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="employer"
                    defaultValue={Gender.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>Gender</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_1.map((gender) => {
                              const { label, value } = gender || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={ELIGIBILITY}>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={value}
                      onChange={handleChange}
                    >
                      {MAPPED_GENDER_1.map((gender) => {
                        const { label, value } = gender || {};
                        return <FormControlLabel key={value} value={value} control={<Radio />} label={label} />;
                      })}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary">
            {ADD_PATIENT}
          </Button>
        </Box>

      </form>
    </FormProvider >
  );
};

export default AddPatientForm;
