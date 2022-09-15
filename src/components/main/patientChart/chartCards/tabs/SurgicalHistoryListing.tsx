// packages block
import {
  Box, Button, Card, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router";
// components block
import Alert from "../../../../common/Alert";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
import TableLoader from "../../../../common/TableLoader";
import AddSurgicalHistory from "../../surgicalHistory/modals/AddSurgicalHistory";
import SurgicalHistoryModal from "../../surgicalHistory/modals/SurgicalHistoryModal";
// constants, utils, interfaces ang graphql block
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from "../../../../../assets/svgs";
import {
  ACTIONS, ADD_NEW_TEXT, DASHES, DELETE_SURGICAL_HISTORY_DESCRIPTION, EIGHT_PAGE_LIMIT, NOTES, PATIENT_PROBLEM_DELETED, PROCEDURE_TEXT, SURGERY_DATE, SURGICAL_HISTORY_TEXT
} from "../../../../../constants";
import { SurgicalHistoriesPayload, useFindAllSurgicalHistoryLazyQuery, useRemoveSurgicalHistoryMutation } from "../../../../../generated/graphql";
import { ChartComponentProps, ParamsType, SurgicalCode } from "../../../../../interfacesTypes";
import {
  Action, ActionType, chartReducer, initialState, State
} from "../../../../../reducers/chartReducer";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { useTableStyles } from "../../../../../styles/tableStyles";
import { getFormatDateString, getPageNumber, isLast, renderTh } from "../../../../../utils";

const SurgicalHistoryTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {
  const classes = useChartingStyles();
  const classesTable = useTableStyles()
  const { id } = useParams<ParamsType>()

  const [state, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const {
    isSubModalOpen, selectedItem, itemId, surgicalHistoryDeleteId, totalPages, page, isOpen,
    openDelete, patientSurgicalHistory
  } = state || {}

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen })
  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page: page })

  const [findAllSurgicalHistory, { loading, error }] = useFindAllSurgicalHistoryLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_SURGICAL_HISTORY, patientSurgicalHistory: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllSurgicalHistory } = data;

        if (findAllSurgicalHistory) {
          const { response, surgicalHistories, pagination } = findAllSurgicalHistory

          if (response) {
            const { status } = response

            if (surgicalHistories && status && status === 200) {
              dispatch({ type: ActionType.SET_PATIENT_SURGICAL_HISTORY, patientSurgicalHistory: surgicalHistories as SurgicalHistoriesPayload['surgicalHistories'] })
            }
          }

          if (pagination) {
            const { totalPages } = pagination
            typeof totalPages === 'number' && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages })
          }
        }
      }
    }
  });

  const fetchSurgicalHistory = useCallback(async () => {
    try {
      await findAllSurgicalHistory({
        variables: {
          surgicalHistoryInput: { patientId: id, paginationOptions: { page, limit: EIGHT_PAGE_LIMIT } }
        },
      })
    } catch (error) { }
  }, [findAllSurgicalHistory, id, page]);

  useEffect(() => {
    id && fetchSurgicalHistory()
  }, [fetchSurgicalHistory, id, page])

  const handleEditModalClose = () => {
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: false })
  }

  const handleEdit = (id: string, surgicalCode: SurgicalCode) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: surgicalCode })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
    dispatch({ type: ActionType.SET_IS_SUB_MODAL_OPEN, isSubModalOpen: true })
  };

  const [removeSurgicalHistory, { loading: removeSurgicalHistoryLoading }] = useRemoveSurgicalHistoryMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { removeSurgicalHistory: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(PATIENT_PROBLEM_DELETED);
          dispatch({ type: ActionType.SET_SURGICAL_HISTORY_DELETE_ID, surgicalHistoryDeleteId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!patientSurgicalHistory && (patientSurgicalHistory.length > 1 || isLast(patientSurgicalHistory.length, page))) {
            await fetchSurgicalHistory()
          } else {
            dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, patientSurgicalHistory?.length || 0) })
          }
        }
      }
    }
  });

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_SURGICAL_HISTORY_DELETE_ID, surgicalHistoryDeleteId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDelete = async () => {
    surgicalHistoryDeleteId && await removeSurgicalHistory({
      variables: { removeSurgicalHistory: { id: surgicalHistoryDeleteId } }
    })
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            <Box className={classes.cardBox}>
              <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant='h3'>{SURGICAL_HISTORY_TEXT}</Typography>

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
                      {renderTh(PROCEDURE_TEXT)}
                      {renderTh(SURGERY_DATE)}
                      {renderTh(NOTES)}
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
                    {patientSurgicalHistory?.map((patientSurgicalHistory) => {
                      const { id, code, codeType, description, notes, surgeryDate } = patientSurgicalHistory ?? {}
                      const codeInfo = {
                        code,
                        description,
                        codeType
                      } as SurgicalCode
                      return (
                        <TableRow>
                          <TableCell scope="row">
                            <Typography>{`${code} | ${description}` ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography>{getFormatDateString(surgeryDate, "MM/DD/YYYY") ?? DASHES}</Typography>
                          </TableCell>

                          <TableCell scope="row">
                            <Typography className={classes.textOverflow}>{notes}</Typography>
                          </TableCell>

                          {
                            !shouldDisableEdit && <TableCell scope="row">
                              <Box display='flex' alignItems='center'>
                                <IconButton size='small' onClick={() => id && handleEdit(id, codeInfo)}>
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

                {((!loading && patientSurgicalHistory?.length === 0) || error) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <ConfirmationModal
          title={SURGICAL_HISTORY_TEXT}
          isOpen={openDelete}
          isLoading={removeSurgicalHistoryLoading}
          description={DELETE_SURGICAL_HISTORY_DESCRIPTION}
          handleDelete={handleDelete}
          setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
        />

        {isSubModalOpen && <SurgicalHistoryModal
          item={selectedItem}
          dispatcher={dispatch}
          isEdit
          recordId={itemId}
          fetch={async () => fetchSurgicalHistory()}
          handleClose={handleEditModalClose}
          isOpen={isSubModalOpen}
        />
        }
      </Grid>

      {isOpen &&
        <AddSurgicalHistory isOpen={isOpen} handleModalClose={handleModalClose} fetch={() => fetchSurgicalHistory()} />}

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
      )}
    </>
  )
}

export default SurgicalHistoryTab;
