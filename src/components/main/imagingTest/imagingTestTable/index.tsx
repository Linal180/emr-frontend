import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Fragment, Reducer, useCallback, useEffect, useReducer } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
//components
import Alert from '../../../common/Alert';
import Search from '../../../common/Search';
import ImagingTestForm from '../imagingTestForm'
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//constants, styles, svgs
import { useTableStyles } from '../../../../styles/tableStyles';
import { getPageNumber, isLast, renderTh } from '../../../../utils';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { State, Action, ActionType, initialState, imagingTestReducer } from '../../../../reducers/imagingTestReducer';
import { FindAllImagingTestPayload, useFindAllImagingTestLazyQuery, useRemoveImagingTestMutation } from '../../../../generated/graphql';
import {
  ADD_NEW_TEXT, DASHES, DELETE_IMAGING_TEST_DESCRIPTION, EIGHT_PAGE_LIMIT, NAME, IMAGING_TEST_TEXT, PAGE_LIMIT, ACTION
} from '../../../../constants';

const ImagingTestTable: FC = (): JSX.Element => {

  const classes = useTableStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(imagingTestReducer, initialState);
  const { searchQuery, data, openDelete, isOpen, itemId, page, totalPages, delId } = state;

  const [findAllImagingTest, { loading, error }] = useFindAllImagingTestLazyQuery({
    onCompleted: (data) => {
      const { findAllImagingTest } = data || {}
      const { imagingTests, pagination, response } = findAllImagingTest || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!imagingTests?.length) {
          dispatch({ type: ActionType.SET_DATA, data: imagingTests as FindAllImagingTestPayload['imagingTests'] })
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })
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

  const [removeImagingTest, { loading: delLoading }] = useRemoveImagingTestMutation({
    onCompleted: async (resData) => {
      const { removeImagingTest: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchAllImagingTest()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, data?.length || 0) })
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
    delId && await removeImagingTest({
      variables: { removeImagingTestInput: { id: delId } }
    })
  }

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });


  const fetchAllImagingTest = useCallback(async () => {
    try {
      await findAllImagingTest({ variables: { findAllImagingTestInput: { paginationOptions: { limit: PAGE_LIMIT, page }, searchQuery } } })
    } catch (error) { }
  }, [findAllImagingTest, page, searchQuery])

  useEffect(() => {
    fetchAllImagingTest()
  }, [fetchAllImagingTest])


  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant='h3'>{IMAGING_TEST_TEXT}</Typography>
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
                    {renderTh(NAME)}
                    {renderTh(ACTION, "center")}
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
                    const { id, name } = icdCode ?? {}
                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Typography>{name ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box display='flex' alignItems='center' justifyContent='center'>
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
        title={IMAGING_TEST_TEXT}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_IMAGING_TEST_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
      {isOpen && <ImagingTestForm
        id={itemId}
        open={isOpen}
        isEdit={!!itemId}
        handleClose={handleModalClose}
        dispatcher={dispatch}
        fetch={() => fetchAllImagingTest()}
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

export default ImagingTestTable