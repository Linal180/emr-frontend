// packages block
import { FC, Fragment, useState } from "react";
import { Box, ClickAwayListener, IconButton, TextField, Typography } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { SearchIcon, ClearIcon, InfoSearchIcon } from "../../assets/svgs";
import { useTableStyles } from "../../styles/tableStyles";
import { SearchComponentProps } from "../../interfacesTypes";
import { SearchTooltip } from "../../styles/searchTooltip";

const Search: FC<SearchComponentProps> = ({ search, info, tooltipData }): JSX.Element => {
  const classes = useTableStyles()
  const [query, setQuery] = useState<string>('')
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => setOpen(true);

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
      {info && <ClickAwayListener onClickAway={handleTooltipClose}>
        <SearchTooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          arrow
          placement="right"
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          className={classes.tooltipContainer}
          title={
            <Fragment>
              {tooltipData?.map((item) => {
                return (
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="caption">{item.format}</Typography>
                  </Box>
                )
              })}
            </Fragment>
          }
        >
          <Box onClick={handleTooltipOpen} pr={2}>
            <InfoSearchIcon />
          </Box>
        </SearchTooltip>
      </ClickAwayListener>}
    </Box>
  );
};

export default Search;
