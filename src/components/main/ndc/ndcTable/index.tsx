import { FC, Fragment, Reducer, useReducer } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
//components
import Search from '../../../common/Search';
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//constants, styles, svgs
import { renderTh } from '../../../../utils';
import { useTableStyles } from '../../../../styles/tableStyles';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { State, Action, ActionType, initialState, ndcCodeReducer } from '../../../../reducers/ndcCodeReducer';
import { ACTIONS, ADD_NEW_TEXT, CODE, DASHES, DELETE_NDC_CODE_DESCRIPTION, DESCRIPTION, EIGHT_PAGE_LIMIT, NDC_TEXT } from '../../../../constants';


const NdcTable: FC = (): JSX.Element => {

  const classes = useTableStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(ndcCodeReducer, initialState);
  const { searchQuery, data, openDelete } = state

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
    // delId && await removeCptCode({
    //   variables: { removeCPTCodeInput: { id: delId } }
    // })
  }

  const loading = false;
  const error = ""
  const delLoading = false

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
        title={NDC_TEXT}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_NDC_CODE_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />

    </Fragment>
  )
}

export default NdcTable