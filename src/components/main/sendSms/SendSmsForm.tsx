import { FC } from "react";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
//components
import Alert from "../../common/Alert";
import Selector from "../../common/Selector";
import BackButton from "../../common/BackButton";
import PageHeader from "../../common/PageHeader";
import PhoneInput from '../../common/PhoneInput';
import InputController from '../../../controller';
//constants
import { SelectorOption, SendSMSFormType } from "../../../interfacesTypes";
import { DASHBOARD_BREAD, DASHBOARD_ROUTE, MESSAGE, MOBILE_NUMBER, SELECT_TEMPLATE, SEND_SMS_TEXT, SMS_BREAD, SMS_TEMPLATES } from "../../../constants";
import { useSendSmsMutation } from "../../../generated/graphql";

const SendSMSForm: FC = (): JSX.Element => {
  const methods = useForm<SendSMSFormType>({
    defaultValues: { message: "", mobile: "", template: { id: '', name: "--" } }
  });
  const { handleSubmit, setValue } = methods;

  const [sendSms, { loading }] = useSendSmsMutation({
    onCompleted: (data) => {
      const { sendSms } = data;
      const { response } = sendSms || {}
      const { message, status } = response || {}
      if (status === 200) {
        message && Alert.success(message)
      }
    },
    onError: (error) => {
      Alert.error(error?.message)
    }
  })

  const onSubmit: SubmitHandler<SendSMSFormType> = async (values) => {
    const { message, mobile } = values;
    try {
      await sendSms({ variables: { sendSmsInput: { message, to: `+1${mobile}` } } })
    } catch (error) { }
  }

  const templateHandler = (editor: SelectorOption) => {
    const { id } = editor || {}
    setValue('message', id)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box py={2} display='flex' justifyContent='space-between'>
          <Box display='flex'>
            <BackButton to={`${DASHBOARD_ROUTE}`} />

            <Box ml={2} />

            <PageHeader
              title={SEND_SMS_TEXT}
              path={[DASHBOARD_BREAD, SMS_BREAD]}
            />
          </Box>
        </Box>
        <Box p={3} pb={0}>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                  <Selector
                    addEmpty
                    name="template"
                    label={SELECT_TEMPLATE}
                    options={SMS_TEMPLATES}
                    onSelect={templateHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <PhoneInput
                    label={MOBILE_NUMBER}
                    name="mobile"
                    isRequired
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <InputController
                    multiline
                    isRequired
                    rows={4}
                    controllerLabel={MESSAGE}
                    controllerName="message"
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Box display='flex' justifyContent='flex-start' alignItems="baseline">
                    <Button type='submit' variant='contained' color='primary' disabled={loading}>
                      {(loading) && <CircularProgress size={20} color="inherit" />} {SEND_SMS_TEXT}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  )
}

export default SendSMSForm