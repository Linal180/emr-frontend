//packages import
import { FC } from "react";
import { Box, Button, Card, colors, Typography } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
//components import
// import LabOrdersTable from "../../common/patient/labOrders";
//constants, types, interfaces, utils import
import { TO_BILLING } from "../../../constants";
import { LabOrderCreateProps } from "../../../interfacesTypes";
import LabOrdersTable from '../../common/patient/labOrders';

const LabOrders: FC<LabOrderCreateProps> = ({ appointmentInfo, handleStep, shouldDisableEdit }) => {
  return (
    <Card>
      <Box p={2} display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant="h4">Lab Order</Typography>

        <Button variant="contained" color="primary" onClick={() => handleStep && handleStep(5)}>
          {TO_BILLING}
          <ChevronRight />
        </Button>
      </Box>

      <Box>
        <LabOrdersTable appointmentInfo={appointmentInfo} shouldDisableEdit={shouldDisableEdit} />
      </Box>
    </Card>
  )
}

export default LabOrders