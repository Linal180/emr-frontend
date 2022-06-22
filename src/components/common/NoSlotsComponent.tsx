// packages block
import { FC } from "react";
import { Typography, Box } from "@material-ui/core";
// constants block
import { NoDataIcon } from "../../assets/svgs";
import { NO_SLOT_AVAILABLE } from "../../constants";

const NoSlotsComponent: FC = (): JSX.Element => {
  return (
    <Box pb={2.5} display="flex" alignItems="center" justifyContent="center" width="100%">
      <Box color="#E3EEFA" width="20px" fontSize={120} display="flex" alignItems="center">
        <NoDataIcon />
      </Box>

      <Box ml={0.5}>
        <Typography component="h6" variant="h5">
          {NO_SLOT_AVAILABLE}
        </Typography>
      </Box>
    </Box>
  );
};

export default NoSlotsComponent;
