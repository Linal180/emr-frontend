// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography } from "@material-ui/core";
// components block
import Breadcrumb from "../../../../common/Breadcrumb";
// interfaces/types block
import { PageBackIcon } from "../../../../../assets/svgs";
import { PATIENTS_ROUTE } from "../../../../../constants";
import { PageHeaderProps } from "../../../../../interfacesTypes";

const ChartingPageHeader: FC<PageHeaderProps> = ({ title, path, id }): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2.25}>

      <Box display="flex">
        <Box mr={2}>
          <Link to={`${PATIENTS_ROUTE}/${id}/details`}>
            <PageBackIcon />
          </Link>
        </Box>
        <Box>
          <Typography component="h4" variant="h4">{title}</Typography>
          {path && <Breadcrumb path={path} />}
        </Box>

      </Box>
    </Box>
  );
};

export default ChartingPageHeader;