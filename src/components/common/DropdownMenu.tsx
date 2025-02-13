// packages block
import { FC, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Menu, MenuItem, Fade, IconButton, Button, } from '@material-ui/core';
// utils and header styles block
import { DropDownItems } from "../../interfacesTypes";
import { useHeaderStyles } from "../../styles/headerStyles";
import { DownArrowIcon, NewAvatarIcon, } from "../../assets/svgs";

const DropdownMenu: FC<DropDownItems> = ({ itemName, menuItem, avatarIcon, current }): JSX.Element => {
  const classes = useHeaderStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = ({ currentTarget }: MouseEvent<HTMLElement>) => setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      {!avatarIcon &&
        <Typography
          className={current ? ` ${classes.menuItem} active` : `${classes.menuItem}`}
          onClick={(event) => handleClick(event)}
        >
          {itemName}
          <Button
            aria-label="dropdown menu"
            aria-controls="menu-appBar"
            aria-haspopup="true" color="inherit"
          >
            <DownArrowIcon />
          </Button>
        </Typography>
      }

      {avatarIcon &&
        <IconButton
          onClick={(event) => handleClick(event)}
          aria-label="dropdown menu"
          aria-controls="menu-appBar"
          aria-haspopup="true"
          color="inherit"
          size='small'
        >
          <NewAvatarIcon />
        </IconButton>
      }

      <Menu
        id="menu-appBar"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {menuItem && menuItem.map((item) => (<Link key={`${item.link}-${item.name}`} to={item.link} className={classes.menuLink}>
          <MenuItem onClick={handleClose}>{item.name}</MenuItem>
        </Link>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;
