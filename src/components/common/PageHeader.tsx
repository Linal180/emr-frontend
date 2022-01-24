// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// interfaces/types block
import { IPageHeader } from "../../interfacesTypes";
import Breadcrumb from "./Breadcrumb";

const PageHeader: FC<IPageHeader> = ({ title, buttonText, hasComponent, linkToPage, noAdd, path, openModal }): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2.25}>
      <Box>
        <Typography component="h4" variant="h4">{title}</Typography>
        {path && <Breadcrumb path={path} />}
      </Box>
      {!noAdd && <>
        {hasComponent ?
          <Button color="primary" variant="contained" component={Link} to={linkToPage || ""}>
            {buttonText || ""}
          </Button>
          :
          (buttonText && <Button color="primary" variant="contained" onClick={openModal}>
            {buttonText}
          </Button>)
        }
      </>}
    </Box>
  );
};

export default PageHeader;