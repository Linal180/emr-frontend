// packages block
import { Search } from "@material-ui/icons";
import { Box, Button, Grid, InputAdornment, TextField } from "@material-ui/core";
// components block
import ChartCards from "./chartCards";
// constants, history, styling block
import { GRAY, WHITE } from "../../../theme";
import { SEARCH_PLACEHOLDER } from "../../../constants";
import PatientProfileHero from "../../common/patient/profileHero";
import { useProfileDetailsStyles } from "../../../styles/profileDetails";

const Chart = (): JSX.Element => {
  const classes = useProfileDetailsStyles()

  return (
    <Box>
      <Box className={classes.profileDetailsContainer}>
        <PatientProfileHero isChart setAttachmentsData={() => {}} setPatient={() => { }} />

        <Grid item md={8} sm={12} xs={12}>
          <Box bgcolor={`${WHITE}`} mt={4} pl={2} boxShadow={`${GRAY}`}>
            <Grid container spacing={3}>
              <Grid item md={10} sm={12} xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder="Search by keyword, date or value."
                  InputProps={{
                    startAdornment: (<InputAdornment position="start">
                      <Search />
                    </InputAdornment>)
                  }}
                />
              </Grid>

              <Grid item md={2} sm={6} xs={6}>
                <Button color="primary" variant="contained">{SEARCH_PLACEHOLDER}</Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Box pb={3} />

        <ChartCards />
      </Box>
    </Box>
  )
}

export default Chart;
