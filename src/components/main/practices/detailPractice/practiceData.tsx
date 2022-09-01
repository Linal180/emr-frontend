// packages block
import { FC } from "react";
import { Grid, Typography } from "@material-ui/core";
// utils, constants block
import { renderItem } from "../../../../utils";
import { PracticeDataProps } from "../../../../interfacesTypes";
import {
  PRACTICE_NAME, PHONE, FAX, PRACTICE_IDENTIFIER, EIN, UPIN, MEDICARE, MEDICAID, CHAMPUS, GROUP_TAX_ID, GROUP_NPI
} from "../../../../constants";

const PracticeData: FC<PracticeDataProps> = ({ practiceData, loading }) => {
  const { name, phone, ein, champus, fax, medicaid, medicare, upin, npi, taxId } = practiceData || {};
  
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12}>
          {renderItem(PRACTICE_NAME, name, undefined, loading)}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12}>
          {renderItem(PHONE, phone, undefined, loading)}
        </Grid>

        <Grid item md={6} sm={12}>
          {renderItem(FAX, fax, undefined, loading)}
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
              {renderItem(EIN, ein, undefined, loading)}
            </Grid>

            <Grid item md={6} sm={12}>
              {renderItem(UPIN, upin, undefined, loading)}
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={6} sm={12}>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12}>
              {renderItem(MEDICARE, medicare, undefined, loading)}
            </Grid>

            <Grid item md={6} sm={12}>
              {renderItem(MEDICAID, medicaid, undefined, loading)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={9} sm={12}>
          <Grid container spacing={3}>
            <Grid item md={4} sm={12}>
              {renderItem(CHAMPUS, champus, undefined, loading)}
            </Grid>

            <Grid item md={4} sm={12}>
              {renderItem(GROUP_TAX_ID, taxId, undefined, loading)}
            </Grid>

            <Grid item md={4} sm={12}>
              {renderItem(GROUP_NPI, npi, undefined, loading)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
};

export default PracticeData;
