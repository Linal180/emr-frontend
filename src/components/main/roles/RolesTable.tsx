
// packages block
import { FC, ChangeEvent, useState } from "react";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Search from "../../common/Search";
// constant, utils and styles block
import { renderTh } from "../../../utils";
import { useTableStyles } from "../../../styles/tableStyles";
import { NAME, DESCRIPTION, ROLES_DUMMY_DATA } from "../../../constants";

const RolesTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [page, setPage] = useState<number>(1);

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Search search={Search} />

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(DESCRIPTION)}
              </TableRow>
            </TableHead>

            <TableBody>
              {ROLES_DUMMY_DATA.map(({
                name, description
              }) =>
                <TableRow>
                  <TableCell scope="row">{name}</TableCell>
                  <TableCell scope="row">{description}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" pt={3}>
        <Pagination
          count={10}
          shape="rounded"
          page={page}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default RolesTable;