// packages block
import { FC, } from 'react';
import { FormProvider, useForm, SubmitHandler, } from "react-hook-form";
import { Box, Button, Typography } from '@material-ui/core';
// component block
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
// constants block
import { ModalAddIcon, } from '../../../../assets/svgs';
import { GRAY_NINE, GRAY_SIX, WHITE, WHITE_FIVE, WHITE_FOUR } from '../../../../theme';
import { ADD, ADULTHOOD, CHILDHOOD, DELETE, EMPTY_OPTION, NOTE, ONSET_DATE, REACTION, SEVERITY, UNKNOWN } from '../../../../constants';

const AllergiesModal2Component: FC = (): JSX.Element => {

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<any> = () => { }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant='h4'>Peanut</Typography>

        <Box p={1} />

        <Selector
          value={EMPTY_OPTION}
          label={REACTION}
          name="reaction"
          options={[]}
        />

        <Selector
          value={EMPTY_OPTION}
          label={SEVERITY}
          name="severity"
          options={[]}
        />

        <Box mb={4} px={1} display='flex' alignItems='center' border={`1px dashed ${WHITE_FOUR}`} borderRadius={6} height={44}>
          <ModalAddIcon />

          <Box ml={1} color={GRAY_NINE}>
            <Typography variant='h6'>Add Reaction</Typography>
          </Box>
        </Box>

        <InputController
          fieldType="text"
          controllerName="onSetDate"
          controllerLabel={ONSET_DATE}
        />

        <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
          <Box className='selectBox' bgcolor={WHITE_FIVE} color={WHITE}>
            <Typography variant='h6'>{CHILDHOOD}</Typography>
          </Box>

          <Box mx={2} className='selectBox'>
            <Typography variant='h6'>{ADULTHOOD}</Typography>
          </Box>

          <Box className='selectBox'>
            <Typography variant='h6'>{UNKNOWN}</Typography>
          </Box>
        </Box>

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

export default AllergiesModal2Component;
