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
    <Box className={classes.profileDetailsContainer}>
      <PatientProfileHero isChart setAttachmentsData={() => {}} setPatient={() => { }} />

      <ChartCards />
    </Box>
  )
}

export default Chart;
