import { FC, Fragment } from "react";
import { Box, Grid } from "@material-ui/core";
//component
import SendSmsForm from './SendSmsForm';
import ShortUrlForm from './ShortUrlForm';
import BackButton from "../../common/BackButton";
import PageHeader from "../../common/PageHeader";
//constants
import { DASHBOARD_BREAD, DASHBOARD_ROUTE, SEND_SMS_TEXT, SMS_BREAD } from "../../../constants";

const SendSMS: FC = (): JSX.Element => {
  return (
    <Fragment>
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
            <SendSmsForm />
          </Grid>

          <Grid item xs={12} sm={12} md={6}>
            <ShortUrlForm />
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  )
}

export default SendSMS;
