// packages block
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// components block
import AddServiceModal from "../main/facilities/addFacilityServices/AddServiceModal";
// interfaces/types block
import { PageHeaderProps } from "../../interfacesTypes";
import Breadcrumb from "./Breadcrumb";
import { ACTIVE_TEXT, ADD_FACILITY_SERVICE } from "../../constants";

const PageHeader: FC<PageHeaderProps> = ({ title, buttonText, hasComponent, linkToPage, noAdd, path, openModal }): JSX.Element => {

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2.25}>
      <Box>
        <Typography component="h4" variant="h4">{title}</Typography>
        {path && <Breadcrumb path={path} />}
      </Box>

      {!noAdd && !openModal && <>
        {hasComponent ?
          <Button color="primary" variant="contained" component={Link} to={linkToPage || ""}>
            {buttonText || ""}
          </Button>
          :
          <Button color="primary" variant="contained" onClick={openModal}>
            {buttonText || ""}
          </Button>
        }
      </>}

    </Box>
  );
};

export default PageHeader;

