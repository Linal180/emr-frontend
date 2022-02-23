// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// interfaces/types block
import { PageHeaderProps } from "../../interfacesTypes";
import { PlusPracticeIcon } from "../../assets/svgs";

const PracticePageHeader: FC<PageHeaderProps> = ({ title, buttonText, hasComponent, linkToPage }): JSX.Element => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2.25}>

      <Box>
        <Typography component="h4" variant="h4">{title}</Typography>
      </Box>

      <>
        {hasComponent &&
          <Button color="primary" variant="contained" component={Link} to={linkToPage || ""} startIcon={linkToPage ? <PlusPracticeIcon /> : ''}>
            {buttonText || ""}
          </Button>}
      </>
    </Box>
  );
};

export default PracticePageHeader;