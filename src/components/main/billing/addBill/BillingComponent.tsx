// packages block
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from "react-router";
import { EMAIL_OR_USERNAME_ALREADY_EXISTS, FORBIDDEN_EXCEPTION, ITEM_MODULE, VIEW_APPOINTMENTS_ROUTE } from "../../../../constants";
import {
  CodeType,
  DoctorPatientRelationType,
  OnsetDateType, OrderOfBenefitType, OtherDateType, PatientBillingStatus,
  PatientPaymentType, useCreateBillingMutation, useCreateClaimLazyQuery, useFetchBillingDetailsByAppointmentIdLazyQuery,
  useFetchPatientInsurancesLazyQuery,
  useGetAppointmentLazyQuery,
  useGetClaimFileLazyQuery,
  useGetFacilityLazyQuery,
  useGetPatientProvidersLazyQuery
} from "../../../../generated/graphql";
//constants block
import history from "../../../../history";
import {
  BillingComponentProps, CodeTablesData, CreateBillingProps, ParamsType
} from "../../../../interfacesTypes";
import { Action, ActionType, billingReducer, initialState, State } from "../../../../reducers/billingReducer";
import { convertDateFromUnix, formatServiceCode, setRecord } from "../../../../utils";
import { createBillingSchema } from "../../../../validationSchemas";
//components block
import Alert from "../../../common/Alert";
import BillingForm from "./BillingForm";

