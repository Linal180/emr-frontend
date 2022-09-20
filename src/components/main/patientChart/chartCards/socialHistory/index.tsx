import { FC, Fragment } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Box, colors, Typography } from "@material-ui/core";
//components
import SocialInputCard from "./socialInputCard";
import SocialSwitchCard from './socialSwitchCard';
import SocialSelectorCard from "./socialSelectorCard";
//constants
import { SocialHistoryProps } from "../../../../../interfacesTypes";
import {
  ABLE_WALK_MAPPED, ACTIVITIES_DAILY_LIVING_MAPPED, ACTIVITIES_OF_DAILY_LIVING, ADVANCED_DIRECTIVE,
  ADVANCED_DIRECTIVE_MAPPED, ALCOHOL_CONSUMPTION_MAPPED, ARE_YOU_ABLE_TO_WALK, ARE_YOU_CURRENTLY_EMPLOYED, ARE_YOU_SEXUALLY_ACTIVE,
  CAFFEINE_CONSUMPTION_MAPPED,
  DIET_AND_EXERCISE, DIET_TYPE_MAPPED, DO_YOU_EVER_USED_TOBACCO_NICOTINE, DO_YOU_FEEL_STRESSED, DO_YOU_HAVE_EVER_SMOKED_TOBACCO, DO_YOU_USE_ANY_ILLICIT, EDUCATION_AND_OCCUPATION,
  EXERCISE_LEVEL_MAPPED, FEEL_STRESSED_MAPPED, HIGHEST_GRADE_MAPPED, HOME_AND_ENVIRONMENT,
  HOME_AND_ENVIRONMENT_SELECTOR_MAPPED, HOME_AND_ENVIRONMENT_SWITCH_MAPPED, HOW_MANY_CHILDREN_DO_YOU_HAVE,
  HOW_MANY_DAYS_OF_MODERATE_TO_STRENUOUS_EXERCISE, LIFESTYLE,
  LIFE_STYLE_MAPPED, MARRIAGE_AND_SEXUALITY, PUBLIC_HEALTH_TRAVEL, PUBLIC_HEALTH_TRAVEL_MAPPED,
  RELATIONSHIP_STATUS_MAPPED, SMOKED_TOBACCO_MAPPED, SUBSTANCE_USE,
  WHAT_IS_THE_HIGHEST_GRADE_OR_LEVEL_OF_SCHOOL_COMPLETED, WHAT_IS_YOUR_EXERCISE_LEVEL, WHAT_IS_YOUR_LEVEL_OF_ALCOHOL_CONSUMPTION, WHAT_IS_YOUR_LEVEL_OF_CAFFEINE_CONSUMPTION, WHAT_IS_YOUR_RELATIONSHIP_STATUS, WHAT_TYPES_OF_SPORTING_ACTIVITIES_PARTICIPATE, WHAT_TYPE_OF_DIET_FOLLOWING, WHAT_WAS_DATE_OF_YOUR_MOST_RECENT_TOBACCO_SCREENING,
} from "../../../../../constants";


