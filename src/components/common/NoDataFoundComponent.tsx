// packages block
import { FC } from "react";
import { Typography, Box } from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
// constants block
import { NO_DATA_FOUND } from "../../constants";

const NoDataFoundComponent: FC = (): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box width={80} color="#E3EEFA" fontSize={120} display="flex" alignItems="center">
        <FolderOpenIcon fontSize="inherit" color="inherit" />
      </Box>

      <Box>
        <Typography component="h5" variant="h5">
          {NO_DATA_FOUND}
        </Typography>
      </Box>
    </Box>
  );
};

export default NoDataFoundComponent;
