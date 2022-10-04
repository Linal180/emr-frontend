import { FC } from 'react'
//components
import SocialDateCard from './SocialDateCard';
import SocialSwitchCard from './SocialSwitchCard';
import SocialInputCard from './SocialInputCard';
import SocialSelectorCard from './SocialSelectorCard';
//constants, interfaces
import { QuestionType } from '../../../../../constants';
import { DependentQuestionCardType, SelectorOption } from '../../../../../interfacesTypes';

const DependentQuestionCard: FC<DependentQuestionCardType> = ({ question, QId, value }): JSX.Element => {
  const { id, questionType, title, options, answer } = question || {}
  const key = questionType as QuestionType;

  if (value && answer?.includes(value)) {

    switch (key) {

      case QuestionType.DATE:

        return <SocialDateCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${QId}.dependent.${id}.note`}
          switchName={`${QId}.dependent.${id}.value`}
          isDependentQ
        />


      case QuestionType.INPUT:

        return <SocialInputCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${QId}.dependent.${id}.note`}
          inputName={`${QId}.dependent.${id}.value`}
          isDependentQ
        />

      case QuestionType.NUMBER:
        return <SocialInputCard
          notStep
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${QId}.dependent.${id}.note`}
          inputName={`${QId}.dependent.${id}.value`}
          inputFieldType={'number'}
          isDependentQ
        />


      case QuestionType.SELECT:

        return <SocialSelectorCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${QId}.dependent.${id}.note`}
          selectorName={`${QId}.dependent.${id}.value`}
          selectorOptions={options as SelectorOption[] || []}
          isDependentQ
        />


      case QuestionType.SWITCH:
        return <SocialSwitchCard
          title={title || ''}
          key={`${id}-${title}`}
          notesName={`${QId}.dependent.${id}.note`}
          switchName={`${QId}.dependent.${id}.value`}
          isDependentQ
        />


      default:

        return <></>
    }
  } else {
    return <></>
  }
}

export default DependentQuestionCard