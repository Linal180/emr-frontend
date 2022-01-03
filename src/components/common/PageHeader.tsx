// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Add } from "@material-ui/icons";
import { Box, Typography, Button } from "@material-ui/core";
// interfaces/types block
import { IPageHeader } from "../../interfacesTypes";

const PageHeader: FC<IPageHeader> = ({ setOpen, isOpen, title, buttonText, hasComponent, linkToPage, noAdd }): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2}>
      <Typography component="h4" variant="h4">
        {title}
      </Typography>
      {!noAdd && <>
        {hasComponent ? (
          <Button color="primary" variant="contained" component={Link} to={linkToPage || ""}>
            <Add />
            {buttonText || ""}
          </Button>
        ) : (
          <Button color="primary" variant="contained" onClick={() => setOpen && setOpen(!isOpen)}>
            <Add />
            {buttonText}
          </Button>
        )}
      </>}
    </Box>
  );
};

export default PageHeader;
