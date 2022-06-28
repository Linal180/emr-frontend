//packages import
import { FC, useCallback, useEffect, useRef, useState } from "react";
import clsx from 'clsx';
import { useParams } from "react-router";
import { Check } from '@material-ui/icons';
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Grid, Step, StepIconProps, StepLabel, Stepper, Typography } from "@material-ui/core";
//components import
import PolicyDetails from "./PolicyDetails";
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import PolicyAttachments from "./PolicyAttachments";
import TextLoader from "../../../../common/TextLoader";
import PolicyHolderDetails from "./PolicyHolderDetails";
import ItemSelector from "../../../../common/ItemSelector";
//constants, types, utils import
import { ChevronRightIcon } from "../../../../../assets/svgs";
import { GREY_SIXTEEN } from "../../../../../theme";
import { formatValue, setRecord } from "../../../../../utils";
import { createInsuranceSchema } from "../../../../../validationSchemas";
import { CheckInConnector, useCheckInStepIconStyles, useInsurancesStyles } from '../../../../../styles/checkInStyles';
import {
  FormForwardRef, InsuranceCreateInput, ParamsType, PolicyCardProps, SelectorOption
} from "../../../../../interfacesTypes";
import {
  ADD_INSURANCE, ADD_INSURANCE_STEPS, EMAIL_OR_USERNAME_ALREADY_EXISTS, EMPTY_OPTION, FORBIDDEN_EXCEPTION,
  INITIAL_COPAY_VALUE, INSURANCE_PAYER_NAME, ITEM_MODULE, NEXT, ORDER_OF_BENEFIT, SAVE_TEXT
} from "../../../../../constants";
import {
  CopayType, OrderOfBenefitType, PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, PricingProductType,
  useCreatePolicyMutation, useFetchPolicyLazyQuery, useUpdatePolicyMutation
} from "../../../../../generated/graphql";

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

