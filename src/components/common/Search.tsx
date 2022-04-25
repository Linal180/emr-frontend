// packages block
import { FC, useState } from "react";
import { Box, IconButton, TextField } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { SearchIcon, ClearIcon } from "../../assets/svgs";
import { useTableStyles } from "../../styles/tableStyles";
import { SearchComponentProps } from "../../interfacesTypes";

const Search: FC<SearchComponentProps> = ({ search }): JSX.Element => {
  const classes = useTableStyles()
  const [query, setQuery] = useState<string>('')

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
    </Box>
  );
};

export default Search;
