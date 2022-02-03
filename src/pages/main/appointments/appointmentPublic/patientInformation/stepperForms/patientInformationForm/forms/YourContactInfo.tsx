// packages block
import { useContext } from "react";
import { Box, Grid } from "@material-ui/core"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
// components block
import { ListContext } from '../../../../../../../../context';
import CardComponent from "../../../../../../../../components/common/CardComponent";
import Selector from "../../../../../../../../components/common/Selector";
import ToggleButtonComponent from "../../../../../../../../components/common/ToggleButtonComponent";
import { EMPTY_OPTION, PREFERRED_COMMUNICATION_METHOD } from "../../../../../../../../constants";
import { renderDoctors } from "../../../../../../../../utils";

const YourContactInfo = () => {
  const { doctorList } = useContext(ListContext)
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<any> = () => {

  }

  return (
    <Box pt={3}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle="How we can contact you?">
            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  isRequired
                  value={EMPTY_OPTION}
                  label={PREFERRED_COMMUNICATION_METHOD}
                  name="preferredCommunicationMethod"
                  options={renderDoctors(doctorList)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <ToggleButtonComponent name="voiceMail" label="Is it okay for us to leave a voicemail?" />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <ToggleButtonComponent name="confirmAppointment" label="May we phone, email, or send a text to you to confirm appointments?" />
              </Grid>
            </Grid>
          </CardComponent>
        </form>
      </FormProvider>
    </Box>
  );
};

export default YourContactInfo;
