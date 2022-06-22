//packages import
import { yupResolver } from "@hookform/resolvers/yup";
import { Check } from '@material-ui/icons';
import clsx from 'clsx';
import { Box, Button, Grid, Typography, Stepper, Step, StepLabel, StepIconProps, colors } from "@material-ui/core";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
//components import
import ItemSelector from "../../../../common/ItemSelector";
import Selector from "../../../../common/Selector";
import TextLoader from "../../../../common/TextLoader";
import PolicyAttachments from "./PolicyAttachments";
import PolicyDetails from "./PolicyDetails";
import PolicyHolderDetails from "./PolicyHolderDetails";
//constants, types, utils import
import { ADD_INSURANCE, ADD_INSURANCE_STEPS, CANCEL, EMAIL_OR_USERNAME_ALREADY_EXISTS, EMPTY_OPTION, FORBIDDEN_EXCEPTION, INITIAL_COPAY_VALUE, INSURANCE_AND_POLICIES, INSURANCE_CARD, INSURANCE_PAYER_NAME, ITEM_MODULE, NEXT, ORDER_OF_BENEFIT, POLICY_HOLDER_DETAILS, POLICY_INFORMATION, SAVE_TEXT } from "../../../../../constants";
import { CopayType, OrderOfBenefitType, PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, PricingProductType, useCreatePolicyMutation, useFetchPolicyLazyQuery, useUpdatePolicyMutation } from "../../../../../generated/graphql";
import { FormForwardRef, InsuranceCreateInput, ParamsType, PolicyCardProps, SelectorOption } from "../../../../../interfacesTypes";
import { formatValue, setRecord } from "../../../../../utils";
import { createInsuranceSchema } from "../../../../../validationSchemas";
import Alert from "../../../../common/Alert";
import { GREY_SIXTEEN } from "../../../../../theme";
import { CheckInConnector, useCheckInStepIconStyles, useInusranceStyles } from '../../../../../styles/checkInStyles';
import { ChevronRightIcon } from "../../../../../assets/svgs";


