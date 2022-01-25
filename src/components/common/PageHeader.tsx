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

const PageHeader: FC<PageHeaderProps> = ({ title, buttonText, hasComponent, linkToPage, noAdd, path, openModel, openModal, tableData, setTableData }): JSX.Element => {
  const [openPopup, setOpenPopup] = useState<boolean>(false);

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
            (buttonText &&
              <Button color="primary" variant="contained" onClick={openModal}>
                {buttonText}
              </Button>
            )
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
          tableData={tableData}
          setTableData={setTableData}
          setOpen={(open: boolean) => setOpenPopup(open)}
        />
      }
    </Box>
  );
};

export default PageHeader;
