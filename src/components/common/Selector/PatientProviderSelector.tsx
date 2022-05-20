import { FC, useCallback, useEffect, useState } from "react";
import { ASSIGNED_PROVIDER } from "../../../constants";
import { DoctorPatient, useGetPatientLazyQuery } from "../../../generated/graphql";
import { PatientProviderSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { renderDoctorPatients } from "../../../utils";
import Selector from "../Selector";

export const PatientProviderSelector: FC<PatientProviderSelectorProps> = ({ patientId })=>{
  const [patientProviders,setPatientProviders] = useState<SelectorOption[]>([])

  const [getPatient] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { getPatient } = data;

        if (getPatient) {
          const { patient } = getPatient;
          const { doctorPatients } = patient ?? {}

          doctorPatients && setPatientProviders(renderDoctorPatients(doctorPatients as DoctorPatient[]))
        }
      }
    },
  });

  const fetchPatient = useCallback(async () => {
    try {
      await getPatient({ variables: { getPatient: { id: patientId } } })
    } catch (error) { }
  }, [getPatient, patientId]);

  useEffect(()=>{
    fetchPatient()
  },[fetchPatient])

  return (
     <Selector 
        label={ASSIGNED_PROVIDER}
        name="assignedProvider"
        addEmpty
        options={patientProviders ?? []}
     />
  )
}