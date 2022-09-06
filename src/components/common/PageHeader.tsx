// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import { Box, Typography, Button } from "@material-ui/core";
// components block
import Breadcrumb from "./Breadcrumb";
// interfaces/types block
import { BLACK_TWO } from "../../theme";
import { PageBackIcon } from "../../assets/svgs";
import { PATIENTS_ROUTE } from "../../constants";
import { PageHeaderProps } from "../../interfacesTypes";

const PageHeader: FC<PageHeaderProps> = ({
  title, subTitle, buttonText, hasComponent, linkToPage, noAdd, path, openModal,
  isIcon, id, startIcon
}): JSX.Element => {
  return (
    <Box display="flex" flexWrap='wrap' alignItems="center" justifyContent="space-between">
      <Box className="breadcrumb-list" pb={2.25}>
        {isIcon &&
          (
            <Box mr={2}>
              <Link to={`${PATIENTS_ROUTE}/${id}/details`}>
                <PageBackIcon />
              </Link>
            </Box>
          )}

        <Typography component="h4" variant="h4">{title}</Typography>

        {path && <Breadcrumb path={path} />}

        {subTitle &&
          <Box color={BLACK_TWO} pt={0.1}>
            <Typography color="inherit" variant="body1">{subTitle}</Typography>
          </Box>
        }
      </Box>

      {!noAdd &&
        <Box pb={2.25}>
          {hasComponent ?
            <Button color="primary" variant="contained" component={Link} to={linkToPage || ""} startIcon={startIcon || <AddIcon />}>
              {buttonText || ""}
            </Button>
            :
            (buttonText &&
              <Button color="primary" variant="contained" onClick={openModal}>
                {buttonText}
              </Button>
            )}
        </Box>
      }
    </Box>
  );
};

export default PageHeader;
