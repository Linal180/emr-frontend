import { Pagination } from '@material-ui/lab';
import { ChangeEvent, FC, Fragment, Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import { Box, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
//components
import RoomForm from '../roomForm'
import Alert from '../../../common/Alert';
import Search from '../../../common/Search';
import TableLoader from '../../../common/TableLoader';
import ConfirmationModal from '../../../common/ConfirmationModal';
import NoDataFoundComponent from '../../../common/NoDataFoundComponent';
//constants, styles, svgs
import { AuthContext } from '../../../../context';
import { getPageNumber, isLast, isPracticeAdmin, isSuperAdmin, renderTh } from '../../../../utils';
import { useTableStyles } from '../../../../styles/tableStyles';
import { AddWhiteIcon, EditOutlinedIcon, TrashOutlinedSmallIcon } from '../../../../assets/svgs';
import { State, Action, ActionType, initialState, roomReducer } from '../../../../reducers/roomReducer';
import { Room, useFindAllRoomLazyQuery, useRemoveRoomMutation } from '../../../../generated/graphql';
import {
  ACTIONS, ADD_NEW_TEXT, DASHES, DELETE_ROOM_DESCRIPTION, EIGHT_PAGE_LIMIT, ROOM_TEXT, NAME,
  PAGE_LIMIT, FACILITY, NUMBER_TEXT
} from '../../../../constants';

const RoomTable: FC = (): JSX.Element => {
  const { user } = useContext(AuthContext)

  const classes = useTableStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(roomReducer, initialState);
  const { searchQuery, data, openDelete, isOpen, itemId, page, totalPages, delId } = state;
  const { roles, facility } = user || {};


  const isSuper = isSuperAdmin(roles);
  const isPracticeUser = isPracticeAdmin(roles);

  const [findAllRooms, { loading, error }] = useFindAllRoomLazyQuery({
    onCompleted: (data) => {
      const { findAllRoom } = data || {}
      const { rooms, pagination, response } = findAllRoom || {}
      const { status } = response || {}
      if (status === 200) {
        const { totalPages } = pagination || {}
        if (!!rooms?.length) {
          dispatch({ type: ActionType.SET_DATA, data: rooms as Room[] })
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

  const [removeRoom, { loading: delLoading }] = useRemoveRoomMutation({
    onCompleted: async (resData) => {
      const { removeRoom: { response } } = resData;

      if (response) {
        const { status, message } = response

        if (status && status === 200) {
          message && Alert.success(message);
          dispatch({ type: ActionType.SET_DEL_ID, delId: '' })
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })

          if (!!data && (data.length > 1 || isLast(data?.length, page))) {
            await fetchAllRooms()
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
    delId && await removeRoom({
      variables: { removeRoomInput: { id: delId } }
    })
  }

  const handleModalClose = () => dispatch({ type: ActionType.SET_IS_OPEN, isOpen: !isOpen });

  const onPageChange = (_: ChangeEvent<unknown>, value: number) => dispatch({
    type: ActionType.SET_PAGE, page: value
  });


  const fetchAllRooms = useCallback(async () => {
    try {

      const inputs = isSuper ? {} : isPracticeUser ? { practiceId: facility?.practiceId } : { practiceId: facility?.practiceId, facilityId: facility?.id }

      await findAllRooms({
        variables: {
          findAllRoomInput:
            { paginationOptions: { limit: PAGE_LIMIT, page }, searchString: searchQuery, ...inputs }
        }
      })
    } catch (error) { }
  }, [facility, findAllRooms, isPracticeUser, isSuper, page, searchQuery])

  useEffect(() => {
    fetchAllRooms()
  }, [fetchAllRooms])


  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant='h3'>{ROOM_TEXT}</Typography>
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
                    {renderTh(NUMBER_TEXT)}
                    {renderTh(FACILITY)}
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
                  {data?.map((room, index) => {
                    const { id, name, number, facility } = room ?? {}
                    const { id: facilityId, name: facilityName } = facility || {}
                    return (
                      <TableRow key={`${id}-${facilityId}-${index}`}>
                        <TableCell scope="row">
                          <Typography>{name ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{number ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Typography>{facilityName ?? DASHES}</Typography>
                        </TableCell>

                        <TableCell scope="row">
                          <Box display='flex' alignItems='center'>

                            <Box className={`${classes.iconsBackground} `}>
                              <Button onClick={() => id && handleEdit(id)}>
                                <EditOutlinedIcon />
                              </Button>
                            </Box>

                            <Box className={`${classes.iconsBackground} `}>
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
        title={ROOM_TEXT}
        isOpen={openDelete}
        isLoading={delLoading}
        description={DELETE_ROOM_DESCRIPTION}
        handleDelete={handleDelete}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
      {isOpen && <RoomForm
        id={itemId}
        open={isOpen}
        isEdit={!!itemId}
        handleClose={handleModalClose}
        dispatcher={dispatch}
        fetch={() => fetchAllRooms()}
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

export default RoomTable