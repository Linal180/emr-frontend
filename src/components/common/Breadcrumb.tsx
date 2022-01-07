// packages block
import { FC } from "react";
import { Box, Button, Typography } from "@material-ui/core";
// history block
import history from "../../history";
import { BreadcrumbProps } from '../../interfacesTypes'

const Breadcrumb: FC<BreadcrumbProps> = ({ title, path, hasButton, buttonText, link }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2}>
      <Box>
        <Typography component="h4" variant="h4">{title}</Typography>

        <Box py={2}>
          <Typography component="p" variant="body2">
            {path?.map((component, index) => `${component} ${path.length > index + 1 ? " / " : ''}`)}
          </Typography>
        </Box>
      </Box>

      {hasButton && link && (
        <Button color="secondary" variant="contained" onClick={() => history.push(link)}>
          {buttonText}
        </Button>
      )}
    </Box >
  )
};

export default Breadcrumb;
