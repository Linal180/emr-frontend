// packages block
import { FC } from "react";
import { TableCell, Typography, Box } from "@material-ui/core";
// interfaces/types block
import { IDetailCellProps } from "../../interfacesTypes";
import { DetailTooltip } from "../../styles/tableStyles";

const TestDetailCell: FC<IDetailCellProps> = ({ description }) => {
  return (
    <TableCell>
      <Box minWidth={170} maxWidth={170}>
        {(description && (description.length > 22)) ?
          <DetailTooltip title={description}>
            <Typography variant="body2">
              {`${description.substring(0, 22)}... `}
            </Typography>
          </DetailTooltip>
          :
          description
        }
      </Box>
    </TableCell>
  );
};

export default TestDetailCell;
