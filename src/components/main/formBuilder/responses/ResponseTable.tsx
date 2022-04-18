// package block
import { ChangeEvent, FC, useState, useEffect, useCallback } from 'react';
import { Box, Table, TableRow, TableHead } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { useParams } from 'react-router';
//components block
import Search from "../../../common/Search";
//constants interfaces
import { renderTh } from '../../../../utils';
import { useTableStyles } from '../../../../styles/tableStyles';
import { ACTION, CREATED_ON, NAME, PAGE_LIMIT, PUBLISHED, TYPE } from '../../../../constants';
import { useFindAllUsersFormsLazyQuery, UserForms } from '../../../../generated/graphql';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
import { ParamsType } from '../../../../interfacesTypes';
//component
const ResponseTable: FC = (): JSX.Element => {
  //hooks
  const classes = useTableStyles();
  const { id: formId } = useParams<ParamsType>()
  //states
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery] = useState<string>('');
  const [forms, setForms] = useState<UserForms[]>([]);
  //mutations & queries
  const [fetchAllUserFormResponses, { loading, error }] = useFindAllUsersFormsLazyQuery({
    onCompleted: (data) => {

    },
    onError: (error) => {

    }
  })

  const fetchAllForms = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }
      const formInputs = formId ? { ...pageInputs, FormId: formId } : { ...pageInputs }
      await fetchAllUserFormResponses({
        variables: {
          userFormInput: { ...formInputs }
        },
      })
    } catch (error) { }
  }, [page, formId, fetchAllUserFormResponses])


  const search = (query: string) => { }

  const handleChange = (_: ChangeEvent<unknown>, value: number) => setPage(value);

  useEffect(() => {
    !searchQuery && formId && fetchAllForms()
  }, [page, searchQuery, fetchAllForms, formId]);

  return (
    <Box className={classes.mainTableContainer}>
      <Search search={search} />

      <Box className="table-overflow">
        <Table >
          <TableHead>
            <TableRow>
              {renderTh(NAME)}
              {renderTh(TYPE)}
              {renderTh(CREATED_ON)}
              {renderTh(PUBLISHED)}
              {renderTh(ACTION, "center")}
            </TableRow>
          </TableHead>
        </Table>
        {((!loading && !forms?.length) || error) && (
          <Box display="flex" justifyContent="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        )}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Pagination
              count={totalPages}
              shape="rounded"
              variant="outlined"
              page={page}
              onChange={handleChange}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ResponseTable