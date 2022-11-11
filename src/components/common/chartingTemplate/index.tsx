
import { FC, useState } from "react";
import { ExpandMore } from "@material-ui/icons";
import { useFormContext } from "react-hook-form";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, colors, Typography } from "@material-ui/core";
//components
import QuestionCard from "./QuestionCard";
import TableLoader from "../TableLoader";
import MacroView from "../Macro/MacroView";
import ChartingTemplateSelector from "../Selector/ChartingTemplateSelector";
//constants
import { renderMultiTemplates } from "../../../utils";
import { useChartingStyles } from '../../../styles/chartingStyles';
import { ALL_NORMAL, CLEAR_TEXT, NORMAL } from "../../../constants";
import { multiOptionType, ChartingTemplateProps, RosType } from "../../../interfacesTypes";


const ChartingTemplate: FC<ChartingTemplateProps> = (props): JSX.Element => {
  const { shouldDisableEdit = false, onSubmit, templateType, loading = false, fetchChartingTemplates, itemId, templates, notes, setItemId, label } = props

  const methods = useFormContext();
  const { setValue, watch, handleSubmit } = methods;
  const values = watch()
  const chartingClasses = useChartingStyles();

  const [expanded, setExpanded] = useState<string | boolean>('panel1');
  const [qSections, setQSections] = useState<{ [key: number]: string[] }>({});
  const [rosTemplate, setRosTemplate] = useState<string[]>([]);

  const handleChange = (panel: string) => {
    setExpanded(expanded === panel ? '' : panel)
  };

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
        setRosTemplate(answerIds)
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
        setRosTemplate([])
        answerIds.forEach((answerId) => {
          const value = values[answerId]
          setValue(answerId, {
            ...(value || {}),
            select: false
          })
          // setValue(`${answerId}.value`, '');
        })
        handleSubmit(onSubmit)()
      }
    }
    else if (rosType === 'template') {
      if (answerIds?.length > 0) {
        setRosTemplate([])
        setQSections({})
        answerIds.forEach((answerId) => {
          const value = values[answerId]
          setValue(answerId, {
            ...(value || {}),
            select: false,
          })
          // setValue(`${answerId}.value`, '');
        })
        handleSubmit(onSubmit)()
      }
    }
  }

  const selectHandler = (multiOption: multiOptionType[]) => {
    const arr = multiOption.map(value => value?.value)
    fetchChartingTemplates(arr)
  }

  const onRemove = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <>
      {!loading ? <>
        <Box px={2} mt={3}>
          <ChartingTemplateSelector
            isEdit
            addEmpty
            label={label}
            name="hpiTemplates"
            onRemove={onRemove}
            onSelect={selectHandler}
            templateType={templateType}
            disabled={shouldDisableEdit}
            defaultValues={renderMultiTemplates(templates)}
          />
        </Box>
        <MacroView
          itemId={itemId}
          setItemId={(itemId: string) => setItemId(itemId)}
          notes={notes}
          type={templateType}
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

    </>
  )
}

export default ChartingTemplate