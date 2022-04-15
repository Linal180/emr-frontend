// packages block
import { FC, useState } from "react";
import { Box, IconButton, TextField } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { useTableStyles } from "../../styles/tableStyles";
import { SearchComponentProps } from "../../interfacesTypes";
import { Clear, Search as SearchIcon } from "@material-ui/icons";

const Search: FC<SearchComponentProps> = ({ search }): JSX.Element => {
  const classes = useTableStyles()
  const [query, setQuery] = useState<string>('')

  const handleSearch = () => {
    search(query)
  }

  return (
    <Box className={classes.tableSearchBox}>
      <IconButton aria-label="search">
        <SearchIcon />
      </IconButton>

      <TextField
        name="searchQuery"
        className={classes.tableSearchInput}
        value={query}
        onChange={({ target: { value } }) => setQuery(value)}
        onKeyPress={({ key }) => key === "Enter" && handleSearch()}
        placeholder="Search here..."
        variant="outlined"
        fullWidth
      />

      {query && <IconButton type="submit" aria-label="clear">
        <Clear />
      </IconButton>}
    </Box>
  );
};

export default Search;
