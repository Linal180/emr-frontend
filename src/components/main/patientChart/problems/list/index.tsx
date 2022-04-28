// packages block
import { Reducer, useReducer, MouseEvent, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Box, Menu, Typography } from "@material-ui/core";
// components block
import CardLayout from "../../common/CardLayout";
import AllergiesModal1Component from "../../common/FilterSearch";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// interfaces/types block
import { GREY_SEVEN } from "../../../../../theme";
import { ParamsType } from "../../../../../interfacesTypes";
import { usePatientChartingStyles } from "../../../../../styles/patientCharting";
import { ALLERGIES_TEXT, LIST_PAGE_LIMIT, NO_RECORDS } from "../../../../../constants";
import { formatValue, getAppointmentDate, getSeverityColor } from "../../../../../utils";
import {
  chartReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/chartReducer";
import {
  PatientAllergiesPayload, useFindAllAllergiesLazyQuery, useFindAllPatientAllergiesLazyQuery,
  AllergiesPayload, AllergyType, Allergies, AllergySeverity, PatientProblemPayload, useFindAllPatientProblemsLazyQuery, useSearchIcdCodesLazyQuery, IcdCodesPayload,
} from "../../../../../generated/graphql";

const ProblemList = (): JSX.Element => {
  const classes = usePatientChartingStyles()
  const { id } = useParams<ParamsType>()
  const [patientProblems, setPatientProblems] = useState<PatientProblemPayload['patientProblem']>([])
  const [{ isSearchOpen, selectedItem, searchedData, itemId, isFormOpen }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isSearchOpen);
  const isFormMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const [findAllPatientProblem, { loading }] = useFindAllPatientProblemsLazyQuery({
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
              setPatientProblems(patientProblems as PatientProblemPayload['patientProblem'])
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
      await findAllPatientProblem()
    } catch (error) { }
  }, [findAllPatientProblem]);

  useEffect(() => {
    id && fetchProblems()
  }, [fetchProblems, id])

  const handleMenuOpen = ({ currentTarget }: MouseEvent<HTMLElement>) => dispatch({
    type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: currentTarget
  });

  const handleMenuClose = () => dispatch({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null });

  const handleEdit = ({ currentTarget }: MouseEvent<HTMLElement>, id: string, allergy: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: allergy })
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
    <CardLayout openSearch={isSearchOpen} cardId={ALLERGIES_TEXT} cardTitle={ALLERGIES_TEXT}
      hasAdd
      dispatcher={dispatch}
      isMenuOpen={isMenuOpen}
      searchData={searchedData}
      searchLoading={findAllergiesLoading}
      filterTabs={Object.keys(AllergyType)}
      searchComponent={AllergiesModal1Component}
      handleMenuClose={() => handleMenuClose()}
      fetch={async () => await fetchAllergies()}
      onSearch={(type, query) => handleSearch(type, query)}
      onClickAddIcon={(event: MouseEvent<HTMLElement>) => handleMenuOpen(event)}
    >
      {loading ?
        <ViewDataLoader columns={12} rows={3} />
        : <Box mb={2}>
          {!!patientAllergies && patientAllergies.length > 0 ? (
            patientAllergies.map((item) => {
              const { id, allergySeverity, allergyStartDate, allergyOnset, allergy, reactions } = item || {}
              const { name } = allergy || {}

              return (
                <Box pb={2} key={id}>
                  <Box display="flex" justifyContent="space-between">
                    <Box onClick={(event) => id && allergy && handleEdit(event, id, allergy)}>
                      <Typography className={classes.cardContentHeading} key={id}>{name}</Typography>
                    </Box>

                    {allergyStartDate ?
                      <Typography className={classes.cardContentDate}>{getAppointmentDate(allergyStartDate)}</Typography>
                      :
                      <Typography className={classes.cardContentDate}>{formatValue(allergyOnset || '')}</Typography>
                    }
                  </Box>

                  <Box mt={1} display="flex" alignItems="center">
                    <Box mr={2} color={getSeverityColor(allergySeverity as AllergySeverity)}>
                      <Typography>{formatValue(allergySeverity || '')}</Typography>
                    </Box>

                    {reactions?.map((reaction, index) => {
                      const { name } = reaction || {}

                      return (
                        <>
                          {index < 2 && (
                            <Typography className={classes.cardContentDescription}>
                              {name}{reactions.length - 1 > index && ','} &nbsp;
                            </Typography>
                          )} {reactions.length > 2 && index === 2 && '...'}
                        </>
                      )
                    })}
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
        {itemId && selectedItem &&
          <AllergyModal item={selectedItem} dispatcher={dispatch} isEdit patientAllergyId={itemId} fetch={async () => fetchAllergies()} />
        }
      </Menu>
    </CardLayout>
  );
}

export default AllergyList;
