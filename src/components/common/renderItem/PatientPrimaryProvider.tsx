import { FC, useCallback, useEffect, useState } from "react";
import { Skeleton } from "@material-ui/lab";
import { Box, InputLabel, Typography } from "@material-ui/core";
//component block
import Alert from "../Alert";
//graphql
import { ASSIGNED_PROVIDER, N_A } from "../../../constants";
import { PatientPrimaryProviderProps } from "../../../interfacesTypes";
import { useGetPatientPrimaryProviderLazyQuery } from "../../../generated/graphql";

export const PatientPrimaryProvider: FC<PatientPrimaryProviderProps> = (
  { patientId, label = ASSIGNED_PROVIDER, setPrimaryProvider }
): JSX.Element => {

  const [name, setName] = useState<string>('')

  const [getPrimaryProvider, { loading }] = useGetPatientPrimaryProviderLazyQuery({
    onCompleted: (data) => {
      const { getPatient } = data;
      const { patient, response } = getPatient || {}
      const { status } = response || {}
      const { primaryDoctor } = patient || {}
      const { id, firstName, lastName } = primaryDoctor || {}

      if (status === 200 && id) {
        setPrimaryProvider && setPrimaryProvider(id)
        setName(`${firstName || ""} ${lastName || ""}`)
      }
    },
    
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const fetchPrimaryPatient = useCallback(() => {
    try {
      getPrimaryProvider({ variables: { getPatient: { id: patientId } } })
    } catch (error) {

    }
  }, [getPrimaryProvider, patientId])

  useEffect(() => {
    patientId && fetchPrimaryPatient()
  }, [fetchPrimaryPatient, patientId])


  return (
    <>
      <Box position="relative">
        <InputLabel shrink className="skelton-label-margin">
          {label}
        </InputLabel>
      </Box>

      {!!loading ? <Box display="flex"
        justifyContent="space-between"
        alignItems="center" borderRadius={4}
        className="skelton-input"
      >
        <Skeleton animation="pulse" variant="rect" width={1000} height={48} />
      </Box>
        : <Box pb={2} pt={0.5}>
          <Typography component="h5" variant="h5" className="word-break">
            {name ? name : N_A}
          </Typography>
        </Box>
      }
    </>
  );
}