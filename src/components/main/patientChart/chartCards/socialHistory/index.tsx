import { useParams } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, colors, Typography } from "@material-ui/core";
import { FC, Fragment, Reducer, useCallback, useEffect, useReducer } from "react";
//components
import Alert from "../../../../common/Alert";
import SocialDateCard from "./socialDateCard";
import SocialInputCard from "./socialInputCard";
import SocialSwitchCard from './socialSwitchCard';
import SocialSelectorCard from "./socialSelectorCard";
//constants
import { PAGE_LIMIT, QuestionType, SUBMIT, } from "../../../../../constants";
import { DependentQuestions, Questions, useFindAllSectionsLazyQuery } from '../../../../../generated/graphql'
import { ParamsType, SelectorOption, SocialHistoryProps } from "../../../../../interfacesTypes";
import { socialHistoryReducer, ActionType, State, initialState, Action } from "../../../../../reducers/socialHistoryReducer";
import { getSocialHistoryFormValues } from "../../../../../utils";
import Loader from "../../../../common/Loader";

const SocialHistory: FC<SocialHistoryProps> = ({ shouldDisableEdit = false }): JSX.Element => {

  const methods = useForm();
  const { id } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(socialHistoryReducer, initialState);
  const { sections } = state;
  const { watch, handleSubmit } = methods;

  const questionValue = watch();


  const [findAllSections, { loading: sectionLoading }] = useFindAllSectionsLazyQuery({

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

  const fetchAllSections = useCallback(async () => {
    try {
      await findAllSections({ variables: { findAllSectionsInput: { paginationOptions: { page: 1, limit: PAGE_LIMIT } } } })
    } catch (error) {

    }
  }, [findAllSections])

  useEffect(() => {
    id && fetchAllSections()
  }, [id, fetchAllSections])

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

  const onSubmit: SubmitHandler<any> = (data) => {
    const values = getSocialHistoryFormValues(data);

  }
  const loading = sectionLoading;

  if (loading) {
    <Loader loading={loading} />
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