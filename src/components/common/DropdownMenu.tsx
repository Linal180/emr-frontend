// packages block
import { FC, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Box, Menu, MenuItem, Fade } from '@material-ui/core';
// utils and header styles block
import { handleLogout } from "../../utils";
import { LOGOUT_TEXT } from "../../constants";
import { DropDownItems } from "../../interfacesTypes";
import { useHeaderStyles } from "../../styles/headerStyles";
import { DownArrowIcon, NewAvatarIcon } from "../../assets/svgs";

const DropdownMenu: FC<DropDownItems> = ({ itemName, menuItem, avatarIcon }): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const classes = useHeaderStyles();
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Box className={classes.menuItem} onClick={(event) => handleClick(event)} aria-label="dropdown menu" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
        {!avatarIcon &&
          <>
            <Typography>{itemName}</Typography>
            <Box pl={2} display="inline"><DownArrowIcon /></Box>
          </>
        }
				
        {avatarIcon && <NewAvatarIcon />}
      </Box>

      <Menu
        id="menu-appBar"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {menuItem && menuItem.map((item) => (<Link to={item.link} className={classes.menuLink}>
          <MenuItem onClick={handleClose}>{item.name}</MenuItem>
        </Link>
        ))}

        {avatarIcon && <MenuItem onClick={handleLogout}>{LOGOUT_TEXT}</MenuItem>}
      </Menu>
    </>
  );
};

export default DropdownMenu;
