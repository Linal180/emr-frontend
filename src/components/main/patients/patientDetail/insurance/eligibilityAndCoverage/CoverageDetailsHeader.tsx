//packages block
import { Box, Card, Grid, Typography } from "@material-ui/core";
import { FC, useMemo } from "react";
//constants, utils, types block
import { PATIENT_INFORMATION, PLAN_DETAIL_INFORMATION, PRIMARY_CARE_PROVIDER_INFO, SUBSCRIBER_INFORMATION } from "../../../../../../constants";
import { CoverageDetailsHeaderProps } from "../../../../../../interfacesTypes";
import { GREY_THREE } from "../../../../../../theme";
import { getFormatDateString } from "../../../../../../utils";

const CoverageDetailsHeader: FC<CoverageDetailsHeaderProps> = ({ patient, policyHolder, primaryProvider, policyEligibility }) => {
  const patientData = useMemo(() => {
    if (patient) {
      const { firstName, lastName, middleName, ssn, dob, gender, contacts } = patient || {}
      const { address, city, state, zipCode, } = contacts?.find((contact) => contact.primaryContact) || {}

      return [
        {
          name: 'Relationship',
          value: 'Self',
        },
        {
          name: 'First Name',
          value: firstName,
        },
        {
          name: 'Middle Name',
          value: middleName,
        },
        {
          name: 'Last Name',
          value: lastName,
        },
        {
          name: 'SSN',
          value: ssn,
        },
        {
          name: 'DOB',
          value: getFormatDateString(dob, 'MM/DD/YYYY'),
        },
        {
          name: 'Sex',
          value: gender,
        },
        {
          name: 'Street',
          value: address,
        },
        {
          name: 'City/State/Zip',
          value: `${city || ''} ${state || ''} ${zipCode || ''}`,
        },
      ]
    }

    return null
  }, [patient])

  const policyHolderData = useMemo(() => {
    if (policyHolder) {
      const { firstName, lastName, middleName, ssn, dob, sex, city, state, zipCode, address, certificationNumber } = policyHolder || {}

      return [
        {
          name: 'First Name',
          value: firstName,
        },
        {
          name: 'Middle Name',
          value: middleName,
        },
        {
          name: 'Last Name',
          value: lastName,
        },
        {
          name: 'Member ID',
          value: certificationNumber,
        },
        {
          name: 'SSN',
          value: ssn,
        },
        {
          name: 'DOB',
          value: getFormatDateString(dob, 'MM/DD/YYYY'),
        },
        {
          name: 'Sex',
          value: sex,
        },
        {
          name: 'Street',
          value: address,
        },
        {
          name: 'City/State/Zip',
          value: `${city || ''} ${state || ''} ${zipCode || ''}`,
        },
      ]
    }

    return null
  }, [policyHolder])

  const planInfo = useMemo(() => {
    if (policyEligibility) {
      const { payerName, planNumber, groupNumber, planBeginDate } = policyEligibility || {}
      const planStartDate = getFormatDateString(planBeginDate?.split("-")[0], 'MM/DD/YYYY')
      const planEndDate = getFormatDateString(planBeginDate?.split("-")[1], 'MM/DD/YYYY')

      return [
        {
          name: 'Payer Name',
          value: payerName,
        },
        {
          name: 'Plan Name',
          value: '',
        },
        {
          name: 'Plan Number',
          value: planNumber,
        },
        {
          name: 'Plan Begin Date',
          value: planStartDate,
        },
        {
          name: 'Plan End Date',
          value: planEndDate,
        },
        {
          name: 'Group Name',
          value: 'Premium Plus',
        },
        {
          name: 'Group Number',
          value: groupNumber,
        },
      ]
    }

    return null
  }, [policyEligibility])

  const providerInfo = useMemo(() => {
    if (primaryProvider) {
      const { firstName, lastName, contacts } = primaryProvider || {}
      const { phone } = contacts?.find((contact) => contact.primaryContact) || {}

      return [
        {
          name: 'Provider Name',
          value: `Dr. ${firstName || ''} ${lastName || ''}`,
        },
        {
          name: 'Provider Phone',
          value: phone,
        },
      ]
    }

    return null
  }, [primaryProvider])

  return (
    <Grid container spacing={3}>
      <Grid item md={3} sm={12} xs={12}>
        <Card>
          <Box p={3} minHeight={270}>
            <Typography variant="h4" color="textPrimary">{PATIENT_INFORMATION}</Typography>

            <Box p={1} />

            {patientData?.map((item, id) => {
              const { name, value } = item;
              return (
                <Box key={id} display='flex' justifyContent='space-between'>
                  <Box color={GREY_THREE} pr={1}>
                    <Typography variant='body2'>{name}</Typography>
                  </Box>

                  <Typography variant='body2' color='textPrimary'>{value}</Typography>
                </Box>
              )
            })}
          </Box>
        </Card>
      </Grid>

      <Grid item md={3} sm={12} xs={12}>
        <Card>
          <Box p={3} minHeight={270}>
            <Typography variant="h4" color="textPrimary">{SUBSCRIBER_INFORMATION}</Typography>

            <Box p={1} />

            {policyHolderData?.map((item, id) => {
              const { name, value } = item;
              return (
                <Box key={id} display='flex' justifyContent='space-between'>
                  <Box color={GREY_THREE} pr={1}>
                    <Typography variant='body2'>{name}</Typography>
                  </Box>

                  <Typography variant='body2' color='textPrimary'>{value}</Typography>
                </Box>
              )
            })}
          </Box>
        </Card>
      </Grid>

      <Grid item md={3} sm={12} xs={12}>
        <Card>
          <Box p={3} minHeight={270}>
            <Typography variant="h4" color="textPrimary">{PLAN_DETAIL_INFORMATION}</Typography>

            <Box p={1} />

            {planInfo?.map((item, id) => {
              const { name, value } = item;
              return (
                <Box key={id} display='flex' justifyContent='space-between'>
                  <Box color={GREY_THREE} pr={1}>
                    <Typography variant='body2'>{name}</Typography>
                  </Box>

                  <Typography variant='body2' color='textPrimary'>{value}</Typography>
                </Box>
              )
            })}
          </Box>
        </Card>
      </Grid>

      <Grid item md={3} sm={12} xs={12}>
        <Card>
          <Box p={3} minHeight={270}>
            <Typography variant="h4" color="textPrimary">{PRIMARY_CARE_PROVIDER_INFO}</Typography>

            <Box p={1} />

            {providerInfo?.map((item, id) => {
              const { name, value } = item;
              return (
                <Box key={id} display='flex' justifyContent='space-between'>
                  <Box color={GREY_THREE} pr={1}>
                    <Typography variant='body2'>{name}</Typography>
                  </Box>

                  <Typography variant='body2' color='textPrimary'>{value}</Typography>
                </Box>
              )
            })}
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CoverageDetailsHeader