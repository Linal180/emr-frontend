import { Box, Chip } from '@material-ui/core'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { QuestionType } from '../../../../../constants'
import InputController from '../../../../../controller'
import { QuestionAnswers } from '../../../../../generated/graphql'
import { AnswerChipsProps } from '../../../../../interfacesTypes'
import Selector from '../../../../common/Selector'

function AnswerChips({ answers, colors, handleSubmit, shouldDisableEdit = false }: AnswerChipsProps) {
  const methods = useFormContext()
  const [firstColor] = colors || []
  const { setValue, watch } = methods
  const answerValues = watch()

  const getTransformedName = (answer: QuestionAnswers) => {
    const { name, options, questionType, id } = answer
    switch (questionType) {
      case QuestionType.NUMBER:
        const [first, second] = name?.split("fill") || []
        return <>
          <Box onClick={() => handleAnswers(id)}>{first}</Box>
          &nbsp;
          <Box width={100} height={60} mt={-2}>
            <InputController
              fieldType='number'
              controllerName={`${id}.value`}
              controllerLabel=""
            />
          </Box>
          &nbsp;
          <Box onClick={() => handleAnswers(id)}>{second}</Box>
        </>

      case QuestionType.SELECT:
        const [firstSelect, secondSelect] = name?.split("fill") || []
        const transformedOptions = options?.map((option) => {
          return {
            id: option.id || '',
            name: option.name
          }
        })
        return <Box display="flex" alignItems="center">
          <Box onClick={() => handleAnswers(id)}>{firstSelect}</Box>
          &nbsp;
          <Box width={120}>
            <Selector
              label=''
              name={`${id}.value`}
              options={transformedOptions || []}
            />
          </Box>
          &nbsp;
          <Box onClick={() => handleAnswers(id)}>{secondSelect}</Box>
        </Box>

      default:
        return <Box onClick={() => handleAnswers(id)}>{name}</Box>
    }
  }

  const handleAnswers = (id: string) => {
    const value = answerValues[id]?.select
    if (value) {
      setValue(`${id}.select`, false)
      handleSubmit && handleSubmit()
      return
    }
    setValue(`${id}.select`, true)
    handleSubmit && handleSubmit()
  }


  return (
    <>
      {
        answers?.map(answer => {
          const { id } = answer || {}
          return (
            <Chip
              label={getTransformedName(answer)}
              clickable
              disabled={shouldDisableEdit}
              style={{
                background: answerValues[id]?.select ? firstColor : 'white',
                border: `1.5px solid ${firstColor}`,
                display: "flex",
                alignItems: "center",
                height: 50,
                color: answerValues[id]?.select ? 'white' : firstColor
              }}
            />
          )
        })
      }
    </>
  )
}

export default AnswerChips