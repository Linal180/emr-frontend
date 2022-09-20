// packages block
import { Box} from "@material-ui/core";
// components block
import ChartCards from "./chartCards";
// constants, history, styling block
import PatientProfileHero from "../../common/patient/profileHero";
import { useProfileDetailsStyles } from "../../../styles/profileDetails";

const Chart = (): JSX.Element => {
  const classes = useProfileDetailsStyles()

  return (
    <Box className={classes.profileDetailsContainer}>
      <PatientProfileHero isChart setAttachmentsData={() => {}} setPatient={() => { }} />

      <Box p={1.5} />

      <ChartCards />
    </Box>
  )
}

export default Chart;
