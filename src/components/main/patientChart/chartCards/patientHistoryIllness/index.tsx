import { Accordion, AccordionDetails, AccordionSummary, Box, Button, colors, Typography } from "@material-ui/core";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
//components
import Alert from "../../../../common/Alert";
//constants
import { ExpandMore } from "@material-ui/icons";
import { HPI_TEMPLATES, NEXT, PATIENT_HISTORY_ILLNESS_TEXT, QuestionType, TemplateType } from "../../../../../constants";
import {
  QuestionTemplate,
  useCreatePatientIllnessHistoryMutation, useGetPatientChartingTemplateLazyQuery, usePatientIllnessHistoryLazyQuery
} from '../../../../../generated/graphql';
import { multiOptionType, ParamsType, PatientHistoryProps } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../../../reducers/patientHistoryReducer";
import { renderMultiTemplates, setRecord } from "../../../../../utils";
import CardComponent from "../../../../common/CardComponent";
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import ChartingTemplateSelector from "../../../../common/Selector/ChartingTemplateSelector";
import TableLoader from "../../../../common/TableLoader";
import QuestionCard from "./QuestionCard";

const PatientHistory: FC<PatientHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const methods = useForm();
  const chartingClasses = useChartingStyles();
  const { id: patientId, appointmentId } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState);
  const { itemId, templates } = state;
  const { handleSubmit, setValue } = methods;

  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (_: ChangeEvent<{}>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  const [createIllnessHistory, { loading: createLoading }] = useCreatePatientIllnessHistoryMutation({
    onCompleted: (data) => {
      const { createPatientIllnessHistory } = data || {}
      const { response, patientIllnessHistory } = createPatientIllnessHistory || {}
      const { status } = response || {}
      const { id } = patientIllnessHistory || {}
      if (status === 200 && id) {
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
        // message && Alert.success(message)
      } else {
        // message && Alert.error(message)
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
        dispatch({ type: ActionType.SET_TEMPLATES, templates: [...(templates || []), template] });
      }
      else {
        dispatch({ type: ActionType.SET_TEMPLATES, templates: [] });
      }
    }
  });

  const [patientIllnessHistory, { loading: getLoading }] = usePatientIllnessHistoryLazyQuery({
    onCompleted: (data) => {
      const { patientIllnessHistory: dataResponse } = data || {}
      const { response, patientIllnessHistory } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        const { id, answers, templates } = patientIllnessHistory || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })

        dispatch({ type: ActionType.SET_TEMPLATES, templates: templates as QuestionTemplate[] })

        setValue('hpiTemplates', renderMultiTemplates(templates as QuestionTemplate[]))

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

  const fetchPatientChartingTemplates = useCallback(async (ids: string[]) => {
    try {
      ids.forEach(async (id) => {
        if (!templates?.some((template) => id === template.id)) {
          ids && await findPatientChartingTemplate({
            variables: {
              templateId: id
            }
          })
        }
      })
    } catch (error) { }

  }, [findPatientChartingTemplate, templates])

  const onSubmit: SubmitHandler<any> = async (values) => {
    try {
      const { hpiTemplates } = values
      const templateIds = hpiTemplates.map((hpiTemplate: multiOptionType) => hpiTemplate.value)
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
            id: itemId,
            templateIds
          }
        }
      })
    } catch (error) { }

  }

  const loading = findPatientChartingTemplateLoading || createLoading || getLoading;

  return (
    <>
      <Box p={2} display='flex' justifyContent='space-between' alignItems='center' flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant='h3'>
          {PATIENT_HISTORY_ILLNESS_TEXT}
        </Typography>
        {handleStep && <Box ml={1}>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => handleStep()}
          >
            {NEXT}
          </Button></Box>}
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!loading ? <>
            <Box px={2} mt={3}>
              <ChartingTemplateSelector
                label={HPI_TEMPLATES}
                name="hpiTemplates"
                addEmpty
                isEdit
                disabled={shouldDisableEdit}
                defaultValues={renderMultiTemplates(templates as QuestionTemplate[])}
                templateType={TemplateType.HPI}
                onSelect={(multiOption: multiOptionType[]) => fetchPatientChartingTemplates(multiOption.map(value => value.value))}
              />
            </Box>
            {templates?.map((template, i) => {
              const { sections, name } = template || {}
              return (
                <Box px={1}>
                  <Accordion expanded={expanded === `panel${i + 1}`} onChange={handleChange(`panel${i + 1}`)} className={chartingClasses.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="h4" color="textPrimary">{name}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto"></Box>
                      <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
                        {sections?.map((section) => {
                          const { id, name, questions } = section || {}
                          return (
                            <CardComponent cardTitle={name || ''} key={id}>
                              {questions?.map((question, index) => {
                                return (
                                  <>
                                    <QuestionCard key={`${index}-${id}`} question={question} handleSubmit={handleSubmit(onSubmit)} />
                                    <Box mt={2} />
                                  </>
                                )
                              })}
                            </CardComponent>
                          )
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )
            })}
          </> : <TableLoader numberOfColumns={1} numberOfRows={10} />}
        </form>
      </FormProvider>
    </>
  )
}

export default PatientHistory