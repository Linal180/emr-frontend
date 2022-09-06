import { FC } from "react";
import { Box, Grid } from "@material-ui/core";
import { FormProvider, useForm } from "react-hook-form";
//components block 
import PatientSelector from "../../../common/Selector/PatientSelector";
import PatientInsuranceComponent from "../../patients/patientDetail/insurance";
//constants
import { PATIENT } from "../../../../constants";

const PatientEligibility: FC = (): JSX.Element => {
  const methods = useForm({
    defaultValues: {
      patient: { id: '', name: '' }
    }
  })
  const { handleSubmit, watch } = methods;
  const { patient } = watch();
  const { id } = patient

  const onSubmit = () => { }


  return (<>
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6}>
            <Box pt={2}>
              <PatientSelector label={PATIENT} name="patient" addNewPatientOption={false} />
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
    {id && <PatientInsuranceComponent
      patientId={id}
      viewInsuranceBtn={false}
      showAddInsuranceBtn={false}
      showEditInsuranceBtn={false}
    />}
  </>)
}

export default PatientEligibility