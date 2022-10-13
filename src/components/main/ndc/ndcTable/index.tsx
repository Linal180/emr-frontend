import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Fragment, Reducer, useCallback, useEffect, useReducer } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
//components
import NdcCodeForm from '../ndcForm'
import Alert from '../../../common/Alert';
import Search from '../../../common/Search';
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//constants, styles, svgs
import { getPageNumber, isLast, renderTh } from '../../../../utils';
import { useTableStyles } from '../../../../styles/tableStyles';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { State, Action, ActionType, initialState, ndcCodeReducer } from '../../../../reducers/ndcCodeReducer';
import { ACTIONS, ADD_NEW_TEXT, CODE, DASHES, DELETE_NDC_CODE_DESCRIPTION, DESCRIPTION, EIGHT_PAGE_LIMIT, NDC_TEXT, PAGE_LIMIT } from '../../../../constants';
import { FindAllNdcPayload, useFindAllNdcLazyQuery, useRemoveNdcCodeMutation } from '../../../../generated/graphql';


const NdcTable: FC = (): JSX.Element => {

  const classes = useTableStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(ndcCodeReducer, initialState);
  const { searchQuery, data, openDelete, isOpen, itemId, page, totalPages, delId } = state;

  const [findAllNdcCodes, { loading, error }] = useFindAllNdcLazyQuery({
    onCompleted: (data) => {
      const { findAllNdc } = data || {}
      const { ndcs, pagination, response } = findAllNdc || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!ndcs?.length) {
          dispatch({ type: ActionType.SET_DATA, data: ndcs as FindAllNdcPayload['ndcs'] })
          totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
        } else {
          dispatch({ type: ActionType.SET_DATA, data: [] });
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
        }
      }
    },
    onError: () => {
      dispatch({ type: ActionType.SET_DATA, data: [] });
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
    }
  })

  const [removeCptCode, { loading: delLoading }] = useRemoveNdcCodeMutation({
    onCompleted: async (resData) => {
      const { removeNdcCode: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchAllNdcCodes()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, isLast?.length || 0) })
          }
        }
      }
    },
    onError({ message }) {
      Alert.error(message)
    },
  })

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const addHandler = () => {
    dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })
  }

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DEL_ID, delId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleEdit = (id: string) => {
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })
  };

  const handleDelete = async () => {
    delId && await removeCptCode({
      variables: { removeNdcCodeInput: { id: delId } }
    })
  }

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });


  const fetchAllNdcCodes = useCallback(async () => {
    try {
      await findAllNdcCodes({ variables: { findAllNdcInput: { paginationOptions: { limit: PAGE_LIMIT, page } } } })
    } catch (error) { }
  }, [findAllNdcCodes, page])

  useEffect(() => {
    fetchAllNdcCodes()
  }, [fetchAllNdcCodes])


  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant='h3'>{NDC_TEXT}</Typography>
            <Button
              variant='contained' color='primary'
              startIcon={<Box width={20}><AddWhiteIcon /></Box>}
              onClick={addHandler}>
              {ADD_NEW_TEXT}
            </Button>
          </Box>
          <Box className={classes.mainTableContainer}>
            <Grid container spacing={3}>
              <Grid item md={4} sm={12} xs={12}>
                <Search search={search} text={searchQuery} />
              </Grid>
            </Grid>

            <Box className="table-overflow" mt={4}>
              <Table aria-label="customized table" className={classes.table}>
                <TableHead>
                  <TableRow>
                    {renderTh(CODE)}
                    {renderTh(DESCRIPTION)}
                    {renderTh(ACTIONS)}
                  </TableRow>
                </TableHead>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <TableLoader numberOfRows={EIGHT_PAGE_LIMIT} numberOfColumns={3} />
                    </TableCell>
                  </TableRow>
                ) : <TableBody>
                  {data?.map((icdCode) => {
                    const { id, code, description } = icdCode ?? {}
                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Typography>{code ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{description ?? DASHES}</Typography>
                        </TableCell>
                        <TableCell scope="row">
                          <Box display='flex' alignItems='center'>

                            <Box className={`${classes.iconsBackground}`}>
                              <Button onClick={() => id && handleEdit(id)}>
                                <EditOutlinedIcon />
                              </Button>
                            </Box>

                            <Box className={`${classes.iconsBackground}`}>
                              <Button onClick={() => id && onDeleteClick(id)}>
                                <TrashOutlinedSmallIcon />
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                }
              </Table>

              {((!loading && data?.length === 0) || error) && (
                <Box display="flex" justifyContent="center" pb={12} pt={5}>
                  <NoDataFoundComponent />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <ConfirmationModal
        title={NDC_TEXT}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_NDC_CODE_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
      {isOpen && <NdcCodeForm
        id={itemId}
        open={isOpen}
        isEdit={!!itemId}
        handleClose={handleModalClose}
        dispatcher={dispatch}
        fetch={() => fetchAllNdcCodes()}
      />}

      {totalPages > 1 && !loading && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={onPageChange}
          />
        </Box>
      )}
    </Fragment>
  )
}

export default NdcTable