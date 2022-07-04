// packages block
import { FC, useState, useCallback, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
//components
import Avatar from "../Avatar";
import ViewDataLoader from "../ViewDataLoader";
// history, constant and styles block
import { NoDataIcon } from "../../../assets/svgs";
import { GRAY_SEVEN, GREY_SEVEN } from "../../../theme";
import { DoctorPatientsProps } from '../../../interfacesTypes'
import { DOB_TEXT, NO_RECORDS, PAGE_LIMIT } from "../../../constants";
import { DoctorPatientsPayload, useFindAllDoctorPatientLazyQuery, } from "../../../generated/graphql";

const DoctorPatients: FC<DoctorPatientsProps> = ({ providerId }): JSX.Element => {
  const [doctorPatients, setDoctorPatients] = useState<DoctorPatientsPayload['doctorPatients']>([])

  const [fetchAllPatientsQuery, { loading }] = useFindAllDoctorPatientLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setDoctorPatients([])
    },

    onCompleted(data) {
      const { findAllDoctorPatients } = data || {};

      if (findAllDoctorPatients) {
        const { doctorPatients } = findAllDoctorPatients
        doctorPatients && setDoctorPatients(doctorPatients as DoctorPatientsPayload['doctorPatients'])
      }
    }
  });

  const fetchAllPatients = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: PAGE_LIMIT } }

      providerId && await fetchAllPatientsQuery({
        variables: {
          doctorPatientsInput: { ...pageInputs, doctorId: providerId }
        }
      })
    } catch (error) { }
  }, [fetchAllPatientsQuery, providerId])


  useEffect(() => {
    fetchAllPatients()
  }, [fetchAllPatients])

  return (
    <>
      {loading ?
        <ViewDataLoader columns={12} rows={3} /> :
        <>
          {!!doctorPatients && doctorPatients.length > 0 ? (
            doctorPatients?.map((doctorPatient) => {
              const { patient } = doctorPatient || {}
              const { id, firstName, lastName, profileAttachment, dob } = patient || {}

              return (
                <Box display='flex' justifyContent='space-between' alignItems='start' key={id} className="mb-3">
                  <Box display='flex'>
                    <Avatar id={profileAttachment || ''} name={`${firstName} ${lastName}`} />
                    <Box>
                      <Box>
                        <Typography variant="body1">{firstName} {lastName}</Typography>
                      </Box>

                      <Box color={GRAY_SEVEN}>
                        <Typography variant="body1">{DOB_TEXT} {dob}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box color={GRAY_SEVEN} fontWeight={700}>
                    <Typography variant="inherit">{ }</Typography>
                  </Box>
                </Box>
              )
            }
            )) : (<Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>
            </Box>)
          }
        </>
      }
    </>)
};

export default DoctorPatients;
