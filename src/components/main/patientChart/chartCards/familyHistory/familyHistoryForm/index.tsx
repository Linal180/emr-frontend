import { useParams } from 'react-router';
import { AddCircleOutline } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { FC, Fragment, Reducer, useCallback, useEffect, useReducer, useRef } from "react";
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
  const observer = useRef<any>();
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

  const { problem: stateProblem, searchQuery, searchedData, page, totalPages } = state || {}
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
          const { icdCodes, pagination } = searchIcdCodes;

          const { totalPages } = pagination || {}
          dispatch({ type: ActionType.SET_TOTAL_PAGES, totalPages: totalPages || 0 })

          icdCodes && dispatch({
            type: ActionType.SET_SEARCHED_DATA,
            searchedData: [...(searchedData || []), ...(icdCodes || [])] as IcdCodesPayload['icdCodes']
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

      if (isEdit && familyHistoryId) {
        const familyHistoryRelatives = familyRelative?.map((item) => {
          const { relative, ...rest } = item;
          const { id: relativeName } = relative || {}
          return { relativeName, ...rest }
        })
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


  const handleICDSearch = useCallback(async (page?: number, searchQuery?: string) => {
    try {

      await searchIcdCodes({
        variables: {
          searchIcdCodesInput: {
            searchTerm: searchQuery || '',
            paginationOptions: { page: page || 1, limit: INITIAL_PAGE_LIMIT }
          }
        }
      })
    } catch (error) { }
  }, [searchIcdCodes])

  const handleSearch = async (query: string) => {
    dispatch({ type: ActionType.SET_SEARCH_QUERY, searchQuery: query })

    if (query.length > 2 || query.length === 0) {
      dispatch({ type: ActionType.SET_SEARCHED_DATA, searchedData: [] })
      dispatch({ type: ActionType.SET_PAGE, page: 1 })
      await handleICDSearch(1, query)
    }
  }

  const lastElementRef = useCallback((node) => {

    if (searchIcdCodesLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && page <= totalPages) {
        dispatch({ type: ActionType.SET_PAGE, page: page + 1 })
        if (searchQuery.length > 2 || searchQuery.length === 0) {
          handleICDSearch(page + 1, searchQuery)
        }
        else {
          handleICDSearch(page + 1)
        }
      }
    });
    if (node) observer.current.observe(node);
  },
    [searchIcdCodesLoading, page, totalPages, handleICDSearch, searchQuery]
  );

  const renderSearchData = useCallback(() => {
    return (
      <Box maxHeight={280} minHeight={280} className="overflowY-auto" display="flex"
        flexDirection="column" alignItems="flex-start"
      >
        {
          (searchedData && searchedData.length > 0 ?
            <>{searchedData?.map(item => {
              const { code, description } = item as IcdCodesWithSnowMedCode || {}

              return (
                <div key={`${code}`} className={`${chartingClasses.hoverClass} my-2`}
                  onClick={() => onProblemSelect(item)}
                  ref={lastElementRef}
                >
                  <Box display="flex" flexDirection="column" px={2}>
                    <Typography variant='body1'>{description}</Typography>

                    <Typography variant='caption'>
                      {`${code} | ${description}`}
                    </Typography>
                  </Box>

                </div>
              )
            })}</> : <Box color={GREY_SEVEN} margin='auto' textAlign='center'>
              <NoDataIcon />
              <Typography variant="h6">{NO_RECORDS}</Typography>

              <Box p={1} />
            </Box>)
        }

        {!!searchIcdCodesLoading &&
          <Box alignSelf="center">
            <CircularProgress size={25} color="inherit" disableShrink />
          </Box>}

      </Box>
    )
  }, [searchIcdCodesLoading, searchedData, chartingClasses.hoverClass, lastElementRef, onProblemSelect])

  useEffect(() => {
    handleICDSearch()
  }, [handleICDSearch])

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
              <Button size='small' onClick={isEdit ? () => handleClose(false) : backHandler}
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
                                      isRequired
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
                                      fieldType="number"
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
