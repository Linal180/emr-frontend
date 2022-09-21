import { FC, Reducer, useReducer } from 'react'
import { Box, Button, Card, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'
//components
import TableLoader from '../../../../common/TableLoader'
import AddVaccine from '../modals/AddVaccine'
import NoDataFoundComponent from '../../../../common/NoDataFoundComponent'
//styles, constants, 
import { renderTh } from '../../../../../utils';
import { AddWhiteIcon } from '../../../../../assets/svgs';
import { useTableStyles } from '../../../../../styles/tableStyles';
import { VaccinesTableProps } from '../../../../../interfacesTypes';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { vaccinesReducer, Action, ActionType, State, initialState } from '../../../../../reducers/vaccinesReducer';
import {
  ACTIONS, ADD_NEW_TEXT, ADMINISTRATION_DATE, AMOUNT_UNIT_TEXT, DATE_ON_VIS, EIGHT_PAGE_LIMIT, EXPIRY_DATE,
  LOT_NO_TEXT, MANUFACTURER_TEXT, NAME, NDC_TEXT, ROUTE, SITE_TEXT, VACCINE_TEXT, VIS_GIVEN_TEXT
} from '../../../../../constants'

const VaccinesTable: FC<VaccinesTableProps> = (props): JSX.Element => {
  const { shouldDisableEdit } = props || {}

  const classes = useChartingStyles();
  const classesTable = useTableStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(vaccinesReducer, initialState);
  const { isOpen } = state;

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const fetchVaccines = () => {

  }

  const loading = false;

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
                    {/* {patientProblems?.map((patientProblem) => {
                      const { problemSeverity, ICDCode, problemType, note, problemStartDate, id } = patientProblem ?? {}
                      return (
                        <TableRow>
                          <TableCell scope="row">
                            <Typography>{ICDCode?.code ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{ICDCode?.description ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>
                              {problemStartDate ? getFormatDateString(problemStartDate, 'MM-DD-YYYY') : ''}
                            </Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox} bgcolor={getProblemTypeColor(problemType || '')}>
                              {problemType}
                            </Box>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography className={classes.textOverflow}>{note}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Box className={classes.activeBox}
                              bgcolor={problemSeverity && getProblemSeverityColor(problemSeverity)}
                            >
                              {problemSeverity}
                            </Box>
                          </TableCell>
                          {
                            !shouldDisableEdit && <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton size='small' onClick={() => id && ICDCode && handleEdit(id, ICDCode)}>
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
                    })} */}
                  </TableBody>
                  }
                </Table>

                {/* {((!loading && patientProblems?.length === 0) || error) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )} */}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* <ConfirmationModal
          title={PROBLEM_TEXT}
          isOpen={openDelete}
          isLoading={removeProblemLoading}
          description={DELETE_PROBLEM_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
        />

        {isSubModalOpen && <ProblemModal
          item={selectedItem}
          dispatcher={dispatch}
          isEdit
          recordId={itemId}
          fetch={async () => fetchProblems()}
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
            onChange={handleChange}
          />
        </Box>
      )} */}
      {isOpen &&
        <AddVaccine isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchVaccines()} />}
    </>
  )
}

export default VaccinesTable