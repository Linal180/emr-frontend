// packages block
import { FC, Fragment, useState } from "react";
import { Box, ClickAwayListener, IconButton, TextField, Tooltip, Typography } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { SearchIcon, ClearIcon } from "../../assets/svgs";
import { useTableStyles } from "../../styles/tableStyles";
import { SearchComponentProps } from "../../interfacesTypes";
import { Info } from "@material-ui/icons";
import { useCalendarStyles } from "../../styles/calendarStyles";

const Search: FC<SearchComponentProps> = ({ search }): JSX.Element => {
  const classes = useTableStyles()
  const iconClass = useCalendarStyles()
  const [query, setQuery] = useState<string>('')
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleClear = () => {
    setQuery('')
    search('')
  }

  return (
    <Box className={classes.searchBox}>
      <IconButton aria-label="search">
        <SearchIcon />
      </IconButton>

      <TextField
        fullWidth
        variant="outlined"
        name="searchQuery"
        placeholder="Search here..."
        className={classes.searchInput}
        value={query}
        onChange={({ target: { value } }) => setQuery(value)}
        onKeyPress={({ key }) => key === "Enter" && search(query)}
      />

      {query &&
        <IconButton type="submit" aria-label="clear" onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      }
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <div>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              <Fragment>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color="inherit">Name:</Typography>
                  <Typography color="inherit">First Last</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color="inherit">Email:</Typography>
                  <Typography color="inherit">admin@alxtel.com</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color="inherit">PRN:</Typography>
                  <Typography color="inherit">AA123456</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color="inherit">DOB:</Typography>
                  <Typography color="inherit">yyyy-mm-dd</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                  <Typography color="inherit">SSN#</Typography>
                  <Typography color="inherit">000-00-0000</Typography>
                </Box>
              </Fragment>
            }
          >
            <Box onClick={handleTooltipOpen} pr={2} className={iconClass.cursor}>
              <Info />
            </Box>
          </Tooltip>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default Search;
