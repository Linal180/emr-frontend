// packages block
import { FC } from "react";
import { Box, Card, Grid, IconButton, Typography } from "@material-ui/core";
import { BLUE_SEVEN, GREEN_ONE, GREY_SEVEN, RED_ONE, } from "../../../theme";
// components
import PieChart2Component from "../charts/pieChart2";
// history, constant and styles block
import {
  CLAIMS_REQUIRING_ACTION, CLAIM_AMOUNT_TO_PROCESS, CLAIM_IN_PROCESS, CLAIM_RECEIVED, MEDICAL_BILLING,
  TOTAL_CLAIM_TEXT,
} from "../../../constants";
import {
  RedirectIcon, PracticeActiveIcon, PracticeInactiveIcon, ClaimActionIcon, ClaimAmountIcon
} from "../../../assets/svgs";

const MedicalBillingComponent: FC = (): JSX.Element =>
  <Card>
    <Box px={3} pb={2}>
      <Box mb={3} display='flex' justifyContent='space-between' alignItems='center'>
        <Box pt={3}>
          <Typography variant="h5">{MEDICAL_BILLING}</Typography>
          <Box p={0.5} />
          <Typography variant="body2">{TOTAL_CLAIM_TEXT}</Typography>
        </Box>

        <IconButton>
          <RedirectIcon />
        </IconButton>
      </Box>

      <PieChart2Component />

      <Box px={4} mt={2} mb={3}>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <Box display='flex'>
              <Box minWidth={30}>
                <PracticeActiveIcon />
              </Box>

              <Box ml={2} flex={1}>
                <Typography variant="h5">24</Typography>

                <Box mt={0.5} color={GREEN_ONE}>
                  <Typography variant="inherit">{CLAIM_RECEIVED}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <Box display='flex'>
              <Box minWidth={30}>
                <PracticeInactiveIcon />
              </Box>

              <Box ml={2} flex={1}>
                <Typography variant="h5">3</Typography>

                <Box mt={0.5} color={BLUE_SEVEN}>
                  <Typography variant="inherit">{CLAIM_IN_PROCESS}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box p={2} />

        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <Box display='flex'>
              <Box minWidth={30}>
                <ClaimActionIcon />
              </Box>

              <Box ml={2} flex={1}>
                <Typography variant="h5">2</Typography>

                <Box mt={0.5} color={RED_ONE}>
                  <Typography variant="inherit">{CLAIMS_REQUIRING_ACTION}</Typography>
                </Box>
              </Box>
            </Box>

          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Box display='flex'>
              <Box minWidth={30}>
                <ClaimAmountIcon />
              </Box>

              <Box ml={2} flex={1}>
                <Typography variant="h5">$3,600</Typography>

                <Box mt={0.5} color={GREY_SEVEN}>
                  <Typography variant="inherit">{CLAIM_AMOUNT_TO_PROCESS}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Card>;

export default MedicalBillingComponent;
