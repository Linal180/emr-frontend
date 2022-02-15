// packages block
import { FC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Grid, Typography } from "@material-ui/core";
// components block
import PatientCardComponent from "./PatientCardComponent";
// interfaces, graphql, constants block /styles
import { extendedPatientSchema } from '../../../../../../validationSchemas';
import { usePatientChartingStyles } from '../../../../../../styles/patientCharting';
import { GeneralFormProps, PatientInputProps } from '../../../../../../interfacesTypes';
import {
  ALLERGIES_TEXT, CARE_PLAN_TEXT, FAMILY_HISTORY_TEXT, IMPLANT_HISTORY_TEXT, LAB_RESULTS_TEXT,
  MEDICAL_HISTORY_TEXT, MEDICATIONS_TEXT, PROBLEMS_TEXT, SOCIAL_HISTORY_TEXT, SURGICAL_HISTORY_TEXT, VACCINE_TEXT, VITALS_TEXT,
} from "../../../../../../constants";

const PatientChartCards: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const classes = usePatientChartingStyles()
  const methods = useForm<PatientInputProps>({
    mode: "all",
    resolver: yupResolver(extendedPatientSchema)
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  const PatientChartingData = [
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
  ]

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={8} item>
              <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd>

              </PatientCardComponent>

              <Box pb={3} />

              <Grid container spacing={3}>
                <Grid md={6} item>
                  <PatientCardComponent cardTitle={ALLERGIES_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                  <Box pb={3} />

                  <PatientCardComponent cardTitle={FAMILY_HISTORY_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                  <Box pb={3} />

                  <PatientCardComponent cardTitle={MEDICAL_HISTORY_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                </Grid>

                <Grid md={6} item>
                  <PatientCardComponent cardTitle={PROBLEMS_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                  <Box pb={3} />

                  <PatientCardComponent cardTitle={VACCINE_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                  <Box pb={3} />

                  <PatientCardComponent cardTitle={SOCIAL_HISTORY_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                  <Box pb={3} />

                  <PatientCardComponent cardTitle={IMPLANT_HISTORY_TEXT} hasAdd>
                    {PatientChartingData && PatientChartingData.map((item, index) => {
                      const { title, description, date } = item
                      return (
                        <Box pb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                            <Typography className={classes.cardContentDate}>{date}</Typography>
                          </Box>

                          <Box>
                            <Typography className={classes.cardContentDescription}>{description}</Typography>
                          </Box>
                        </Box>
                      )
                    })}
                  </PatientCardComponent>

                </Grid>
              </Grid>

            </Grid>

            <Grid md={4} item>
              <PatientCardComponent cardTitle={MEDICATIONS_TEXT} hasAdd>
                {PatientChartingData && PatientChartingData.map((item, index) => {
                  const { title, description, date } = item
                  return (
                    <Box pb={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                        <Typography className={classes.cardContentDate}>{date}</Typography>
                      </Box>

                      <Box>
                        <Typography className={classes.cardContentDescription}>{description}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </PatientCardComponent>

              <Box pb={3} />

              <PatientCardComponent cardTitle={LAB_RESULTS_TEXT} hasAdd>
                {PatientChartingData && PatientChartingData.map((item, index) => {
                  const { title, description, date } = item
                  return (
                    <Box pb={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                        <Typography className={classes.cardContentDate}>{date}</Typography>
                      </Box>

                      <Box>
                        <Typography className={classes.cardContentDescription}>{description}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </PatientCardComponent>


              <Box pb={3} />

              <PatientCardComponent cardTitle={SURGICAL_HISTORY_TEXT} hasAdd>
                {PatientChartingData && PatientChartingData.map((item, index) => {
                  const { title, description, date } = item
                  return (
                    <Box pb={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                        <Typography className={classes.cardContentDate}>{date}</Typography>
                      </Box>

                      <Box>
                        <Typography className={classes.cardContentDescription}>{description}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </PatientCardComponent>

              <Box pb={3} />

              <PatientCardComponent cardTitle={CARE_PLAN_TEXT} hasAdd>
                {PatientChartingData && PatientChartingData.map((item, index) => {
                  const { title, description, date } = item
                  return (
                    <Box pb={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography className={classes.cardContentHeading} key={`${item}-${index}`}>{title}</Typography>
                        <Typography className={classes.cardContentDate}>{date}</Typography>
                      </Box>

                      <Box>
                        <Typography className={classes.cardContentDescription}>{description}</Typography>
                      </Box>
                    </Box>
                  )
                })}
              </PatientCardComponent>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  );
};

export default PatientChartCards;
