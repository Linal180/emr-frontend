// packages block
import { FC, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
import clsx from 'clsx';
import { useParams } from "react-router";
import { Check } from '@material-ui/icons';
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, Grid, Step, StepIconProps, StepLabel, Stepper, Typography
} from "@material-ui/core";
// components block
import PolicyDetails from "./PolicyDetails";
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import PolicyAttachments from "./PolicyAttachments";
import PolicyHolderDetails from "./PolicyHolderDetails";
import ItemSelector from "../../../../common/ItemSelector";
// constants, types, utils block
import { GREY_SIXTEEN } from "../../../../../theme";
import { ChevronRightIcon } from "../../../../../assets/svgs";
import { formatValue, setRecord } from "../../../../../utils";
import { createInsuranceSchema } from "../../../../../validationSchemas";
import {
  Action, ActionType, insuranceReducer, initialState, State
} from "../../../../../reducers/insuranceReducer";
import {
  CheckInConnector, useCheckInStepIconStyles, useInsurancesStyles
} from '../../../../../styles/checkInStyles';
import {
  FormForwardRef, InsuranceCreateInput, ParamsType, PolicyCardProps
} from "../../../../../interfacesTypes";
import {
  ADD_INSURANCE, ADD_INSURANCE_STEPS, CONFLICT_EXCEPTION, EDIT_INSURANCE, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  EMPTY_OPTION, FORBIDDEN_EXCEPTION, INITIAL_COPAY_VALUE, INSURANCE_CARD_ERROR_MESSAGE, INSURANCE_PAYER_NAME,
  ITEM_MODULE, NEXT, ORDER_OF_BENEFIT, SAVE_TEXT
} from "../../../../../constants";
import {
  CopayType, DoctorPatientRelationType, OrderOfBenefitType, PolicyHolderRelationshipType, Policy_Holder_Gender_Identity, PricingProductType,
  useCreatePolicyMutation, useFetchPolicyLazyQuery, useGetPatientProvidersLazyQuery, useUpdatePolicyMutation
} from "../../../../../generated/graphql";

