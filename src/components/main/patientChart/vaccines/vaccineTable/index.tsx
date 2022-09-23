import { useParams } from 'react-router';
import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from 'react'
import { Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
//components
import AddVaccine from '../modals/AddVaccine';
import VaccineModal from '../modals/VaccineModal';
import TableLoader from '../../../../common/TableLoader';
import ConfirmationModal from '../../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent';
//styles, constants, 
import { formatValue, getPageNumber, isLast, renderTh } from '../../../../../utils';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../../assets/svgs';
import { useTableStyles } from '../../../../../styles/tableStyles';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { ParamsType, VaccinesTableProps } from '../../../../../interfacesTypes';
import { Cvx, FindAllVaccinesPayload, useFindAllVaccinesLazyQuery, useRemoveVaccineMutation } from '../../../../../generated/graphql';
import { vaccinesReducer, Action, ActionType, State, initialState } from '../../../../../reducers/vaccinesReducer';
import {
  ACTIONS, ADD_NEW_TEXT, ADMINISTER_BY, ADMINISTRATION_DATE, AMOUNT_UNIT_TEXT, DASHES, DATE_ON_VIS, DELETE_VACCINE_DESCRIPTION,
  EIGHT_PAGE_LIMIT, EXPIRY_DATE, LOT_NO_TEXT, MANUFACTURER_TEXT, NAME, NDC_TEXT, PAGE_LIMIT, ROUTE, SITE_TEXT,
  VACCINE_TEXT, VIS_GIVEN_TEXT
} from '../../../../../constants'
import Alert from '../../../../common/Alert';

const VaccinesTable: FC<VaccinesTableProps> = (props): JSX.Element => {
  const { shouldDisableEdit } = props || {}

  const classes = useChartingStyles();
  const classesTable = useTableStyles()
  const { id: patientId } = useParams<ParamsType>()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(vaccinesReducer, initialState);
  const { isOpen, page, data, totalPages, openDelete, delId, isSubModalOpen, itemId, selectedItem } = state;

  const [findAllVaccines, { loading, error }] = useFindAllVaccinesLazyQuery({
    onCompleted: (data) => {
      const { findAllVaccines } = data || {}
      const { pagination, vaccines, response } = findAllVaccines || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!vaccines?.length) {
          dispatch({ type: ActionType.SET_DATA, data: vaccines as FindAllVaccinesPayload['vaccines'] })
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

  const [removeVaccine, { loading: delLoading }] = useRemoveVaccineMutation({
    onCompleted: async (resData) => {
      const { removeVaccine: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchVaccines()
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

  const fetchVaccines = useCallback(async () => {
    try {
      await findAllVaccines({ variables: { findAllVaccinesInput: { paginationOptions: { limit: PAGE_LIMIT, page: page }, patientId } } })
    } catch (error) { }
  }, [findAllVaccines, patientId, page])

  useEffect(() => {
    patientId && fetchVaccines()
  }, [fetchVaccines, patientId, page]);

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DEL_ID, delId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDelete = async () => {
    delId && await removeVaccine({
      variables: { removeVaccineInput: { id: delId } }
    })
  }

  const handleEditModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const handleEdit = (id: string, mvxCode?: Cvx) => {
    mvxCode && dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: mvxCode })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box className={classes.cardBox}>
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h3'>{VACCINE_TEXT}</Typography>

                {!shouldDisableEdit &&
                  <Button
                    variant='contained' color='primary'
                    startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                    onClick={() => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: true })}>
                    {ADD_NEW_TEXT}
                  </Button>}
              </Box>

              <Box className={classes.tableBox}>
                <Table aria-label="customized table" className={classesTable.table}>
                  <TableHead>
                    <TableRow>
                      {renderTh(NAME)}
                      {renderTh(ADMINISTRATION_DATE)}
                      {renderTh(ADMINISTER_BY)}
                      {renderTh(AMOUNT_UNIT_TEXT)}
                      {renderTh(ROUTE)}
                      {renderTh(SITE_TEXT)}
                      {renderTh(NDC_TEXT)}
                      {renderTh(MANUFACTURER_TEXT)}
                      {renderTh(EXPIRY_DATE)}
                      {renderTh(VIS_GIVEN_TEXT)}
                      {renderTh(DATE_ON_VIS)}
                      {renderTh(LOT_NO_TEXT)}
                      {!shouldDisableEdit && renderTh(ACTIONS)}
                    </TableRow>
                  </TableHead>

                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <TableLoader numberOfRows={EIGHT_PAGE_LIMIT} numberOfColumns={5} />
                      </TableCell>
                    </TableRow>
                  ) : <TableBody>
                    {data?.map((vaccine) => {
                      const { id, cvxId, administrationDate, amount, units, route, site, ndcId, mvxId,
                        expiryDate, visGiven, visDate, lotNo, cvx, ndc, mvx, administerBy } = vaccine ?? {}
                      const { name } = cvx || {}
                      const { ndcCode } = ndc || {}
                      const { mvxCode } = mvx || {}
                      return (
                        <TableRow>
                          <TableCell scope="row">
                            <Typography>{cvxId ? name ?? DASHES : DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{administrationDate ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{administerBy ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>
                              {amount ? units ? `${amount} (${formatValue(units)})` : amount : DASHES}
                            </Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{route ? formatValue(route) : DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{site ? formatValue(site) : DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{ndcId ? ndcCode ?? DASHES : DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{mvxId ? mvxCode ?? DASHES : DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{expiryDate ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{visGiven ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{visDate ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{lotNo ?? DASHES}</Typography>
                          </TableCell>

                          {
                            !shouldDisableEdit && <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton size='small' onClick={() => id && handleEdit(id, cvx || undefined)}>
                                  <EditOutlinedIcon />
                                </IconButton>

                                <IconButton size='small' onClick={() => id && onDeleteClick(id)}>
                                  <TrashOutlinedSmallIcon />
                                </IconButton>
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
          </Card>
        </Grid>
      </Grid>

      <ConfirmationModal
        title={VACCINE_TEXT}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_VACCINE_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />

      {isSubModalOpen && <VaccineModal
        item={selectedItem}
        dispatcher={dispatch}
        isEdit
        recordId={itemId}
        fetch={async () => fetchVaccines()}
        handleClose={handleEditModalClose}
        isOpen={isSubModalOpen}
      />
      }

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
      {isOpen &&
        <AddVaccine isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchVaccines()} />}
    </>
  )
}

export default VaccinesTable