const CheckInStepIcon = (props: StepIconProps) => {
  const classes = useCheckInStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

const PolicyCard: FC<PolicyCardProps> = ({ id, isEdit, handleReload, filteredOrderOfBenefitOptions, setPolicyToEdit }) => {
  const addInsuranceClasses = useInusranceStyles();
  const { id: patientId } = useParams<ParamsType>()
  const [policyId, setPolicyId] = useState<string>('')
  const [policyHolderId, setPolicyHolderId] = useState<string>('')
  const [insuranceId, setInsuranceId] = useState<SelectorOption>(EMPTY_OPTION)
  const policyAttachmentRef = useRef<FormForwardRef | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Shipping address', 'Payment details', 'Review your order'];
  const isLastStep = activeStep === steps.length - 1;


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
          policyAttachmentRef.current?.submit()
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
          policyAttachmentRef.current?.submit()
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
          memberId, notes, orderOfBenefit, policyHolder, primaryCareProvider, referringProvider, pricingProductType, policyHolderRelationship } = policy ?? {}

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
        orderOfBenefit && setValue('orderOfBenefit', setRecord(orderOfBenefit, orderOfBenefit))
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

  useEffect(() => {
    setActiveStep(activeStep)
  }, [activeStep])

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



  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleForward = () => {
    setActiveStep(activeStep + 1);
  };



  const onSubmit: SubmitHandler<InsuranceCreateInput> = async (values) => {
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
      await updatePolicy({
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
            ...(orderOfBenefit?.id && { orderOfBenefit: orderOfBenefit?.id.trim() as OrderOfBenefitType }),
            patientId: patientId,
            ...(patientRelationship?.id && { policyHolderRelationship: patientRelationship?.id as PolicyHolderRelationshipType }),
            ...(pricingProductType?.id && { pricingProductType: pricingProductType?.id as PricingProductType }),
            referringProviderId: referringProvider?.id ?? '',
            primaryCareProviderId: primaryCareProvider?.id ?? '',
            policyHolderInfo: { ...policyHolderInfo, id: policyHolderId }
          }
        }
      })
      setPolicyToEdit && setPolicyToEdit('')
    } else {
      createPolicy({
        variables: {
          createPolicyInput: {
            coinsurancePercentage: coInsurancePercentage,
            ...(transformedCopays.length && {
              copays: transformedCopays.map((copayValues) => {
                const { id: copayId, ...copayValue } = copayValues
                return copayValue
              })
            }),
            expirationDate,
            insuranceId: insuranceId?.id ?? '',
            issueDate,
            memberId: certificationNumber,
            groupNumber: policyNumber,
            notes,
            ...(orderOfBenefit?.id && { orderOfBenefit: orderOfBenefit?.id.trim() as OrderOfBenefitType }),
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

  // useEffect(() => {
  //   // orderOfBenefit?.id && setActiveStep(0)
  //   console.log("pricingProductType?.id", pricingProductType?.id)
  //   pricingProductType?.id && setActiveStep(1)
  // }, [orderOfBenefit?.id, pricingProductType?.id, setActiveStep])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={3} alignItems="center">
              <Grid item md={12} sm={12} xs={12}>
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

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  name="orderOfBenefit"
                  label={ORDER_OF_BENEFIT}
                  value={EMPTY_OPTION}
                  options={filteredOrderOfBenefitOptions ?? []}
                />
              </Grid>
            </Grid>

            <PolicyDetails isEdit={isEdit} />

          </>
        )
      case 1:
        return <PolicyHolderDetails isEdit={isEdit} />
      case 2:
        return <PolicyAttachments handleReload={() => { }} policyId={policyId} ref={policyAttachmentRef} />
      default:
        return 'Unknown step';
    }
  }

  return (
    <Box maxWidth={600} minWidth={600}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{ADD_INSURANCE}</Typography>

            <Box display="flex" alignItems="center">

              <Button type={isLastStep ? 'submit' : 'button'} onClick={isLastStep ? () => { } : handleForward} variant="contained" color="primary"> {isLastStep ? 'Place order' : NEXT}</Button>

              {activeStep !== 0 && (<>
                <Box mr={1} />
                <Button type="button" onClick={handleBack} variant="outlined" color="secondary">BACK</Button>
              </>
              )}

            </Box>
          </Box>
          {isEdit && fetchPolicyLoading ? <TextLoader rows={[{ column: 1, size: 3 }, { column: 4, size: 3 }, { column: 2, size: 3 }]} /> :
            <Box p={2}>
              {/* <Box pb={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h4'>{INSURANCE_AND_POLICIES}</Typography>

                <Box display="flex" alignItems="center">
                  <Button variant="outlined" color="inherit" className="danger" onClick={() => setPolicyToEdit && setPolicyToEdit('')}>{CANCEL}</Button>
                  <Box p={1} />
                  <Button type='submit' variant='contained' color='primary' disabled={createPolicyLoading || updatePolicyLoading}>{SAVE_TEXT}</Button>
                </Box>
              </Box> */}

              <Box className={addInsuranceClasses.checkInProfileBox}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
                  {ADD_INSURANCE_STEPS.map((label, index) => (
                    <Step key={label}>
                      <StepLabel onClick={() => handleStep(index)} StepIconComponent={CheckInStepIcon}>
                        <Box ml={0} display='flex' alignItems='center' className='pointer-cursor'>
                          {label}
                          <Box p={0.5} />

                          {!(ADD_INSURANCE_STEPS.length - 1 === index) ? <ChevronRightIcon /> : ''}
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box mt={2}>
                <Typography>{getStepContent(activeStep)}</Typography>
              </Box>

            </Box>}
        </form>
      </FormProvider>
    </Box>
  )
}

export default PolicyCard