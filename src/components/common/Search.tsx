// packages block
import { FC, useState } from "react";
import { Box, IconButton, TextField } from "@material-ui/core";
import { Clear, Search as SearchIcon } from "@material-ui/icons";
// styles and interfaces block
import { useTableStyles } from "../../styles/tableStyles";
import { SearchComponentProps } from "../../interfacesTypes";

const Search: FC<SearchComponentProps> = ({ search }): JSX.Element => {
  const classes = useTableStyles()
  const [query, setQuery] = useState<string>('')
  const handleSearch = () => search(query)

  return (
    <Box className={classes.tableSearchBox}>
      <IconButton aria-label="search">
        <SearchIcon />
      </IconButton>

      <TextField
        fullWidth
        variant="outlined"
        name="searchQuery"
        placeholder="Search"
        value={query}
        className={classes.tableSearchInput}
        onChange={({ target: { value } }) => setQuery(value)}
        onKeyPress={({ key }) => key === "Enter" && handleSearch()}
      />

      {query &&
        <IconButton type="submit" aria-label="clear">
          <Clear />
        </IconButton>
      }
    </Box>
  );
};

export default Search;
