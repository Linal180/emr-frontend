import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer } from 'react'
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
//components
import ICD10Form from '../icd10Form';
import Alert from '../../../common/Alert';
import Search from "../../../common/Search";
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//styles, constants, 
import { useTableStyles } from '../../../../styles/tableStyles';
import { IcdCodesTableProps } from '../../../../interfacesTypes';
import { getPageNumber, isLast, isSuperAdmin, renderTh } from '../../../../utils';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { icd10Reducer, Action, ActionType, State, initialState } from '../../../../reducers/icdTenReducer';
import { FindAllIcdCodesPayload, useFindAllIcdCodesLazyQuery, useRemoveIcdCodeMutation } from '../../../../generated/graphql';
import {
  ACTIONS, ADD_NEW_TEXT, CODE, DASHES, DELETE_ICD_10_DESCRIPTION, DESCRIPTION, EIGHT_PAGE_LIMIT, ICD_TEN,
  ICD_TEN_CODE, PAGE_LIMIT, PRIORITY
} from '../../../../constants';
import { AuthContext } from '../../../../context';

const IcdCodesTable: FC<IcdCodesTableProps> = (): JSX.Element => {

  const classes = useTableStyles()

  const { user } = useContext(AuthContext)

  const { roles } = user || {}
  const isSuper = isSuperAdmin(roles);


  const [state, dispatch] = useReducer<Reducer<State, Action>>(icd10Reducer, initialState);
  const { isOpen, page, data, totalPages, openDelete, delId, itemId, searchQuery, systematic } = state;

  const [fetchAllIcdCodes, { loading, error }] = useFindAllIcdCodesLazyQuery({
    onCompleted: (data) => {
      const { findAllIcdCodes } = data || {}
      const { pagination, icdCodes, response } = findAllIcdCodes || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!icdCodes?.length) {
          dispatch({ type: ActionType.SET_DATA, data: icdCodes as FindAllIcdCodesPayload['icdCodes'] })
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

  const [removeIcdCode, { loading: delLoading }] = useRemoveIcdCodeMutation({
    onCompleted: async (resData) => {
      const { removeIcdCode: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchIcdCodes()
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

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const fetchIcdCodes = useCallback(async (pageNo?: number) => {
    try {
      await fetchAllIcdCodes({
        variables: {
          findAllIcdCodesInput: {
            paginationOptions: { limit: PAGE_LIMIT, page: pageNo || page },
            searchQuery
          }
        }
      })
    } catch (error) { }
  }, [fetchAllIcdCodes, page, searchQuery])

  const fetchData = () => {
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
    fetchIcdCodes(1)
  }

  useEffect(() => {
    fetchIcdCodes()
  }, [fetchIcdCodes]);

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DEL_ID, delId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDelete = async () => {
    delId && await removeIcdCode({
      variables: { removeIcdCodeInput: { id: delId } }
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
            <Typography variant='h3'>{ICD_TEN}</Typography>

            {
              <Button
                variant='contained' color='primary'
                startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                onClick={addHandler}>
                {ADD_NEW_TEXT}
              </Button>}
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
                    const { id, code, description, systematic, priority } = icdCode ?? {}

                    return (
                      <TableRow>
                        <TableCell scope="row">
                          <Typography>{code || DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{description || DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{priority ?? DASHES}</Typography>
                        </TableCell>

                        {<TableCell scope="row">
                          <Box display='flex' alignItems='center'>

                            <Box className={`${classes.iconsBackground} ${!isSuper ? 'disable-icon' : ''}`}>
                              <Button onClick={() => id && handleEdit(id, systematic as boolean)}>
                                <EditOutlinedIcon />
                              </Button>
                            </Box>

                            <Box className={`${classes.iconsBackground} ${(systematic && !isSuper) ? 'disable-icon' : ''}`}>
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
        title={ICD_TEN_CODE}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_ICD_10_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />

      {isOpen && <ICD10Form
        id={itemId}
        open={isOpen}
        isEdit={!!itemId}
        handleClose={handleModalClose}
        fetch={() => fetchData()}
        dispatcher={dispatch}
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

export default IcdCodesTable