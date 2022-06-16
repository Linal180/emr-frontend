// packages block
import { FC } from 'react';
import { Add } from '@material-ui/icons';
import { Pagination } from '@material-ui/lab';
import { Box, Table, TableHead, TableRow, TableBody, TableCell, Button, Typography } from '@material-ui/core';
// components block
import Search from '../../../../common/Search';
//constants, types, interfaces, utils block
import { WHITE } from '../../../../../theme';
import { renderTh, } from '../../../../../utils';
import { NAME, CREATED_ON, AGREEMENTS_TABLE_DUMMY_DATA, ADD_NEW_TEXT, AGREEMENTS } from '../../../../../constants'
import { AgreementGeneralProps } from '../../../../../interfacesTypes';

const AgreementsTable: FC<AgreementGeneralProps> = ({ setEdit }): JSX.Element => {
  const search = (query: string) => { };

  return (
    <>
      <Box pb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" color='textPrimary'>{AGREEMENTS}</Typography>

        <Button onClick={() => setEdit(true)} variant="contained" color="primary">
          <Add />
          {ADD_NEW_TEXT}
        </Button>
      </Box>

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
