// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// interfaces/types block
import { IPageHeader } from "../../interfacesTypes";
import Breadcrumb from "./Breadcrumb";

const PageHeader: FC<IPageHeader> = ({ title, buttonText, hasComponent, linkToPage, noAdd, path }): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2}>
      <Box>
        <Typography component="h4" variant="h4">{title}</Typography>
        {path && <Breadcrumb path={path} />}
      </Box>

      {!noAdd && <>
        {hasComponent &&
          <Button color="secondary" variant="contained" component={Link} to={linkToPage || ""}>
            {buttonText || ""}
          </Button>
        }
      </>}
    </Box>
  );
};

export default PageHeader;
