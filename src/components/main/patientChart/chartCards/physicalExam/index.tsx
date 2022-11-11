import { useParams } from "react-router-dom";
import { ExpandMore } from "@material-ui/icons";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, colors, Typography } from "@material-ui/core";
//components
import QuestionCard from "./QuestionCard";
import Alert from "../../../../common/Alert";
import TableLoader from "../../../../common/TableLoader";
import MacroView from "../../../../common/Macro/MacroView";
import ChartingTemplateSelector from "../../../../common/Selector/ChartingTemplateSelector";
//constants
import { renderMultiTemplates } from "../../../../../utils";
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { multiOptionType, ParamsType, PatientHistoryProps, RosType } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../../../reducers/patientHistoryReducer";
import { ALL_NORMAL, CLEAR_TEXT, NEXT, NORMAL, PE_TEMPLATES, PHYSICAL_EXAM_TEXT, QuestionType, TemplateType } from "../../../../../constants";
import {
  QuestionTemplate, useCreatePhysicalExamHistoryMutation, useGetPatientChartingTemplateLazyQuery,
  usePhysicalExamLazyQuery
} from '../../../../../generated/graphql';


const PhysicalExam: FC<PatientHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const methods = useForm();
  const chartingClasses = useChartingStyles();
  const { id: patientId, appointmentId } = useParams<ParamsType>()

  const [expanded, setExpanded] = useState<string | boolean>('panel1');
  const [qSections, setQSections] = useState<{ [key: number]: string[] }>({});
  const [rosTemplate, setRosTemplate] = useState<{ [key: number]: string[] }>({});

  const handleChange = (panel: string) => {
    setExpanded(expanded === panel ? '' : panel)
  };

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState);
  const { itemId, templates, notes } = state;
  const { handleSubmit, setValue, watch } = methods;
  const values = watch()

  const [createPhysicalExam] = useCreatePhysicalExamHistoryMutation({
    onCompleted: (data) => {
      const { createPhysicalExam } = data || {}
      const { response, physicalExam } = createPhysicalExam || {}
      const { status } = response || {}
      const { id } = physicalExam || {}
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

  const [patientPhysicalExam, { loading: getLoading }] = usePhysicalExamLazyQuery({
    onCompleted: (data) => {
      const { physicalExam: dataResponse } = data || {}
      const { response, physicalExam } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        const { id, answers, templates, notes } = physicalExam || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
        notes && dispatch({ type: ActionType.SET_NOTES, notes: notes })

        dispatch({ type: ActionType.SET_TEMPLATES, templates: templates as QuestionTemplate[] })

        setValue('hpiTemplates', renderMultiTemplates(templates as QuestionTemplate[]))

        answers?.forEach((answerInfo) => {
          const { answerId, value, answer } = answerInfo
          const { questionType } = answer || {}
          if (questionType === QuestionType.SELECT) {
            setValue(`${answerId}.select`, true)
            setValue(`${answerId}.value`, { id: value, name: value })
            return
          }
          setValue(`${answerId}.select`, true)
          setValue(`${answerId}.value`, value)
        })
      }
    },
    onError: () => { }
  })

  const fetchPatientPhysicalExam = useCallback(async () => {
    appointmentId && await patientPhysicalExam({
      variables: {
        physicalExamInput: {
          appointmentId: appointmentId
        }
      }
    })

  }, [patientPhysicalExam, appointmentId])

  useEffect(() => {
    fetchPatientPhysicalExam()
  }, [fetchPatientPhysicalExam])

  const fetchPatientChartingTemplates = async (ids: string[]) => {
    try {
      ids.forEach(async (id) => {
        if (!templates?.some((template) => id === template.id)) {
          id && await findPatientChartingTemplate({
            variables: {
              templateId: id
            }
          })
        }
      })

      const transformedTemplates = templates.filter((template) => ids.includes(template?.id))
      dispatch({ type: ActionType.SET_TEMPLATES, templates: transformedTemplates })
    } catch (error) { }

  }

  const onSubmit: SubmitHandler<any> = async (values) => {
    try {
      const { hpiTemplates = [] } = values || {}
      const templateIds = hpiTemplates?.map((hpiTemplate: multiOptionType) => hpiTemplate?.value)

      const answerResponses = Object?.keys(values)?.reduce((acc, key) => {
        const value = values[key]
        if (key === 'hpiTemplates') {
          return acc
        }

        if (value?.select === true) {
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

      createPhysicalExam({
        variables: {
          createPhysicalExamInput: {
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

  const handleNormal = (answerIds: string[], rosType: RosType, index: number) => {
    if (rosType === 'section') {
      if (!(qSections?.[index]?.length) && answerIds?.length > 0) {
        setQSections((prev) => ({ ...prev, [index]: answerIds }))
        if (answerIds) {
          answerIds.forEach((answerId) => {
            const value = values[answerId]
            setValue(answerId, {
              ...(value || {}),
              select: true
            })
          })
          handleSubmit(onSubmit)()
        }
      }
    }
    else if (rosType === 'template') {
      if (!(rosTemplate?.[index]?.length) && answerIds?.length > 0) {
        setRosTemplate((prev) => ({ ...prev, [index]: answerIds }))
        answerIds.forEach((answerId) => {
          const value = values[answerId]
          setValue(answerId, {
            ...(value || {}),
            select: true
          })
        })
        handleSubmit(onSubmit)()
      }
    }
  }

  const handleClear = (answerIds: string[], rosType: RosType, index: number) => {
    if (rosType === 'section') {
      if (answerIds?.length > 0) {
        setQSections((prev) => ({ ...prev, [index]: [] }))
        answerIds.forEach((answerId) => {
          const value = values[answerId]
          setValue(answerId, {
            ...(value || {}),
            select: false
          })
        })
        handleSubmit(onSubmit)()
      }
    }
    else if (rosType === 'template') {
      if (answerIds?.length > 0) {
        setRosTemplate((prev) => ({ ...prev, [index]: [] }))
        answerIds.forEach((answerId) => {
          const value = values[answerId]
          setValue(answerId, {
            ...(value || {}),
            select: false
          })
        })
        handleSubmit(onSubmit)()
      }
    }
  }

  const selectHandler = (multiOption: multiOptionType[]) => {
    fetchPatientChartingTemplates(multiOption.map(value => value.value))
  }

  const onRemove = () => {
    handleSubmit(onSubmit)()
  }

  const loading = findPatientChartingTemplateLoading || getLoading;

  return (
    <>
      <Box p={2} display='flex' justifyContent='space-between' alignItems='center' flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant='h3'>
          {PHYSICAL_EXAM_TEXT}
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
                isEdit
                addEmpty
                name="hpiTemplates"
                onRemove={onRemove}
                label={PE_TEMPLATES}
                onSelect={selectHandler}
                disabled={shouldDisableEdit}
                templateType={TemplateType.PHYSICAL_EXAM}
                defaultValues={renderMultiTemplates(templates as QuestionTemplate[])}
              />
            </Box>
            <MacroView
              itemId={itemId}
              setItemId={(itemId: string) => dispatch({ type: ActionType.SET_ITEM_ID, itemId })}
              notes={notes}
              type={TemplateType.PHYSICAL_EXAM}
            />
            {templates?.map((template, i) => {
              const { id, sections, name } = template || {}

              const clearAnswerIds = sections?.reduce<string[]>((acc, section) => {
                const { questions } = section || {}
                const answers = questions?.reduce<string[]>((acc, question) => {
                  const answerValues = question?.answers?.map((answer) => answer.id || '') || []
                  acc.push(...answerValues)
                  return acc
                }, []) || []
                acc.push(...answers)
                return acc
              }, [])

              const normalAnswerIds = sections?.reduce<string[]>((acc, section) => {
                const { questions } = section || {}
                const answers = questions?.reduce<string[]>((acc, question) => {
                  const answerValues = question?.answers?.map((answer) => answer.answerType === 'normal' ? answer.id : '')?.filter(value => !!value) || []
                  acc.push(...answerValues)
                  return acc
                }, []) || []
                acc.push(...answers)
                return acc
              }, [])

              return (
                <Box px={1} key={`${i}-${id}`}>
                  <Accordion expanded={expanded === `panel${i + 1}`} className={chartingClasses.accordion}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      IconButtonProps={{
                        onClick: () => handleChange(`panel${i + 1}`)
                      }}
                    >
                      <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" color="textPrimary">{name}</Typography>
                        <Box display="flex" alignItems="center">
                          <Box mx={1}>
                            <Button color="primary" onClick={() => handleNormal(normalAnswerIds || [], 'template', i)}>
                              {ALL_NORMAL}
                            </Button>
                          </Box>

                          <Box mx={1}>
                            <Button className="danger" onClick={() => handleClear(clearAnswerIds || [], 'template', i)}>
                              {CLEAR_TEXT}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
                        {sections?.map((section, index) => {
                          const { id, name, questions } = section || {}

                          const clearSectionAnswerIds = questions?.reduce<string[]>((acc, question) => {
                            const answerValues = question?.answers?.map((answer) => answer.id || '') || []
                            acc.push(...answerValues)
                            return acc
                          }, [])

                          const normalSectionAnswerIds = questions?.reduce<string[]>((acc, question) => {
                            const answerValues = question?.answers?.map((answer) => answer.answerType === 'normal' ? answer.id : '')?.filter(value => !!value) || []
                            acc.push(...answerValues)
                            return acc
                          }, [])

                          return (
                            <Card key={`${id}-${index}`}>
                              <Box
                                width="100%" pr={3.5} mb={3}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`1px solid ${colors.grey[300]}`}
                              >
                                <Typography variant="h4" color="textPrimary">{name}</Typography>
                                <Box display="flex" alignItems="center">
                                  <Box mx={1}>
                                    <Button color="primary" onClick={() => handleNormal(normalSectionAnswerIds || [], 'section', index)}>
                                      {NORMAL}
                                    </Button>
                                  </Box>

                                  <Box mx={1}>
                                    <Button className="danger" onClick={() => handleClear(clearSectionAnswerIds || [], 'section', index)}>
                                      {CLEAR_TEXT}
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>

                              {questions?.map((question, index) => {
                                return (
                                  <>
                                    <QuestionCard
                                      key={`${index}-${id}`}
                                      question={question}
                                      handleSubmit={handleSubmit(onSubmit)}
                                      shouldDisableEdit={shouldDisableEdit}
                                    />
                                    <Box mt={2} />
                                  </>
                                )
                              })}

                            </Card>
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

export default PhysicalExam