const CheckInStepIcon: FC<StepIconProps> = ({ active, completed }) => {
  const classes = useCheckInStepIconStyles();

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
  id, isEdit, handleReload, filteredOrderOfBenefitOptions, setPolicyToEdit, refetch
}) => {
  const addInsuranceClasses = useInsurancesStyles();
  const { id: patientId } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(insuranceReducer, initialState)

  const { policyId, activeStep, isFormLoaded, policyHolderId, insuranceId, numberOfFiles } = state
  const policyAttachmentRef = useRef<FormForwardRef | null>(null);
  const isLastStep = activeStep === ADD_INSURANCE_STEPS.length - 1;

  const methods = useForm<InsuranceCreateInput>({
    mode: "all",
    defaultValues: { copayFields: [INITIAL_COPAY_VALUE] },
    resolver: yupResolver(createInsuranceSchema)
  });
  const { handleSubmit, setValue, trigger } = methods;

  const [createPolicy, { loading: createPolicyLoading }] = useCreatePolicyMutation({
    onError({ message }) {
      Alert.error(message === FORBIDDEN_EXCEPTION || message === CONFLICT_EXCEPTION ?
        EMAIL_OR_USERNAME_ALREADY_EXISTS : message)
    },

    onCompleted(data) {
      const { createPolicy: { response, policy } } = data ?? {};

      if (response) {
        const { status } = response

        if (status && status === 200) {
          dispatch({ type: ActionType.SET_POLICY_ID, policyId: policy?.id })
          policyAttachmentRef.current?.submit()
          handleReload && handleReload()
        }
      }
    }
  });

  const [updatePolicy, { loading: updatePolicyLoading }] = useUpdatePolicyMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION || message === CONFLICT_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else Alert.error(message)
    },

    onCompleted(data) {
      const { updatePolicy: { response, policy } } = data ?? {};

      if (response) {
        const { status } = response

        if (status && status === 200) {
          policyAttachmentRef.current?.submit()
          dispatch({ type: ActionType.SET_POLICY_ID, policyId: policy?.id })
          handleReload && handleReload()
        }
      }
    }
  });

  const [getPatientProviders] = useGetPatientProvidersLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() { },

    onCompleted(data) {
      if (data) {
        const { getPatientProviders } = data;

        if (getPatientProviders) {

          const { providers } = getPatientProviders;
          const { doctor: primaryDoctor } = providers?.find((provider) => provider.relation === DoctorPatientRelationType.PrimaryProvider) || {}
          const { doctor: referringDoctor } = providers?.find((provider) => provider.relation === DoctorPatientRelationType.ReferringProvider) || {}

          primaryDoctor &&
            setValue('primaryCareProvider', setRecord(primaryDoctor.id, `${primaryDoctor.firstName} ${primaryDoctor.lastName}`))

          referringDoctor &&
            setValue('referringProvider', setRecord(referringDoctor.id, `${referringDoctor.firstName} ${referringDoctor.lastName}`))
        }
      }
    },
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

        notes && setValue('notes', notes)
        issueDate && setValue('issueDate', issueDate)
        groupNumber && setValue('policyNumber', groupNumber)
        memberId && setValue('certificationNumber', memberId)
        expirationDate && setValue('expirationDate', expirationDate)
        transformedCopayFields && setValue('copayFields', transformedCopayFields)
        coinsurancePercentage && setValue('coInsurancePercentage', coinsurancePercentage)
        orderOfBenefit && setValue('orderOfBenefit', setRecord(orderOfBenefit, orderOfBenefit))
        policyHolderRelationship &&
          setValue('patientRelationship', setRecord(policyHolderRelationship, policyHolderRelationship))

        if (insurance) {
          const insuranceInfo = { id: insurance.id, name: `${insurance.payerId} | ${insurance.payerName}` }
          dispatch({ type: ActionType.SET_INSURANCE_ID, insuranceId: insuranceInfo })
          setValue('insuranceId', insuranceInfo)
        }

        primaryCareProvider &&
          setValue('primaryCareProvider',
            setRecord(primaryCareProvider.id, `${primaryCareProvider.firstName} ${primaryCareProvider.lastName}`))

        referringProvider &&
          setValue('referringProvider', setRecord(referringProvider.id,
            `${referringProvider.firstName} ${referringProvider.lastName}`))

        dob && setValue('dob', dob)
        ssn && setValue('ssn', ssn)
        city && setValue('city', city)
        suffix && setValue('suffix', suffix)
        address && setValue('address', address)
        zipCode && setValue('zipCode', zipCode)
        lastName && setValue('lastName', lastName)
        employer && setValue('employer', employer)
        sex && setValue('sex', setRecord(sex, sex))
        firstName && setValue('firstName', firstName)
        middleName && setValue('middleName', middleName)
        addressCTD && setValue('addressCTD', addressCTD)
        state && setValue('state', setRecord(state, state))
        certificationNumber && setValue('policyHolderId', certificationNumber)
        pricingProductType && setValue('pricingProductType', setRecord(pricingProductType, pricingProductType))

        dispatch({ type: ActionType.SET_POLICY_ID, policyId: id || '' })
        dispatch({ type: ActionType.SET_POLICY_HOLDER_ID, policyHolderId: policyHolderIdToUpdate || '' })
        trigger()
        dispatch({ type: ActionType.SET_IS_FORM_LOADED, isFormLoaded: false })
      }
    }
  });

  const findPolicy = useCallback(async () => {
    try {
      id && await fetchPolicy({ variables: { id } })
    } catch (error) { }
  }, [fetchPolicy, id])

  const fetchAllPatientsProviders = useCallback(async () => {
    try {
      patientId && await getPatientProviders({
        variables: {
          getPatient: { id: patientId }
        }
      })
    } catch (error) { }
  }, [patientId, getPatientProviders])

  useEffect(() => {
    fetchAllPatientsProviders()
    isEdit && findPolicy()
  }, [fetchAllPatientsProviders, findPolicy, isEdit]);

  const handleStepsValidation = async (step: number) => {
    if (step === 0) {
      return true
    }

    if (step === 1) {
      const isValid = await trigger(['insuranceId', 'orderOfBenefit', "patientRelationship", "certificationNumber",
        "policyNumber", "issueDate", "expirationDate", "copayFields", "coInsurancePercentage",
        "referringProvider", "primaryCareProvider", "pricingProductType", "notes", 'suffix',])
      return isValid
    }

    if (step === 2) {
      const isValid = await trigger(['policyHolderId', 'employer', 'firstName', 'middleName', 'lastName',
        'zipCode', 'address', 'addressCTD', 'city', 'state', 'ssn', 'sex', 'dob'])
      return isValid
    }
  }

  const handleStep = async (step: number) => {
    const shouldProceed = await handleStepsValidation(step)
    shouldProceed && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: step })
  };

  const handleBack = async () => {
    const shouldProceed = await handleStepsValidation(activeStep - 1)
    shouldProceed && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep - 1 })
  };

  const handleForward = async () => {
    const shouldProceed = await handleStepsValidation(activeStep + 1)
    shouldProceed && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })
  };

  const onSubmit: SubmitHandler<InsuranceCreateInput> = async (values) => {
    if (numberOfFiles) {
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
        address, addressCTD, city, dob, employer, firstName, suffix, zipCode,
        middleName, lastName, certificationNumber: inputPolicyHolderId, ssn, state: state?.id ?? '',
        ...(sex?.id && { sex: sex?.id as Policy_Holder_Gender_Identity })
      }

      const { id: selectedInsurance } = insuranceId || {}
      const { id: selectedReferringProvider } = referringProvider || {}
      const { id: selectedPrimaryCareProvider } = primaryCareProvider || {}

      if (isEdit) {
        policyId && await updatePolicy({
          variables: {
            updatePolicyInput: {
              id: policyId, coinsurancePercentage: coInsurancePercentage,
              expirationDate, insuranceId: selectedInsurance || '', issueDate,
              memberId: certificationNumber, groupNumber: policyNumber, notes,
              patientId: patientId,
              referringProviderId: selectedReferringProvider || '',
              primaryCareProviderId: selectedPrimaryCareProvider || '',
              policyHolderInfo: { ...policyHolderInfo, id: policyHolderId },
              ...(transformedCopays.length && { copays: transformedCopays }),
              ...(orderOfBenefit?.id && { orderOfBenefit: orderOfBenefit?.id.trim() as OrderOfBenefitType }),
              ...(patientRelationship?.id && {
                policyHolderRelationship: patientRelationship?.id as PolicyHolderRelationshipType
              }),
              ...(pricingProductType?.id && {
                pricingProductType: pricingProductType?.id as PricingProductType
              }),
            }
          }
        })

        setPolicyToEdit && setPolicyToEdit('')
      } else {
        createPolicy({
          variables: {
            createPolicyInput: {
              coinsurancePercentage: coInsurancePercentage, patientId: patientId,
              expirationDate, insuranceId: selectedInsurance || '', issueDate,
              memberId: certificationNumber, groupNumber: policyNumber, notes,
              policyHolderInfo, referringProviderId: selectedReferringProvider || '',
              primaryCareProviderId: selectedPrimaryCareProvider || '',
              ...(orderOfBenefit?.id && { orderOfBenefit: orderOfBenefit?.id.trim() as OrderOfBenefitType }),
              ...(pricingProductType?.id && { pricingProductType: pricingProductType?.id as PricingProductType }),
              ...(patientRelationship?.id && {
                policyHolderRelationship: patientRelationship?.id as PolicyHolderRelationshipType
              }),
              ...(transformedCopays.length && {
                copays: transformedCopays.map((copayValues) => {
                  const { id: copayId, ...copayValue } = copayValues
                  return copayValue
                })
              }),
            }
          }
        })
      }
    } else Alert.error(INSURANCE_CARD_ERROR_MESSAGE)

    refetch && refetch()
  }

  const loading = isEdit && isFormLoaded
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={3} alignItems="center">
              <Grid item md={12} sm={12} xs={12}>
                <ItemSelector
                  addEmpty
                  isRequired
                  isEdit={isEdit}
                  loading={loading}
                  name="insuranceId"
                  value={insuranceId}
                  label={INSURANCE_PAYER_NAME}
                  modalName={ITEM_MODULE.insurance}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  isRequired
                  loading={loading}
                  value={EMPTY_OPTION}
                  name="orderOfBenefit"
                  label={ORDER_OF_BENEFIT}
                  options={filteredOrderOfBenefitOptions ?? []}
                />
              </Grid>
            </Grid>

            <PolicyDetails isEdit={isEdit} loading={loading} />
          </>
        )

      case 1:
        return <PolicyHolderDetails isEdit={isEdit} loading={loading} />

      case 2:
        return <Box p={3}>
          <PolicyAttachments handleReload={() => { }}
            dispatch={dispatch}
            policyId={policyId}
            ref={policyAttachmentRef}
            numberOfFiles={numberOfFiles}
          />
        </Box>

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
            <Typography variant='h3'>{isEdit ? EDIT_INSURANCE : ADD_INSURANCE}</Typography>

            <Box display="flex" alignItems="center">
              {activeStep !== 0 &&
                <Button type="button" onClick={handleBack} variant="outlined" color="secondary">BACK</Button>
              }

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

            <Box pt={2} mt={2} maxHeight="calc(100vh - 160px)" className="overflowY-auto">
              <Box px={1}>
                <Typography>{getStepContent(activeStep)}</Typography>
              </Box>
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  )
}

export default PolicyCard;
