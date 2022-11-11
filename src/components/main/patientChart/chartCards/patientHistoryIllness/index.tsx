import { useParams } from "react-router-dom";
import { Box, Button, colors, Typography } from "@material-ui/core";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
//components
import Alert from "../../../../common/Alert";
import ChartingTemplate from '../../../../common/chartingTemplate'
//constants
import { renderMultiTemplates, setRecord } from "../../../../../utils";
import { multiOptionType, ParamsType, PatientHistoryProps } from "../../../../../interfacesTypes";
import { HPI_TEMPLATES, NEXT, PATIENT_HISTORY_ILLNESS_TEXT, QuestionType, TemplateType } from "../../../../../constants";
import { Action, ActionType, initialState, patientHistoryReducer, State } from "../../../../../reducers/patientHistoryReducer";
import {
  QuestionTemplate, useCreatePatientIllnessHistoryMutation, useGetPatientChartingTemplateLazyQuery,
  usePatientIllnessHistoryLazyQuery
} from '../../../../../generated/graphql';

const PatientHistory: FC<PatientHistoryProps> = ({ shouldDisableEdit = false, handleStep }): JSX.Element => {
  const methods = useForm();
  const { id: patientId, appointmentId } = useParams<ParamsType>()

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientHistoryReducer, initialState);
  const { itemId, templates, notes } = state;
  const { setValue } = methods;

  const [createIllnessHistory] = useCreatePatientIllnessHistoryMutation({
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
        const { id, answers, templates, notes } = patientIllnessHistory || {}
        id && dispatch({ type: ActionType.SET_ITEM_ID, itemId: id })
        notes && dispatch({ type: ActionType.SET_NOTES, notes: notes })

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
      const templateIds = hpiTemplates?.map((hpiTemplate: multiOptionType) => hpiTemplate?.value);

      const answerResponses = Object.keys(values)?.reduce((acc, key) => {
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
      }, [] as { answerId: string, value?: string }[])

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

  const loading = findPatientChartingTemplateLoading || getLoading;

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
          </Button>
        </Box>}
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <ChartingTemplate
            notes={notes}
            itemId={itemId}
            loading={loading}
            onSubmit={onSubmit}
            label={HPI_TEMPLATES}
            templates={templates}
            key={`ChartingTemplate-HPI`}
            templateType={TemplateType.HPI}
            shouldDisableEdit={shouldDisableEdit}
            fetchChartingTemplates={fetchPatientChartingTemplates}
            setItemId={(item: string) => dispatch({ itemId: item, type: ActionType.SET_ITEM_ID })}
          />
        </form>
      </FormProvider>
    </>
  )
}

export default PatientHistory