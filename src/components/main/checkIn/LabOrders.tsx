//packages import
import { FC } from "react";
import { Box, Button, Card, colors, Typography } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
//components import
import LabOrdersCreateForm from "../labOrders/addOrder/LabOrdersCreateForm";
//constants, types, interfaces, utils import
import { TO_BILLING } from "../../../constants";
import { LabOrderCreateProps } from "../../../interfacesTypes";

const LabOrders: FC<LabOrderCreateProps> = ({ appointmentInfo, handleStep }) => {
  return (
    <Card>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant="h4">Lab Order</Typography>

        <Button variant="contained" color="primary" onClick={()=>handleStep && handleStep(6)}>
          {TO_BILLING}
          <ChevronRight />
        </Button>
      </Box>

      <Box p={2}>
        <LabOrdersCreateForm appointmentInfo={appointmentInfo} />
      </Box>
    </Card>
  )
}

export default LabOrders