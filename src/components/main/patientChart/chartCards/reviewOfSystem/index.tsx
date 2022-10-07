import { Box, Button, Typography } from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
//components
import Alert from "../../../../common/Alert";
//constants
import { NEXT, QuestionType, REVIEW_OF_SYSTEM_TEXT, ROS_TEMPLATES, SUBMIT, TemplateType } from "../../../../../constants";
import { useCreateReviewOfSystemHistoryMutation, useGetPatientChartingTemplateLazyQuery, useReviewOfSystemLazyQuery } from '../../../../../generated/graphql';
import { ParamsType, PatientHistoryProps, SelectorOption } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../../../reducers/patientHistoryReducer";
import CardComponent from "../../../../common/CardComponent";
import ChartingTemplateSelector from "../../../../common/Selector/ChartingTemplateSelector";
import TableLoader from "../../../../common/TableLoader";
import QuestionCard from "./QuestionCard";

const ReviewOfSystem: FC<PatientHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const methods = useForm();
  const { id: patientId, appointmentId } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState);
  const { template, itemId } = state;
  const { handleSubmit, setValue } = methods;

  const [createReviewOfSystem, { loading: createLoading }] = useCreateReviewOfSystemHistoryMutation({
    onCompleted: (data) => {
      const { createReviewOfSystem } = data || {}
      const { response, reviewOfSystem } = createReviewOfSystem || {}
      const { status, message } = response || {}
      const { id } = reviewOfSystem || {}
      if (status === 200 && id) {
        message && Alert.success(message)
        fetchPatientReviewOfSystem()
      } else {
        message && Alert.error(message)
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })


  const [findPatientChartingTemplate, { loading: findPatientChartingTemplateLoading }] = useGetPatientChartingTemplateLazyQuery({

    onError: ({ message }) => {
      Alert.error(message)
    },

    onCompleted: (data) => {
      const { getPatientChartingTemplate } = data || {};
      const { response, template } = getPatientChartingTemplate || {};
      const { status } = response || {};

      if (status === 200 && template) {
        dispatch({ type: ActionType.SET_TEMPLATE, template })
      }
      else {
        dispatch({ type: ActionType.SET_TEMPLATE, template: null });
      }
    }
  });

  const [patientReviewOfSystem, { loading: getLoading }] = useReviewOfSystemLazyQuery({
    onCompleted: (data) => {
      const { reviewOfSystem: dataResponse } = data || {}
      const { response, reviewOfSystem } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        const { id, answers } = reviewOfSystem || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })

        answers?.forEach((answerInfo) => {
          const { answerId, value, answer } = answerInfo
          const { questionType } = answer || {}
          if (questionType === QuestionType.SELECT) {
            setValue(`${answerId}.select`, true)
            setValue(`${answerId}.value`, {id: "able", name: "able"})
            return
          }
          setValue(`${answerId}.select`, true)
          setValue(`${answerId}.value`, value)
        })
      }
    },
    onError: () => { }
  })

  const fetchPatientReviewOfSystem = useCallback(async () => {
    appointmentId && await patientReviewOfSystem({
      variables: {
        reviewOfSystemInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [patientReviewOfSystem, appointmentId])

  useEffect(() => {
    fetchPatientReviewOfSystem()
  }, [fetchPatientReviewOfSystem])

  const fetchPatientChartingTemplates = useCallback(async (id) => {
    try {
      id && await findPatientChartingTemplate({
        variables: {
          templateId: id
        }
      })
    } catch (error) { }

  }, [findPatientChartingTemplate])

  const onSubmit: SubmitHandler<any> = async (values) => {
    try {
      const answerResponses = Object.keys(values).reduce((acc, key) => {
        const value = values[key]
        if (key === 'hpiTemplates') {
          return acc
        }

        if (value.select === true) {
          acc.push({
            answerId: key,
            value: value?.value?.id ? value?.value?.id : value?.value
          })
          return acc
        }

        return acc
      }, [] as {
        answerId: string
        value?: string
      }[])

      await createReviewOfSystem({
        variables: {
          createReviewOfSystemInput: {
            answerResponses: answerResponses,
            appointmentId: appointmentId,
            patientId: patientId,
            id: itemId
          }
        }
      })
    } catch (error) { }

  }

  const loading = findPatientChartingTemplateLoading || createLoading || getLoading;


  if (loading) {
    return <TableLoader numberOfColumns={1} numberOfRows={10} />
  }

  const { sections } = template || {}

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mx={3}>
            <ChartingTemplateSelector
              label={ROS_TEMPLATES}
              name="hpiTemplates"
              addEmpty
              templateType={TemplateType.REVIEW_OF_SYSTEM}
              onSelect={({ id }: SelectorOption) => fetchPatientChartingTemplates(id)}
            />
          </Box>
          {sections?.length && <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">

            <Typography variant='h3'>
              {REVIEW_OF_SYSTEM_TEXT}
            </Typography>

            <Box display='flex' alignItems='center' justifyContent="space-between">
              {!shouldDisableEdit && <Button type="submit" variant="contained" color="primary">
                {SUBMIT}
              </Button>}
              {handleStep && <Box ml={1}>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={() => handleStep()}
                >
                  {NEXT}
                </Button></Box>}
            </Box>
          </Box>}

          <Box maxHeight="calc(100vh - 200px)" className="overflowY-auto">
            {sections?.map((section) => {
              const { id, name, questions } = section || {}
              return (
                <CardComponent cardTitle={name || ''} key={id}>
                  {questions?.map((question, index) => {
                    return (
                      <>
                        <QuestionCard key={`${index}-${id}`} question={question} />
                        <Box mt={2} />
                      </>
                    )
                  })}
                </CardComponent>
              )
            })}
          </Box>
        </form>
      </FormProvider>
    </>


  )
}

export default ReviewOfSystem