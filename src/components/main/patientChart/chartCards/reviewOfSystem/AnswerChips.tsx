import { Box, Chip } from '@material-ui/core'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { QuestionType } from '../../../../../constants'
import InputController from '../../../../../controller'
import { QuestionAnswers } from '../../../../../generated/graphql'
import { AnswerChipsProps } from '../../../../../interfacesTypes'
import Selector from '../../../../common/Selector'

function AnswerChips({ answers, colors }: AnswerChipsProps) {
  const methods = useFormContext()
  const [firstColor, secondColor] = colors || []
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
          <Box width={100}>
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
          <Box width={100} height={60} mt={-2}>
            <Selector
              label=''
              name={`${id}.value`}
              options={transformedOptions || []}
            />
          </Box>
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
      return
    }
    setValue(`${id}.select`, true)
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
              style={{
                background: answerValues[id]?.select ? firstColor : secondColor,
                border: answerValues[id]?.select ? '1px solid black' : '',
                display: "flex",
                alignItems: "center",
                height: 50
              }}
            />
          )
        })
      }
    </>
  )
}

export default AnswerChips