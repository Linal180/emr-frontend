// packages block
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from "react";
import { Box, ClickAwayListener, IconButton, TextField, Typography } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { useTableStyles } from "../../styles/tableStyles";
import { SearchTooltip } from "../../styles/searchTooltip";
import { FormForwardRef, SearchComponentProps } from "../../interfacesTypes";
import { SearchIcon, ClearIcon, InfoSearchIcon } from "../../assets/svgs";

const Search = forwardRef<FormForwardRef | undefined, SearchComponentProps>(
  ({ text = '', search, info, tooltipData, placeHolder, submit }, searchRef
  ): JSX.Element => {
    const classes = useTableStyles()
    const [query, setQuery] = useState<string>(text)
    const [open, setOpen] = useState(false);

    const handleTooltipClose = () => setOpen(false);
    const handleTooltipOpen = () => setOpen(true);

    const handleClear = () => {
      if (query.length > 2) {
        setQuery('')
        search('')
      } else setQuery('')
    }

    useImperativeHandle(searchRef, () => ({
      submit() {
        handleClear()
      }
    }));

    useEffect(() => {
      text && setQuery(text)
    }, [text])

    return (
      <Box className={classes.searchBox}>
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>

        <TextField
          fullWidth
          variant="outlined"
          name="searchQuery"
          placeholder={placeHolder ? placeHolder : "Search here..."}
          className={classes.searchInput}
          value={query}
          onKeyPress={({ key }) => key === 'Enter' && query.length > 2 && submit && submit()}
          onChange={({ target: { value } }) => {
            if (value.length > 2) {
              search(value)
              setQuery(value)
            }

            if (!value.length) {
              search('')
            }

            setQuery(value)
          }}
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
  });

export default Search;
