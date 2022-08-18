import { FC, Fragment } from "react";
import { Box, Card, Grid } from "@material-ui/core";
//component
import SendSmsForm from './SendSmsForm';
import ShortUrlForm from './ShortUrlForm';
import BackButton from "../../common/BackButton";
import PageHeader from "../../common/PageHeader";
//constants
import { DASHBOARD_BREAD, DASHBOARD_ROUTE, SEND_SMS_TEXT, SMS_BREAD } from "../../../constants";
import CardComponent from "../../common/CardComponent";

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

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <Box p={3}>
              <SendSmsForm />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <CardComponent cardTitle={"URL Shortener"}>
            <Box p={3}>
              <ShortUrlForm />
            </Box>
          </CardComponent>

        </Grid>
      </Grid>
    </Fragment>
  )
}

export default SendSMS;
