// packages block
import { FC, useState, ChangeEvent,} from 'react';
import { FormProvider, useForm, SubmitHandler, Controller } from "react-hook-form";
import { Box, Button, FormControl, InputLabel, Typography } from '@material-ui/core';
// component block
import Selector from '../../../../../common/Selector';
import InputController from '../../../../../../controller';
// constants block
import {  GRAY_TWO, WHITE, } from '../../../../../../theme';
import { usePublicAppointmentStyles } from '../../../../../../styles/publicAppointmentStyles';
import { AntSwitch } from '../../../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { 
  ACTIVE, ADD, APPOINTMENT, DELETE, EMPTY_OPTION, FUNCTIONAL_HEARTBURN, HISTORICAL, NOTES, ONSET_DATE, STATUS, TYPE, 
} from '../../../../../../constants';


const AllergiesModal3Component: FC = (): JSX.Element => {
  const classes = usePublicAppointmentStyles();
  const [isChecked, setIsChecked] = useState(false);

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('active', checked)
  };

  const methods = useForm<any>({
    mode: "all",
  });
  const { handleSubmit, control, setValue } = methods;
  const onSubmit: SubmitHandler<any> = () => { }
  return (
    <>
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

          <Box>
            <Controller
              name='status'
              control={control}
              render={() => (
                <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                  <InputLabel shrink>{STATUS}</InputLabel>

                  <label className="toggle-main toggleMain">
                    <Box color={isChecked ? WHITE : GRAY_TWO}>{ACTIVE}</Box>
                    <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='active' />
                    <Box color={isChecked ? GRAY_TWO : WHITE}>{HISTORICAL}</Box>
                  </label>
                </FormControl>
              )}
            />
          </Box>

          <Box>
            <Controller
              name='status'
              control={control}
              render={() => (
                <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                  <InputLabel shrink>{TYPE}</InputLabel>

                  <label className="toggle-main toggleMain">
                    <Box color={isChecked ? WHITE : GRAY_TWO}>Acute</Box>
                    <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='acute' />
                    <Box color={isChecked ? GRAY_TWO : WHITE}>Chronic</Box>
                  </label>
                </FormControl>
              )}
            />
          </Box>

          <Selector
            value={EMPTY_OPTION}
            label={APPOINTMENT}
            name="appointment"
            options={[]}
          />

          <InputController
            fieldType="text"
            controllerName="notes"
            controllerLabel={NOTES}
          />

          <Box display='flex' justifyContent='flex-end'>
            <Button type='submit' variant='contained' className='btnDanger'>{DELETE}</Button>

            <Box p={1} />

            <Button type='submit' variant='contained' color='primary'>{ADD}</Button>
          </Box>
        </form>
      </FormProvider>
    </>
  )
};

export default AllergiesModal3Component;
