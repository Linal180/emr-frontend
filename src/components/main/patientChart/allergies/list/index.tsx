// packages block
import { Reducer, useReducer, MouseEvent, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
// components block
import CardLayout from "../../common/CardLayout";
import AllergiesModal1Component from "../FilterSearch";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// interfaces/types block
import { ParamsType } from "../../../../../interfacesTypes";
import { ALLERGIES_TEXT, LIST_PAGE_LIMIT, NO_RECORDS } from "../../../../../constants";
import {
  chartReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/chartReducer";
import {
  PatientAllergiesPayload, useFindAllAllergiesLazyQuery, useFindAllPatientAllergiesLazyQuery,
  AllergiesPayload, AllergyType, PatientAllergies,
} from "../../../../../generated/graphql";
import { Box, Typography } from "@material-ui/core";
import { usePatientChartingStyles } from "../../../../../styles/patientCharting";
import { GREY_SEVEN } from "../../../../../theme";
import { formatValue, getAppointmentDate } from "../../../../../utils";
// import AddModal from "../AddModal";

const AllergyList = (): JSX.Element => {
  const classes = usePatientChartingStyles()
  const { id } = useParams<ParamsType>()
  const [patientAllergies, setPatientAllergies] = useState<PatientAllergiesPayload['patientAllergies']>([])
  const [{ isSearchOpen, searchedData }, dispatch] =
    useReducer<Reducer<State, Action>>(chartReducer, initialState)
  const isMenuOpen = Boolean(isSearchOpen);

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
  })

  const handleMenuClose = () => dispatch({ type: ActionType.SET_IS_SEARCH_OPEN, isSearchOpen: null });

  // const handleEdit = (event: MouseEvent<HTMLElement>, id: string) => {
  // }

  const handleSearch = async (type: string, query: string) => {
    try {
      query && await findAllAllergies({
        variables: {
          allergyInput: {
            allergyName: query, allergyType: type.toLowerCase(),
            paginationOptions: { page: 1, limit: LIST_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }

  return (
    <>
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
                      <Box>
                        <Typography className={classes.cardContentHeading} key={id}>{name}</Typography>
                      </Box>

                      {allergyStartDate ?
                        <Typography className={classes.cardContentDate}>{getAppointmentDate(allergyStartDate)}</Typography>
                        :
                        <Typography className={classes.cardContentDate}>{formatValue(allergyOnset || '')}</Typography>
                      }
                    </Box>

                    <Box>
                      <Typography className={classes.cardContentDescription}>{allergySeverity}</Typography>

                      {reactions?.map(reaction => {
                        const { name } = reaction || {}

                        return (
                          <Typography className={classes.cardContentDescription}>{name}</Typography>
                        )
                      })}
                    </Box>
                  </Box>
                )
              })
            ) : (<Box color={GREY_SEVEN}><Typography variant="h6">{NO_RECORDS}</Typography></Box>)}
          </Box>}
      </CardLayout>
    </>
  );
}

export default AllergyList;