const PolicyCard: FC<PolicyCardProps> = ({
  id, isEdit, handleReload, filteredOrderOfBenefitOptions, setPolicyToEdit
}) => {
  const addInsuranceClasses = useInsurancesStyles();
  const { id: patientId } = useParams<ParamsType>()
  const [policyId, setPolicyId] = useState<string>('')

  const [policyHolderId, setPolicyHolderId] = useState<string>('')
  const [insuranceId, setInsuranceId] = useState<SelectorOption>(EMPTY_OPTION)
  const policyAttachmentRef = useRef<FormForwardRef | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [isFormLoaded, setIsFormLoaded] = useState<boolean>(true)
  const isLastStep = activeStep === ADD_INSURANCE_STEPS.length - 1;

  const methods = useForm<InsuranceCreateInput>({
    mode: "all",
    defaultValues: {
      copayFields: [INITIAL_COPAY_VALUE]
    },
    resolver: yupResolver(createInsuranceSchema)
  });
  const { handleSubmit, setValue, trigger } = methods;

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

  const [fetchPolicy] = useFetchPolicyLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    async onCompleted(data) {
      const { fetchPolicy } = data || {};

      if (fetchPolicy) {
        const { policy } = fetchPolicy

        const { coinsurancePercentage, copays, expirationDate, groupNumber, insurance, issueDate,
          memberId, notes, orderOfBenefit, policyHolder, primaryCareProvider, referringProvider,
          pricingProductType, policyHolderRelationship
        } = policy ?? {}

        const { address, addressCTD, certificationNumber, city, dob, employer,
          firstName, lastName, middleName, sex, ssn, state, suffix, zipCode, id: policyHolderIdToUpdate
        } = policyHolder ?? {}

        const transformedCopayFields = copays?.map((copay) => {
          return {
            copayType: setRecord(copay.type ?? '', formatValue(copay.type ?? '',)),
            amount: copay.amount ?? '',
            copayId: copay.id ?? ''
          }
        })

        transformedCopayFields && setValue('copayFields', transformedCopayFields)
        coinsurancePercentage && setValue('coInsurancePercentage', coinsurancePercentage)
        expirationDate && setValue('expirationDate', expirationDate)
        groupNumber && setValue('policyNumber', groupNumber)
        issueDate && setValue('issueDate', issueDate)
        memberId && setValue('certificationNumber', memberId)
        notes && setValue('notes', notes)
        orderOfBenefit && setValue('orderOfBenefit', setRecord(orderOfBenefit, orderOfBenefit))
        policyHolderRelationship &&
          setValue('patientRelationship', setRecord(policyHolderRelationship, policyHolderRelationship))

        if (insurance) {
          const insuranceInfo = { id: insurance.id, name: `${insurance.payerId} | ${insurance.payerName}` }
          setInsuranceId(insuranceInfo)
          setValue('insuranceId', insuranceInfo)
        }

        primaryCareProvider &&
          setValue('primaryCareProvider',
            setRecord(primaryCareProvider.id, `${primaryCareProvider.firstName} ${primaryCareProvider.lastName}`))

        referringProvider &&
          setValue('referringProvider', setRecord(referringProvider.id,
            `${referringProvider.firstName} ${referringProvider.lastName}`))

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
        trigger()
        setIsFormLoaded(false)
      }
    }
  });

  const findPolicy = useCallback(async () => {
    try {
      await fetchPolicy({ variables: { id: id ?? '' } })
    } catch (error) { }
  }, [fetchPolicy, id])

  useEffect(() => {
    isEdit && findPolicy()
  }, [findPolicy, isEdit]);

  const handleStepsValidation = async (step: number) => {
    if (step === 0) {
      return true
    }

    if (step === 1) {
      const isValid = await trigger(['insuranceId', 'orderOfBenefit', "patientRelationship", "certificationNumber",
        "policyNumber", "issueDate", "expirationDate", "copayFields", "coInsurancePercentage",
        "referringProvider", "primaryCareProvider", "pricingProductType", "notes",])
      return isValid
    }

    if (step === 2) {
      const isValid = await trigger(['policyHolderId', 'employer', 'suffix', 'firstName', 'middleName', 'lastName', 'zipCode',
        'address', 'addressCTD', 'city', 'state', 'ssn', 'sex', 'dob'])
      return isValid
    }

  }

  const handleStep = async (step: number) => {
    const shouldProceed = await handleStepsValidation(step)
    shouldProceed && setActiveStep(step);
  };

  const handleBack = async () => {
    const shouldProceed = await handleStepsValidation(activeStep - 1)
    shouldProceed && setActiveStep(activeStep - 1);
  };

  const handleForward = async () => {
    const shouldProceed = await handleStepsValidation(activeStep + 1)
    shouldProceed && setActiveStep(activeStep + 1);
  };

  const onSubmit: SubmitHandler<InsuranceCreateInput> = async (values) => {
    const { address, addressCTD, certificationNumber, city, coInsurancePercentage, copayFields,
      dob, employer, expirationDate, firstName, insuranceId, issueDate, lastName, middleName,
      notes, orderOfBenefit, patientRelationship, policyHolderId: inputPolicyHolderId, policyNumber,
      pricingProductType, primaryCareProvider, referringProvider, sex, ssn, state, suffix, zipCode
    } = values ?? {}

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
        return <Box p={3}><PolicyAttachments handleReload={() => { }} policyId={policyId} ref={policyAttachmentRef} /></Box>
      default:
        return 'Unknown step';
    }
  }

  return (
    <Box maxWidth={480}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            display="flex" justifyContent="space-between" alignItems="center"
            borderBottom={`1px solid ${GREY_SIXTEEN}`} p={2}
          >
            <Typography variant='h3'>{ADD_INSURANCE}</Typography>

            <Box display="flex" alignItems="center">
              {activeStep !== 0 && (<>
                <Button type="button" onClick={handleBack} variant="outlined" color="secondary">BACK</Button>
              </>
              )}

              <Box p={1} />

              <Button
                type={'button'}
                onClick={isLastStep ? handleSubmit(onSubmit) : handleForward}
                variant="contained" color="primary"
                disabled={isLastStep ? createPolicyLoading || updatePolicyLoading : false} >
                {isLastStep ? SAVE_TEXT : NEXT}
              </Button>
            </Box>
          </Box>
          {isEdit && isFormLoaded ? <TextLoader rows={[{ column: 1, size: 3 }, { column: 4, size: 3 }, { column: 2, size: 3 }]} /> :
            <Box p={2}>
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

              <Box pt={2} mt={2} maxHeight="calc(100vh - 160px)" className="overflowY-auto scrollbar-hover">
                <Box px={1}>
                  <Typography>{getStepContent(activeStep)}</Typography>
                </Box>
              </Box>
            </Box>}
        </form>
      </FormProvider>
    </Box>
  )
}

export default PolicyCard
