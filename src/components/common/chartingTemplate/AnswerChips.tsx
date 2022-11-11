import { Box, Chip } from '@material-ui/core'
import { useFormContext } from 'react-hook-form'
//component
import Selector from '../Selector'
import InputController from '../../../controller'
//constants, graphql, interfaces
import { QuestionType } from '../../../constants'
import { AnswerChipsProps } from '../../../interfacesTypes'
import { QuestionAnswers } from '../../../generated/graphql'

function AnswerChips({ answers, colors, handleSubmit, shouldDisableEdit }: AnswerChipsProps) {
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
          <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{first}</Box>
          &nbsp;
          <Box width={100}>
            <InputController
              fieldType='number'
              controllerName={`${id}.value`}
              controllerLabel=""
              onChange={() => handleSubmit && handleSubmit()}
            />
          </Box>
          &nbsp;
          <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{second}</Box>
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
          <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{firstSelect}</Box>
          <Box width={100} height={60} mt={-2}>
            <Selector
              label=''
              name={`${id}.value`}
              options={transformedOptions || []}
              onSelect={() => handleSubmit && handleSubmit()}
            />
          </Box>
          <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{secondSelect}</Box>
        </Box>

      case QuestionType.INPUT:
        const [firstInput, secondInput] = name?.split("fill") || []
        return <>
          <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{firstInput}</Box>
          &nbsp;
          <Box width={100}>
            <InputController
              controllerName={`${id}.value`}
              controllerLabel=""
              onChange={() => handleSubmit && handleSubmit()}
            />
          </Box>
          &nbsp;
          <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{secondInput}</Box>
        </>

      default:
        return <Box className='pointer-cursor' onClick={() => handleAnswers(id)}>{name}</Box>
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