// packages block
import { FC, useState } from "react";
import { Box, IconButton, TextField } from "@material-ui/core";
// styles, constants, utils and interfaces block
import { TablesSearchIcon } from "../../assets/svgs";
import { useTableStyles } from "../../styles/tableStyles";
import { SearchComponentProps } from "../../interfacesTypes";

const Search: FC<SearchComponentProps> = ({ search }): JSX.Element => {
  const classes = useTableStyles()
  const [query, setQuery] = useState<string>('')

  const handleSearch = () => {
    search(query.trim())
  }

  return (
    <Box className={classes.searchContainer}>
      <TextField
        name="searchQuery"
        className={classes.tablesSearchIcon}
        value={query}
        onChange={({ target: { value } }) => setQuery(value)}
        onKeyPress={({ key }) => key === "Enter" && handleSearch()}
        placeholder="Search"
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment:
            <IconButton color="default">
              <TablesSearchIcon />
            </IconButton>
        }}
      />
    </Box>
  );
};

export default Search;
