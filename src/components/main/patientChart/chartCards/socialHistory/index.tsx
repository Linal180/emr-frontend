import { useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Typography } from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useMemo, useReducer } from "react";
//components
import QuestionCard from "./QuestionCard";
import Alert from "../../../../common/Alert";
//constants
import { getSocialHistoryFormValues } from "../../../../../utils";
import { NEXT, PAGE_LIMIT, QuestionType, SOCIAL_HISTORY_TEXT, SUBMIT } from "../../../../../constants";
import { ParamsType, SocialHistoryProps } from "../../../../../interfacesTypes";
import { socialHistoryReducer, ActionType, State, initialState, Action } from "../../../../../reducers/socialHistoryReducer";
import {
  SocialAnswer, SocialDependentAnswer, useCreatePatientSocialHistoryMutation, useFindAllSectionsLazyQuery,
  usePatientSocialHistoryLazyQuery
} from '../../../../../generated/graphql'
import TableLoader from "../../../../common/TableLoader";
import CardComponent from "../../../../common/CardComponent";

const SocialHistory: FC<SocialHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {

  const methods = useForm();
  const { id: patientId } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(socialHistoryReducer, initialState);
  const { sections, itemId, socialAnswer } = state;
  const { handleSubmit, setValue } = methods;


  const [findAllSections, { loading: sectionLoading }] = useFindAllSectionsLazyQuery({

    variables: {
      findAllSectionsInput: {
        paginationOptions: { page: 1, limit: PAGE_LIMIT }
      }
    },

    onError: ({ message }) => {
      Alert.error(message)
    },

    onCompleted: (data) => {
      const { findAllSections } = data || {};
      const { response, sections } = findAllSections || {};
      const { status } = response || {};

      if (status === 200 && sections) {
        dispatch({ type: ActionType.SET_SECTIONS, sections })
      }
      else {
        dispatch({ type: ActionType.SET_SECTIONS, sections: [] });
      }
    }
  });

  const [createSocialHistory, { loading: createLoading }] = useCreatePatientSocialHistoryMutation({
    onCompleted: (data) => {
      const { createPatientSocialHistory } = data || {}
      const { response, socialHistory } = createPatientSocialHistory || {}
      const { status, message } = response || {}
      const { id } = socialHistory || {}
      if (status === 200 && id) {
        message && Alert.success(message)
        fetchPatientSocialHistory()
      } else {
        message && Alert.error(message)
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const [patientSocialHistory, { loading: getLoading }] = usePatientSocialHistoryLazyQuery({
    onCompleted: (data) => {
      const { patientSocialHistory } = data || {}
      const { response, socialHistory } = patientSocialHistory || {}
      const { status } = response || {}

      if (status === 200) {
        const { id, socialAnswer } = socialHistory || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
        if (socialAnswer) {
          socialAnswer?.length && dispatch({ type: ActionType.SET_SOCIAL_ANSWER, socialAnswer: socialAnswer as SocialAnswer[] })
        }
      }
    },
    onError: () => { }
  })

  const fetchPatientSocialHistory = useCallback(async () => {
    await patientSocialHistory({
      variables: {
        patientSocialHistoryInput: {
          patientId: patientId
        }
      }
    })

  }, [patientSocialHistory, patientId])

  const fetchSocialHistory = useCallback(async () => {
    try {
      await findAllSections()
      await fetchPatientSocialHistory()
    } catch (error) { }

  }, [fetchPatientSocialHistory, findAllSections])

  useEffect(() => {
    patientId && fetchSocialHistory()
  }, [patientId, fetchSocialHistory])

  const setDependentAnswer = useCallback((answer: SocialDependentAnswer, QId: string) => {
    const { name, note, value, dependentQuestion } = answer
    const { questionType, options } = dependentQuestion || {}
    const key = questionType as QuestionType;

    switch (key) {

      case QuestionType.DATE:
        note && setValue(`${QId}.dependent.${name}.note`, note)
        value && setValue(`${QId}.dependent.${name}.value`, new Date(value))
        break;

      case QuestionType.INPUT:
        setValue(`${QId}.dependent.${name}.note`, note || '')
        value && setValue(`${QId}.dependent.${name}.value`, value)
        break;

      case QuestionType.NUMBER:

        setValue(`${QId}.dependent.${name}.note`, note || '')
        value && setValue(`${QId}.dependent.${name}.value`, parseInt(value))
        break;

      case QuestionType.SELECT:

        setValue(`${QId}.dependent.${name}.note`, note || '');
        const res = options?.find(({ id }) => id === value)
        value && res && setValue(`${QId}.dependent.${name}.value`, res)

        break;

      case QuestionType.SWITCH:
        setValue(`${QId}.dependent.${name}.note`, note || '')
        value && setValue(`${QId}.dependent.${name}.value`, value === 'true' ? true : false)
        break;

      default:

        setValue(`${QId}.dependent.${name}.note`, note || '')
        value && setValue(`${QId}.dependent.${name}.value`, value)
        break;
    }

  }, [setValue])

  const setAnswer = useCallback((answer: SocialAnswer) => {
    const { name, note, value, question, socialDependentAnswer } = answer
    const { questionType, options } = question || {}
    const key = questionType as QuestionType;

    switch (key) {
      case QuestionType.DATE:
        note && setValue(`${name}.note`, note)
        value && setValue(`${name}.value`, new Date(value))
        break;

      case QuestionType.INPUT:
        setValue(`${name}.note`, note || '')
        value && setValue(`${name}.value`, value)
        break;

      case QuestionType.NUMBER:

        setValue(`${name}.note`, note || '')
        value && setValue(`${name}.value`, parseInt(value))
        break;

      case QuestionType.SELECT:
        setValue(`${name}.note`, note || '');
        const res = options?.find(({ id }) => id === value)
        value && res && setValue(`${name}.value`, res)
        socialDependentAnswer && socialDependentAnswer?.length > 0
          && socialDependentAnswer?.map((dependent) => setDependentAnswer(dependent, name || ''))
        break;

      case QuestionType.SWITCH:
        setValue(`${name}.note`, note || '')
        value && setValue(`${name}.value`, value === 'true' ? true : false)
        socialDependentAnswer && socialDependentAnswer?.length > 0
          && socialDependentAnswer?.map((dependent) => setDependentAnswer(dependent, name || ''))
        break;
      default:
        setValue(`${name}.note`, note || '')
        value && setValue(`${name}.value`, value)
        break;
    }
  }, [setValue, setDependentAnswer])

  useMemo(() => {
    if (socialAnswer?.length) {
      socialAnswer?.map((answer) => setAnswer(answer))
      return socialAnswer
    }
    return []
  }, [socialAnswer, setAnswer])

  const onSubmit: SubmitHandler<any> = async (data) => {
    const values = getSocialHistoryFormValues(data);
    try {
      const inputs = {
        ...(itemId && { id: itemId }),
        patientId: patientId,
        socialAnswer: values,
      }

      await createSocialHistory({
        variables: {
          createPatientSocialHistoryInput: inputs
        }
      })
    } catch (error) { }
  }

  const loading = sectionLoading || createLoading || getLoading;


  if (loading) {
    return <TableLoader numberOfColumns={1} numberOfRows={10} />
  }

  return (

    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">

          <Typography variant='h3'>
            {SOCIAL_HISTORY_TEXT}
          </Typography>

          <Box display='flex' alignItems='center' justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary">
              {SUBMIT}
            </Button>
            {handleStep && <Box ml={1}>
              <Button
                variant='contained'
                color='secondary'
                // size="large"
                onClick={() => handleStep()}
              >
                {NEXT}
              </Button></Box>}
          </Box>
        </Box>

        <Box maxHeight="calc(100vh - 200px)" className="overflowY-auto">
          {sections?.map((section) => {
            const { id, name, questions } = section || {}
            return (
              <CardComponent cardTitle={name || ''} key={id}>
                {questions?.map((question, index) => <QuestionCard key={`${index}-${id}`} question={question} />)}
              </CardComponent>
            )
          })}
        </Box>

      </form>
    </FormProvider>

  )
}

export default SocialHistory