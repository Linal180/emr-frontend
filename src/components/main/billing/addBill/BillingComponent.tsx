// packages block
import moment from "moment";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from 'react-hook-form';
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
// components block
import BillingForm from "./BillingForm";
import Alert from "../../../common/Alert";
import Loader from "../../../common/Loader";
import ClaimErrorModal from "../../../common/ClaimErrorModal";
// constants block
import history from "../../../../history";
import { createBillingSchema } from "../../../../validationSchemas";
import { convertDateFromUnix, formatEnumMember, getCharFromNumber, getNumberFromChar, setRecord } from "../../../../utils";
import {
  Action, ActionType, billingReducer, initialState, State
} from "../../../../reducers/billingReducer";
import {
  BillingComponentProps, CodeTablesData, CreateBillingProps, ParamsType
} from "../../../../interfacesTypes";
import {
  EMAIL_OR_USERNAME_ALREADY_EXISTS, FORBIDDEN_EXCEPTION, ITEM_MODULE, VIEW_APPOINTMENTS_ROUTE
} from "../../../../constants";
import {
  CodeType, DoctorPatientRelationType, OnsetDateType, OrderOfBenefitType, OtherDateType,
  PatientPaymentType, useCreateBillingMutation, useCreateClaimMutation, useGetPatientProvidersLazyQuery,
  useFetchPatientInsurancesLazyQuery, useGetAppointmentLazyQuery, useGetClaimFileLazyQuery, useGetFacilityLazyQuery,
  useFetchBillingDetailsByAppointmentIdLazyQuery, useGenerateClaimNoLazyQuery, useFindPatientLastAppointmentLazyQuery,
  useFindAppointmentInsuranceStatusLazyQuery,
} from "../../../../generated/graphql";

