//packages import
import { yupResolver } from "@hookform/resolvers/yup";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, colors, Grid, Typography } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { FC, useCallback, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
//components import
import ItemSelector from "../../../../common/ItemSelector";
import Selector from "../../../../common/Selector";
import TextLoader from "../../../../common/TextLoader";
import EligibilityDetails from "./EligibilityDetails";
import PolicyAttachments from "./PolicyAttachments";
import PolicyDetails from "./PolicyDetails";
import PolicyHolderDetails from "./PolicyHolderDetails";
//constants, types, utils import
import { ELIGIBILITY, EMAIL_OR_USERNAME_ALREADY_EXISTS, EMPTY_OPTION, FORBIDDEN_EXCEPTION, INITIAL_COPAY_VALUE, INSURANCE_AND_POLICIES, INSURANCE_CARD, INSURANCE_PAYER_NAME, ITEM_MODULE, ORDER_OF_BENEFIT, POLICY_HOLDER_DETAILS, POLICY_INFORMATION, SAVE_TEXT } from "../../../../../constants";
import { CopayType, OrderOfBenefitType, PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, PricingProductType, useCreatePolicyMutation, useFetchPolicyLazyQuery, useUpdatePolicyMutation } from "../../../../../generated/graphql";
import { InsuranceCreateInput, ParamsType, PolicyCardProps, SelectorOption } from "../../../../../interfacesTypes";
import { formatValue, setRecord } from "../../../../../utils";
import { createInsuranceSchema } from "../../../../../validationSchemas";
import Alert from "../../../../common/Alert";

const PolicyCard: FC<PolicyCardProps> = ({ id, isEdit, handleReload, filteredOrderOfBenefitOptions }) => {
  const { id: patientId } = useParams<ParamsType>()
  const [expanded, setExpanded] = useState<string | false>(false);
  const [policyId, setPolicyId] = useState<string>('')
  const [policyHolderId, setPolicyHolderId] = useState<string>('')
  const [insuranceId, setInsuranceId] = useState<SelectorOption>(EMPTY_OPTION)

  const methods = useForm<InsuranceCreateInput>({
    mode: "all",
    defaultValues: {
      copayFields: [INITIAL_COPAY_VALUE]
    },
    resolver: yupResolver(createInsuranceSchema)
  });
  const { handleSubmit, setValue } = methods;

  const [createPolicy, { loading: createPolicyLoading }] = useCreatePolicyMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createPolicy: { response, policy } } = data ?? {};

      if (response) {
        const { status } = response

        if (status && status === 200) {
          setPolicyId(policy.id ?? '')
          handleReload && handleReload()
        }
      }
    }
  });

  const [updatePolicy, { loading: updatePolicyLoading }] = useUpdatePolicyMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { updatePolicy: { response, policy } } = data ?? {};

      if (response) {
        const { status } = response

        if (status && status === 200) {
          setPolicyId(policy.id ?? '')
          handleReload && handleReload()
        }
      }
    }
  });

  const [fetchPolicy, { loading: fetchPolicyLoading }] = useFetchPolicyLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onCompleted(data) {
      const { fetchPolicy } = data || {};

      if (fetchPolicy) {
        const { policy } = fetchPolicy

        const { coinsurancePercentage, copays, expirationDate, groupNumber, insurance, issueDate,
          memberId, notes, orderOfBenifit, policyHolder, primaryCareProvider, referringProvider, pricingProductType, policyHolderRelationship } = policy ?? {}

        const { address, addressCTD, certificationNumber, city, dob, employer,
          firstName, lastName, middleName, sex, ssn, state, suffix, zipCode, id: policyHolderIdToUpdate } = policyHolder ?? {}

        const transformedCopayFields = copays?.map((copay) => {
          return {
            copayType: setRecord(copay.type ?? '', formatValue(copay.type ?? '',)),
            amount: copay.amount ?? '',
            copayId: copay.id ?? ''
          }
        })

        coinsurancePercentage && setValue('coInsurancePercentage', coinsurancePercentage)
        expirationDate && setValue('expirationDate', expirationDate)
        groupNumber && setValue('policyNumber', groupNumber)
        issueDate && setValue('issueDate', issueDate)
        memberId && setValue('certificationNumber', memberId)
        notes && setValue('notes', notes)
        orderOfBenifit && setValue('orderOfBenefit', setRecord(orderOfBenifit, orderOfBenifit))
        policyHolderRelationship && setValue('patientRelationship', setRecord(policyHolderRelationship, policyHolderRelationship))

        if (insurance) {
          const insuranceInfo = { id: insurance.id, name: `${insurance.payerId} | ${insurance.payerName}` }
          setInsuranceId(insuranceInfo)
          setValue('insuranceId', insuranceInfo)
        }

        copays && setValue('copayFields', transformedCopayFields)
        primaryCareProvider && setValue('primaryCareProvider', setRecord(primaryCareProvider.id, `${primaryCareProvider.firstName} ${primaryCareProvider.lastName}`))
        referringProvider && setValue('referringProvider', setRecord(referringProvider.id, `${referringProvider.firstName} ${referringProvider.lastName}`))
        pricingProductType && setValue('pricingProductType', setRecord(pricingProductType, pricingProductType))
        employer && setValue('employer', employer)
        suffix && setValue('suffix', suffix)
        firstName && setValue('firstName', firstName)
        middleName && setValue('middleName', middleName)
        lastName && setValue('lastName', lastName)
        zipCode && setValue('zipCode', zipCode)
        city && setValue('city', city)
        address && setValue('address', address)
        addressCTD && setValue('addressCTD', addressCTD)
        dob && setValue('dob', dob)
        state && setValue('state', setRecord(state, state))
        sex && setValue('sex', setRecord(sex, sex))
        ssn && setValue('ssn', ssn)
        certificationNumber && setValue('policyHolderId', certificationNumber)

        setPolicyId(id ?? '')
        setPolicyHolderId(policyHolderIdToUpdate ?? '')
      }
    }
  });

  const findPolicy = useCallback(async () => {
    try {
      await fetchPolicy({
        variables: {
          id: id ?? ''
        }
      })
    } catch (error) { }
  }, [fetchPolicy, id])

  useEffect(() => {
    isEdit && findPolicy()
  }, [findPolicy, isEdit]);


  const onSubmit: SubmitHandler<InsuranceCreateInput> = (values) => {
    const { address, addressCTD, certificationNumber, city, coInsurancePercentage, copayFields, dob, employer, expirationDate, firstName,
      insuranceId, issueDate, lastName, middleName, notes, orderOfBenefit, patientRelationship, policyHolderId: inputPolicyHolderId, policyNumber,
      pricingProductType, primaryCareProvider, referringProvider, sex, ssn, state, suffix, zipCode } = values ?? {}

    const transformedCopays = copayFields?.map((copayField) => {
      return {
        amount: copayField.amount,
        id: copayField.copayId ?? '',
        ...(copayField.copayType?.id && { type: copayField.copayType?.id as CopayType })
      }
    }) ?? []

    const policyHolderInfo = {
      address,
      addressCTD,
      city,
      dob,
      employer,
      firstName,
      middleName,
      lastName,
      certificationNumber: inputPolicyHolderId,
      ssn,
      state: state?.id ?? '',
      suffix,
      zipCode,
      ...(sex?.id && { sex: sex?.id as Policy_Holder_Gender_Identity })
    }

    if (isEdit) {
      updatePolicy({
        variables: {
          updatePolicyInput: {
            id: policyId,
            coinsurancePercentage: coInsurancePercentage,
            ...(transformedCopays.length && { copays: transformedCopays }),
            expirationDate,
            insuranceId: insuranceId?.id ?? '',
            issueDate,
            memberId: certificationNumber,
            groupNumber: policyNumber,
            notes,
            ...(orderOfBenefit?.id && { orderOfBenifit: orderOfBenefit?.id.trim() as OrderOfBenefitType }),
            patientId: patientId,
            ...(patientRelationship?.id && { policyHolderRelationship: patientRelationship?.id as PolicyHolderRelationshipType }),
            ...(pricingProductType?.id && { pricingProductType: pricingProductType?.id as PricingProductType }),
            referringProviderId: referringProvider?.id ?? '',
            primaryCareProviderId: primaryCareProvider?.id ?? '',
            policyHolderInfo: { ...policyHolderInfo, id: policyHolderId }
          }
        }
      })
    } else {
      createPolicy({
        variables: {
          createPolicyInput: {
            coinsurancePercentage: coInsurancePercentage,
            ...(transformedCopays.length && { copays: transformedCopays.map((copayValues)=>{
              const {id:copayId, ...copayValue} = copayValues
              return copayValue
            }) }),
            expirationDate,
            insuranceId: insuranceId?.id ?? '',
            issueDate,
            memberId: certificationNumber,
            groupNumber: policyNumber,
            notes,
            ...(orderOfBenefit?.id && { orderOfBenifit: orderOfBenefit?.id.trim() as OrderOfBenefitType }),
            patientId: patientId,
            ...(patientRelationship?.id && { policyHolderRelationship: patientRelationship?.id as PolicyHolderRelationshipType }),
            ...(pricingProductType?.id && { pricingProductType: pricingProductType?.id as PricingProductType }),
            referringProviderId: referringProvider?.id ?? '',
            primaryCareProviderId: primaryCareProvider?.id ?? '',
            policyHolderInfo
          }
        }
      })
    }
  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isEdit && fetchPolicyLoading ? <TextLoader rows={[{ column: 1, size: 3 }, { column: 4, size: 3 }, { column: 2, size: 3 }]} /> :
          <>
            <Box pb={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{INSURANCE_AND_POLICIES}</Typography>

              <Button type='submit' variant='contained' color='primary' disabled={createPolicyLoading || updatePolicyLoading}>{SAVE_TEXT}</Button>
            </Box>

            <Box pt={3} pb={5}>
              <Grid container spacing={3} alignItems="center">
                <Grid item md={3} sm={12} xs={12}>
                  <ItemSelector
                    isRequired
                    isEdit={isEdit}
                    addEmpty
                    label={INSURANCE_PAYER_NAME}
                    name="insuranceId"
                    modalName={ITEM_MODULE.insurance}
                    value={insuranceId}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    isRequired
                    name="orderOfBenefit"
                    label={ORDER_OF_BENEFIT}
                    value={EMPTY_OPTION}
                    options={filteredOrderOfBenefitOptions ?? []}
                  />
                </Grid>
              </Grid>

              <Box mt={4} />

              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='accordionCustomize'>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                    <Typography variant='h4'>{POLICY_INFORMATION}</Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <PolicyDetails isEdit={isEdit} />
                </AccordionDetails>
              </Accordion>

              <Box mt={4} />

              <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className='accordionCustomize'>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                    <Typography variant='h4'>{POLICY_HOLDER_DETAILS}</Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <PolicyHolderDetails isEdit={isEdit} />
                </AccordionDetails>
              </Accordion>

              <Box mt={4} />

              <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className='accordionCustomize'>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                    <Typography variant='h4'>{ELIGIBILITY}</Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <EligibilityDetails />
                </AccordionDetails>
              </Accordion>

              <Box mt={4} />

              <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className='accordionCustomize' disabled={!policyId}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Box pb={2} minWidth="100%" margin="auto" borderBottom={`1px solid ${colors.grey[300]}`}>
                    <Typography variant='h4'>{INSURANCE_CARD}</Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <PolicyAttachments handleReload={() => { }} policyId={policyId} />
                </AccordionDetails>
              </Accordion>
            </Box>
          </>}
      </form>
    </FormProvider>
  )
}

export default PolicyCard