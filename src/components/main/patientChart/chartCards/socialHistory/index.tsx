import { useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, colors, Typography } from "@material-ui/core";
import { FC, Fragment, Reducer, useCallback, useEffect, useReducer } from "react";
//components
import Alert from "../../../../common/Alert";
import SocialDateCard from "./socialDateCard";
import Loader from "../../../../common/Loader";
import SocialInputCard from "./socialInputCard";
import SocialSwitchCard from './socialSwitchCard';
import SocialSelectorCard from "./socialSelectorCard";
//constants
import { PAGE_LIMIT, QuestionType, SUBMIT, } from "../../../../../constants";
import {
  DependentQuestions, Questions, SocialAnswer, SocialDependentAnswer,
  useCreatePatientSocialHistoryMutation, useFindAllSectionsLazyQuery, usePatientSocialHistoryLazyQuery
} from '../../../../../generated/graphql'
import { ParamsType, SelectorOption, SocialHistoryProps } from "../../../../../interfacesTypes";
import { socialHistoryReducer, ActionType, State, initialState, Action } from "../../../../../reducers/socialHistoryReducer";
import { getSocialHistoryFormValues } from "../../../../../utils";

const SocialHistory: FC<SocialHistoryProps> = ({ shouldDisableEdit = false }): JSX.Element => {

  const methods = useForm();
  const { id: patientId } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(socialHistoryReducer, initialState);
  const { sections, itemId } = state;
  const { watch, handleSubmit, setValue } = methods;

  const questionValue = watch();


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
    onCompleted: async (data) => {
      const { createPatientSocialHistory } = data || {}
      const { response, socialHistory } = createPatientSocialHistory || {}
      const { status, message } = response || {}
      const { id } = socialHistory || {}
      if (status === 200 && id) {
        message && Alert.success(message)
        await fetchPatientSocialHistory()
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
          socialAnswer?.map((answer) => setAnswer(answer as SocialAnswer))
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

  const getDependentQuestionCard = (question: DependentQuestions, QId: string, value?: string | undefined) => {
    const { id, questionType, title, options, answer } = question || {}
    const key = questionType as QuestionType;

    if (value && answer?.includes(value)) {

      switch (key) {

        case QuestionType.DATE:

          return <SocialDateCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${QId}.dependent.${id}.note`}
            switchName={`${QId}.dependent.${id}.value`}
            isDependentQ
          />


        case QuestionType.INPUT:

          return <SocialInputCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${QId}.dependent.${id}.note`}
            inputName={`${QId}.dependent.${id}.value`}
            isDependentQ
          />

        case QuestionType.NUMBER:
          return <SocialInputCard
            notStep
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${QId}.dependent.${id}.note`}
            inputName={`${QId}.dependent.${id}.value`}
            inputFieldType={'number'}
            isDependentQ
          />


        case QuestionType.SELECT:

          return <SocialSelectorCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${QId}.dependent.${id}.note`}
            selectorName={`${QId}.dependent.${id}.value`}
            selectorOptions={options as SelectorOption[] || []}
            isDependentQ
          />


        case QuestionType.SWITCH:
          return <SocialSwitchCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${QId}.dependent.${id}.note`}
            switchName={`${QId}.dependent.${id}.value`}
            isDependentQ
          />


        default:

          return <></>
      }
    } else {
      return <></>
    }
  }

  const getQuestionCard = (question: Questions) => {
    const { id, questionType, title, options, dependentQuestions } = question || {}
    const key = questionType as QuestionType;
    const res = questionValue ? questionValue[`${id}`] : {}

    switch (key) {
      case QuestionType.DATE:

        return <Fragment>
          <SocialDateCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${id}.note`}
            switchName={`${id}.value`}
          />

        </Fragment>
      case QuestionType.INPUT:

        return <Fragment>
          <SocialInputCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${id}.note`}
            inputName={`${id}.value`}
          />
        </Fragment>

      case QuestionType.NUMBER:

        return <SocialInputCard
          notStep
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${id}.note`}
          inputName={`${id}.value`}
          inputFieldType={'number'}
        />

      case QuestionType.SELECT:
        const { value: select } = res || {}
        const { id: selectValue } = select || {}

        return <Fragment>
          <SocialSelectorCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${id}.note`}
            selectorName={`${id}.value`}
            selectorOptions={options as SelectorOption[] || []}
          />
          {dependentQuestions && dependentQuestions?.length > 0 && <Box>
            {dependentQuestions?.map((dependentQuestion) => getDependentQuestionCard(dependentQuestion, id, selectValue))}
          </Box>}
        </Fragment>

      case QuestionType.SWITCH:
        const { value } = res || {}
        return <Fragment>
          <SocialSwitchCard
            title={title || ''}
            key={`${id}-${title}`}
            notesName={`${id}.note`}
            switchName={`${id}.value`}
          />
          {dependentQuestions && dependentQuestions?.length > 0 && value &&
            <Box >
              {dependentQuestions?.map((dependentQuestion) => getDependentQuestionCard(dependentQuestion, id, value ? 'yes' : 'no'))}
            </Box>}
        </Fragment>
      default:

        return <></>
    }
  }

  const setDependentAnswer = (answer: SocialDependentAnswer, QId: string) => {
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

  }

  const setAnswer = (answer: SocialAnswer) => {
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
        break;
      default:
        setValue(`${name}.note`, note || '')
        value && setValue(`${name}.value`, value)
        break;
    }
  }

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
   return <Loader loading />
  }

  return (<FormProvider {...methods}>
    <form onSubmit={handleSubmit(onSubmit)}>

      {sections?.map((section) => {
        const { id, name, questions } = section || {}
        return (
          <Box key={id} m={2}>
            <Box>
              <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant='h3'>{name}</Typography>
              </Box>
              {questions?.map((question) => getQuestionCard(question))}
            </Box>
          </Box>
        )
      })}
      <Box>
        <Button type="submit">
          {SUBMIT}
        </Button>
      </Box>
    </form>
  </FormProvider>)
}

export default SocialHistory