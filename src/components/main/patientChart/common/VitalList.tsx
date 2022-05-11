import { Box, Typography } from "@material-ui/core"
import { VitalListComponentProps } from "../../../../interfacesTypes"
import { usePatientChartingStyles } from "../../../../styles/patientCharting"


export const VitalListComponent = ({ title, description, isError }: VitalListComponentProps) => {
  const classes = usePatientChartingStyles()
  return (
    <Box pb={2}>
      <Box display="flex">
        <Typography className={classes.cardContentHeading}><li>{title}</li></Typography>
      </Box>

      <Box>
        <Typography className={isError ? classes.cardContentDescriptionError : classes.cardContentDescription}>
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

