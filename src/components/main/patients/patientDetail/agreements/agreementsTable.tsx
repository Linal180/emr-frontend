// packages
import React from 'react';
import { Box, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
//components
import Search from '../../../../common/Search';
//constants, types, interfaces, utils
import { renderTh, } from '../../../../../utils';
import { NAME, CREATED_ON, AGREEMENTS_TABLE_DUMMY_DATA } from '../../../../../constants'
import { Pagination } from '@material-ui/lab';
import { WHITE } from '../../../../../theme';

const AgreementsTable = (): JSX.Element => {
  const search = (query: string) => { };

  return (
    <>
    {/* className={classes.mainTableContainer} */}
      <Box bgcolor={WHITE}>
        <Box p={2} bgcolor={WHITE}>
          <Box py={2} maxWidth={450}>
            <Search search={search} />
          </Box>
        </Box>

        <Box bgcolor={WHITE} className="table-overflow agreement-table">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(CREATED_ON)}
              </TableRow>
            </TableHead>

            <TableBody>
              {AGREEMENTS_TABLE_DUMMY_DATA.map(({
                name, date,
              }) =>
                <TableRow>
                  <TableCell scope="row">{name}</TableCell>
                  <TableCell scope="row">{date}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" p={3}>
        <Pagination
          count={10}
          shape="rounded"
          variant="outlined"
          page={1}
        />
      </Box>
    </>
  )
}

export default AgreementsTable;
