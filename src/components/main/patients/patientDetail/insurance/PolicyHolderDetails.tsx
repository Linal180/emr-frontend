//packages import
import { FC, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { Box, Grid } from "@material-ui/core";
import { useFormContext } from "react-hook-form";
//components import
import Selector from "../../../../common/Selector";
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
//constants, types and interface props
import { setRecord } from "../../../../../utils";
import { GeneralFormProps, InsuranceCreateInput, ParamsType } from "../../../../../interfacesTypes";
import {
  PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, useGetPatientLazyQuery
} from "../../../../../generated/graphql";
import {
  ADDRESS_ONE, ADDRESS_TWO, CITY, DOB, EMPLOYER, EMPTY_OPTION, FIRST_NAME, SUFFIX, ZIP_CODE,
  LAST_NAME, LEGAL_SEX, MAPPED_POLICY_GENDER, MAPPED_STATES, MIDDLE_NAME, SSN, STATE,
  POLICY_HOLDER_ID_CERTIFICATION_NUMBER,
} from "../../../../../constants";

const PolicyHolderDetails: FC<GeneralFormProps> = ({ isEdit }) => {
  const { id: patientId } = useParams<ParamsType>()
  const { watch, setValue, trigger } = useFormContext<InsuranceCreateInput>()
  const { patientRelationship } = watch()
  const { id: patientRelationshipValue } = patientRelationship ?? {}

  const [getPatient] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    variables: {
      getPatient: { id: patientId }
    }
  });

  const handlePolicyHolderSelfRelation = useCallback(async () => {
    if (patientRelationshipValue === PolicyHolderRelationshipType.Self) {
      const { data } = await getPatient()
      const { getPatient: getPatientValues } = data ?? {}
      const { patient } = getPatientValues ?? {}

      const { gender, dob, firstName, lastName, middleName, suffix, contacts, ssn, employer } = patient ?? {}
      const { name } = employer || {}
      const { address2, address, state, zipCode, city } = contacts?.find((contact) => !!contact?.primaryContact) ?? {}

      dob && setValue('dob', dob)
      ssn && setValue('ssn', ssn)
      city && setValue('city', city)
      name && setValue('employer', name)
      suffix && setValue('suffix', suffix)
      address && setValue('address', address)
      zipCode && setValue('zipCode', zipCode)
      lastName && setValue('lastName', lastName)
      address2 && setValue('addressCTD', address2)
      firstName && setValue('firstName', firstName)
      middleName && setValue('middleName', middleName)
      state && setValue('state', setRecord(state, state))
      gender && setValue('sex', setRecord(Policy_Holder_Gender_Identity.None, Policy_Holder_Gender_Identity.None))
      trigger()
    }
  }, [getPatient, patientRelationshipValue, setValue, trigger])

  useEffect(() => {
    !isEdit && handlePolicyHolderSelfRelation()
  }, [getPatient, handlePolicyHolderSelfRelation, isEdit, patientRelationshipValue])

  return (
    <Box minWidth="100%" pt={3}>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            controllerName="policyHolderId"
            controllerLabel={POLICY_HOLDER_ID_CERTIFICATION_NUMBER}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            controllerName="employer"
            controllerLabel={EMPLOYER}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <InputController
            isRequired
            fieldType="text"
            controllerName="suffix"
            controllerLabel={SUFFIX}
          />
        </Grid>

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
            controllerName="middleName"
            controllerLabel={MIDDLE_NAME}
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
            controllerName="zipCode"
            controllerLabel={ZIP_CODE}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerName="address"
            controllerLabel={ADDRESS_ONE}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerName="addressCTD"
            controllerLabel={ADDRESS_TWO}
          />
        </Grid>
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
          <Selector
            addEmpty
            name="state"
            label={STATE}
            value={EMPTY_OPTION}
            options={MAPPED_STATES}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerName="ssn"
            controllerLabel={SSN}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Selector
            addEmpty
            name="sex"
            label={LEGAL_SEX}
            value={EMPTY_OPTION}
            options={MAPPED_POLICY_GENDER}
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <DatePicker name="dob" label={DOB} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default PolicyHolderDetails
