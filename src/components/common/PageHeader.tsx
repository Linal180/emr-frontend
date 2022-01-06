// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
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
          <Button color="secondary" variant="contained" component={Link} to={linkToPage || ""}>
            {buttonText || ""}
          </Button>
        ) : (
          <Button color="secondary" variant="contained" onClick={() => setOpen && setOpen(!isOpen)}>
            {buttonText}
          </Button>
        )}
      </>}
    </Box>
  );
};

export default PageHeader;
