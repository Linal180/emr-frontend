// packages block
import { FC } from 'react';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
import { Box, Button, Typography } from '@material-ui/core';
// component block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// constants block
import { GRAY_SIX, WHITE, WHITE_FIVE, } from '../../../../theme';
import {
  ACTIVE, ACUTE, ADD, APPOINTMENT, CHRONIC, DELETE, EMPTY_OPTION, FUNCTIONAL_HEARTBURN, HISTORICAL, NOTE, ONSET_DATE, STATUS, TYPE,
} from '../../../../constants';

const AllergiesModal3Component: FC = (): JSX.Element => {

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant='h4'>{FUNCTIONAL_HEARTBURN}</Typography>

        <Box p={1} />

        <Box display='flex'>
          <Typography variant='h5'>ICD-10 Code:</Typography>
          <Box p={0.3} />
          <Typography variant='body2'>R12</Typography>
        </Box>

        <Box display='flex' mb={3}>
          <Typography variant='h5'>SnoMED Code:</Typography>
          <Box p={0.3} />
          <Typography variant='body2'>722876002</Typography>
        </Box>

        <InputController
          fieldType="text"
          controllerName="onSetDate"
          controllerLabel={ONSET_DATE}
        />

        <Typography variant='body1'>{STATUS}</Typography>

        <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
          <Box className='selectBox' bgcolor={WHITE_FIVE} color={WHITE}>
            <Typography variant='h6'>{ACTIVE}</Typography>
          </Box>

          <Box mx={2} className='selectBox'>
            <Typography variant='h6'>{HISTORICAL}</Typography>
          </Box>
        </Box>

        <Typography variant='body1'>{TYPE}</Typography>

        <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
          <Box className='selectBox' style={{ backgroundColor: '#A1A5B7', color: WHITE }}>
            <Typography variant='h6'>{ACUTE}</Typography>
          </Box>

          <Box mx={2} className='selectBox'>
            <Typography variant='h6'>{CHRONIC}</Typography>
          </Box>
        </Box>

        <Selector
          value={EMPTY_OPTION}
          label={APPOINTMENT}
          name="appointment"
          options={[]}
        />

        <InputController
          fieldType="text"
          controllerName="note"
          controllerLabel={NOTE}
        />

        <Box display='flex' justifyContent='flex-end'>
          <Button type='submit' variant='contained' className='btnDanger'>{DELETE}</Button>

          <Box p={1} />

          <Button type='submit' variant='contained' color='primary'>{ADD}</Button>
        </Box>
      </form>
    </FormProvider>
  )
};

export default AllergiesModal3Component;
