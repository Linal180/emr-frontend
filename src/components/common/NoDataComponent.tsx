// packages block
import { Box, Typography } from "@material-ui/core";
import { FC } from "react";
// constants block
import { NoDataIcon } from "../../assets/svgs";
import { NO_DATA_FOUND } from "../../constants";
import { NoDataComponentProps } from "../../interfacesTypes";

const NoDataComponent: FC<NoDataComponentProps> = ({ message }): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box color="#E3EEFA" fontSize={120} display="flex" alignItems="center">
        <Box width={40}>
          <NoDataIcon />
        </Box>
      </Box>

      <Box mt={1}>
        <Typography component="h5" variant="h5">
          {message ? message : NO_DATA_FOUND}
        </Typography>
      </Box>
    </Box>
  );
};

export default NoDataComponent;