const SocialHistory: FC<SocialHistoryProps> = ({ shouldDisableEdit = false }): JSX.Element => {

  const methods = useForm()

  return (<FormProvider {...methods}>
    <form>

      <Fragment>
        {/* daily living activities start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{ACTIVITIES_OF_DAILY_LIVING}</Typography>
        </Box>
        {ACTIVITIES_DAILY_LIVING_MAPPED.map((activity, index) => {
          const { notesName, switchName, title } = activity;

          return (
            <SocialSwitchCard notesName={notesName} switchName={switchName} title={title} key={`${index}-${switchName}`} />
          )
        })}

        <SocialSelectorCard
          selectorName="ableToWalk"
          notesName="ableToWalkNote"
          title={ARE_YOU_ABLE_TO_WALK}
          selectorOptions={ABLE_WALK_MAPPED}
        />
        {/* daily living activities end */}
      </Fragment>

      <Fragment>
        {/* public health travel start */}

        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{PUBLIC_HEALTH_TRAVEL}</Typography>
        </Box>
        {PUBLIC_HEALTH_TRAVEL_MAPPED.map((activity, index) => {
          const { notesName, switchName, title } = activity;

          return (
            <SocialSwitchCard notesName={notesName} switchName={switchName} title={title} key={`${index}-${switchName}`} />
          )
        })}

        {/* public health travel end */}
      </Fragment>

      <Fragment>
        {/* Substance Use start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{SUBSTANCE_USE}</Typography>
        </Box>

        <SocialSelectorCard
          title={DO_YOU_HAVE_EVER_SMOKED_TOBACCO}
          notesName={'smokingStatusNote'}
          selectorName={'smokingStatus'}
          key={`smokingStatus`}
          selectorOptions={SMOKED_TOBACCO_MAPPED}
        />

        <SocialSwitchCard
          key={`tobaccoNicotine`}
          notesName={'tobaccoNicotineNote'}
          switchName={'tobaccoNicotine'}
          title={DO_YOU_EVER_USED_TOBACCO_NICOTINE}
        />

        <SocialInputCard
          inputName="tobaccoScreening"
          notesName="tobaccoScreeningNote"
          title={WHAT_WAS_DATE_OF_YOUR_MOST_RECENT_TOBACCO_SCREENING}
        />

        <SocialSelectorCard
          title={WHAT_IS_YOUR_LEVEL_OF_ALCOHOL_CONSUMPTION}
          notesName={'alcoholConsumptionNote'}
          selectorName={'alcoholConsumption'}
          key={`alcoholConsumption`}
          selectorOptions={ALCOHOL_CONSUMPTION_MAPPED}
        />

        <SocialSwitchCard
          key={`recreationalDrugsNote`}
          notesName={'recreationalDrugsNote'}
          switchName={'recreationalDrugs'}
          title={DO_YOU_USE_ANY_ILLICIT}
        />

        <SocialSelectorCard
          title={WHAT_IS_YOUR_LEVEL_OF_CAFFEINE_CONSUMPTION}
          notesName={'caffeineConsumptionNote'}
          selectorName={'caffeineConsumption'}
          key={`caffeineConsumption`}
          selectorOptions={CAFFEINE_CONSUMPTION_MAPPED}
        />

        {/* Diet and Exercise end */}
      </Fragment>
      
      <Fragment>

        {/* Advanced Directive start */}

        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{ADVANCED_DIRECTIVE}</Typography>
        </Box>
        {ADVANCED_DIRECTIVE_MAPPED.map((activity, index) => {
          const { notesName, switchName, title } = activity;

          return (
            <SocialSwitchCard notesName={notesName} switchName={switchName} title={title} key={`${index}-${switchName}`} />
          )
        })}

        {/* Advanced Directive end */}
      </Fragment>

      <Fragment>
        {/* Home and Environment start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{HOME_AND_ENVIRONMENT}</Typography>
        </Box>
        {HOME_AND_ENVIRONMENT_SWITCH_MAPPED.map((activity, index) => {
          const { notesName, switchName, title } = activity;

          return (
            <SocialSwitchCard notesName={notesName} switchName={switchName} title={title} key={`${index}-${switchName}`} />
          )
        })}

        {HOME_AND_ENVIRONMENT_SELECTOR_MAPPED.map((activity, index) => {
          const { notesName, title, selectorName, selectorOptions } = activity;

          return (
            <SocialSelectorCard
              title={title}
              notesName={notesName}
              selectorName={selectorName}
              key={`${index}-${selectorName}`}
              selectorOptions={selectorOptions}
            />
          )
        })}
        {/* Home and Environment end */}
      </Fragment>

      <Fragment>
        {/* Lifestyle start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{LIFESTYLE}</Typography>
        </Box>

        <SocialSelectorCard
          title={DO_YOU_FEEL_STRESSED}
          notesName={'feelStressNote'}
          selectorName={'feelStress'}
          key={`feelStressNote`}
          selectorOptions={FEEL_STRESSED_MAPPED}
        />

        {LIFE_STYLE_MAPPED.map((activity, index) => {
          const { notesName, switchName, title } = activity;

          return (
            <SocialSwitchCard notesName={notesName} switchName={switchName} title={title} key={`${index}-${switchName}`} />
          )
        })}

        {/*Lifestyle end */}
      </Fragment>

      <Fragment>
        {/* Education and Occupation start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{EDUCATION_AND_OCCUPATION}</Typography>
        </Box>

        <SocialSelectorCard
          title={WHAT_IS_THE_HIGHEST_GRADE_OR_LEVEL_OF_SCHOOL_COMPLETED}
          notesName={'highestDegreeNote'}
          selectorName={'highestDegree'}
          key={`highestDegree`}
          selectorOptions={HIGHEST_GRADE_MAPPED}
        />

        <SocialSwitchCard
          key={`currentEmployed`}
          notesName={'currentEmployedNote'}
          switchName={'currentEmployed'}
          title={ARE_YOU_CURRENTLY_EMPLOYED}
        />

        {/* Education and Occupation end */}
      </Fragment>

      <Fragment>
        {/* Marriage and Sexuality start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{MARRIAGE_AND_SEXUALITY}</Typography>
        </Box>

        <SocialSelectorCard
          title={WHAT_IS_YOUR_RELATIONSHIP_STATUS}
          notesName={'relationshipStatusNote'}
          selectorName={'relationshipStatus'}
          key={`relationshipStatusNote`}
          selectorOptions={RELATIONSHIP_STATUS_MAPPED}
        />

        <SocialSwitchCard
          key={`sexuallyActive`}
          notesName={'sexuallyActiveNote'}
          switchName={'sexuallyActive'}
          title={ARE_YOU_SEXUALLY_ACTIVE}
        />

        <SocialInputCard
          inputName="children"
          notesName="childrenNote"
          inputFieldType="number"
          notStep
          title={HOW_MANY_CHILDREN_DO_YOU_HAVE}
        />
        {/* Marriage and Sexuality end */}
      </Fragment>

      <Fragment>
        {/* Diet and Exercise start */}
        <Box pt={2} pb={1} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant='h3'>{DIET_AND_EXERCISE}</Typography>
        </Box>

        <SocialSelectorCard
          title={WHAT_TYPE_OF_DIET_FOLLOWING}
          notesName={'followingDietNote'}
          selectorName={'followingDiet'}
          key={`followingDietNote`}
          selectorOptions={DIET_TYPE_MAPPED}
        />

        <SocialSelectorCard
          title={WHAT_IS_YOUR_EXERCISE_LEVEL}
          notesName={'exerciseLevelNote'}
          selectorName={'exerciseLevel'}
          key={`exerciseLevel`}
          selectorOptions={EXERCISE_LEVEL_MAPPED}
        />

        <SocialInputCard
          inputName="strenuousExercise"
          notesName="strenuousExerciseNote"
          inputFieldType="number"
          notStep
          title={HOW_MANY_DAYS_OF_MODERATE_TO_STRENUOUS_EXERCISE}
        />

        <SocialInputCard
          inputName="sportActivities"
          notesName="sportActivitiesNote"
          title={WHAT_TYPES_OF_SPORTING_ACTIVITIES_PARTICIPATE}
        />
        {/* Diet and Exercise end */}
      </Fragment>

    </form>
  </FormProvider>)
}

export default SocialHistory