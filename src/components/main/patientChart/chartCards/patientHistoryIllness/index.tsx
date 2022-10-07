import { Box, Button, Typography } from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
//components
import Alert from "../../../../common/Alert";
//constants
import { HPI_TEMPLATES, NEXT, PATIENT_HISTORY_ILLNESS_TEXT, QuestionType, SUBMIT, TemplateType } from "../../../../../constants";
import { useCreatePatientIllnessHistoryMutation, useGetPatientChartingTemplateLazyQuery, usePatientIllnessHistoryLazyQuery } from '../../../../../generated/graphql';
import { ParamsType, PatientHistoryProps, SelectorOption } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../../../reducers/patientHistoryReducer";
import CardComponent from "../../../../common/CardComponent";
import ChartingTemplateSelector from "../../../../common/Selector/ChartingTemplateSelector";
import TableLoader from "../../../../common/TableLoader";
import QuestionCard from "./QuestionCard";
import { setRecord } from "../../../../../utils";

const PatientHistory: FC<PatientHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const methods = useForm();
  const { id: patientId, appointmentId } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState);
  const { template, itemId } = state;
  const { handleSubmit, setValue } = methods;

  const [createIllnessHistory, { loading: createLoading }] = useCreatePatientIllnessHistoryMutation({
    onCompleted: (data) => {
      const { createPatientIllnessHistory } = data || {}
      const { response, patientIllnessHistory } = createPatientIllnessHistory || {}
      const { status, message } = response || {}
      const { id } = patientIllnessHistory || {}
      if (status === 200 && id) {
        message && Alert.success(message)
        fetchPatientIllnessHistory()
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

  const [patientIllnessHistory, { loading: getLoading }] = usePatientIllnessHistoryLazyQuery({
    onCompleted: (data) => {
      const { patientIllnessHistory: dataResponse } = data || {}
      const { response, patientIllnessHistory } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        const { id, answers } = patientIllnessHistory || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })

        answers?.forEach((answerInfo) => {
          const { answerId, value, answer } = answerInfo
          const { questionType } = answer || {}
          if (questionType === QuestionType.SELECT) {
            setValue(`${answerId}.select`, true)
            setValue(`${answerId}.value`, setRecord(value || '', value || ''))
            return
          }
          setValue(`${answerId}.select`, true)
          setValue(`${answerId}.value`, value)
        })
      }
    },
    onError: () => { }
  })

  const fetchPatientIllnessHistory = useCallback(async () => {
    appointmentId && await patientIllnessHistory({
      variables: {
        patientIllnessHistoryInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [patientIllnessHistory, appointmentId])

  useEffect(() => {
    fetchPatientIllnessHistory()
  }, [fetchPatientIllnessHistory])

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

      await createIllnessHistory({
        variables: {
          createPatientIllnessHistoryInput: {
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
              label={HPI_TEMPLATES}
              name="hpiTemplates"
              addEmpty
              templateType={TemplateType.HPI}
              onSelect={({ id }: SelectorOption) => fetchPatientChartingTemplates(id)}
            />
          </Box>
          {sections?.length && <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">

            <Typography variant='h3'>
              {PATIENT_HISTORY_ILLNESS_TEXT}
            </Typography>

            <Box display='flex' alignItems='center' justifyContent="space-between">
              {!shouldDisableEdit && <Button type="submit" variant="contained" color="primary">
                {SUBMIT}
              </Button>}
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

export default PatientHistory