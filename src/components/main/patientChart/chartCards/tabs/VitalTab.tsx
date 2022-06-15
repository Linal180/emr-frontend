import {
  Box, Button, Card, Grid
} from "@material-ui/core"
import { ChangeEvent, Reducer, useCallback, useEffect, useReducer, useState } from "react"
import Pagination from "@material-ui/lab/Pagination";
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router"
//components
import Selector from "../../../../common/Selector"
import ViewDataLoader from "../../../../common/ViewDataLoader"
import { AddVitals } from "../../vitalsCard/add"
import { VitalsLabels } from "../../vitalsCard/listing/labels"
import { VitalListingTable } from "../../vitalsCard/listing/lists"
//constants, interfaces, utils
import { AddWhiteIcon, PrinterWhiteIcon } from "../../../../../assets/svgs"
import { ADD_NEW_TEXT, EMPTY_OPTION, PRINT_CHART, VITAL_LIST_PAGE_LIMIT } from "../../../../../constants"
import { PatientVitalPayload, PatientVitalsPayload, useFindAllPatientVitalsLazyQuery } from "../../../../../generated/graphql"
import { ParamsType, PatientInputProps } from "../../../../../interfacesTypes"
import { Action, initialState, patientReducer, State } from "../../../../../reducers/patientReducer"
import { useChartingStyles } from "../../../../../styles/chartingStyles"
import { usePatientVitalListingStyles } from "../../../../../styles/patientVitalsStyles"

const VitalTab = () => {
  const classes = useChartingStyles()
  const vitalClasses = usePatientVitalListingStyles()
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [vitalToEdit, setVitalToEdit] = useState<PatientVitalPayload['patientVital']>(null);
  const [patientVitals, setPatientVitals] = useState<PatientVitalsPayload['patientVitals']>([]);
  const [patientStates, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const { id } = useParams<ParamsType>()

  const handleClose = () => {
    setVitalToEdit(null)
    setOpen(false)
  };

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }


  const methods = useForm<PatientInputProps>({
    mode: "all",
  });

  const [getPatientVitals, { loading }] = useFindAllPatientVitalsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setPatientVitals([])
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
                if (a?.createdAt && b?.createdAt) {
                  return (a?.createdAt < b?.createdAt) ? 1 : ((b?.createdAt < a?.createdAt) ? -1 : 0)
                }
                return 0
              })
              sortedVitals?.length > 0 && setPatientVitals(sortedVitals as PatientVitalsPayload['patientVitals'])
            }
          }

          if (pagination) {
            const { totalPages } = pagination
            typeof totalPages === 'number' && setTotalPages(totalPages)
          }
        }
      }
    }
  })

  const fetchPatientAllVitals = useCallback(async () => {
    try {
      await getPatientVitals({
        variables: {
          patientVitalInput: { patientId: id, paginationOptions: { page, limit: VITAL_LIST_PAGE_LIMIT } }
        },
      })
    } catch (error) { }
  }, [getPatientVitals, id, page])

  useEffect(() => {
    id && fetchPatientAllVitals()
  }, [id, fetchPatientAllVitals])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Card>
            {
              loading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> :
                <Box className={classes.cardBox}>
                  <FormProvider {...methods}>
                    <form>
                      <Box px={2} pt={2} display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                          <Box className={classes.tableHeaderDropdown}>
                            <Selector
                              name="units"
                              label={''}
                              value={EMPTY_OPTION}
                            />
                          </Box>

                          <Box p={2} />

                          <Box className={classes.tableHeaderDropdown}>
                            <Selector
                              name="results"
                              label={''}
                              value={EMPTY_OPTION}
                            />
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center">
                          <Button variant='contained' color='secondary'>
                            <PrinterWhiteIcon />
                            <Box p={0.5} />
                            {PRINT_CHART}
                          </Button>

                          <Box p={1} />

                          <Button onClick={() => setOpen(true)} variant='contained' color='primary'>
                            <AddWhiteIcon />
                            <Box p={0.5} />
                            {ADD_NEW_TEXT}
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  </FormProvider>

                  <Box className={classes.tableBox}>
                    <Grid container>
                      <Grid item xs={2}>
                        <VitalsLabels patientStates={patientStates} />
                      </Grid>
                      <Grid item xs={10}>
                        <Box className={vitalClasses.listingTable}>
                          <VitalListingTable
                            patientVitals={patientVitals}
                            patientStates={patientStates}
                            setPatientVitals={setPatientVitals}
                            setVitalToEdit={setVitalToEdit}
                            setOpen={setOpen}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
            }
          </Card>

          {open && <AddVitals
            dispatcher={dispatch}
            fetchPatientAllVitals={fetchPatientAllVitals}
            patientStates={patientStates}
            handleClose={handleClose}
            isOpen={open}
            vitalToEdit={vitalToEdit}
            isEdit={!!vitalToEdit}
          />}
        </Grid>
      </Grid>
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
  )
}

export default VitalTab;
