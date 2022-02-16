// packages block
import { FC, MouseEvent, useState } from "react";
import { AppBar, Typography, Box, Menu, MenuItem, Fade, Link } from '@material-ui/core';

// utils and header styles block
import { useHeaderStyles } from "../../styles/headerStyles";
import { DownArrowIcon } from "../../assets/svgs";
import { SCHEDULE_TEXT, PROFILE_TEXT, MYACCOUNT_TEXT, LOGOUT_TEXT  } from "../../constants";

const DropdownMenu: FC = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const classes = useHeaderStyles();
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return(
        <>
            <Box className={classes.newMenuItem} onClick={(event) => handleClick(event)} aria-label="dropdown menu" aria-controls="menu-appbar" aria-haspopup="true" color="inherit" >
                <Typography> {SCHEDULE_TEXT} </Typography>
                <Box pl={2} display="inline"><DownArrowIcon /></Box>
            </Box>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted 
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MenuItem onClick={handleClose}>{PROFILE_TEXT}</MenuItem>
                <MenuItem onClick={handleClose}>{MYACCOUNT_TEXT}</MenuItem>
                <MenuItem onClick={handleClose}>{LOGOUT_TEXT}</MenuItem>
            </Menu>
        </>
    );
};

export default DropdownMenu;