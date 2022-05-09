// packages block
import { Reducer, useReducer, MouseEvent, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Box, Menu, Typography } from "@material-ui/core";
// components block
import CardLayout from "../../common/CardLayout";
import ProblemModal from "../modals/ProblemModal";
import FilterSearch from "../../common/FilterSearch";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// interfaces/types block
import { GREY_SEVEN } from "../../../../../theme";
import { ParamsType } from "../../../../../interfacesTypes";
import { usePatientChartingStyles } from "../../../../../styles/patientCharting";
import { formatValue, getAppointmentDate, getSeverityColor } from "../../../../../utils";
import { CARD_LAYOUT_MODAL, LIST_PAGE_LIMIT, NO_RECORDS, PROBLEMS_TEXT } from "../../../../../constants";
import {
  chartReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/chartReducer";
import {
   useFindAllPatientProblemsLazyQuery, useSearchIcdCodesLazyQuery, IcdCodesPayload,
  PatientProblemsPayload, IcdCodes, ProblemSeverity,
} from "../../../../../generated/graphql";

const ProblemList = (): JSX.Element => {
  const classes = usePatientChartingStyles()
  const { id } = useParams<ParamsType>()
  const [patientProblems, setPatientProblems] = useState<PatientProblemsPayload['patientProblems']>([])
  const [{ isSearchOpen, selectedItem, searchedData, itemId, isFormOpen }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isSearchOpen);
  const isFormMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const [findAllPatientProblems, { loading }] = useFindAllPatientProblemsLazyQuery({
    variables: {
      patientProblemInput: { patientId: id, paginationOptions: { page: 1, limit: LIST_PAGE_LIMIT } }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientProblems([])
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientProblem } = data;

        if (findAllPatientProblem) {
          const { response, patientProblems } = findAllPatientProblem

          if (response) {
            const { status } = response

            if (patientProblems && status && status === 200) {
              setPatientProblems(patientProblems as PatientProblemsPayload['patientProblems'])
            }
          }
        }
      }
    }
  });

  const [searchIcdCodes, { loading: findAllergiesLoading }] = useSearchIcdCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { searchIcdCodes } = data;

        if (searchIcdCodes) {
          const { icdCodes } = searchIcdCodes

          icdCodes && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: icdCodes as IcdCodesPayload['icdCodes']
          })
        }
      }
    }
  });

  const fetchProblems = useCallback(async () => {
    try {
      await findAllPatientProblems()
    } catch (error) { }
  }, [findAllPatientProblems]);

  useEffect(() => {
    id && fetchProblems()
  }, [fetchProblems, id])

  const handleMenuOpen = ({ currentTarget }: MouseEvent<HTMLElement>) => dispatch({
    type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: currentTarget
  });

  const handleMenuClose = () => dispatch({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null });

  const handleEdit = ({ currentTarget }: MouseEvent<HTMLElement>, id: string, icdCode: IcdCodes) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: icdCode })
    dispatch({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: currentTarget })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
  };

  const handleSearch = async (query: string) => {
    try {
      query && await searchIcdCodes({
        variables: {
          searchIcdCodesInput: { searchTerm: query }
        }
      })
    } catch (error) { }
  }

  return (
    <CardLayout openSearch={isSearchOpen} cardId={PROBLEMS_TEXT} cardTitle={PROBLEMS_TEXT}
      hasAdd
      modal={CARD_LAYOUT_MODAL.ICDCodes}
      dispatcher={dispatch}
      isMenuOpen={isMenuOpen}
      searchData={searchedData}
      searchComponent={FilterSearch}
      searchLoading={findAllergiesLoading}
      handleMenuClose={() => handleMenuClose()}
      fetch={async () => await fetchProblems()}
      onSearch={(type, query) => handleSearch(query)}
      onClickAddIcon={(event: MouseEvent<HTMLElement>) => handleMenuOpen(event)}
    >
      {loading ?
        <ViewDataLoader columns={12} rows={3} />
        : <Box mb={2}>
          {!!patientProblems && patientProblems.length > 0 ? (
            patientProblems.map((item) => {
              const { id, problemSeverity, ICDCode, problemStartDate } = item || {}
              const { code } = ICDCode || {}

              return (
                <Box pb={2} key={id}>
                  <Box display="flex" justifyContent="space-between">
                    <Box onClick={(event) => id && ICDCode && handleEdit(event, id, ICDCode)}>
                      <Typography className={classes.cardContentHeading} key={id}>{code}</Typography>
                    </Box>

                    {problemStartDate &&
                      <Typography className={classes.cardContentDate}>{getAppointmentDate(problemStartDate)}</Typography>
                    }
                  </Box>

                  <Box mr={2} color={getSeverityColor(problemSeverity as ProblemSeverity)}>
                    <Typography>{formatValue(problemSeverity || '')}</Typography>
                  </Box>
                </Box>
              )
            })
          ) : (<Box color={GREY_SEVEN}><Typography variant="h6">{NO_RECORDS}</Typography></Box>)}
        </Box>}

      <Menu
        getContentAnchorEl={null}
        anchorEl={isFormOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        id={cardId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isFormMenuOpen}
        onClose={handleMenuClose}
        className={classes.dropdown}
      >
        {itemId && selectedItem && selectedItem.__typename === CARD_LAYOUT_MODAL.ICDCodes &&
          <ProblemModal item={selectedItem} dispatcher={dispatch} isEdit recordId={itemId} fetch={async () => fetchProblems()} />
        }
      </Menu>
    </CardLayout>
  );
}

export default ProblemList;
