// packages block
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@material-ui/core";
// components block
import AddServiceModal from "../main/facilities/facilityServicesListing/AddServiceModal";
// interfaces/types block
import { IPageHeader } from "../../interfacesTypes";
import Breadcrumb from "./Breadcrumb";
import { ACTIVE_TEXT, ADD_FACILITY_SERVICE } from "../../constants";

const PageHeader: FC<IPageHeader> = ({ title, buttonText, hasComponent, linkToPage, noAdd, path, openModel, openModal }): JSX.Element => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);

  const handleService = () => { };

  const onButtonClick = () => {
    setOpenPopup(true)
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" pb={2.25}>
      <Box>
        <Typography component="h4" variant="h4">{title}</Typography>
        {path && <Breadcrumb path={path} />}
      </Box>

      {!noAdd &&
        <>
          {hasComponent ?
            <Button color="primary" variant="contained" component={Link} to={linkToPage || ""}>
              {buttonText || ""}
            </Button>
            :
            (buttonText && <Button color="primary" variant="contained" onClick={openModal}>
              {buttonText}
            </Button>)
          }
        </>
      }

      {openModel &&
        <Button color="primary" variant="contained" onClick={() => onButtonClick()}>
          {buttonText || ""}
        </Button>
      }

      {openModel &&
        <AddServiceModal
          title={ADD_FACILITY_SERVICE}
          isOpen={openPopup}
          description={ACTIVE_TEXT}
          handleService={handleService}
          setOpen={(open: boolean) => setOpenPopup(open)}
        />
      }
    </Box>
  );
};

export default PageHeader;
