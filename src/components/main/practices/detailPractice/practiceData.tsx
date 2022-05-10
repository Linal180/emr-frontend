// packages block
import { FC } from "react";
import { Grid, Typography } from "@material-ui/core";
// utils, constants & graphql block
import { renderItem } from "../../../../utils";
import { PracticePayload } from "../../../../generated/graphql";
import {
  PRACTICE_NAME, PHONE, FAX, PRACTICE_IDENTIFIER, EIN, UPIN, MEDICARE, MEDICAID, CHAMPUS
} from "../../../../constants";

interface PracticeDataProps {
  practiceData: PracticePayload['practice'];
}
const PracticeData: FC<PracticeDataProps> = ({ practiceData }) => {
  const { name, phone, ein, champus, fax, medicaid, medicare, upin } = practiceData || {};
  
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12}>
          {renderItem(PRACTICE_NAME, name)}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          {renderItem(PHONE, phone)}
        </Grid>

        <Grid item md={6} sm={12}>
          {renderItem(FAX, fax)}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={12} sm={12}>
          <Typography variant='h6'>{PRACTICE_IDENTIFIER}</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              {renderItem(EIN, ein)}
            </Grid>

            <Grid item md={6} sm={12}>
              {renderItem(UPIN, upin)}
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              {renderItem(MEDICARE, medicare)}
            </Grid>

            <Grid item md={6} sm={12}>
              {renderItem(MEDICAID, medicaid)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              {renderItem(CHAMPUS, champus)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
};

export default PracticeData;
