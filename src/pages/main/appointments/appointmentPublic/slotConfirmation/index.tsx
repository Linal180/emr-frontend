// packages block
import { FC, MouseEvent, useState } from "react";
import { ArrowDropDown } from "@material-ui/icons";
import { Box, Button, Card, Menu, Typography } from '@material-ui/core';
// utils, styles  block, constants
import { WHITE_TWO } from '../../../../../theme';
import { PATIENT_INFORMATION, SLOT_CONFIRMATION_HEADING_TWO, SLOT_CONFIRMATION_SUB_HEADING, SLOT_CONFIRMATION_SUB_HEADING_TWO } from '../../../../../constants';
import { slotConfirmationStyles } from "../../../../../styles/publicAppointment/slotConfirmation"
import { Link } from "react-router-dom";

const SlotConfirmation: FC = (): JSX.Element => {
  const classes = slotConfirmationStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "slot-menu";
  const handleMenuClose = () => setAnchorEl(null);
  const handleSlotMenuOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const renderMenu = (
    <Menu
      getContentAnchorEl={null}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box display="flex" flexDirection="column" pl={2} pr={2}>
        <Button>
          Yes, Confirm it!
        </Button>
        <Link to={PATIENT_INFORMATION}>
          <Button>
            Not now, Maybe Later!
          </Button>
        </Link>

      </Box>

    </Menu>
  );

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <Box minHeight="580px" className={classes.container}>
          <Box maxWidth="700px">
            <Typography component="h3" variant="h3" >Thank you! Your visit at 8:15 am has been confirmed.</Typography>
            <Typography component="h3" variant="h3" >{SLOT_CONFIRMATION_HEADING_TWO}</Typography>
          </Box>

          <Box pt={3}>
            <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING}</Typography>
            <Typography component="h5" variant="h5">{SLOT_CONFIRMATION_SUB_HEADING_TWO}</Typography>
          </Box>

          <Box display="flex" gridGap={20} mt={3}>
            <Button type="submit" variant="contained">
              Cancel Booking
            </Button>
            <Button type="submit" variant="contained" className='blue-button' onClick={handleSlotMenuOpen}>
              <Typography>
                Continue
              </Typography>  <ArrowDropDown />
            </Button>
          </Box>
          {renderMenu}
        </Box>
      </Card>
    </Box>
  );
};

export default SlotConfirmation;
