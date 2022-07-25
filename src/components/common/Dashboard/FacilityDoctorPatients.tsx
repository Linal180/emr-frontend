// packages block
import { FC, useState, useCallback, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
//components
import Avatar from "../Avatar";
import ViewDataLoader from "../ViewDataLoader";
// history, constant and styles block
import { dobDateFormat } from "../../../utils";
import { NoDataIcon } from "../../../assets/svgs";
import { GRAY_SEVEN, GREY_SEVEN } from "../../../theme";
import { DoctorPatientsProps } from '../../../interfacesTypes'
import { DOB_TEXT, NO_RECORDS, PAGE_LIMIT } from "../../../constants";
import {
  DoctorPatientsPayload, Patient, PatientsPayload, useFindAllDoctorPatientLazyQuery,
  useGetFacilityPatientsLazyQuery,
} from "../../../generated/graphql";

const FacilityDoctorPatients: FC<DoctorPatientsProps> = ({
  providerId, facilityId, setPatientCount
}): JSX.Element => {
  const [patients, setPatients] = useState<PatientsPayload['patients']>([])
  const [doctorPatients, setDoctorPatients] = useState<DoctorPatientsPayload['doctorPatients']>([])

  const [facilityPatientsQuery, { loading: facilityPatientLoading }] = useGetFacilityPatientsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatients([])
    },

    onCompleted(data) {
      const { getFacilityPatients } = data || {};

      if (getFacilityPatients) {
        const { patients, pagination } = getFacilityPatients

        if (pagination) {
          const { totalCount } = pagination
          setPatientCount && setPatientCount(totalCount || 0)
        }

        patients && setPatients(patients as PatientsPayload['patients'])
      }
    }
  });

  const [doctorPatientsQuery, { loading }] = useFindAllDoctorPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatients([])
    },

    onCompleted(data) {
      const { findAllDoctorPatients } = data || {};

      if (findAllDoctorPatients) {
        const { doctorPatients, pagination } = findAllDoctorPatients

        if (pagination) {
          const { totalCount } = pagination
          setPatientCount && setPatientCount(totalCount || 0)
        }

        doctorPatients && setDoctorPatients(doctorPatients as DoctorPatientsPayload['doctorPatients'])
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: PAGE_LIMIT } }

      !!providerId ? await doctorPatientsQuery({
        variables: {
          doctorPatientsInput: { ...pageInputs, doctorId: providerId }
        }
      })
        : !!facilityId && await facilityPatientsQuery({
          variables: {
            getFacilityPatientsInput: { ...pageInputs, facilityId }
          }
        })
    } catch (error) { }
  }, [doctorPatientsQuery, facilityId, facilityPatientsQuery, providerId])


  useEffect(() => {
    fetchAllPatients()
  }, [fetchAllPatients])

  const patientLoading = loading || facilityPatientLoading

  const patientDetail = (patient: Patient) => {
    const { id, dob, profileAttachment, firstName, lastName } = patient || {}

    return (
      <Box display='flex' justifyContent='space-between' alignItems='start' key={id} className="mb-3">
        <Box display='flex'>
          <Avatar id={profileAttachment || ''} name={`${firstName} ${lastName}`} />
          <Box>
            <Box>
              <Typography variant="body1">{firstName} {lastName}</Typography>
            </Box>

            <Box color={GRAY_SEVEN}>
              <Typography variant="body1">{DOB_TEXT} {!!dob && dobDateFormat(dob)}</Typography>
            </Box>
          </Box>
        </Box>

        <Box color={GRAY_SEVEN} fontWeight={700}>
          <Typography variant="inherit">{ }</Typography>
        </Box>
      </Box>
    )
  }
  return (
    <>
      {loading ?
        <ViewDataLoader columns={12} rows={3} /> :
        <>
          {(patients?.length === 0 && doctorPatients?.length === 0) && !patientLoading ?
            <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>
            </Box>
            : <>
              {facilityId ?
                patients?.map(patient => patientDetail(patient as Patient))
                : doctorPatients?.map(doctorPatient => patientDetail(doctorPatient?.patient as Patient))}
            </>
          }
        </>
      }
    </>)
};

export default FacilityDoctorPatients;
