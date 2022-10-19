import { Accordion, AccordionDetails, AccordionSummary, Box, Button, colors, Typography } from "@material-ui/core";
import { ChangeEvent, FC, Reducer, useCallback, useEffect, useReducer, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
//components
import Alert from "../../../../common/Alert";
//constants
import { ExpandMore } from "@material-ui/icons";
import { NEXT, QuestionType, REVIEW_OF_SYSTEM_TEXT, ROS_TEMPLATES, TemplateType } from "../../../../../constants";
import { QuestionTemplate, useCreateReviewOfSystemHistoryMutation, useGetPatientChartingTemplateLazyQuery, useReviewOfSystemLazyQuery } from '../../../../../generated/graphql';
import { multiOptionType, ParamsType, PatientHistoryProps } from "../../../../../interfacesTypes";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../../../reducers/patientHistoryReducer";
import CardComponent from "../../../../common/CardComponent";
import ChartingTemplateSelector from "../../../../common/Selector/ChartingTemplateSelector";
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import TableLoader from "../../../../common/TableLoader";
import QuestionCard from "./QuestionCard";
import { renderMultiTemplates } from "../../../../../utils";

const ReviewOfSystem: FC<PatientHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const methods = useForm();
  const chartingClasses = useChartingStyles();
  const { id: patientId, appointmentId } = useParams<ParamsType>()

  const [expanded, setExpanded] = useState<string | false>('panel1');

  const handleChange = (panel: string) => (_: ChangeEvent<{}>, isExpanded: boolean) =>
    setExpanded(isExpanded ? panel : false);

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState);
  const { itemId, templates } = state;
  const { handleSubmit, setValue } = methods;

  const [createReviewOfSystem, { loading: createLoading }] = useCreateReviewOfSystemHistoryMutation({
    onCompleted: (data) => {
      const { createReviewOfSystem } = data || {}
      const { response, reviewOfSystem } = createReviewOfSystem || {}
      const { status } = response || {}
      const { id } = reviewOfSystem || {}
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

  const [patientReviewOfSystem, { loading: getLoading }] = useReviewOfSystemLazyQuery({
    onCompleted: (data) => {
      const { reviewOfSystem: dataResponse } = data || {}
      const { response, reviewOfSystem } = dataResponse || {}
      const { status } = response || {}

      if (status === 200) {
        const { id, answers, templates } = reviewOfSystem || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })

        dispatch({ type: ActionType.SET_TEMPLATES, templates: templates as QuestionTemplate[] })

        setValue('hpiTemplates', renderMultiTemplates(templates as QuestionTemplate[]))

        answers?.forEach((answerInfo) => {
          const { answerId, value, answer } = answerInfo
          const { questionType } = answer || {}
          if (questionType === QuestionType.SELECT) {
            setValue(`${answerId}.select`, true)
            setValue(`${answerId}.value`, { id: "able", name: "able" })
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

      await createReviewOfSystem({
        variables: {
          createReviewOfSystemInput: {
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
          {REVIEW_OF_SYSTEM_TEXT}
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
                label={ROS_TEMPLATES}
                name="hpiTemplates"
                addEmpty
                isEdit
                defaultValues={renderMultiTemplates(templates as QuestionTemplate[])}
                templateType={TemplateType.REVIEW_OF_SYSTEM}
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

export default ReviewOfSystem