const BillingComponent: FC<BillingComponentProps> = ({ shouldDisableEdit, submitButtonText, labOrderNumber }) => {
  const { id, appointmentId } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(billingReducer, initialState)
  const { employment, autoAccident, otherAccident, facilityId, claimNumber, shouldCheckout, claimModalOpen, claimErrorMessages } = state

  const methods = useForm<CreateBillingProps>({
    mode: "all",
    defaultValues: {
      claimDate: moment().format('MM-DD-YYYY') || ''
    },
    resolver: yupResolver(createBillingSchema)
  });
  const { setValue, watch } = methods;

  const [createBilling, { loading: createBillingLoading }] = useCreateBillingMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },
    onCompleted() {
      if (labOrderNumber) {
        history.push(`/patients/${id}/details/10`)
        return
      }
      shouldCheckout && history.push(`${VIEW_APPOINTMENTS_ROUTE}`)
      fetchBillingDetails()
    }
  });

  const [createClaim, { loading: createClaimLoading }] = useCreateClaimMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else {

        dispatch(({ type: ActionType.SET_CLAIM_ERROR_MESSAGES, claimErrorMessages: message.split('.') }))
        dispatch(({ type: ActionType.SET_CLAIM_MODAL_OPEN, claimModalOpen: true }))
      }
    },

    onCompleted(data) {
      if (data) {
        const { createClaim } = data || {}
        const { response, claimStatus } = createClaim || {}
        const { status } = response || {}
        if (status === 200) {
          const { id, statusId, statusName } = claimStatus || {}
          id && setValue('claimStatus', { id, name: statusName, statusName: statusId })

          const successMessage = statusId === 'acknowledged' ? 'Claim Submitted Successfully' : 'Claim Created Successfully'

          dispatch(({ type: ActionType.SET_CLAIM_ERROR_MESSAGES, claimErrorMessages: [successMessage] }))
          dispatch(({ type: ActionType.SET_CLAIM_MODAL_OPEN, claimModalOpen: true }))
        }
      }
    }
  });

  const [getClaimFile, { loading: getClaimFileLoading }] = useGetClaimFileLazyQuery({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { getClaimFile } = data
        const { claimFile } = getClaimFile || {}

        const buffer = Buffer.from(claimFile || [])
        const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob)
        var win = window.open();
        win?.document.write('<iframe src="' + url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
      }
    }
  });

  const [fetchPatientInsurances, { loading: fetchPatientInsurancesLoading }] = useFetchPatientInsurancesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: ({
      id: id
    }),

    onCompleted(data) {
      const { fetchPatientInsurances } = data || {}

      if (fetchPatientInsurances) {
        const { policies, response } = fetchPatientInsurances
        if (response && response.status === 200) {
          if (!shouldDisableEdit) {
            const { copays, id } = policies?.find((policyInfo) => policyInfo.orderOfBenefit === OrderOfBenefitType.Primary) ?? {}
            const totalAmount = copays?.reduce((acc, copay) => {
              return acc += copay.amount ? +copay.amount : 0
            }, 0)
            setValue('amount', String(totalAmount ?? ''))
            id && dispatch({ type: ActionType.SET_INSURANCE_ID, insuranceId: id })
          }
        }
      }
    }
  });

  const [fetchPatientAppointment, { loading: fetchPatientAppointmentLoading }] = useFindPatientLastAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: ({
      lastVisitedAppointmentInput: {
        patientId: id
      }
    }),

    onCompleted(data) {
      const { findPatientLastAppointment } = data || {}

      if (findPatientLastAppointment) {
        const { appointment, response } = findPatientLastAppointment
        if (response && response.status === 200) {
          const { scheduleStartDateTime } = appointment || {}
          scheduleStartDateTime && setValue('otherDate', convertDateFromUnix(scheduleStartDateTime))
        }
      }
    }
  });

  const [getAppointment, { loading: getAppointmentLoading }] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {
          const { scheduleStartDateTime, facility, billingStatus: billStatus } = appointment || {}
          const { id } = facility || {}

          id && dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: id })
          setValue('serviceDate', convertDateFromUnix(scheduleStartDateTime))
          billStatus && dispatch({ type: ActionType.SET_BILLING_STATUS, billingStatus: billStatus })
        }
      }
    }
  });

  const [getPatientProviders, { loading: getPatientProvidersLoading }] = useGetPatientProvidersLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() { },

    onCompleted(data) {
      if (data) {
        const { getPatientProviders } = data;

        if (getPatientProviders) {

          const { providers } = getPatientProviders;
          const primaryProvider = providers?.find((provider) => provider?.relation === DoctorPatientRelationType.PrimaryProvider)
          const renderingProvider = providers?.find((provider) => provider?.relation === DoctorPatientRelationType.RenderingProvider)

          primaryProvider && setValue('servicingProvider', setRecord(primaryProvider?.doctorId || '', `${primaryProvider?.doctor?.firstName} ${primaryProvider?.doctor?.lastName}`))
          renderingProvider && setValue('renderingProvider', setRecord(renderingProvider?.doctorId || '', `${renderingProvider?.doctor?.firstName} ${renderingProvider?.doctor?.lastName}`))
        }
      }
    },
  });

  const [getFacility, { loading: getFacilityLoading }] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { getFacility } = data || {};
      const { facility } = getFacility || {}
      const { serviceCode, id, name, practice } = facility || {}
      const { name: practiceName, id: practiceId } = practice || {}

      id && name && setValue('facility', setRecord(id, name))
      practiceName && setValue('practice', practiceName)
      practiceId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: practiceId })
      serviceCode && setValue('pos', setRecord(serviceCode, formatEnumMember(serviceCode)))
    }
  });

  const [generateClaimNo, { loading: generateClaimNoLoading }] = useGenerateClaimNoLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { generateClaimNo } = data || {};
      const { claimNumber } = generateClaimNo || {}
      dispatch({ type: ActionType.SET_CLAIM_NUMBER, claimNumber: claimNumber || '' })
    }
  });

  const [fetchBillingDetailsByAppointmentId, { loading: fetchBillingDetailsLoading }] = useFetchBillingDetailsByAppointmentIdLazyQuery({
    onCompleted(data) {
      if (data) {
        const { fetchBillingDetailsByAppointmentId } = data ?? {}
        const { billing } = fetchBillingDetailsByAppointmentId ?? {}

        const { onsetDateType, otherDateType, patientPaymentType,
          autoAccident, codes, employment, onsetDate, otherDate, otherAccident, amount, claimDate, facility,
          pos, renderingProvider, serviceDate, servicingProvider, claimNo, uncoveredAmount, claimStatus, to, from,
          feeSchedule, claim
        } = billing ?? {}

        const { practice } = facility || {}
        const { name: practiceName, id: practiceId } = practice || {}
        const transformedCodes = codes?.reduce<CodeTablesData>((acc, codeValues) => {
          const { codeType, code, diagPointer, price, unit, description, m1, m2, m3, m4 } = codeValues
          const codeData = {
            id: codeValues.id,
            codeId: codeValues?.code || '',
            code: code ?? '',
            description: description ?? '',
            price: price ?? '',
            codeType,
            m1: setRecord(m1 || '', m1 || ''),
            m2: setRecord(m2 || '', m2 || ''),
            m3: setRecord(m3 || '', m3 || ''),
            m4: setRecord(m4 || '', m4 || ''),
            unit: unit ?? '',
            diagPointer: diagPointer ?? '',
            diag1: diagPointer ? String(getNumberFromChar(diagPointer, 0)) : '',
            diag2: diagPointer ? String(getNumberFromChar(diagPointer, 1)) : '',
            diag3: diagPointer ? String(getNumberFromChar(diagPointer, 3)) : '',
            diag4: diagPointer ? String(getNumberFromChar(diagPointer, 4)) : ''
          }

          if (acc[codeType]) {
            acc[codeType]?.push(codeData)
            return acc
          }

          acc[codeType] = [codeData]
          return acc
        }, {})

        transformedCodes && Object.keys(transformedCodes).forEach((key) => {
          if (key === CodeType.Icd_10Code) {
            transformedCodes && setValue(ITEM_MODULE.icdCodes, transformedCodes?.ICD_10_CODE || [], { shouldValidate: true })
            return
          }

          if (key === CodeType.CptCode) {
            transformedCodes && setValue(ITEM_MODULE.cptFeeSchedule, transformedCodes.CPT_CODE || [])
            return
          }
        })
        transformedCodes && dispatch({ type: ActionType.SET_TABLE_CODES_DATA, tableCodesData: transformedCodes })

        otherAccident && dispatch({ type: ActionType.SET_OTHER_ACCIDENT, otherAccident: otherAccident })
        autoAccident && dispatch({ type: ActionType.SET_AUTO_ACCIDENT, autoAccident: autoAccident })
        employment && dispatch({ type: ActionType.SET_EMPLOYMENT, employment: employment })
        claimNo && dispatch({ type: ActionType.SET_CLAIM_NUMBER, claimNumber: claimNo })
        practiceId && dispatch({ type: ActionType.SET_PRACTICE_ID, practiceId: practiceId })
        servicingProvider?.id && dispatch({ type: ActionType.SET_PROVIDER_ID, providerId: servicingProvider?.id })

        setValue('paymentType', setRecord(patientPaymentType, patientPaymentType))
        setValue('otherDateType', setRecord(otherDateType, otherDateType))
        setValue('onsetDateType', setRecord(onsetDateType, onsetDateType))
        setValue('otherDate', otherDate ?? '')
        setValue('onsetDate', onsetDate ?? '')
        setValue('amount', amount ?? '')
        setValue('uncoveredAmount', uncoveredAmount ?? '')
        setValue('claimDate', claimDate ?? '')
        setValue('serviceDate', serviceDate ?? '')
        setValue('to', to ?? '')
        setValue('from', from ?? '')
        pos && setValue('pos', setRecord(pos, formatEnumMember(pos)))
        claimStatus?.id && setValue('claimStatus', { id: claimStatus?.id, name: claimStatus?.statusName || '', statusName: claimStatus?.statusId })
        facility?.id && setValue('facility', setRecord(facility.id, facility.name))
        feeSchedule?.id && setValue('feeSchedule', setRecord(feeSchedule.id, feeSchedule.name || ''))
        practiceName && setValue('practice', practiceName)
        servicingProvider?.id && setValue('servicingProvider', setRecord(servicingProvider.id, `${servicingProvider.firstName} ${servicingProvider.lastName}`))
        renderingProvider?.id && setValue('renderingProvider', setRecord(renderingProvider.id, `${renderingProvider.firstName} ${renderingProvider.lastName}`))
        dispatch({ type: ActionType.SET_CLAIM_CREATED, isClaimCreated: !!claim?.id })
      }
    }
  })

  const createClaimCallback = useCallback(async (claimMethod?: boolean) => {
    try {
      const { onsetDate, onsetDateType, otherDate, otherDateType, cptFeeSchedule, IcdCodes, from, to, paymentType } = watch()
      const { id: onSetDateTypeId } = onsetDateType ?? {}
      const { id: otherDateTypeId } = otherDateType ?? {}
      const { id: patientPaymentType } = paymentType || {}

      const billingCodes = [...cptFeeSchedule, ...IcdCodes]
      const transformedBillingCodes = !!billingCodes.length ? billingCodes.map(billingCode => {
        const { codeId, id, m1, m2, m3, m4, diag1, diag2, diag3, diag4, unit, ...billingCodeToCreate } = billingCode
        const diagA = diag1 ? getCharFromNumber(Number(diag1) - 1) : ''
        const diagB = diag2 ? getCharFromNumber(Number(diag2) - 1) : ''
        const diagC = diag3 ? getCharFromNumber(Number(diag3) - 1) : ''
        const diagD = diag4 ? getCharFromNumber(Number(diag4) - 1) : ''
        const diagPointer = `${diagA}${diagB}${diagC}${diagD}`
        const cptVariables = {
          diagPointer: diagPointer,
          m1: m1?.name,
          m2: m2?.name,
          m3: m3?.name,
          m4: m4?.name,
          unit
        }
        return {
          ...billingCodeToCreate,
          ...(billingCodeToCreate.codeType === CodeType.CptCode && cptVariables)
        }
      }) : []

      const createClaimInput = {
        appointmentId,
        autoAccident,
        codes: transformedBillingCodes,
        employment,
        onsetDate,
        ...(onSetDateTypeId && { onsetDateType: onSetDateTypeId as OnsetDateType }),
        otherAccident,
        otherDate,
        ...(otherDateTypeId && { otherDateType: otherDateTypeId as OtherDateType }),
        patientId: id,
        from,
        to,
        patientPaymentType: patientPaymentType as PatientPaymentType
      }

      const getClaimFileInput = {
        appointmentId,
        autoAccident,
        codes: transformedBillingCodes,
        employment,
        onsetDate,
        ...(onSetDateTypeId && { onsetDateType: onSetDateTypeId as OnsetDateType }),
        otherAccident,
        otherDate,
        ...(otherDateTypeId && { otherDateType: otherDateTypeId as OtherDateType }),
        patientId: id,
        from,
        to
      }

      !claimMethod ? await createClaim({ variables: { createClaimInput } }) : await getClaimFile({ variables: { getClaimFileInput } })

    } catch (error) { }
  }, [appointmentId, autoAccident, createClaim, employment, getClaimFile, id, otherAccident, watch])

  const fetchBillingDetails = useCallback(async () => {
    try {
      fetchBillingDetailsByAppointmentId({
        variables: {
          appointmentId: appointmentId ?? ''
        }
      })
    } catch (error) { }
  }, [appointmentId, fetchBillingDetailsByAppointmentId])

  const fetchAppointment = useCallback(async () => {
    try {
      appointmentId && await getAppointment({
        variables: { getAppointment: { id: appointmentId } }
      })
    } catch (error) { }
  }, [getAppointment, appointmentId])

  const fetchFacility = useCallback(async () => {
    try {
      facilityId && await getFacility({
        variables: { getFacility: { id: facilityId } }
      })
    } catch (error) { }
  }, [facilityId, getFacility])

  const fetchAllPatientsProviders = useCallback(async () => {
    try {
      id && await getPatientProviders({
        variables: {
          getPatient: { id }
        }
      })
    } catch (error) { }
  }, [id, getPatientProviders])

  const fetchClaimNumber = useCallback(async () => {
    try {
      await generateClaimNo()
    } catch (error) { }
  }, [generateClaimNo])

  const [findAppointmentInsuranceStatus] = useFindAppointmentInsuranceStatusLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      const { findAppointmentInsuranceStatus } = data || {};

      if (findAppointmentInsuranceStatus) {
        const { insuranceStatus } = findAppointmentInsuranceStatus
        const patientPaymentType = insuranceStatus === 'insurance' ? setRecord(PatientPaymentType.Insurance, PatientPaymentType.Insurance) : setRecord(PatientPaymentType.NoInsurance, PatientPaymentType.NoInsurance)
        insuranceStatus && setValue('paymentType', patientPaymentType)
        insuranceStatus && dispatch({ type: ActionType.SET_INSURANCE_STATUS, insuranceStatus: patientPaymentType?.id })
      }
    }
  });

  const findInsuranceStatus = useCallback(async () => {
    try {
      await findAppointmentInsuranceStatus({
        variables: {
          appointmentId: appointmentId || ''
        }
      })
    } catch (error) { }
  }, [appointmentId, findAppointmentInsuranceStatus])


  const onSubmit: SubmitHandler<CreateBillingProps> = (values) => {
    if (shouldDisableEdit) {
      history.push(VIEW_APPOINTMENTS_ROUTE)
    } else {
      const { amount, paymentType, onsetDate, onsetDateType, otherDate,
        otherDateType, cptFeeSchedule, IcdCodes, facility, claimDate, pos, serviceDate, renderingProvider,
        servicingProvider, uncoveredAmount, claimStatus, from, to, feeSchedule } = values
      const { id: onSetDateTypeId } = onsetDateType ?? {}
      const { id: otherDateTypeId } = otherDateType ?? {}
      const { id: paymentTypeId } = paymentType ?? {}
      const { id: facilityId } = facility ?? {}
      const { id: renderingProviderId } = renderingProvider ?? {}
      const { id: servicingProviderId } = servicingProvider ?? {}
      const { id: posId } = pos ?? {}
      const { id: claimStatusId } = claimStatus ?? {}
      const { id: feeScheduleId } = feeSchedule ?? {}

      const billingCodes = [...cptFeeSchedule, ...IcdCodes]
      const transformedBillingCodes = billingCodes && billingCodes.map(billingCode => {
        const { codeId, id, m1, m2, m3, m4, diag1, diag2, diag3, diag4, unit, ...billingCodeToCreate } = billingCode
        const diagA = diag1 ? getCharFromNumber(Number(diag1) - 1) : ''
        const diagB = diag2 ? getCharFromNumber(Number(diag2) - 1) : ''
        const diagC = diag3 ? getCharFromNumber(Number(diag3) - 1) : ''
        const diagD = diag4 ? getCharFromNumber(Number(diag4) - 1) : ''
        const diagPointer = `${diagA}${diagB}${diagC}${diagD}`
        const cptVariables = {
          diagPointer: diagPointer,
          ...(m1?.id && { m1: m1?.id }),
          ...(m2?.id && { m2: m2?.id }),
          ...(m3?.id && { m3: m3?.id }),
          ...(m4?.id && { m4: m4?.id }),
          unit
        }
        return {
          ...billingCodeToCreate,
          ...(billingCodeToCreate.codeType === CodeType.CptCode && cptVariables)
        }
      })

      const createBillingInput = {
        ...(appointmentId && { appointmentId: appointmentId || '' }),
        ...(facilityId && { facilityId: facilityId || '' }),
        ...(renderingProviderId && { renderingProviderId: renderingProviderId || '' }),
        ...(servicingProviderId && { servicingProviderId: servicingProviderId || '' }),
        ...(claimStatusId && { claimStatusId: claimStatusId || '' }),
        ...(feeScheduleId && { feeScheduleId: feeScheduleId || '' }),
        ...(onSetDateTypeId && { onsetDateType: onSetDateTypeId as OnsetDateType }),
        ...(otherDateTypeId && { otherDateType: otherDateTypeId as OtherDateType }),
        ...(paymentTypeId && { patientPaymentType: paymentTypeId as PatientPaymentType }),
        ...(labOrderNumber && { labOrderNumber: labOrderNumber }),
        autoAccident: autoAccident, employment: employment, otherAccident: otherAccident,
        onsetDate: onsetDate, otherDate: otherDate, claimDate, pos: posId, serviceDate,
        amount: amount, patientId: id ?? '', codes: transformedBillingCodes, claimNo: claimNumber,
        uncoveredAmount, from, to, shouldCheckout
      }

      createBilling({
        variables: {
          createBillingInput
        }
      })
    }
  }

  useEffect(() => {
    if (shouldDisableEdit) {
      fetchBillingDetails()
    } else {
      fetchPatientInsurances()
      fetchAppointment()
      fetchAllPatientsProviders()
      fetchFacility()
      fetchClaimNumber()
      fetchPatientAppointment()
      fetchBillingDetails()
      findInsuranceStatus()
    }
  }, [fetchAllPatientsProviders, fetchAppointment, fetchPatientInsurances, fetchFacility, shouldDisableEdit, fetchBillingDetails, fetchClaimNumber, fetchPatientAppointment, findInsuranceStatus])

  const isLoading = shouldDisableEdit ? fetchBillingDetailsLoading
    : fetchPatientInsurancesLoading || getAppointmentLoading || getPatientProvidersLoading || getFacilityLoading || generateClaimNoLoading || fetchPatientAppointmentLoading

  if (isLoading) {
    return <Loader loading loaderText='Fetching Billing Details...' />
  }

  if (createBillingLoading) {
    return <Loader loading loaderText='Saving Billing Details...' />
  }

  if (getClaimFileLoading) {
    return <Loader loading loaderText='Fetching HCFA-1500 Form...' />
  }

  return (
    <>
      <BillingForm
        createBillingLoading={createBillingLoading}
        dispatch={dispatch}
        methods={methods}
        onSubmit={onSubmit}
        state={state}
        shouldDisableEdit={shouldDisableEdit}
        submitButtonText={submitButtonText}
        createClaimCallback={createClaimCallback}
        claimNumber={claimNumber}
        createClaimLoading={createClaimLoading}
      />

      {
        claimModalOpen &&
        <ClaimErrorModal
          isOpen={claimModalOpen}
          setIsOpen={(open: boolean) => dispatch({ type: ActionType.SET_CLAIM_MODAL_OPEN, claimModalOpen: open })}
          errorMessages={claimErrorMessages}
        />
      }
    </>

  )
}

export default BillingComponent;