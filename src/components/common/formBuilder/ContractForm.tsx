//packages block
import { FC } from "react"
import { Box, Grid } from "@material-ui/core"
//components
import InputController from "../../../controller"
//constants
import { CONTRACT_NO, ORGANIZATION_NAME } from "../../../constants"

const ContractForm: FC = (): JSX.Element => {
  return <Box my={3}>
    <Grid container spacing={3}>
      <Grid item md={3} sm={6} xs={12}>
        <InputController controllerName="contractNumber" fieldType="text" controllerLabel={CONTRACT_NO} isRequired />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <InputController controllerName="organizationName" fieldType="text" controllerLabel={ORGANIZATION_NAME} isRequired />
      </Grid>
    </Grid>
  </Box>
}

export default ContractForm