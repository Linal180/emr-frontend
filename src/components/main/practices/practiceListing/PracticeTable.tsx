// packages block
import { FC, ChangeEvent, Reducer, useEffect, useReducer, useContext } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { Box, Table, TableBody, TableHead, TableRow, TableCell } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Search from "../../../common/Search";
import TableLoader from "../../../common/TableLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { ListContext } from "../../../../context";
import { useTableStyles } from "../../../../styles/tableStyles";
import { TrashNewIcon, EditNewIcon } from '../../../../assets/svgs';
import { formatPhone, getFormattedDate, getPageNumber, renderTh } from "../../../../utils";
import {
  practiceReducer, Action, initialState, State, ActionType
} from "../../../../reducers/practiceReducer";
import {
  PracticesPayload, useFindAllPracticesLazyQuery, useRemovePracticeMutation
} from "../../../../generated/graphql";
import {
  ACTION, PHONE, NAME, PRACTICE_MANAGEMENT_ROUTE, DELETE_PRACTICE_DESCRIPTION, PRACTICE, PAGE_LIMIT,
  CANT_DELETE_PRACTICE, DATE_ADDED,
} from "../../../../constants";

const PracticeTable: FC = (): JSX.Element => {
  const classes = useTableStyles();
  const { setFacilityList, fetchAllFacilityList, setRoleList } = useContext(ListContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(practiceReducer, initialState)
  const { searchQuery, page, totalPages, openDelete, practices, deletePracticeId } = state

  const [findAllPractices, { loading, error }] = useFindAllPracticesLazyQuery({
    variables: {
      practiceInput: {
        practiceName: searchQuery,
        paginationOptions: {
          page, limit: PAGE_LIMIT
        }
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PRACTICES, practices: [] });
      dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPractices } = data;

        if (findAllPractices) {
          const { pagination, practices } = findAllPractices

          practices && dispatch({
            type: ActionType.SET_PRACTICES,
            practices: practices as PracticesPayload['practices']
          })

          if (pagination) {
            const { totalPages } = pagination
            totalPages && dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages })
          }
        }
      } else {
        dispatch({ type: ActionType.SET_PRACTICES, practices: [] });
      }
    }
  });

  const [removePractice, { loading: deletePracticeLoading }] = useRemovePracticeMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      Alert.error(CANT_DELETE_PRACTICE)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      try {
        if (data) {
          const { removePractice: { response } } = data

          if (response) {
            const { message } = response
            message && Alert.success(message);
            dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
            setFacilityList([])
            setRoleList([])
            fetchAllFacilityList()

            if(practices && practices.length > 1){
              await findAllPractices();
            } else {
              dispatch({ type: ActionType.SET_PAGE, page: getPageNumber(page, practices?.length || 0)})
            }
          }
        }
      } catch (error) { }
    }
  });

  useEffect(() => { findAllPractices() }, [page, findAllPractices]);
  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({ type: ActionType.SET_PAGE, page })

  const onDelete = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_DELETE_PRACTICE_ID, deletePracticeId: id })
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  const handleDeletePractice = async () => {
    deletePracticeId &&
      await removePractice({
        variables: { removePractice: { id: deletePracticeId } }
      })
  };

  const search = (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })
    dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: 0 })
    dispatch({ type: ActionType.SET_PAGE, page: 1 })
  }

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mb={2} maxWidth={450}>
          <Search search={search} />
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(NAME)}
                {renderTh(PHONE)}
                {renderTh(DATE_ADDED)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={4} />
                  </TableCell>
                </TableRow>) : (
                practices?.map(practice => {
                  const { id, name, phone, createdAt } = practice || {};

                  return (
                    <TableRow key={id}>
                      <TableCell scope="row">{name}</TableCell>
                      <TableCell scope="row">{formatPhone(phone || '')}</TableCell>
                      <TableCell scope="row">{getFormattedDate(createdAt || '')}</TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                          <Link to={`${PRACTICE_MANAGEMENT_ROUTE}/${id}`}>
                            <Box className={classes.iconsBackground}>
                              <EditNewIcon />
                            </Box>
                          </Link>

                          <Box className={classes.iconsBackground} onClick={() => onDelete(id || '')}>
                            <TrashNewIcon />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {((!loading && practices?.length === 0) || error) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}

          <ConfirmationModal
            title={PRACTICE}
            isOpen={openDelete}
            isLoading={deletePracticeLoading}
            handleDelete={handleDeletePractice}
            description={DELETE_PRACTICE_DESCRIPTION}
            setOpen={(open: boolean) =>
              dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })
            }
          />
        </Box>
      </Box>

      {totalPages > 1 && (
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
  );
};

export default PracticeTable;
