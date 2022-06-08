// packages block
import { FC, useEffect, useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Card, CircularProgress, colors, Grid, Typography } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from "react-router";
//components block
import InputController from '../../../../controller';
import Alert from "../../../common/Alert";
import DoctorSelector from '../../../common/Selector/DoctorSelector';
// interfaces, graphql, constants block
import { CreateLabTestProviderProps, LabOrderProviderProps, ParamsType } from "../../../../interfacesTypes";
import { GREY_THREE } from '../../../../theme';
import { ContactType, useGetPatientLazyQuery, useUpdateLabTestsByOrderNumMutation } from "../../../../generated/graphql";
import {
  GUARANTOR, NOTES, NOT_FOUND_EXCEPTION, N_A, PRIMARY_PROVIDER,
  PRINT, PROVIDER_DETAILS, PROVIDER_DETAILS_SUCCESS_DESCRIPTION, REFERRING_PROVIDER, SAVE_TEXT, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from '../../../../constants';
import { addLabProviderDetailsSchema } from "../../../../validationSchemas";

const LabOrdersProviderForm: FC<LabOrderProviderProps> = ({ labOrderNumber, handleStep }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const [guarantorName, setGuarantorName] =  useState<string>('')
  const methods = useForm<CreateLabTestProviderProps>({
    mode: "all",
    resolver: yupResolver(addLabProviderDetailsSchema)
  });

  const [getPatient] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      getPatient: {
        id: patientId
      }
    },

    onCompleted(data) {
      if (data) {
        const { getPatient } = data ?? {}
        const { patient } = getPatient ?? {}
        const { contacts } = patient ?? {}

        const guarantorInfo = contacts?.find((contact) => contact.contactType === ContactType.Guarandor)
        const { firstName, lastName } = guarantorInfo ?? {}
        const guarantorName = firstName ? `${firstName} ${lastName}` : ''
        setGuarantorName(guarantorName)
      }
    }
  });

  useEffect(() => {
    getPatient()
  }, [getPatient])

  const [updateLabTest, { loading }] = useUpdateLabTestsByOrderNumMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      Alert.success(PROVIDER_DETAILS_SUCCESS_DESCRIPTION);
      handleStep && handleStep(2)
    }
  });

  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<CreateLabTestProviderProps> = (values) => {
    const { primaryProviderId, referringProviderId, providerNotes } = values ?? {}
    const { id: primaryProvider } = primaryProviderId ?? {}
    const { id: referringProvider } = referringProviderId ?? {}

    updateLabTest({
      variables: {
        updateLabTestItemInput: {
          primaryProviderId: primaryProvider,
          referringProviderId: referringProvider,
          patientId: patientId ?? '',
          orderNumber: labOrderNumber,
          providerNotes
        }
      }
    })
  }

  return (
    <Card>
      <Box p={2}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box py={2} mb={4} borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant='h4'>{PROVIDER_DETAILS}</Typography>
            </Box>


            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <Typography variant='h6'>{GUARANTOR}</Typography>

                <Box py={0.6} mb={2} color={GREY_THREE}>
                  <Typography variant='body1'>{guarantorName || N_A}</Typography>
                </Box>
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <DoctorSelector
                  isRequired
                  label={PRIMARY_PROVIDER}
                  name="primaryProviderId"
                  shouldOmitFacilityId
                />
              </Grid>

              <Grid item md={4} sm={12} xs={12}>
                <DoctorSelector
                  isRequired
                  label={REFERRING_PROVIDER}
                  name="referringProviderId"
                  shouldOmitFacilityId
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="providerNotes"
                  controllerLabel={NOTES}
                  multiline
                />
              </Grid>
            </Grid>

            <Box mb={3} display="flex">
              <Button variant="contained" color="secondary">{PRINT}</Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {SAVE_TEXT}
                {loading && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Card>
  );
};

export default LabOrdersProviderForm;
