// packages block
import { FC, MouseEvent, useState } from "react";
import { AppBar, Typography, Box, Menu, MenuItem, Fade, Link, Toolbar } from '@material-ui/core';

// utils and header styles block
import { useHeaderStyles } from "../../styles/headerStyles";
import { DownArrowIcon, EMRLogo, NewAvatarIcon } from "../../assets/svgs";
import { BILLING_TEXT, USERS_TEXT, SCHEDULE_TEXT, HOME_TEXT, REPORTS, HELLO_TEXT, RICHARD_TEXT, PROFILE_TEXT, MYACCOUNT_TEXT, LOGOUT_TEXT } from "../../constants";

const HeaderNew: FC = (): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const classes = useHeaderStyles();
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const renderMenu = (
        <Menu 
            id="menu-appbar" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose} TransitionComponent={Fade} getContentAnchorEl={null} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "top", horizontal: "center" }} >
            <MenuItem onClick={handleClose}>{PROFILE_TEXT}</MenuItem>
            <MenuItem onClick={handleClose}>{MYACCOUNT_TEXT}</MenuItem>
            <MenuItem onClick={handleClose}>{LOGOUT_TEXT}</MenuItem>
        </Menu>
      );

    return (
        <>
            <AppBar className={classes.newAppBar}>
                <Toolbar style={{justifyContent: "space-between", alignItems: "center"}}>
                    {/* LOGO */}
                    <Box>
                        <EMRLogo />
                    </Box>

                    {/* MENU */}
                    <Box className={classes.newMenuBar}>
                        <Typography className={classes.newMenuItem} component={Link}>
                            {HOME_TEXT}
                        </Typography>

                        {/* <DropDownMenu /> */}
                        <Box>
                            <Box className={classes.newMenuItem} onClick={(event) => handleClick(event)} aria-label="dropdown menu" aria-controls="menu-appbar" aria-haspopup="true" color="inherit" >
                                <Typography> {SCHEDULE_TEXT} </Typography>
                                <Box pl={2} display="inline"><DownArrowIcon /></Box>
                            </Box>
                            {renderMenu}
                        </Box>

                        <Box>
                            <Box className={classes.newMenuItem} onClick={(event) => handleClick(event)} aria-label="dropdown menu" aria-controls="menu-appbar" aria-haspopup="true" color="inherit" >
                                <Typography> {USERS_TEXT} </Typography>
                                <Box pl={2} display="inline"><DownArrowIcon /></Box>
                            </Box>
                            {renderMenu}
                        </Box>

                        <Box>
                            <Box className={classes.newMenuItem} onClick={(event) => handleClick(event)} aria-label="dropdown menu" aria-controls="menu-appbar" aria-haspopup="true" color="inherit" >
                                <Typography> {BILLING_TEXT} </Typography>
                                <Box pl={2} display="inline"><DownArrowIcon /></Box>
                            </Box>
                            {renderMenu}
                        </Box>

                        <Typography className={classes.newMenuItem} component={Link}>
                            {REPORTS}
                        </Typography>
                    </Box>

                    {/* AVATAR */}
                    <Box display="flex" alignItems="center">
                        <Box className={classes.newMenuItem1}>
                            <Typography style={{color:'#A1A5B7', textAlign: 'right'}}>
                                {HELLO_TEXT}
                            </Typography>
                            <Typography variant="h6">{RICHARD_TEXT}</Typography>
                        </Box>

                        <Box pl={2} style={{cursor: 'pointer'}}>
                            <Box>
                                <Box onClick={(event) => handleClick(event)} aria-label="dropdown menu" aria-controls="menu-appbar" aria-haspopup="true" color="inherit" >
                                    <NewAvatarIcon />
                                </Box>
                                {renderMenu}
                            </Box>
                        </Box>

                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default HeaderNew;