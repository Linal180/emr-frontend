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
import { ALLERGIES_TEXT, LIST_PAGE_LIMIT } from "../../../../../constants";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/patientReducer";
import {
  AllergiesPayload,
  AllergyType,
  PatientAllergiesPayload, useFindAllAllergiesLazyQuery, useFindAllPatientAllergiesLazyQuery
} from "../../../../../generated/graphql";
import { Box, Typography } from "@material-ui/core";
import { usePatientChartingStyles } from "../../../../../styles/patientCharting";

const AllergyList = (): JSX.Element => {
  const classes = usePatientChartingStyles()
  const { id } = useParams<ParamsType>()
  const [patientAllergies, setPatientAllergies] = useState<PatientAllergiesPayload['patientAllergies']>([])
  const [allergies, setAllergies] = useState<AllergiesPayload['allergies']>([])
  const [{ anchorEl }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const isMenuOpen = Boolean(anchorEl);
  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;

  const [findAllPatientAllergies, { loading }] = useFindAllPatientAllergiesLazyQuery({
    variables: {
      patientAllergyInput: { patientId: id, paginationOptions: { page: 1, limit: LIST_PAGE_LIMIT } }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setAllergies([])
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
      setAllergies([])
    },

    onCompleted(data) {
      if (data) {
        const { findAllAllergies } = data;

        if (findAllAllergies) {
          const { response, allergies } = findAllAllergies

          if (response) {
            const { status } = response

            if (patientAllergies && status && status === 200) {
              console.log(allergies, "searched")
              setAllergies(allergies as AllergiesPayload['allergies'])
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
  const onSubmit: SubmitHandler<any> = () => { }

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => dispatch({
    type: ActionType.SET_ANCHOR_EL, anchorEl: event.currentTarget
  })

  const handleMenuClose = () => dispatch({ type: ActionType.SET_ANCHOR_EL, anchorEl: null });

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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardLayout anchorEl={anchorEl} cardId={ALLERGIES_TEXT} cardTitle={ALLERGIES_TEXT}
          hasAdd
          searchData={allergies}
          isMenuOpen={isMenuOpen}
          searchLoading={findAllergiesLoading}
          filterTabs={Object.keys(AllergyType)}
          searchComponent={AllergiesModal1Component}
          handleMenuClose={() => handleMenuClose()}
          onSearch={(type, query) => handleSearch(type, query)}
          onClickAddIcon={(event: MouseEvent<HTMLElement>) => handleMenuOpen(event)}
        >
          {loading ?
            <ViewDataLoader columns={12} rows={3} />
            :
            (
              <>
                {!!patientAllergies && patientAllergies.length > 0 ? (
                  patientAllergies.map((item) => {
                    const { id, allergySeverity, allergyStartDate, allergy } = item || {}
                    const { name } = allergy || {}

                    return (
                      <Box pb={2} key={id}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography className={classes.cardContentHeading} key={id}>{name}</Typography>
                          <Typography className={classes.cardContentDate}>{allergyStartDate}</Typography>
                        </Box>

                        <Box>
                          <Typography className={classes.cardContentDescription}>{allergySeverity}</Typography>
                        </Box>
                      </Box>
                    )
                  })
                ) : (<h1>No data added yet!</h1>)}
              </>
            )
          }
        </CardLayout>
      </form>
    </FormProvider>
  );
}

export default AllergyList;
