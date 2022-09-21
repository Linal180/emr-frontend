import { useParams } from 'react-router';
import { AddCircleOutline } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, Fragment, Reducer, useCallback, useEffect, useReducer } from "react";
import { FormProvider, useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
  IconButton, InputBase, Typography
} from "@material-ui/core";
//components
import Alert from '../../../../../common/Alert';
import Selector from "../../../../../common/Selector";
import InputController from "../../../../../../controller";
//interfaces
import {
  ADD_FAMILY_HISTORY, CANCEL, CLOSE, DIED_TEXT, EMPTY_OPTION, familyRelativeFormDefaultValue, SUBMIT,
  FAMILY_RELATIVE_MAPPED, INITIAL_PAGE_LIMIT, NOTES, NO_RECORDS, ONSET_AGE_TEXT, RELATIVE, SEARCH_FOR_DISEASE,
} from "../../../../../../constants";
import { FamilyHistorySchema } from '../../../../../../validationSchemas';
import { NoDataIcon, PageBackIcon, SearchIcon, TrashOutlinedIcon } from "../../../../../../assets/svgs";
import {
  IcdCodesPayload, IcdCodesWithSnowMedCode, useCreateFamilyHistoryMutation, useGetFamilyHistoryLazyQuery,
  useSearchIcdCodesLazyQuery, useUpdateFamilyHistoryMutation
} from '../../../../../../generated/graphql';
import {
  FamilyHistoryFormProps, FamilyHistoryFormType, ParamsType, SideDrawerCloseReason
} from "../../../../../../interfacesTypes";
import {
  familyHistoryFormReducer, Action, ActionType, State, initialState
} from "../../../../../../reducers/familyHistoryFormReducer";
import { setRecord } from '../../../../../../utils';
import { BLUE, GREY_SEVEN } from '../../../../../../theme';
import { useChartingStyles } from '../../../../../../styles/chartingStyles';

