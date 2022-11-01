import { Box, colors, makeStyles, Typography } from '@material-ui/core';
import { FC, useMemo } from 'react';
//component
import AnswerChips from './AnswerChips';
//constants, interfaces
import { SectionQuestions } from '../../../../../generated/graphql';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
    '& .MuiChip-root': {
      height: '30px !important',
      borderRadius: '4px !important',
      '& .MuiAutocomplete-inputRoot, .MuiOutlinedInput-root': {
        height: '24px !important',
        marginTop: 9,
        backgroundColor: '#F3F4F6',
        borderRadius: '4px !important',
        paddingTop: '0px !important',
      },
    },
    "& .MuiChip-label": {
      whiteSpace: "normal",
      textOverflow: "clip",
      textAlign: "center",
      fontSize: 16,
      fontWeight: '500',
      display: "flex",
      alignItems: "center",
      padding: '0px 10px 0px 5px',
    },
    padding: '10 0',
  },
}));

const QuestionCard: FC<{ question: SectionQuestions, handleSubmit?: Function, shouldDisableEdit?: boolean }> = ({ question, handleSubmit, shouldDisableEdit = false }): JSX.Element => {
  const classes = useStyles()
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
      <Box pb={2} mb={2} borderBottom={`1px solid ${colors.grey[300]}`} display="flex" justifyContent="space-between" alignItems="center">
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