// packages block
import { FC } from "react";
import { Card, CardContent, CardHeader, IconButton, Box } from "@material-ui/core";
// interfaces/types block
import { AddChartingIcon } from "../../../../../../assets/svgs";
import { ChartingCardComponentType } from "../../../../../../interfacesTypes";

const PatientCardComponent: FC<ChartingCardComponentType> = ({ children, cardTitle, hasAdd, onAddClick, disableAddIcon }): JSX.Element => (
  <Card>
    <CardHeader
      action={
        hasAdd && (
          <Box display="flex" alignItems="center">
            <IconButton disabled={disableAddIcon} onClick={onAddClick} aria-label="patient-charting">
              <AddChartingIcon />
            </IconButton>
          </Box>
        )
      }
      title={cardTitle}
    />

    <CardContent>{children}</CardContent>
  </Card>
);

export default PatientCardComponent;
