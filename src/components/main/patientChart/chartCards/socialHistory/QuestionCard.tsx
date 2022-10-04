import { FC, Fragment } from 'react';
import { Box } from '@material-ui/core';
import { useFormContext } from 'react-hook-form';
//component
import SocialDateCard from './SocialDateCard';
import SocialSwitchCard from './SocialSwitchCard';
import SocialInputCard from './SocialInputCard';
import SocialSelectorCard from './SocialSelectorCard';
import DependentQuestionCard from './DependentQuestionCard';
//constants, interfaces
import { QuestionType } from '../../../../../constants';
import { QuestionCardType, SelectorOption } from '../../../../../interfacesTypes';

const QuestionCard: FC<QuestionCardType> = ({ question }): JSX.Element => {
  const { watch } = useFormContext()
  const questionValue = watch();

  const { id, questionType, title, options, dependentQuestions } = question || {}
  const key = questionType as QuestionType;
  const res = questionValue ? questionValue[`${id}`] : {}

  switch (key) {
    case QuestionType.DATE:

      return <Fragment>
        <SocialDateCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${id}.note`}
          switchName={`${id}.value`}
        />

      </Fragment>
    case QuestionType.INPUT:

      return <Fragment>
        <SocialInputCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${id}.note`}
          inputName={`${id}.value`}
        />
      </Fragment>

    case QuestionType.NUMBER:

      return <SocialInputCard
        notStep
        title={title || ''}
        key={`${id}-${title}`}
        notesName={`${id}.note`}
        inputName={`${id}.value`}
        inputFieldType={'number'}
      />

    case QuestionType.SELECT:
      const { value: select } = res || {}
      const { id: selectValue } = select || {}

      return <Fragment>
        <SocialSelectorCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${id}.note`}
          selectorName={`${id}.value`}
          selectorOptions={options as SelectorOption[] || []}
        />
        {dependentQuestions && dependentQuestions?.length > 0 && <Box>
          {dependentQuestions?.map((dependentQuestion) =>
            <DependentQuestionCard question={dependentQuestion} QId={id} value={selectValue} />)}
        </Box>}
      </Fragment>

    case QuestionType.SWITCH:
      const { value } = res || {}
      return <Fragment>
        <SocialSwitchCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${id}.note`}
          switchName={`${id}.value`}
        />
        {dependentQuestions && dependentQuestions?.length > 0 && value &&
          <Box >
            {dependentQuestions?.map((dependentQuestion) =>
              <DependentQuestionCard question={dependentQuestion} QId={id} value={value ? 'yes' : 'no'} />
            )}
          </Box>}
      </Fragment>
    default:

      return <></>
  }
}

export default QuestionCard