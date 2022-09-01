// packages block
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import Pagination from "@material-ui/lab/Pagination";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button, Card, Grid, Typography } from "@material-ui/core";
// components
import { AddVitals } from "../../vitalsCard/add";
import TableLoader from "../../../../common/TableLoader";
import { VitalsLabels } from "../../vitalsCard/listing/labels";
import { VitalListingTable } from "../../vitalsCard/listing/lists";
import NoDataFoundComponent from "../../../../common/NoDataFoundComponent";
//constants, interfaces, utils
import { AddWhiteIcon } from "../../../../../assets/svgs";
import { useChartingStyles } from "../../../../../styles/chartingStyles";
import { usePatientVitalListingStyles } from "../../../../../styles/patientVitalsStyles";
import { ChartComponentProps, ParamsType, PatientInputProps } from "../../../../../interfacesTypes";
import { ADD_NEW_TEXT, PAGE_LIMIT, VITALS_TEXT, VITAL_LIST_PAGE_LIMIT } from "../../../../../constants";
import { PatientVitalsPayload, useFindAllPatientVitalsLazyQuery } from "../../../../../generated/graphql";
import { Action, initialState, patientReducer, State, ActionType } from "../../../../../reducers/patientReducer";

const VitalTab: FC<ChartComponentProps> = ({ shouldDisableEdit }) => {
  const classes = useChartingStyles()
  const { id } = useParams<ParamsType>()
  const vitalClasses = usePatientVitalListingStyles()

  const [patientStates, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const { openVital, vitalPage, vitalTotalPages, vitalToEdit, patientVitals } = patientStates || {}
  const methods = useForm<PatientInputProps>({ mode: "all" });

  const handleClose = () => {
    dispatch({ type: ActionType.SET_VITAL_TO_EDIT, vitalToEdit: null })
    dispatch({ type: ActionType.SET_OPEN_VITAL, openVital: false })
  };

  const handleChange = (_: ChangeEvent<unknown>, page: number) => dispatch({
    type: ActionType.SET_VITAL_PAGE, vitalPage: page
  })

  const [getPatientVitals, { loading }] = useFindAllPatientVitalsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_PATIENT_VITALS, patientVitals: [] })
    },

    onCompleted(data) {
      if (data) {
        const { findAllPatientVitals } = data;

        if (findAllPatientVitals) {
          const { response, patientVitals, pagination } = findAllPatientVitals

          if (response) {
            const { status } = response

            if (patientVitals && status && status === 200) {
              const sortedVitals = patientVitals?.sort((a, b) => {
                if (a?.updatedAt && b?.updatedAt) {
                  return (a?.updatedAt < b?.updatedAt) ? 1 : ((b?.updatedAt < a?.updatedAt) ? -1 : 0)
                }

                return 0
              })

              sortedVitals?.length > 0 && dispatch({
                type: ActionType.SET_PATIENT_VITALS,
                patientVitals: sortedVitals as PatientVitalsPayload['patientVitals']
              })
            }
          }

          if (pagination) {
            const { totalPages } = pagination

            typeof totalPages === 'number' && dispatch({
              type: ActionType.SET_VITAL_TOTAL_PAGES, vitalTotalPages: totalPages
            })
          }
        }
      }
    }
  })

  const fetchPatientAllVitals = useCallback(async () => {
    try {
      await getPatientVitals({
        variables: {
          patientVitalInput: {
            patientId: id,
            paginationOptions: { page: vitalPage, limit: VITAL_LIST_PAGE_LIMIT }
          }
        },
      })
    } catch (error) { }
  }, [getPatientVitals, id, vitalPage])

  useEffect(() => {
    id && fetchPatientAllVitals()
  }, [id, fetchPatientAllVitals])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            {loading ? (
              <TableLoader numberOfRows={PAGE_LIMIT} numberOfColumns={5} />
            ) : <Box className={classes.cardBox}>
              <FormProvider {...methods}>
                <form>
                  <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant='h3'>{VITALS_TEXT}</Typography>

                    {!shouldDisableEdit &&
                      <Button
                        variant='contained' color='primary'
                        onClick={() => dispatch({
                          type: ActionType.SET_OPEN_VITAL, openVital: true
                        })}
                      >
                        <AddWhiteIcon />
                        <Box p={0.5} />
                        {ADD_NEW_TEXT}
                      </Button>}
                  </Box>
                </form>
              </FormProvider>

              <Box className={classes.tableBox}>
                <Box display="flex">
                  <Box flex={1}>
                    <VitalsLabels />
                  </Box>

                  <Box flex={3}>
                    <Box className={vitalClasses.listingTable}>
                      <VitalListingTable
                        loading={loading}
                        dispatcher={dispatch}
                        patientStates={patientStates}
                        shouldDisableEdit={shouldDisableEdit}
                      />

                      {!loading && !patientVitals?.length &&
                        <NoDataFoundComponent />}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>}
          </Card>

          {openVital && <AddVitals
            dispatcher={dispatch}
            fetchPatientAllVitals={fetchPatientAllVitals}
            patientStates={patientStates}
            handleClose={handleClose}
            isEdit={!!vitalToEdit}
          />}
        </Grid>
      </Grid>

      {vitalTotalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Pagination
            count={vitalTotalPages}
            shape="rounded"
            variant="outlined"
            page={vitalPage}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  )
}

export default VitalTab;
