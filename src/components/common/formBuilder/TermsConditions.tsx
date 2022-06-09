//packages block
import { FC } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
//components
import CheckboxController from "../CheckboxController"
//interfaces
import { FieldComponentProps } from "../../../interfacesTypes"

const TermsConditions: FC<FieldComponentProps> = ({ item }): JSX.Element => {
  const { label, fieldId } = item
  return <Box my={3}>
    <Box maxHeight={400} pl={2} mb={3} overflow="auto">
      <Typography variant="subtitle1" component="p">{`{{Terms of Service Content}}`}</Typography>
    </Box>
    <Grid container>
      <Grid item xs={12}>
        <CheckboxController controllerName={fieldId} controllerLabel={label} />
      </Grid>
    </Grid>
  </Box>
}

export default TermsConditions