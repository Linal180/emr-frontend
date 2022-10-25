import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Fragment, Reducer, useCallback, useEffect, useReducer } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
//components
import VaccineProductForm from '../vaccineProductForm'
import Alert from '../../../common/Alert';
import Search from '../../../common/Search';
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//constants, styles, svgs
import { useTableStyles } from '../../../../styles/tableStyles';
import { getPageNumber, isLast, renderTh } from '../../../../utils';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { FindAllVaccineProductsPayload, useFetchAllVaccineProductsLazyQuery, useRemoveVaccineProductMutation } from '../../../../generated/graphql';
import { ACTIONS, ADD_NEW_TEXT, CVX_TEXT, DASHES, EIGHT_PAGE_LIMIT, MVX_TEXT, VACCINE_PRODUCT_TEXT, PAGE_LIMIT, DELETE_VACCINE_PRODUCT_DESCRIPTION, NAME } from '../../../../constants';
import { State, Action, ActionType, initialState, vaccineProductReducer } from '../../../../reducers/vaccineProductReducer';

const VaccineProductTable: FC = (): JSX.Element => {

  const classes = useTableStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(vaccineProductReducer, initialState);
  const { searchQuery, data, openDelete, isOpen, itemId, page, totalPages, delId } = state;

  const [findAllVaccineProducts, { loading, error }] = useFetchAllVaccineProductsLazyQuery({
    onCompleted: (data) => {
      const { fetchAllVaccineProducts } = data || {}
      const { vaccineProducts, pagination, response } = fetchAllVaccineProducts || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!vaccineProducts?.length) {
          dispatch({ type: ActionType.SET_DATA, data: vaccineProducts as FindAllVaccineProductsPayload['vaccineProducts'] })
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

  const [removeVaccineProduct, { loading: delLoading }] = useRemoveVaccineProductMutation({
    onCompleted: async (resData) => {
      const { removeVaccineProduct: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchAllVacinesProduct()
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
    delId && await removeVaccineProduct({
      variables: { removeVaccineProductInput: { id: delId } }
    })
  }

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });


  const fetchAllVacinesProduct = useCallback(async (pageNo?: number) => {
    try {
      await findAllVaccineProducts({ variables: { fetchAllVaccineProductsInput: { paginationOptions: { limit: PAGE_LIMIT, page: pageNo || page }, searchQuery } } })
    } catch (error) { }
  }, [findAllVaccineProducts, page, searchQuery])

  const fetchData = () => {
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
    fetchAllVacinesProduct(1)
  }
  useEffect(() => {
    fetchAllVacinesProduct()
  }, [fetchAllVacinesProduct])


  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant='h3'>{VACCINE_PRODUCT_TEXT}</Typography>
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
                    {renderTh(CVX_TEXT)}
                    {renderTh(MVX_TEXT)}
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
                    const { id, name, cvx, mvx, systematic } = icdCode ?? {}
                    const { mvxCode, manufacturerName } = mvx || {}
                    const { cvxCode, name: cvxName } = cvx || {}

                    return (
                      <TableRow>

                        <TableCell scope="row">
                          <Typography>{name ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{cvxName ? `${cvxCode}: ${cvxName}` : cvxCode}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{manufacturerName ? `${mvxCode}: ${manufacturerName}` : mvxCode}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box display='flex' alignItems='center'>

                            <Box className={`${classes.iconsBackground} ${systematic ? 'disable-icon' : ''}`}>
                              <Button onClick={() => id && handleEdit(id)}>
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
        title={VACCINE_PRODUCT_TEXT}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_VACCINE_PRODUCT_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
      {isOpen && <VaccineProductForm
        id={itemId}
        open={isOpen}
        isEdit={!!itemId}
        handleClose={handleModalClose}
        dispatcher={dispatch}
        fetch={() => fetchData()}
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

export default VaccineProductTable