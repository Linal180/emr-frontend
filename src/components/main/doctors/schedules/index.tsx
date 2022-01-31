// packages block
import { MouseEvent, useState, FC } from "react";
import { Box, Grid, Typography, Button, Menu, MenuItem } from "@material-ui/core";
// components block
import CardComponent from "../../../common/CardComponent";
import ToggleBtn from './ToggleButton';
// interfaces, graphql, constants block
import { ADD_MORE_RECORDS_TEXT, AVAILABILITY_TEXT, NON_AVAILABILITY_TEXT, WEEK_DAYS } from "../../../../constants";
import { useDoctorScheduleStyles } from '../../../../styles/doctorSchedule';
import { AddSlotIcon } from '../../../../assets/svgs';

const DoctorScheduleForm: FC = () => {
  const classes = useDoctorScheduleStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const menuId = "header-schedule-slot";
  const handleScheduleSlotClose = () => setAnchorEl(null);
  const handleScheduleSlotOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <CardComponent cardTitle={AVAILABILITY_TEXT}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                {WEEK_DAYS.map(({ index, name }) => {
                  return (
                    <>
                      <ToggleBtn key={index} name={name} label="Set your availability status" />
                      <Box aria-label="schedule-slot" aria-controls={menuId} aria-haspopup="true" onClick={handleScheduleSlotOpen} className={classes.addSlot}>
                        <AddSlotIcon />
                        <Typography>
                          {ADD_MORE_RECORDS_TEXT}
                        </Typography>
                      </Box>
                      <Menu
                        classes={
                          { paper: "schedule-slot" }
                        }
                        getContentAnchorEl={null}
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        id={menuId}
                        keepMounted
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                        open={isMenuOpen}
                        onClose={handleScheduleSlotClose}
                      >
                        <MenuItem>
                          Logout
                        </MenuItem>
                        <MenuItem>
                          Logout
                        </MenuItem>
                        <MenuItem>
                          Logout
                        </MenuItem>
                        <MenuItem>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  )
                })}
              </Grid>
            </Grid>
          </CardComponent>
        </Grid>

        <Grid md={6} item>
          <CardComponent cardTitle={NON_AVAILABILITY_TEXT}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                {WEEK_DAYS.map(({ index, name }) => (
                  <ToggleBtn key={index} name={name} label="Set your availability status" />
                ))}
              </Grid>
            </Grid>
          </CardComponent>
        </Grid>
      </Grid >
    </>
  );
};

export default DoctorScheduleForm;
