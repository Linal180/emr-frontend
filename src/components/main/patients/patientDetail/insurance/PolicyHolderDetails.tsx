//packages import
import { Box, Grid } from "@material-ui/core";
import { FC, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router";
//components import
import InputController from "../../../../../controller";
import DatePicker from "../../../../common/DatePicker";
import Selector from "../../../../common/Selector";
//constants, types and interface props
import {
  ADDRESS, ADDRESS_CTD, CITY, DOB, EMPLOYER, EMPTY_OPTION, FIRST_NAME,
  LAST_NAME, LEGAL_SEX, MAPPED_POLICY_GENDER, MAPPED_STATES, MIDDLE_NAME, POLICY_HOLDER_ID_CERTIFICATION_NUMBER,
  SSN, STATE, SUFFIX, ZIP_CODE
} from "../../../../../constants";
import { PolicyHolderRelationshipType, useGetPatientLazyQuery } from "../../../../../generated/graphql";
import { GeneralFormProps, InsuranceCreateInput, ParamsType } from "../../../../../interfacesTypes";
import { setRecord } from "../../../../../utils";


const PolicyHolderDetails: FC<GeneralFormProps> = ({ isEdit }) => {
  const { id: patientId } = useParams<ParamsType>()
  const { watch, setValue } = useFormContext<InsuranceCreateInput>()
  const { patientRelationship } = watch()
  const { id: patientRelationshipValue } = patientRelationship ?? {}

  const [getPatient] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      getPatient: {
        id: patientId
      }
    }
  });

  const handlePolicyHolderSelfRelation = useCallback(async () => {
    if (patientRelationshipValue === PolicyHolderRelationshipType.Self) {
      const { data } = await getPatient()
      const { getPatient: getPatientValues } = data ?? {}
      const { patient } = getPatientValues ?? {}
      const { gender, dob, firstName, lastName, middleName, suffix, contacts, ssn, employer } = patient ?? {}
      const { address2, address, state, zipCode, city } = contacts?.find((contact) => !!contact?.primaryContact) ?? {}

      employer?.name && setValue('employer', employer?.name)
      suffix && setValue('suffix', suffix)
      firstName && setValue('firstName', firstName)
      middleName && setValue('middleName', middleName)
      lastName && setValue('lastName', lastName)
      zipCode && setValue('zipCode', zipCode)
      city && setValue('city', city)
      address && setValue('address', address)
      address2 && setValue('addressCTD', address2)
      dob && setValue('dob', dob)
      state && setValue('state', setRecord(state, state))
      gender && setValue('sex', setRecord(gender, gender))
      ssn && setValue('ssn', ssn)
    } else {
      if (!isEdit) {
        setValue('employer', '')
        setValue('suffix', '')
        setValue('firstName', '')
        setValue('middleName', '')
        setValue('lastName', '')
        setValue('zipCode', '')
        setValue('city', '')
        setValue('address', '')
        setValue('addressCTD', '')
        setValue('dob', undefined)
        setValue('state', setRecord('', ''))
        setValue('sex', setRecord('', ''))
        setValue('ssn', '')
      }
    }
  }, [getPatient, isEdit, patientRelationshipValue, setValue])

  useEffect(() => {
    handlePolicyHolderSelfRelation()
  }, [getPatient, handlePolicyHolderSelfRelation, patientRelationshipValue])

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
            controllerLabel={ADDRESS}
          />
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerName="addressCTD"
            controllerLabel={ADDRESS_CTD}
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