// packages block
import { Reducer, useReducer, MouseEvent, useState, useEffect, useCallback, FC } from "react";
import { useParams } from "react-router";
import { Box, Menu, Typography } from "@material-ui/core";
// components block
import CardLayout from "../../common/CardLayout";
import AllergyModal from "../modals/AllergyModal";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import AllergiesModal1Component from "../../common/FilterSearch";
// interfaces/types block
import { GREY_SEVEN } from "../../../../../theme";
import { ChartComponentProps, ParamsType } from "../../../../../interfacesTypes";
import { usePatientChartingStyles } from "../../../../../styles/patientCharting";
import { formatValue, getAppointmentDate, getSeverityColor } from "../../../../../utils";
import {
  ALLERGIES_TEXT, CARD_LAYOUT_MODAL, INITIAL_PAGE_LIMIT, LIST_PAGE_LIMIT, NO_RECORDS
} from "../../../../../constants";
import {
  chartReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/chartReducer";
import {
  PatientAllergiesPayload, useFindAllAllergiesLazyQuery, useFindAllPatientAllergiesLazyQuery,
  AllergiesPayload, AllergyType, Allergies, AllergySeverity,
} from "../../../../../generated/graphql";
import { NoDataIcon } from "../../../../../assets/svgs";

const AllergyList: FC<ChartComponentProps> = ({ shouldDisableEdit }): JSX.Element => {
  const classes = usePatientChartingStyles()
  const { id } = useParams<ParamsType>()
  const [patientAllergies, setPatientAllergies] = useState<PatientAllergiesPayload['patientAllergies']>([])
  const [{ isSearchOpen, selectedItem, searchedData, itemId, isFormOpen }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isSearchOpen);
  const isFormMenuOpen = Boolean(isFormOpen);
  const cardId = "widget-menu";

  const [findAllPatientAllergies, { loading }] = useFindAllPatientAllergiesLazyQuery({
    variables: {
      patientAllergyInput: { patientId: id, paginationOptions: { page: 1, limit: LIST_PAGE_LIMIT } }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientAllergies([])
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientAllergies } = data;

        if (findAllPatientAllergies) {
          const { response, patientAllergies } = findAllPatientAllergies

          if (response) {
            const { status } = response

            if (patientAllergies && status && status === 200) {
              setPatientAllergies(patientAllergies as PatientAllergiesPayload['patientAllergies'])
            }
          }
        }
      }
    }
  });

  const [findAllAllergies, { loading: findAllergiesLoading }] = useFindAllAllergiesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllAllergies } = data;

        if (findAllAllergies) {
          const { response, allergies } = findAllAllergies

          if (response) {
            const { status } = response

            if (allergies && status && status === 200) {
              dispatch({
                type: ActionType.SET_SEARCHED_DATA,
                searchedData: allergies as AllergiesPayload['allergies']
              })
            }
          }
        }
      }
    }
  });

  const fetchAllergies = useCallback(async () => {
    try {
      await findAllPatientAllergies()
    } catch (error) { }
  }, [findAllPatientAllergies]);

  useEffect(() => {
    id && fetchAllergies()
  }, [fetchAllergies, id])

  const handleMenuOpen = ({ currentTarget }: MouseEvent<HTMLElement>) => dispatch({
    type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: currentTarget
  });

  const handleMenuClose = () => dispatch({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null });

  const handleEdit = ({ currentTarget }: MouseEvent<HTMLElement>, id: string, allergy: Allergies) => {
    dispatch({ type: ActionType.SET_SELECTED_ITEM, selectedItem: allergy })
    dispatch({ type: ActionType.SET_IS_FORM_OPEN, isFormOpen: currentTarget })
    dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
  };

  const handleSearch = useCallback(async (type: string, query: string) => {
    try {
      await findAllAllergies({
        variables: {
          allergyInput: {
            allergyName: query, allergyType: type.toLowerCase(),
            paginationOptions: { page: 1, limit: query ? LIST_PAGE_LIMIT : INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [findAllAllergies])

  useEffect(() => {
    handleSearch(Object.keys(AllergyType)[0], '')
  }, [handleSearch])

  return (
    <CardLayout openSearch={isSearchOpen} cardId={ALLERGIES_TEXT} cardTitle={ALLERGIES_TEXT}
      hasAdd={!shouldDisableEdit}
      modal={CARD_LAYOUT_MODAL.Allergies}
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
          ) : (<Box color={GREY_SEVEN} margin='auto' textAlign='center'>
            <NoDataIcon />

            <Typography variant="h6">{NO_RECORDS}</Typography>
          </Box>)}
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
        {itemId && selectedItem && selectedItem.__typename === 'Allergies' &&
          <AllergyModal item={selectedItem} dispatcher={dispatch} isEdit recordId={itemId} fetch={async () => fetchAllergies()} />
        }
      </Menu>
    </CardLayout>
  );
}

export default AllergyList;
