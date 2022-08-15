import { FC } from "react";
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
//components
import Selector from "../../common/Selector";
import BackButton from "../../common/BackButton";
import PageHeader from "../../common/PageHeader";
import PhoneInput from '../../common/PhoneInput';
import CKEditorController from '../../../controller/CKEditorController';
//constants
import { SelectorOption, SendSMSFormType } from "../../../interfacesTypes";
import { DASHBOARD_BREAD, DASHBOARD_ROUTE, MESSAGE, MOBILE_NUMBER, SELECT_TEMPLATE, SEND_SMS_TEXT, SMS_BREAD, SMS_TEMPLATES } from "../../../constants";

const SendSMSForm: FC = (): JSX.Element => {
  const methods = useForm<SendSMSFormType>({
    defaultValues: { message: "", mobile: "", template: { id: '', name: "--" } }
  });
  const { handleSubmit, setValue } = methods;

  const loading = false;

  const onSubmit: SubmitHandler<SendSMSFormType> = (values) => {
    const { message, mobile } = values;
    debugger
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

          <Box display='flex' justifyContent='flex-start' alignItems="baseline">
            <Button type='submit' variant='contained' color='primary' disabled={loading}>
              {(loading) && <CircularProgress size={20} color="inherit" />} {SEND_SMS_TEXT}
            </Button>
          </Box>
        </Box>
        <Box p={3} pb={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6}>
              <Selector
                addEmpty
                name="template"
                label={SELECT_TEMPLATE}
                options={SMS_TEMPLATES}
                onSelect={templateHandler}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <PhoneInput
                label={MOBILE_NUMBER}
                name="mobile"
                isRequired
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <CKEditorController label={MESSAGE} name="message" isRequired />
            </Grid>
          </Grid>
        </Box>
      </form>
    </FormProvider>
  )
}

export default SendSMSForm