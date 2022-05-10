import { Box, Typography } from "@material-ui/core"
import { VitalListComponentProps } from "../../../../interfacesTypes"
import { usePatientChartingStyles } from "../../../../styles/patientCharting"


export const VitalListComponent = ({ title, date, description, isError }: VitalListComponentProps) => {
  const classes = usePatientChartingStyles()
  return (
    <Box pb={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography className={classes.cardContentHeading}>{title}</Typography>
        <Typography className={classes.cardContentDate}>{date}</Typography>
      </Box>

      <Box>
        <Typography className={isError ? classes.cardContentDescriptionError : classes.cardContentDescription}>
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

