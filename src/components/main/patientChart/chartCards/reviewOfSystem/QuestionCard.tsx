import { Grid, makeStyles, Typography } from '@material-ui/core';
import { FC, useMemo } from 'react';
//component
//constants, interfaces
import { SectionQuestions } from '../../../../../generated/graphql';
import { BLUE_ELEVEN, GREEN_ONE, PINK } from '../../../../../theme';
import AnswerChips from './AnswerChips';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
    "& .MuiChip-label": {
      whiteSpace: "normal",
      textOverflow: "clip",
      textAlign: "center",
      fontSize: 16,
    },
    padding: 10,
  },
}));

const QuestionCard: FC<{ question: SectionQuestions }> = ({ question }): JSX.Element => {
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
    <Grid spacing={3} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid black" }}>
      <Grid md={4}>
        <Typography variant='h6'>{title}</Typography>
      </Grid>

      <Grid md={8}>
        <div className={classes.root}>
          <AnswerChips
            answers={normalAnswers}
            colors={[GREEN_ONE, 'rgba(140,169,0,0.2)']}
          />
          <AnswerChips
            answers={neutralAnswers}
            colors={[BLUE_ELEVEN, `rgba(0,115,176,0.16)`]}
          />
          <AnswerChips
            answers={abnormalAnswers}
            colors={[PINK, `rgba(204,0,29,0.1)`]}
          />
        </div>
      </Grid>
    </Grid>
  )
}

export default QuestionCard