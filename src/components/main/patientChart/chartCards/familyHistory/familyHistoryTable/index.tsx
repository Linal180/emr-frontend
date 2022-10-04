import { useParams } from "react-router";
import { Pagination } from "@material-ui/lab";
import { Edit as EditIcon } from "@material-ui/icons";
import { ChangeEvent, FC, Fragment, Reducer, useCallback, useEffect, useReducer } from "react";
import { Box, Button, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
//components
import Alert from '../../../../../common/Alert';
import FamilyHistoryForm from "../familyHistoryForm";
import TableLoader from "../../../../../common/TableLoader";
import ConfirmationModal from "../../../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../../../common/NoDataFoundComponent";
//svgs
import { formatValue, getPageNumber, isLast, renderTh } from "../../../../../../utils";
import { useTableStyles } from "../../../../../../styles/tableStyles";
import { useChartingStyles } from '../../../../../../styles/chartingStyles';
import { AddWhiteIcon, TrashNewIcon } from "../../../../../../assets/svgs";
import { FamilyHistoryProps, ParamsType } from "../../../../../../interfacesTypes"
import { familyHistoryReducer, Action, ActionType, State, initialState } from "../../../../../../reducers/familyHistoryReducer";
import { FamilyHistoriesPayload, useFindAllFamilyHistoryLazyQuery, useRemoveFamilyHistoryMutation } from "../../../../../../generated/graphql";
import {
  ACTIONS, ADD_NEW_TEXT, DELETE_FAMILY_DESCRIPTION, DIED_TEXT, FAMILY_HISTORY_TEXT, NAME, NEXT, NOTES, ONSET_AGE_TEXT,
  PAGE_LIMIT, RELATIVE
} from "../../../../../../constants";


const FamilyHistoryTable: FC<FamilyHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const { id: patientId } = useParams<ParamsType>()
  const classes = useTableStyles();
  const chartingClasses = useChartingStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(familyHistoryReducer, initialState);
  const { page, familyHistories, openAdd, totalPages, openDelete, delFamilyId, editFamilyId } = state || {}

  const [fetchAllFamilyHistory, { loading, error }] = useFindAllFamilyHistoryLazyQuery({
    onCompleted: (data) => {
      const { findAllFamilyHistory } = data || {}
      const { familyHistories, response, pagination } = findAllFamilyHistory || {}
      const { status } = response || {};
      if (status === 200) {
        const { totalPages } = pagination || {}
        totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages });
        if (!!familyHistories?.length) {
          dispatch({ type: ActionType.SET_FAMILY_HISTORIES, familyHistories: familyHistories as FamilyHistoriesPayload['familyHistories'] })
        } else {
          dispatch({ type: ActionType.SET_FAMILY_HISTORIES, familyHistories: [] });
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
        }

      }
    },
    onError: () => {
      dispatch({ type: ActionType.SET_FAMILY_HISTORIES, familyHistories: [] });
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 });
    }
  })

  const [removeFamilyHistory, { loading: removeLoading }] = useRemoveFamilyHistoryMutation({
    onCompleted: async (data) => {
      const { removeFamilyHistory } = data || {}
      const { familyHistory, response } = removeFamilyHistory || {}
      const { status, message } = response || {};
      const { id } = familyHistory || {}
      if (status === 200 && id) {
        dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
        message && Alert.success(message)
        if (!!familyHistories && ((familyHistories?.length || 0) > 1 || isLast(familyHistories?.length || 0, page))) {
          fetchFamilyHistory()
        } else {
          dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, familyHistories?.length || 0) })
        }
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const handleDelete = (id: string) => {
    dispatch({ type: ActionType.SET_DEL_FAMILY_ID, delFamilyId: id });
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true });
  }

  const fetchFamilyHistory = useCallback(async () => {
    try {
      const paginationOptions = { page, limit: PAGE_LIMIT }
      const inputs = { paginationOptions, patientId }
      await fetchAllFamilyHistory({ variables: { findAllFamilyHistoryInput: inputs } })
    } catch (error) { }
  }, [page, patientId, fetchAllFamilyHistory])

  useEffect(() => {
    patientId && fetchFamilyHistory()
  }, [patientId, fetchFamilyHistory])

  const handleClose = (open: boolean) => {
    dispatch({ type: ActionType.SET_EDIT_FAMILY_ID, editFamilyId: '' })
    dispatch({ type: ActionType.SET_OPEN_ADD, openAdd: open })
  }

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });

  const handleCancelAppointment = async () => {
    delFamilyId &&
      await removeFamilyHistory({
        variables: { removeFamilyHistoryInput: { id: delFamilyId } }
      })
  };

  const editHandler = (id: string) => {
    dispatch({ type: ActionType.SET_EDIT_FAMILY_ID, editFamilyId: id });
    dispatch({ type: ActionType.SET_OPEN_ADD, openAdd: true });
  }

  return (<Fragment>
    <Card>
      <Box className={chartingClasses.cardBox}>
        <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant='h3'>{FAMILY_HISTORY_TEXT}</Typography>

          <Box display='flex' alignItems='center'>
            {!shouldDisableEdit &&
              <Button
                variant='contained' color='primary'
                startIcon={<Box width={20}><AddWhiteIcon /></Box>}
                onClick={() => dispatch({ type: ActionType.SET_OPEN_ADD, openAdd: !openAdd })}
              >
                {ADD_NEW_TEXT}
              </Button>}

            <Box p={1} />

            {handleStep && <Button
              variant='contained'
              color='secondary'
              size="large"
              onClick={() => handleStep(7)}
            >
              {NEXT}
            </Button>}
          </Box>
        </Box>

        <Box className={chartingClasses.tableBox}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(RELATIVE)}
                {renderTh(ONSET_AGE_TEXT)}
                {renderTh(DIED_TEXT)}
                {renderTh(NOTES)}
                {!shouldDisableEdit && renderTh(ACTIONS, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={4} numberOfColumns={4} />
                  </TableCell>
                </TableRow>
              ) : (
                familyHistories?.map((history, i) => {
                  const { id, name, familyHistoryRelatives } = history || {};

                  return (
                    <Fragment key={`${id}-${i}`}>
                      {familyHistoryRelatives?.map((family, index) => {
                        const { died, notes, onsetAge, relativeName } = family || {}
                        return (
                          <TableRow key={`${id}-${index}`}>
                            {index === 0 &&
                              <TableCell rowSpan={familyHistoryRelatives?.length}>
                                {name}
                              </TableCell>}
                            <TableCell style={{ paddingLeft: index === 0 ? 'inherited' : 10 }}>{formatValue(relativeName || '')}</TableCell>
                            <TableCell>{onsetAge}</TableCell>
                            <TableCell>{died}</TableCell>
                            <TableCell>{notes}</TableCell>
                            {index === 0 && !shouldDisableEdit &&
                              <TableCell rowSpan={familyHistoryRelatives?.length}>
                                <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                                  <Box className={classes.iconsBackground} onClick={() => editHandler(id || '')}>
                                    <EditIcon />
                                  </Box>
                                  <Box className={classes.iconsBackground} onClick={() => handleDelete(id || '')}>
                                    <TrashNewIcon />
                                  </Box>
                                </Box>
                              </TableCell>}
                          </TableRow>
                        )
                      })}
                    </Fragment>
                  )
                })
              )}
            </TableBody>
          </Table>

          {((!loading && familyHistories?.length === 0) || error) &&
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          }
        </Box>
      </Box>
    </Card>

    {totalPages > 1 && (
      <Box display="flex" justifyContent="flex-end" p={3}>
        <Pagination
          shape="rounded"
          variant="outlined"
          page={page}
          count={totalPages}
          onChange={onPageChange}
        />
      </Box>
    )}

    <ConfirmationModal
      title={FAMILY_HISTORY_TEXT}
      isOpen={openDelete}
      isLoading={removeLoading}
      description={DELETE_FAMILY_DESCRIPTION}
      handleDelete={handleCancelAppointment}
      setOpen={(open: boolean) => dispatch({
        type: ActionType.SET_OPEN_DELETE, openDelete: open
      })}
    />

    {openAdd && <FamilyHistoryForm
      isOpen={openAdd}
      id={editFamilyId}
      isEdit={!!editFamilyId}
      handleClose={handleClose}
      fetchFamilyHistory={fetchFamilyHistory}
    />}
  </Fragment>
  )
}

export default FamilyHistoryTable