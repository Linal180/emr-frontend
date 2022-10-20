import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from 'react'
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
//components
import CptCodeForm from '../cptCodeForm';
import Alert from '../../../common/Alert';
import Search from "../../../common/Search";
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//styles, constants, 
import { useTableStyles } from '../../../../styles/tableStyles';
import { IcdCodesTableProps } from '../../../../interfacesTypes';
import { getPageNumber, isLast, renderTh } from '../../../../utils';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { cptCodeReducer, Action, ActionType, State, initialState } from '../../../../reducers/cptCodeReducer';
import { AllCptCodePayload, useFindAllCptCodesLazyQuery, useRemoveCptCodeMutation } from '../../../../generated/graphql';
import {
  ACTIONS, ADD_NEW_TEXT, CODE, CPT_CODE, CPT_CODES, DASHES, DELETE_CPT_CODE_DESCRIPTION, DESCRIPTION, EIGHT_PAGE_LIMIT,
  PAGE_LIMIT, PRIORITY
} from '../../../../constants';

const CptCodeTable: FC<IcdCodesTableProps> = (): JSX.Element => {

  const classes = useTableStyles()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(cptCodeReducer, initialState);
  const { isOpen, page, data, totalPages, openDelete, delId, itemId, searchQuery, systematic } = state;

  const [fetchAllIcdCodes, { loading, error }] = useFindAllCptCodesLazyQuery({
    onCompleted: (data) => {
      const { findAllCptCodes } = data || {}
      const { pagination, cptCodes, response } = findAllCptCodes || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!cptCodes?.length) {
          dispatch({ type: ActionType.SET_DATA, data: cptCodes as AllCptCodePayload['cptCodes'] })
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

  const [removeCptCode, { loading: delLoading }] = useRemoveCptCodeMutation({
    onCompleted: async (resData) => {
      const { removeCPTCode: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchIcdCodes()
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

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const fetchIcdCodes = useCallback(async () => {
    try {
      await fetchAllIcdCodes({
        variables: {
          findAllCptCodesInput: {
            paginationOptions: { limit: PAGE_LIMIT, page: page },
            code: searchQuery
          }
        }
      })
    } catch (error) { }
  }, [fetchAllIcdCodes, page, searchQuery])

  useEffect(() => {
    fetchIcdCodes()
  }, [fetchIcdCodes, page]);

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DEL_ID, delId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDelete = async () => {
    delId && await removeCptCode({
      variables: { removeCPTCodeInput: { id: delId } }
    })
  }

  const handleEdit = (id: string, systematic: boolean) => {
    dispatch({ type: ActionType.SET_SYSTEMATIC, systematic })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  const addHandler = () => {
    dispatch({ type: ActionType.SET_SYSTEMATIC, systematic: false })
    dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant='h3'>{CPT_CODES}</Typography>

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
                    {renderTh(PRIORITY)}
                    {renderTh(ACTIONS)}
                  </TableRow>
                </TableHead>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <TableLoader numberOfRows={EIGHT_PAGE_LIMIT} numberOfColumns={5} />
                    </TableCell>
                  </TableRow>
                ) : <TableBody>
                  {data?.map((icdCode) => {
                    const { id, code, shortDescription, systematic, priority } = icdCode ?? {}
                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Typography>{code ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{shortDescription ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{priority ?? DASHES}</Typography>
                        </TableCell>


                        {<TableCell scope="row">
                          <Box display='flex' alignItems='center'>

                            <Box className={`${classes.iconsBackground}`}>
                              <Button onClick={() => id && handleEdit(id, systematic as boolean)}>
                                <EditOutlinedIcon />
                              </Button>
                            </Box>

                            <Box className={`${classes.iconsBackground} ${systematic ? 'disable-icon' : ''}`}>
                              <Button onClick={() => id && onDeleteClick(id)}>
                                <TrashOutlinedSmallIcon />
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                        }
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
        title={CPT_CODE}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_CPT_CODE_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />

      {isOpen && <CptCodeForm
        id={itemId}
        open={isOpen}
        isEdit={!!itemId}
        handleClose={handleModalClose}
        dispatcher={dispatch}
        fetch={() => fetchIcdCodes()}
        systematic={systematic}
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
    </>
  )
}

export default CptCodeTable