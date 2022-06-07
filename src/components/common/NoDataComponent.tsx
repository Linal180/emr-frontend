// packages block
import { FC } from "react";
import { Typography, Box } from "@material-ui/core";
// constants block
import { NO_DATA_FOUND } from "../../constants";
import { NoDataIcon } from "../../assets/svgs";

const NoDataComponent: FC = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box color="#E3EEFA" fontSize={120} display="flex" alignItems="center">
        <NoDataIcon />
      </Box>

      <Box mt={1}>
        <Typography component="h5" variant="h5">
          {NO_DATA_FOUND}
        </Typography>
      </Box>
    </Box>
  );
};

export default NoDataComponent;
