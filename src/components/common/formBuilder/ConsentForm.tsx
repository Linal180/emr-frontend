//packages block
import { FC } from "react"
import { Box, Grid } from "@material-ui/core"
//components
import InputController from "../../../controller"
import CheckboxController from "../CheckboxController"
//constants
import { CONTRACT_NO, ORGANIZATION_NAME } from "../../../constants"

const ConsentForm: FC = (): JSX.Element => {
  return <Box my={3}>
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <CheckboxController controllerName="phonePermission"  controllerLabel="Granted" title="Consent To call" />
        {/* <InputController controllerName="contractNumber" fieldType="text" controllerLabel={CONTRACT_NO} isRequired /> */}
      </Grid>
      <Grid item xs={3}>
        {/* <InputController controllerName="organizationName" fieldType="text" controllerLabel={ORGANIZATION_NAME} isRequired /> */}
      </Grid>
    </Grid>
  </Box>
}

export default ConsentForm