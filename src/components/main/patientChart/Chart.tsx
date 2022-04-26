// packages block
import { Box, Button, Card, Grid,} from "@material-ui/core";
// components block
import ChartCards from "./chartCards";
// constants, history, styling block
import { GRAY, } from "../../../theme";
import { SEARCH_PLACEHOLDER } from "../../../constants";
import PatientProfileHero from "../../common/patient/profileHero";
import { useProfileDetailsStyles } from "../../../styles/profileDetails";
import Search from "../../common/Search";

const Chart = (): JSX.Element => {
  const classes = useProfileDetailsStyles()

  return (
    <Box>
      <Box className={classes.profileDetailsContainer}>
        <PatientProfileHero isChart setAttachmentsData={() => {}} setPatient={() => { }} />

        <Grid item md={8} sm={12} xs={12}>
          <Box mt={3} mr={1}>
            <Card>
              <Box px={3} py={2} boxShadow={`${GRAY}`} borderRadius={6} display="flex" justifyContent="space-between" alignItems="center">
                <Box width="88%" maxWidth="88%">
                  <Search search={Search} />
                </Box>

                <Button variant="contained" color="inherit" className="muted">{SEARCH_PLACEHOLDER}</Button>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Box pb={3} />

        <ChartCards />
      </Box>
    </Box>
  )
}

export default Chart;
