// packages block
import { FC, useState } from "react";
import moment from "moment";
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Button, Avatar
} from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../../../utils";
import { getDate } from "../../../../../../utils";
import { Patient } from "../../../../../../generated/graphql";
import { ProfileUserIcon } from "../../../../../../assets/svgs";
import {
  EMAIL, PHONE, NAME, SPECIALTY, FACILITY, dummyVitalsChartingList, GROWTH_CHART, PDF_TEXT
} from "../../../../../../constants";
import InputController from "../../../../../../controller";
import { useProfileDetailsStyles } from "../../../../../../styles/profileDetails";

const VitalsChartingTable: FC = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const [patientData] = useState<Patient | null>();
  const { firstName, lastName, dob, doctorPatients } = patientData || {}
  const PATIENT_AGE = moment().diff(getDate(dob || ''), 'years');

  const ProfileDetails = [
    {
      icon: ProfileUserIcon(),
      description: `${PATIENT_AGE} Yrs Old`
    },
  ]

  let providerName = "hello world"

  if (doctorPatients) {
    const currentDoctor = doctorPatients.map(doctorPatient => {
      if (doctorPatient.currentProvider) {
        return doctorPatient.doctor
      }

      return null
    })[0];

    if (currentDoctor) {
      debugger
      const { firstName, lastName } = currentDoctor || {};
      providerName = `${firstName} ${lastName}` || "--"
    }
  }

  const ProfileAdditionalDetails = [
    {
      title: "Primary Provider",
      description: providerName
    },
  ]
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  return (
    <>
      <Box className={classes.profileCard}>
        <Box display="flex" alignItems="center">
          <Box pl={1}>
            <Box pr={3.75}>
              <Avatar variant="square" src='' className={classes.profileImage} />
            </Box>
          </Box>
        </Box>

        <Box flex={1}>
          <Box display="flex">
            <Box flex={1}>
              <Box display="flex" alignItems="center" className={classes.userName}>
                {`${firstName} ${lastName}`}
              </Box>

              <Box display="flex" width="100%" pt={1} flexWrap="wrap">
                {ProfileDetails.map((item, index) => (
                  <Box display="flex" key={`${item.description}-${index}`} className={classes.profileInfoItem}>
                    <Box>{item.icon}</Box>
                    <Box>{item.description}</Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box display="flex" pr={3}>
              {ProfileAdditionalDetails.map((item, index) => (
                <Box key={`${item.title}-${index}`}>
                  <Box className={classes.profileInfoHeading}>{item.title}</Box>
                  <Box>{item.description}</Box>
                </Box>
              ))}
            </Box>

            <Button color="primary" variant="contained" className="blue-button">Schedule Appointment</Button>
          </Box>
        </Box>
      </Box>

      <Box pt={3} pb={2} pl={3} display='flex'>
        <Box pr={1}>
          <Button color="secondary" variant="contained">
            {GROWTH_CHART}
          </Button>
        </Box>

        <Box>
          <Button color="secondary" variant="contained">
            {PDF_TEXT}
          </Button>
        </Box>
      </Box>

      <Box>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh('22-10-2022')}
                {renderTh(EMAIL)}
                {renderTh(PHONE)}
                {renderTh(SPECIALTY)}
                {renderTh(FACILITY)}
              </TableRow>
            </TableHead>

            <TableBody>
              {dummyVitalsChartingList?.map((item) => {
                const { id, firstName, lastName, email, phone, specialty, code } = item || {};

                return (
                  <TableRow key={id}><TableCell scope="row">{`${firstName} ${lastName}`}</TableCell>
                    <TableCell scope="row">
                      <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <InputController
                            fieldType="text"
                            controllerName="reason"
                            controllerLabel={''}
                          />
                        </form>
                      </FormProvider>
                    </TableCell>
                    <TableCell scope="row">{email}</TableCell>
                    <TableCell scope="row">{phone}</TableCell>
                    <TableCell scope="row">{specialty}</TableCell>
                    <TableCell scope="row">{code}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
};

export default VitalsChartingTable;