const FamilyHistoryForm: FC<FamilyHistoryFormProps> = ({
  handleClose, isOpen, isEdit, id: familyHistoryId, fetchFamilyHistory: fetchFamilyHistories
}): JSX.Element => {
  const { id } = useParams<ParamsType>()
  const methods = useForm<FamilyHistoryFormType>({
    defaultValues: {
      problem: { id: '', name: '' },
      familyRelative: [familyRelativeFormDefaultValue]
    },
    resolver: yupResolver(FamilyHistorySchema)
  });

  const chartingClasses = useChartingStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(familyHistoryFormReducer, initialState);

  const { problem: stateProblem, searchQuery, searchedData } = state || {}
  const { watch, control, setValue, handleSubmit, reset } = methods;
  const { problem, familyRelative: fields } = watch();
  const { id: problemId, name } = problem || {}
  const { append, remove } = useFieldArray({ control, name: "familyRelative" });

  const [searchIcdCodes, { loading: searchIcdCodesLoading }] = useSearchIcdCodesLazyQuery({
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

  const [createFamilyHistory, { loading: createLoading }] = useCreateFamilyHistoryMutation({
    onCompleted: async (data) => {
      const { createFamilyHistory } = data || {}
      const { response, familyHistory } = createFamilyHistory || {}
      const { status, message } = response || {}
      const { id } = familyHistory || {}
      if (status === 200 && id) {
        dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
        dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
        dispatch({ type: ActionType.SET_PROBLEM, problem: '' })
        reset()
        fetchFamilyHistories && await fetchFamilyHistories()
        message && Alert.success(message)
        handleClose(false)
      }
      else {
        message && Alert.error(message)
      }
    },
    onError: ({ message }) => {
      message && Alert.error(message)
    }
  })

  const [updateFamilyHistory, { loading: updateLoading }] = useUpdateFamilyHistoryMutation({
    onCompleted: async (data) => {
      const { updateFamilyHistory } = data || {}
      const { response, familyHistory } = updateFamilyHistory || {}
      const { status, message } = response || {}
      const { id } = familyHistory || {}
      if (status === 200 && id) {
        dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
        dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: '' })
        dispatch({ type: ActionType.SET_PROBLEM, problem: '' })
        reset()
        fetchFamilyHistories && await fetchFamilyHistories()
        message && Alert.success(message)
        handleClose(false)
      }
      else {
        message && Alert.error(message)
      }

    },
    onError: ({ message }) => {
      message && Alert.error(message)
    }
  })

  const [getFamilyHistory, { loading: getLoading }] = useGetFamilyHistoryLazyQuery({
    onCompleted: (data) => {
      const { getFamilyHistory } = data || {}
      const { familyHistory, response } = getFamilyHistory || {}
      const { status } = response || {}

      if (status === 200) {
        const { familyHistoryRelatives, name, icdCodeId } = familyHistory || {}
        icdCodeId && dispatch({ type: ActionType.SET_PROBLEM, problem: icdCodeId })

        if (familyHistoryRelatives?.length) {

          const newArray = familyHistoryRelatives?.map((item) => {
            const { relativeName, died, notes, onsetAge, id } = item || {}
            const relative = FAMILY_RELATIVE_MAPPED?.find(({ id }) => id === relativeName)

            return {
              id: id || '',
              relative: relative ?? { id: '', name: "" },
              died: died || '',
              notes: notes || '',
              onsetAge: onsetAge || ''
            }
          })

          name && icdCodeId && setValue('problem', setRecord(icdCodeId, name, false));
          newArray?.length && setValue('familyRelative', newArray)
        }
      }
    },
    onError: () => {

    }
  })

  const onFieldAddHandler = () => {
    append(familyRelativeFormDefaultValue)
  }

  const backHandler = () => {
    dispatch({ type: ActionType.SET_PROBLEM, problem: '' })
    setValue('problem', EMPTY_OPTION)
  }

  const onProblemSelect = useCallback((data: IcdCodesWithSnowMedCode | null) => {
    const { id, description } = data || {};
    if (id) {
      dispatch({ type: ActionType.SET_PROBLEM, problem: id })
      setValue('problem', setRecord(id, description || "", false))
    }
  }, [setValue])

  const modalCloseHandler = (_: any, reason: SideDrawerCloseReason) => {
    if (reason === 'backdropClick') {
      return
    }
    handleClose(true)
  }

  const onSubmit: SubmitHandler<FamilyHistoryFormType> = async (values) => {
    const { familyRelative, problem } = values;
    const { id: icdCodeId, name: problemName } = problem;

    try {
      const familyHistoryRelatives = familyRelative?.map((item) => {
        const { relative, ...rest } = item;
        const { id: relativeName } = relative || {}
        return { relativeName, ...rest }
      })
      if (isEdit && familyHistoryId) {
        await updateFamilyHistory({
          variables: {
            updateFamilyHistoryInput: {
              id: familyHistoryId,
              name: problemName,
              patientId: id,
              icdCodeId,
              familyHistoryRelatives
            }
          }
        })
      }
      else {
        const familyHistoryRelatives = familyRelative?.map((item) => {
          const { id, relative, ...rest } = item;
          const { id: relativeName } = relative || {}
          return { relativeName, ...rest }
        })
        await createFamilyHistory({
          variables: {
            createFamilyHistoryInput: {
              name: problemName,
              patientId: id,
              icdCodeId,
              familyHistoryRelatives
            }
          }
        })
      }
    } catch (error) { }
  }

  const fetchFamilyHistory = useCallback(async () => {
    try {
      await getFamilyHistory({ variables: { getFamilyHistoryInput: { id: familyHistoryId } } })
    } catch (error) { }

  }, [familyHistoryId, getFamilyHistory])

  useEffect(() => {
    familyHistoryId && isEdit && fetchFamilyHistory()
  }, [familyHistoryId, fetchFamilyHistory, isEdit])


  const handleICDSearch = useCallback(async (query: string) => {
    try {
      const queryString = query

      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: queryString,
            paginationOptions: { page: 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes])

  const handleSearch = useCallback(async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2) {
      handleICDSearch(query)
    } else {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
    }
  }, [handleICDSearch])

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {!!searchIcdCodesLoading ?
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>
          :
          (searchedData && searchedData.length > 0 ?
            searchedData?.map(item => {
              const { code, description } = item as IcdCodesWithSnowMedCode || {}

              return (
                <Box key={`${code}`} my={0.2} className={chartingClasses.hoverClass}
                  onClick={() => onProblemSelect(item)}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{description}</Typography>

                    <Typography variant='caption'>
                      {description}
                    </Typography>
                  </Box>

                </Box>
              )
            }) : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }
      </Box>
    )
  }, [chartingClasses.hoverClass, searchIcdCodesLoading, searchedData, onProblemSelect])

  const loading = createLoading || getLoading || updateLoading

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={modalCloseHandler}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        {problemId && stateProblem ? <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" >
              <Button size='small' onClick={backHandler}
                disabled={loading}
              >
                <PageBackIcon />
              </Button>

              <Typography variant='h4'>{name}</Typography>
            </Box>

            <Box className="billing-box" display="flex" alignItems="center" justifyContent="flex-end"
              border={`1px solid ${BLUE}`} borderRadius={4} minWidth="fit-content">
              <Button onClick={onFieldAddHandler} disabled={loading}>
                <AddCircleOutline color='secondary' />

                <Box ml={1} />

                <Typography color="secondary">{RELATIVE}</Typography>
              </Button>
            </Box>
          </Box>
        </> : <Typography variant="h4">{ADD_FAMILY_HISTORY}</Typography>}
      </DialogTitle>


      <DialogContent>
        <FormProvider  {...methods}>
          <form>
            <Box className="dialogBg">
              <Grid container spacing={3}>
                {!problemId && !stateProblem ? <Grid item xs={12}>
                  <Box mb={2} className={chartingClasses.searchBox} display="flex">
                    <IconButton size='small' aria-label="search">
                      <SearchIcon />
                    </IconButton>

                    <InputBase
                      value={searchQuery}
                      inputProps={{ 'aria-label': 'search' }}
                      placeholder={SEARCH_FOR_DISEASE}
                      onChange={({ target: { value } }) => handleSearch(value)}
                    />
                  </Box>
                  {renderSearchData()}
                </Grid>
                  : <Fragment>
                    <Grid item xs={12}>
                      {fields?.length > 0 && fields?.map((option, index) => {
                        const { id } = option || {}
                        return (
                          <Grid key={`${index}-${id}`} container>
                            <Grid item xs={12}>
                              {fields?.length > 1 &&
                                <Grid item xs={12}>
                                  <Box mt={1} mb={2} display="flex" justifyContent="flex-end">
                                    <IconButton size='small' onClick={() => remove(index)}>
                                      <TrashOutlinedIcon />
                                    </IconButton>
                                  </Box>
                                </Grid>
                              }

                              <Box px={2}>
                                <Grid container spacing={3}>
                                  <Grid item xs={4}>
                                    <Selector
                                      isRequired
                                      key={`familyRelative.${index}.relative`}
                                      name={`familyRelative.${index}.relative`}
                                      options={FAMILY_RELATIVE_MAPPED}
                                      label={RELATIVE}
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <InputController
                                      controllerName={`familyRelative.${index}.onsetAge`}
                                      key={`familyRelative.${index}.onsetAge`} fieldType="number"
                                      controllerLabel={ONSET_AGE_TEXT} notStep
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <InputController
                                      controllerName={`familyRelative.${index}.died`}
                                      key={`familyRelative.${index}.died`}
                                      controllerLabel={DIED_TEXT}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <InputController
                                      controllerName={`familyRelative.${index}.notes`}
                                      key={`familyRelative.${index}.notes`}
                                      controllerLabel={NOTES}
                                      multiline
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Fragment>
                }
              </Grid>
            </Box>
          </form>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Box display='flex' justifyContent='flex-end'>
          {stateProblem && stateProblem ?
            <Fragment>
              <Box mr={2}>
                <Button
                  variant='outlined'
                  onClick={() => handleClose(false)}
                  disabled={loading}
                >
                  {CANCEL}
                </Button>
              </Box>
              <Box>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                >
                  {SUBMIT}
                </Button>
              </Box>
            </Fragment> :
            <Fragment>
              <Box>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleClose(false)}
                  disabled={loading}
                >
                  {CLOSE}
                </Button>
              </Box>
            </Fragment>
          }
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default FamilyHistoryForm;