const BillingComponent: FC<BillingComponentProps> = ({ shouldDisableEdit, submitButtonText, labOrderNumber }) => {
  const { id, appointmentId } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(billingReducer, initialState)
  const { employment, autoAccident, otherAccident, facilityId, claimNumber } = state

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

    onCompleted(data) {
      if (labOrderNumber) {
        history.push(`/patients/${id}/details/10`)
        return
      }
      history.push(`${VIEW_APPOINTMENTS_ROUTE}`)
    }
  });

  const [createClaim] = useCreateClaimLazyQuery({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (data) {

      }
    }
  });

  const [getClaimFile] = useGetClaimFileLazyQuery({
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

  const createClaimCallback = useCallback((claimMethod?: boolean) => {
    try {
      const { onsetDate, onsetDateType, otherDate, otherDateType, CPTCode, IcdCodes } = watch()
      const { id: onSetDateTypeId } = onsetDateType ?? {}
      const { id: otherDateTypeId } = otherDateType ?? {}

      const billingCodes = [...CPTCode, ...IcdCodes]
      const transformedBillingCodes = !!billingCodes.length ? billingCodes.map(billingCode => {
        const { id, ...billingCodeToCreate } = billingCode
        return billingCodeToCreate
      }) : []

      const claimInput = {
        appointmentId,
        autoAccident,
        codes: transformedBillingCodes,
        employment,
        onsetDate,
        ...(onSetDateTypeId && { onsetDateType: onSetDateTypeId as OnsetDateType }),
        otherAccident,
        otherDate,
        ...(otherDateTypeId && { otherDateType: otherDateTypeId as OtherDateType }),
        patientId: id
      }

      !claimMethod ? createClaim({ variables: { claimInput } }) : getClaimFile({ variables: { claimInput } })

    } catch (error) { }
  }, [appointmentId, autoAccident, createClaim, employment, getClaimFile, id, otherAccident, watch])

  const [fetchBillingDetailsByAppointmentId] = useFetchBillingDetailsByAppointmentIdLazyQuery({
    onCompleted(data) {
      if (data) {
        const { fetchBillingDetailsByAppointmentId } = data ?? {}
        const { billing } = fetchBillingDetailsByAppointmentId ?? {}
        const { onsetDateType, otherDateType, patientBillingStatus, patientPaymentType,
          autoAccident, codes, employment, onsetDate, otherDate, otherAccident, amount, claimDate, facility,
          pos, renderingProvider, serviceDate, servicingProvider, claimNo } = billing ?? {}



        const transformedCodes = codes?.reduce<CodeTablesData>((acc, codeValues) => {
          const codeType = codeValues.codeType
          const codeData = {
            id: codeValues.id,
            code: codeValues.code ?? '',
            description: codeValues.description ?? '',
            price: codeValues.price ?? '',
            codeType,
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
            transformedCodes && setValue(ITEM_MODULE.icdCodes, transformedCodes?.ICD_10_CODE || [])
            return
          }
          if (key === CodeType.CptCode) {
            transformedCodes && setValue(ITEM_MODULE.cptCode, transformedCodes.CPT_CODE || [])
            return
          }
        })
        transformedCodes && dispatch({ type: ActionType.SET_TABLE_CODES_DATA, tableCodesData: transformedCodes })

        otherAccident && dispatch({ type: ActionType.SET_OTHER_ACCIDENT, otherAccident: otherAccident })
        autoAccident && dispatch({ type: ActionType.SET_AUTO_ACCIDENT, autoAccident: autoAccident })
        employment && dispatch({ type: ActionType.SET_EMPLOYMENT, employment: employment })
        claimNo && dispatch({ type: ActionType.SET_CLAIM_NUMBER, claimNumber: claimNo })

        setValue('billingStatus', setRecord(patientBillingStatus, patientBillingStatus))
        setValue('paymentType', setRecord(patientPaymentType, patientPaymentType))
        setValue('otherDateType', setRecord(otherDateType, otherDateType))
        setValue('onsetDateType', setRecord(onsetDateType, onsetDateType))
        setValue('otherDate', otherDate ?? '')
        setValue('onsetDate', onsetDate ?? '')
        setValue('amount', amount ?? '')
        setValue('claimDate', claimDate ?? '')
        setValue('serviceDate', serviceDate ?? '')
        pos && setValue('pos', setRecord(pos, formatServiceCode(pos)))
        facility?.id && setValue('facility', setRecord(facility.id, facility.name))
        servicingProvider?.id && setValue('servicingProvider', setRecord(servicingProvider.id, `${servicingProvider.firstName} ${servicingProvider.lastName}`))
        renderingProvider?.id && setValue('renderingProvider', setRecord(renderingProvider.id, `${renderingProvider.firstName} ${renderingProvider.lastName}`))
      }
    }
  })

  const fetchBillingDetails = useCallback(async () => {
    try {
      fetchBillingDetailsByAppointmentId({
        variables: {
          appointmentId: appointmentId ?? ''
        }
      })
    } catch (error) { }
  }, [appointmentId, fetchBillingDetailsByAppointmentId])

  const onSubmit: SubmitHandler<CreateBillingProps> = (values) => {
    if (shouldDisableEdit) {
      history.push(VIEW_APPOINTMENTS_ROUTE)
    } else {
      const { amount, billingStatus, paymentType, onsetDate, onsetDateType, otherDate,
        otherDateType, CPTCode, IcdCodes, facility, claimDate, pos, serviceDate, renderingProvider, servicingProvider } = values
      const { id: onSetDateTypeId } = onsetDateType ?? {}
      const { id: otherDateTypeId } = otherDateType ?? {}
      const { id: billingStatusId } = billingStatus ?? {}
      const { id: paymentTypeId } = paymentType ?? {}
      const { id: facilityId } = facility ?? {}
      const { id: renderingProviderId } = renderingProvider ?? {}
      const { id: servicingProviderId } = servicingProvider ?? {}
      const { id: posId } = pos ?? {}

      const billingCodes = [...CPTCode, ...IcdCodes]
      const transformedBillingCodes = billingCodes && billingCodes.map(billingCode => {
        const { id, ...billingCodeToCreate } = billingCode
        return billingCodeToCreate
      })

      const createBillingInput = {
        ...(appointmentId && { appointmentId: appointmentId || '' }),
        ...(facilityId && { facilityId: facilityId || '' }),
        ...(renderingProviderId && { renderingProviderId: renderingProviderId || '' }),
        ...(servicingProviderId && { servicingProviderId: servicingProviderId || '' }),
        autoAccident: autoAccident,
        employment: employment,
        otherAccident: otherAccident,
        onsetDate: onsetDate,
        otherDate: otherDate,
        claimDate,
        pos: posId,
        serviceDate,
        ...(onSetDateTypeId && { onsetDateType: onSetDateTypeId as OnsetDateType }),
        ...(otherDateTypeId && { otherDateType: otherDateTypeId as OtherDateType }),
        amount: amount,
        ...(billingStatusId && { patientBillingStatus: billingStatusId as PatientBillingStatus }),
        ...(paymentTypeId && { patientPaymentType: paymentTypeId as PatientPaymentType }),
        patientId: id ?? '',
        codes: transformedBillingCodes,
        ...(labOrderNumber && { labOrderNumber: labOrderNumber }),
        claimNo: claimNumber
      }

      createBilling({
        variables: {
          createBillingInput
        }
      })
    }
  }

  const [fetchPatientInsurances] = useFetchPatientInsurancesLazyQuery({
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

  const [getAppointment] = useGetAppointmentLazyQuery({
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
          const { scheduleStartDateTime, facility } = appointment || {}
          const { id } = facility || {}

          id && dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: id })
          setValue('serviceDate', convertDateFromUnix(scheduleStartDateTime))
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
          const primaryProvider = providers?.find((provider) => provider?.relation === DoctorPatientRelationType.PrimaryProvider)
          const renderingProvider = providers?.find((provider) => provider?.relation === DoctorPatientRelationType.RenderingProvider)

          primaryProvider && setValue('servicingProvider', setRecord(primaryProvider?.doctorId || '', `${primaryProvider?.doctor?.firstName} ${primaryProvider?.doctor?.lastName}`))
          renderingProvider && setValue('renderingProvider', setRecord(renderingProvider?.doctorId || '', `${renderingProvider?.doctor?.firstName} ${renderingProvider?.doctor?.lastName}`))
        }
      }
    },
  });

  const [getFacility] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() { },

    onCompleted(data) {
      const { getFacility } = data || {};
      const { facility } = getFacility || {}
      const { serviceCode, id, name } = facility || {}

      id && name && setValue('facility', setRecord(id, name))
      serviceCode && setValue('pos', setRecord(serviceCode, formatServiceCode(serviceCode)))
    }
  });

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

  useEffect(() => {
    if (shouldDisableEdit) {
      fetchBillingDetails()
    } else {
      fetchPatientInsurances()
      fetchAppointment()
      fetchAllPatientsProviders()
      fetchFacility()
    }
  }, [fetchAllPatientsProviders, fetchAppointment, fetchPatientInsurances, fetchFacility, shouldDisableEdit, fetchBillingDetails])

  return (
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
    />
  )
}

export default BillingComponent
