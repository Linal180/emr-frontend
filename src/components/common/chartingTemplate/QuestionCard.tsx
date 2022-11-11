import { Box, colors, Typography } from '@material-ui/core';
import { FC, useMemo } from 'react';
//component
import AnswerChips from './AnswerChips';
//constants, interfaces
import { TemplateQuestionCardType } from '../../../interfacesTypes';
import { questionCardStyles } from '../../../styles/questionCardStyles';

const QuestionCard: FC<TemplateQuestionCardType> = ({ question, handleSubmit, shouldDisableEdit = false }): JSX.Element => {
  const classes = questionCardStyles()
  const { title, answers } = question || {}

  const normalAnswers = useMemo(() => {
    if (!answers?.length) {
      return []
    }

    return answers.filter((answer) => answer.answerType === 'normal')
  }, [answers])

  const neutralAnswers = useMemo(() => {
    if (!answers?.length) {
      return []
    }

    return answers.filter((answer) => answer.answerType === 'Neutral')
  }, [answers])

  const abnormalAnswers = useMemo(() => {
    if (!answers?.length) {
      return []
    }

    return answers.filter((answer) => answer.answerType === 'Abnormal')
  }, [answers])

  return (
    <Box>
      <Box pb={2} mb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant='h6'>{title}</Typography>
      </Box>

      <Box className={classes.root} pb={2}>
        <AnswerChips
          answers={normalAnswers}
          colors={['#03CC83', 'rgba(3,204,131,0.4)']}
          handleSubmit={handleSubmit}
          shouldDisableEdit={shouldDisableEdit}
        />

        <AnswerChips
          answers={neutralAnswers}
          colors={['#204ECF', `rgba(32,78,207,0.4)`]}
          handleSubmit={handleSubmit}
          shouldDisableEdit={shouldDisableEdit}
        />

        <AnswerChips
          answers={abnormalAnswers}
          colors={['#DD1010', `rgba(221,16,16,0.4)`]}
          handleSubmit={handleSubmit}
          shouldDisableEdit={shouldDisableEdit}
        />
      </Box>
    </Box>
  )
}

export default QuestionCard